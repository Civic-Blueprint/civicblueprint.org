#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
website_dir="$(cd "${script_dir}/.." && pwd)"
repo_root="$(cd "${website_dir}/.." && pwd)"
workspace_root="$(cd "${repo_root}/.." && pwd)"

source_repo="${workspace_root}/project-2028"
content_root="${website_dir}/content"
target_dir="${content_root}/project-2028"

if [[ ! -d "${source_repo}" ]]; then
  echo "Expected sibling repo at ${source_repo}, but it was not found."
  echo "Clone project-2028 next to civicblueprint.org, then run this script again."
  exit 1
fi

mkdir -p "${content_root}"

if [[ -L "${target_dir}" ]]; then
  rm "${target_dir}"
fi

mkdir -p "${target_dir}"
rsync -a --delete --delete-excluded \
  --exclude=".git/" \
  --exclude=".cursor/" \
  --exclude=".github/" \
  --exclude=".env*" \
  --exclude="scripts/" \
  --exclude="assets/" \
  --exclude="CLAUDE.md" \
  --exclude="ROADMAP.md" \
  --exclude="WEBSITE_SUBMISSION_TRIAGE_CHECKLIST.md" \
  --exclude="LICENSE" \
  --exclude="*.code-workspace" \
  --exclude=".prettierignore" \
  --exclude=".gitignore" \
  --exclude="docs/PRACTITIONER_OUTREACH_TEMPLATE.md" \
  "${source_repo}/" \
  "${target_dir}/"
echo "Synced markdown content into ${target_dir}"

