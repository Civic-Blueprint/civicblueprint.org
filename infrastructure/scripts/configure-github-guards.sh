#!/usr/bin/env bash
set -euo pipefail

OWNER="${OWNER:-Civic-Blueprint}"
REPO="${REPO:-civicblueprint.org}"
MAIN_BRANCH="${MAIN_BRANCH:-main}"

# Optional reviewer IDs and names for environment approvals.
# Examples:
#   export PRODUCTION_REVIEWER_TEAM_ID=123456
#   export PRODUCTION_REVIEWER_USER_ID=12345678
#   export PRODUCTION_REVIEWER_USERNAME=Roustalski
#   export PRODUCTION_REVIEWER_TEAM_SLUG=platform
PRODUCTION_REVIEWER_TEAM_ID="${PRODUCTION_REVIEWER_TEAM_ID:-}"
PRODUCTION_REVIEWER_USER_ID="${PRODUCTION_REVIEWER_USER_ID:-}"
STAGING_REVIEWER_TEAM_ID="${STAGING_REVIEWER_TEAM_ID:-}"
STAGING_REVIEWER_USER_ID="${STAGING_REVIEWER_USER_ID:-}"
PRODUCTION_REVIEWER_USERNAME="${PRODUCTION_REVIEWER_USERNAME:-}"
STAGING_REVIEWER_USERNAME="${STAGING_REVIEWER_USERNAME:-}"
PRODUCTION_REVIEWER_TEAM_SLUG="${PRODUCTION_REVIEWER_TEAM_SLUG:-}"
STAGING_REVIEWER_TEAM_SLUG="${STAGING_REVIEWER_TEAM_SLUG:-}"

resolve_user_id() {
  local username="${1:-}"
  if [[ -z "$username" ]]; then
    return
  fi

  gh api "users/${username}" --jq .id
}

resolve_team_id() {
  local team_slug="${1:-}"
  if [[ -z "$team_slug" ]]; then
    return
  fi

  gh api "orgs/${OWNER}/teams/${team_slug}" --jq .id
}

if [[ -z "$PRODUCTION_REVIEWER_USER_ID" && -n "$PRODUCTION_REVIEWER_USERNAME" ]]; then
  PRODUCTION_REVIEWER_USER_ID="$(resolve_user_id "$PRODUCTION_REVIEWER_USERNAME")"
fi
if [[ -z "$STAGING_REVIEWER_USER_ID" && -n "$STAGING_REVIEWER_USERNAME" ]]; then
  STAGING_REVIEWER_USER_ID="$(resolve_user_id "$STAGING_REVIEWER_USERNAME")"
fi
if [[ -z "$PRODUCTION_REVIEWER_TEAM_ID" && -n "$PRODUCTION_REVIEWER_TEAM_SLUG" ]]; then
  PRODUCTION_REVIEWER_TEAM_ID="$(resolve_team_id "$PRODUCTION_REVIEWER_TEAM_SLUG")"
fi
if [[ -z "$STAGING_REVIEWER_TEAM_ID" && -n "$STAGING_REVIEWER_TEAM_SLUG" ]]; then
  STAGING_REVIEWER_TEAM_ID="$(resolve_team_id "$STAGING_REVIEWER_TEAM_SLUG")"
fi

build_reviewers_json() {
  local team_id="${1:-}"
  local user_id="${2:-}"

  if [[ -n "$team_id" && -n "$user_id" ]]; then
    printf '[{"type":"Team","id":%s},{"type":"User","id":%s}]' "$team_id" "$user_id"
    return
  fi

  if [[ -n "$team_id" ]]; then
    printf '[{"type":"Team","id":%s}]' "$team_id"
    return
  fi

  if [[ -n "$user_id" ]]; then
    printf '[{"type":"User","id":%s}]' "$user_id"
    return
  fi

  printf '[]'
}

PROD_REVIEWERS="$(build_reviewers_json "$PRODUCTION_REVIEWER_TEAM_ID" "$PRODUCTION_REVIEWER_USER_ID")"
STAGING_REVIEWERS="$(build_reviewers_json "$STAGING_REVIEWER_TEAM_ID" "$STAGING_REVIEWER_USER_ID")"

echo "Resolved reviewer configuration:"
echo "  production -> team_id=${PRODUCTION_REVIEWER_TEAM_ID:-none}, user_id=${PRODUCTION_REVIEWER_USER_ID:-none}"
echo "  staging    -> team_id=${STAGING_REVIEWER_TEAM_ID:-none}, user_id=${STAGING_REVIEWER_USER_ID:-none}"

echo "Applying branch protection to ${OWNER}/${REPO}:${MAIN_BRANCH}"
cat > /tmp/main-branch-protection.json <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "require_last_push_approval": true,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${OWNER}/${REPO}/branches/${MAIN_BRANCH}/protection" \
  --input /tmp/main-branch-protection.json >/dev/null

echo "Configuring production environment protection"
cat > /tmp/production-environment.json <<EOF
{
  "wait_timer": 0,
  "prevent_self_review": true,
  "deployment_branch_policy": {
    "protected_branches": true,
    "custom_branch_policies": false
  },
  "reviewers": ${PROD_REVIEWERS}
}
EOF
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${OWNER}/${REPO}/environments/production" \
  --input /tmp/production-environment.json >/dev/null

echo "Configuring staging environment protection"
cat > /tmp/staging-environment.json <<EOF
{
  "wait_timer": 0,
  "prevent_self_review": true,
  "reviewers": ${STAGING_REVIEWERS}
}
EOF
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${OWNER}/${REPO}/environments/staging" \
  --input /tmp/staging-environment.json >/dev/null

echo "GitHub branch protections and environment approvals configured."
