import { eq, inArray } from 'drizzle-orm'
import { randomBytes } from 'node:crypto'
import db from '../adapters/data/db'
import { ConfirmationStatus, CreateInvitee, inviteeTable, invitesTable, InviteeType, SelectInvitee } from '../adapters/data/schemas/rsvp'

export class InvitesRepository {
  // #region Admin methods
  public async findAll() {
    const invites = await db.select()
      .from(invitesTable)

    return invites
  }

  public async findById(id: string) {
    const [invite, invitees] = await Promise.all([
      db.select()
        .from(invitesTable)
        .where(eq(invitesTable.id, id))
        .then(([it]) => it),
      db.select()
        .from(inviteeTable)
        .where(eq(inviteeTable.inviteId, id)),
    ])

    return {
      ...invite,
      invitees,
    }
  }

  public async countDetails() {
    const invitees = await db.select()
      .from(inviteeTable)

    function count(type: ConfirmationStatus) {
      return invitees.reduce(({ adults, children }, item) => {
        if (item.confirmationStatus !== type)
          return { adults, children }

        switch (item.inviteeType) {
          case InviteeType.ADULT:
            return { children, adults: adults + 1 }
          case InviteeType.CHILD:
            return { adults, children: children + 1 }
        }
      }, { adults: 0, children: 0 })
    }

    return {
      confirmed: count(ConfirmationStatus.CONFIRMED),
      refused: count(ConfirmationStatus.REFUSED),
      pending: count(ConfirmationStatus.PENDING),
    }
  }

  public async createInvite(label: string) {
    const code = randomBytes(3).toString('hex')
    return await db.insert(invitesTable)
      .values({ label, code })
      .returning()
  }

  public async updateInviteLabel(id: string, label: string) {
    await db.update(invitesTable)
      .set({ label, updatedAt: new Date() })
      .where(eq(invitesTable.id, id))
  }

  public async updateInvitee(id: number, data: { name: string, inviteeType: InviteeType }) {
    await db.update(inviteeTable)
      .set(data)
      .where(eq(inviteeTable.id, id))
  }

  public async deleteInvite(id: string) {
    await db.delete(invitesTable)
      .where(eq(invitesTable.id, id))
  }

  public async addInvitees(inviteId: string, ...invitees: CreateInvitee[]) {
    return await db.transaction(async tx => {
      const createdInvitees = await db.insert(inviteeTable)
        .values(invitees)
        .returning()
      const [{ status: inviteStatus, amount }] = await tx.select({ status: invitesTable.confirmationStatus, amount: invitesTable.invitedAmount })
        .from(invitesTable)
        .where(eq(invitesTable.id, inviteId))
      await tx.update(invitesTable)
        .set({
          updatedAt: new Date(),
          confirmationStatus: inviteStatus === ConfirmationStatus.CONFIRMED
            ? ConfirmationStatus.PARTIALLY_CONFIRMED
            : ConfirmationStatus.PENDING,
          invitedAmount: amount + createdInvitees.length,
        })
        .where(eq(invitesTable.id, inviteId))
      return createdInvitees
    })
  }

  public async removeInvitees(...inviteeIds: number[]) {
    return await db.transaction(async tx => {
      const deleted = await db.delete(inviteeTable)
        .where(inArray(inviteeTable.id, inviteeIds))
        .returning({ inviteId: inviteeTable.inviteId, status: inviteeTable.confirmationStatus })

      const [{inviteId}] = deleted

      const updatedInvitees = await tx.select().from(inviteeTable)
        .where(eq(inviteeTable.inviteId, inviteId))

      if (!updatedInvitees.length) {
        await tx.delete(invitesTable)
          .where(eq(invitesTable.id, inviteId))
        return
      }

      const { status, confirmed } = this.getConfirmationStatus(updatedInvitees)

      await tx.update(invitesTable)
        .set({
          updatedAt: new Date(),
          confirmationStatus: status,
          confirmationDate: [ConfirmationStatus.CONFIRMED, ConfirmationStatus.REFUSED].includes(status)
            ? new Date()
            : null,
          invitedAmount: updatedInvitees.length,
          confirmedAmount: confirmed,
        })
        .where(eq(invitesTable.id, inviteId))
    })
  }

  // #endregion

  // #region Public methods
  public async findByCode(code: string) {
    const [invite, invitees] = await Promise.all([
      db.select()
        .from(invitesTable)
        .where(eq(invitesTable.code, code))
        .then(([it]) => it),
      db.select()
        .from(inviteeTable)
        .where(eq(inviteeTable.inviteId, code)),
    ])

    return {
      ...invite,
      invitees,
    }
  }

  public async updateInviteConfirmation(inviteId: string, notes: string | null, ...invitees: Pick<SelectInvitee, 'id' | 'confirmationStatus'>[]) {
    return await db.transaction(async tx => {
      const tasks = new Array<Promise<unknown>>()
      for (const invitee of invitees) {
        const task = tx.update(inviteeTable)
          .set({
            confirmationStatus: invitee.confirmationStatus,
            confirmationUpdatedAt: new Date(),
          })
          .where(eq(inviteeTable.id, invitee.id))
        tasks.push(task)
      }
      await Promise.all(tasks)

      const updatedInvitees = await tx.select().from(inviteeTable)
        .where(eq(inviteeTable.inviteId, inviteId))

      const { status, confirmed } = this.getConfirmationStatus(updatedInvitees)

      await tx.update(invitesTable)
        .set({
          confirmationStatus: status,
          confirmationDate: [ConfirmationStatus.CONFIRMED, ConfirmationStatus.PARTIALLY_CONFIRMED].includes(status)
            ? new Date()
            : null,
          confirmedAmount: confirmed,
          confirmationNotes: notes,
          updatedAt: new Date(),
        })
    })
  }
  // #endregion

  private getConfirmationStatus(invitees: SelectInvitee[]) {
    const confirmed = invitees.filter(it => it.confirmationStatus === ConfirmationStatus.CONFIRMED)
    let status: ConfirmationStatus = ConfirmationStatus.CONFIRMED
    {
      const refused = invitees.filter(it => it.confirmationStatus === ConfirmationStatus.REFUSED)
      const pending = invitees.filter(it => it.confirmationStatus === ConfirmationStatus.PENDING)

      if (refused.length === invitees.length)
        status = ConfirmationStatus.REFUSED
      else if (pending.length === invitees.length)
        status = ConfirmationStatus.PENDING
      else if (pending.length > 0)
        status = ConfirmationStatus.PARTIALLY_CONFIRMED
    }

    return {
      status,
      confirmed: confirmed.length,
    }
  }
}
