#!/usr/bin/env bash
# Publish phrase artifacts to GitHub Pages (lexico-phrases repo), or copy locally for testing.
#
# Default (no args): clone git@github.com:fertilis/lexico-phrases.git in a temp dir, sync
#   dictionary/io/output/* into repo/phrases/, commit, push. Set NEXT_PUBLIC_PHRASES_BASE_URL to
#   https://fertilis.github.io/lexico-phrases/phrases (no trailing slash).
#
# With a path: copy only to that directory (no git). Run `make sentence_phrases` in dictionary/ first.

set -euo pipefail
REPO_ROOT="$(cd "$(dirname $(realpath "${BASH_SOURCE[0]}"))/.." && pwd)"
SRC="${REPO_ROOT}/dictionary/io/output"
REMOTE_URL="${LEXICO_PHRASES_REMOTE:-git@github.com:fertilis/lexico-phrases.git}"
# Served at {pages-root}/phrases/ — matches spec PHRASES_BASE_URL examples.
PHRASES_SUBDIR="phrases"
DEST="${1:-}"

(cd ${REPO_ROOT}/dictionary && make sentence_phrases)

if [[ ! -f "${SRC}/phrases-current.txt" ]]; then
  echo "Missing ${SRC}/phrases-current.txt — run 'make sentence_phrases' in dictionary/ first." >&2
  exit 1
fi

GZIP_NAME="$(tr -d '\r\n' < "${SRC}/phrases-current.txt")"
if [[ -z "${GZIP_NAME}" ]]; then
  echo "phrases-current.txt is empty" >&2
  exit 1
fi
if [[ ! -f "${SRC}/${GZIP_NAME}" ]]; then
  echo "Missing payload ${SRC}/${GZIP_NAME}" >&2
  exit 1
fi

sync_phrases_dir() {
  local target="$1"
  mkdir -p "${target}"
  # Drop stale versioned payloads so the Pages repo does not accumulate old hashes.
  find "${target}" -maxdepth 1 -type f -name 'phrases-*.json.gz' -delete 2>/dev/null || true
  cp "${SRC}/phrases-current.txt" "${target}/"
  cp "${SRC}/${GZIP_NAME}" "${target}/"
}

if [[ -n "${DEST}" ]]; then
  mkdir -p "${DEST}"
  sync_phrases_dir "${DEST}"
  echo "Copied to ${DEST}: phrases-current.txt ${GZIP_NAME}"
  exit 0
fi

TMP="$(mktemp -d)"
cleanup() { rm -rf "${TMP}"; }
trap cleanup EXIT

git clone --depth 1 "${REMOTE_URL}" "${TMP}/repo"
CLONE="${TMP}/repo"
OUT="${CLONE}/${PHRASES_SUBDIR}"
sync_phrases_dir "${OUT}"

cd "${CLONE}"
git config user.email "lexico-phrases-publish@local"
git config user.name "lexico publish-phrases"
git add "${PHRASES_SUBDIR}/"
if git diff --staged --quiet; then
  echo "No changes to commit (remote already has ${GZIP_NAME})."
  exit 0
fi

git commit -m "Publish phrases ${GZIP_NAME}"
git push origin HEAD

echo "Pushed to ${REMOTE_URL} (${PHRASES_SUBDIR}/): phrases-current.txt ${GZIP_NAME}"
