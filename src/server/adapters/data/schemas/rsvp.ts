import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm'
import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { uuid } from '~/lib/uuid'

export enum ConfirmationStatus {
  PENDING = 'PENDING',
  REFUSED = 'REFUSED',
  CONFIRMED = 'CONFIRMED',
  PARTIALLY_CONFIRMED = 'PARTIALLY_CONFIRMED',
}

export enum InviteeType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
}

export const invitesTable = sqliteTable('invites', t => ({
  id: t.text('id').primaryKey()
    .$defaultFn(() => uuid()),
  code: t.text('code')
    .notNull().unique(),
  label: t.text('label')
    .notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`CURRENT_TIMESTAMP`).notNull(),
  confirmationStatus: t.text('confirmation_status').$type<ConfirmationStatus>()
    .default(ConfirmationStatus.PENDING).notNull(),
  confirmationNotes: t.text('confirmation_notes'),
  updatedAt: t.integer('updated_at', { mode: 'timestamp_ms' }),
  confirmationDate: t.integer('confirmation_date', { mode: 'timestamp_ms' }),
  invitedAmount: t.integer('invited_amount')
    .default(0).notNull(),
  confirmedAmount: t.integer('confirmed_amount')
    .default(0).notNull(),
}))

export type SelectInvite = InferSelectModel<typeof invitesTable>

export const inviteeTable = sqliteTable('invitees', t => ({
  id: t.integer('id').primaryKey({ autoIncrement: true }),
  name: t.text('name')
    .notNull(),
  inviteId: t.text('invite_id')
    .notNull()
    .references(() => invitesTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  inviteeType: t.text('invitee_type').$type<InviteeType>()
    .notNull(),
  /** **{PARTIALLY_CONFIRMED}** is not valid for this entity */
  confirmationStatus: t.text('confirmation_status').$type<ConfirmationStatus>()
    .default(ConfirmationStatus.PENDING).notNull(),
  confirmationUpdatedAt: t.integer('confirmation_updated_at', { mode: 'timestamp_ms' }),
}))

export type CreateInvitee = Omit<InferInsertModel<typeof inviteeTable>, 'id'>
export type SelectInvitee = InferSelectModel<typeof inviteeTable>
