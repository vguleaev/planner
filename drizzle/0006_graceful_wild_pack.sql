CREATE TABLE IF NOT EXISTS "backlog_task_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

TRUNCATE TABLE backlog_tasks;

--> statement-breakpoint
ALTER TABLE "backlog_tasks" ADD COLUMN "group_id" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "backlog_task_group_userId_idx" ON "backlog_task_groups" USING btree ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backlog_tasks" ADD CONSTRAINT "backlog_tasks_group_id_backlog_task_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."backlog_task_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "backlog_task_groupId_idx" ON "backlog_tasks" USING btree ("group_id");