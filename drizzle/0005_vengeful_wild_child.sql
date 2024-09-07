CREATE TABLE IF NOT EXISTS "backlog_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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