CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`provider_id` text,
	`order` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
