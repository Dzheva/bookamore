-- TFB-141 — one-off DATA migration (NOT a Liquibase changelog).
--
-- Context:
--   BOOK images uploaded before the addImage hotfix (TFB-140 era) have a row in
--   `images` but no matching row in `books_images`. Because a book renders its
--   photos from `books_images` (Book.images), those books show no image even
--   though the file/record exist. This script backfills the missing links.
--
-- Properties:
--   * Idempotent — the NOT EXISTS guard means re-running inserts nothing new.
--   * Only links images whose entity_id points to an EXISTING book (FK-safe).
--   * `id` is a fresh UUID (gen_random_uuid, built-in on PostgreSQL 13+); the value
--     only needs to be unique, this is not a domain-generated uuidv7.
--
-- Finding (2026-07-02, dev + prod): every currently-unlinked BOOK image has an
--   entity_id that points to a book which NO LONGER EXISTS (leftovers from deleted
--   books). Therefore this backfill is a verified no-op on today's data (INSERT 0 0):
--   images of *existing* books are already linked by the addImage/TFB-140 path.
--   The script is kept as an idempotent safety-net for other environments/future data.
--   Cleaning up the leftover rows (images with entity_type='BOOK' and no existing book)
--   is a SEPARATE destructive migration and is intentionally NOT done here.
--
-- Run order (dev first, then prod):
--   1) Run section 1 (PREVIEW) and eyeball the rows that WILL be inserted.
--   2) BACK UP the DB first:
--        docker exec bookamore-prod-db-1 pg_dump -U postgres bookamore_prod \
--          > backup_before_TFB-141_$(date +%F_%H%M).sql
--   3) Run section 2 (BACKFILL). It is wrapped in a transaction and prints the
--      remaining orphan count (must be 0) before COMMIT.

-- =====================================================================
-- 1. PREVIEW — rows that will be linked
-- =====================================================================
SELECT i.entity_id AS book_id, i.path
FROM images i
JOIN books b ON b.id = i.entity_id
WHERE i.entity_type = 'BOOK'
  AND NOT EXISTS (SELECT 1 FROM books_images bi WHERE bi.path = i.path)
ORDER BY i.path;

-- =====================================================================
-- 2. BACKFILL
-- =====================================================================
BEGIN;

INSERT INTO books_images (id, created_date, last_modified_date, book_id, path)
SELECT gen_random_uuid(), now(), now(), i.entity_id, i.path
FROM images i
JOIN books b ON b.id = i.entity_id
WHERE i.entity_type = 'BOOK'
  AND NOT EXISTS (SELECT 1 FROM books_images bi WHERE bi.path = i.path);

-- Must be 0 before committing:
SELECT COUNT(*) AS remaining_orphans
FROM images i
JOIN books b ON b.id = i.entity_id
WHERE i.entity_type = 'BOOK'
  AND NOT EXISTS (SELECT 1 FROM books_images bi WHERE bi.path = i.path);

COMMIT;
