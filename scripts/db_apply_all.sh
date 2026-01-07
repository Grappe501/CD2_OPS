#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set."
  exit 1
fi

echo "Applying migrations..."
psql "$DATABASE_URL" -f packages/db/migrations/001_init.sql

echo "Applying views..."
psql "$DATABASE_URL" -f packages/db/views/001_views_dashboard_skeleton.sql

echo "Done."
