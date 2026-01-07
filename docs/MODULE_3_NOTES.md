# CD2_OPS — Module 3 Notes

## Safety model
- `/api/data/view` only permits view names that appear in the widget registry (allowlist).
- Query is `SELECT * FROM cd2.<view> LIMIT $1`.
- Identifiers are safely quoted; limit is parameterized.

## Required prior step
Module 1 must be applied to your `DATABASE_URL`:
- migrations/001_init.sql
- views/001_views_dashboard_skeleton.sql
