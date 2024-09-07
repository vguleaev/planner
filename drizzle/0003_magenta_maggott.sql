DROP TABLE IF EXISTS "backlog_tasks";

-- ALTER TABLE "backlog_tasks" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "backlog_tasks" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

CREATE TABLE IF NOT EXISTS "backlog_tasks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'NOT_COMPLETED' NOT NULL,
	"priority" "priority" DEFAULT 'MEDIUM' NOT NULL,
	"due_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "backlog_task_userId_idx" ON "backlog_tasks" USING btree ("user_id");