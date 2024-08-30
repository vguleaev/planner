ALTER TABLE "expenses" ADD COLUMN "date" date DEFAULT '2023-01-01';

UPDATE "expenses" SET "date" = '2023-01-01' WHERE "date" IS NULL;

ALTER TABLE "expenses" ALTER COLUMN "date" SET NOT NULL;