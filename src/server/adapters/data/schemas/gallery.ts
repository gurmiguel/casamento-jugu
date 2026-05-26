import { sql } from 'drizzle-orm'
import { sqliteTable } from 'drizzle-orm/sqlite-core'

export const galleryTable = sqliteTable('gallery', t => ({
  id: t.integer('id').primaryKey({ autoIncrement: true }),
  path: t.text('path').notNull(),
  providerId: t.text('provider_id'),
  order: t.integer('order').notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
}))
