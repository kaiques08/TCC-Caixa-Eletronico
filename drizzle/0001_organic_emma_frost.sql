CREATE TABLE `test_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`viewer_email` text NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`registration` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `test_sessions_expires_at_idx` ON `test_sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `test_sessions_viewer_email_idx` ON `test_sessions` (`viewer_email`);