#!/usr/bin/env bash
set -euo pipefail

# --- Load .env if present (optional) ---
if [[ -f .env ]]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs -I {} echo {})
fi

# --- Required env vars (with sensible defaults where possible) ---
: "${LOCAL_DB_NAME:?Set LOCAL_DB_NAME}"
: "${LOCAL_DB_USER:?Set LOCAL_DB_USER}"
: "${SSH_USER:?Set SSH_USER}"
: "${SSH_HOST:?Set SSH_HOST}"

# Optional locals
LOCAL_DB_HOST="${LOCAL_DB_HOST:-localhost}"
LOCAL_DB_PORT="${LOCAL_DB_PORT:-5432}"
PGPASSWORD="${PGPASSWORD:-}"                    # if you use password auth; leave empty if using .pgpass or peer
DUMP_DIR="${DUMP_DIR:-./backups}"               # where to place local dumps
INCLUDE_GLOBALS="${INCLUDE_GLOBALS:-true}"      # "true" or "false"
PARALLEL_JOBS="${PARALLEL_JOBS:-4}"             # for pg_restore later; we just note it in filename
COMPRESS_LEVEL="${COMPRESS_LEVEL:-9}"           # pg_dump -Z

# Remote copy target
SSH_PORT="${SSH_PORT:-22}"
REMOTE_PATH="${REMOTE_PATH:-/tmp}"              # where to upload on the server

# --- Tools check ---
for cmd in pg_dump pg_dumpall scp psql; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "Missing required command: $cmd"; exit 1; }
done

# --- Create output dir & names ---
mkdir -p "$DUMP_DIR"
STAMP="$(date +'%Y%m%d_%H%M%S')"
DB_DUMP_FILE="${DUMP_DIR}/${LOCAL_DB_NAME}_${STAMP}_FcZ${COMPRESS_LEVEL}_j${PARALLEL_JOBS}.dump"
GLOBALS_FILE="${DUMP_DIR}/globals_${STAMP}.sql"

echo "==> Creating database dump: $DB_DUMP_FILE"
PGPASSWORD="$PGPASSWORD" pg_dump \
  -U "$LOCAL_DB_USER" \
  -h "$LOCAL_DB_HOST" \
  -p "$LOCAL_DB_PORT" \
  -d "$LOCAL_DB_NAME" \
  -Fc -Z "$COMPRESS_LEVEL" \
  -f "$DB_DUMP_FILE"

if [[ "${INCLUDE_GLOBALS}" == "true" ]]; then
  echo "==> Dumping globals (roles, tablespaces): $GLOBALS_FILE"
  PGPASSWORD="$PGPASSWORD" pg_dumpall \
    -U "$LOCAL_DB_USER" \
    -h "$LOCAL_DB_HOST" \
    -p "$LOCAL_DB_PORT" \
    --globals-only > "$GLOBALS_FILE"
else
  echo "==> Skipping globals dump (INCLUDE_GLOBALS=false)"
  GLOBALS_FILE=""
fi

# --- Copy to server ---
# echo "==> Copying dumps to ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"
# if [[ -n "$GLOBALS_FILE" ]]; then
#   scp -P "$SSH_PORT" "$DB_DUMP_FILE" "$GLOBALS_FILE" "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
# else
#   scp -P "$SSH_PORT" "$DB_DUMP_FILE" "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"
# fi

# echo "==> Done."
# echo "Uploaded:"
# echo " - $(basename "$DB_DUMP_FILE")"
# [[ -n "$GLOBALS_FILE" ]] && echo " - $(basename "$GLOBALS_FILE")"
# echo
# echo "Note: On the server, restore with something like:"
# cat <<'EOF'
# # (Run on server; adjust names)
# # psql -U postgres -f /tmp/globals_YYYYMMDD_HHMMSS.sql         # optional, review before applying
# # createdb -U postgres <dbname>
# # psql -U postgres -d <dbname> -c "CREATE EXTENSION IF NOT EXISTS postgis;"
# # pg_restore -U postgres -d <dbname> -j 4 /tmp/<your_dump>.dump
# EOF
