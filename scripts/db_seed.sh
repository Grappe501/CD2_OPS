#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set."
  exit 1
fi

echo "Seeding minimal data..."
psql "$DATABASE_URL" -f packages/db/seeds/001_seed_minimal.sql
echo "Done."
