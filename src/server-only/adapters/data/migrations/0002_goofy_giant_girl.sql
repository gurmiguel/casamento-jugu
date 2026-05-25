CREATE TABLE `invitees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`invite_id` text NOT NULL,
	`invitee_type` text NOT NULL,
	`confirmation_status` text DEFAULT 'PENDING' NOT NULL,
	`confirmation_updated_at` integer,
	FOREIGN KEY (`invite_id`) REFERENCES `invites`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invites` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`label` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`confirmation_status` text DEFAULT 'PENDING' NOT NULL,
	`confirmation_notes` text,
	`updated_at` integer,
	`confirmation_date` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invites_code_unique` ON `invites` (`code`);