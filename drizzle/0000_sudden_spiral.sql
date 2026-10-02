CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_email` text NOT NULL,
	`author_name` text NOT NULL,
	`role` text NOT NULL,
	`turma` text NOT NULL,
	`channel` text DEFAULT 'geral' NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `chat_messages_created_at_idx` ON `chat_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `chat_messages_channel_created_at_idx` ON `chat_messages` (`channel`,`created_at`);--> statement-breakpoint
CREATE INDEX `chat_messages_author_created_at_idx` ON `chat_messages` (`author_email`,`created_at`);