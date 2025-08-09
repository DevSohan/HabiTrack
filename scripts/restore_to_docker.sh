#!/usr/bin/env bash
set -euo pipefail

# Load variables from .env (ignoring comments)
if [[ -f .env ]]; then
  # Export each non-comment, non-empty line
  export $(grep -v '^#' .env | xargs)
fi

# copy into container
docker cp "$BACKUP" "$POSTGRES_CONTAINER":/tmp/backup

# create DB if needed
docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" -i "$POSTGRES_CONTAINER" \
  psql -U "$POSTGRES_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='${POSTGRES_DB}'" \
| grep -q 1 || docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" -i "$POSTGRES_CONTAINER" \
  createdb -U "$POSTGRES_USER" "$POSTGRES_DB"

# ensure postgis
docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" -i "$POSTGRES_CONTAINER" \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# restore (custom format)
docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" -i "$POSTGRES_CONTAINER" \
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists -j 4 /tmp/backup
