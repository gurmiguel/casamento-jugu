import { asc, eq, inArray } from 'drizzle-orm'
import db from '../adapters/data/db'
import { galleryTable } from '../adapters/data/schemas'

export class GalleryRepository {
  public async findAll() {
    return await db.select()
      .from(galleryTable)
      .orderBy(asc(galleryTable.order))
  }

  public async findById(id: number) {
    return await db
      .select()
      .from(galleryTable)
      .where(eq(galleryTable.id, id))
      .then(res => res[0])
  }

  public async saveAll(images: Array<{ path: string, id: string, order: number }>) {
    return await db.insert(galleryTable).values(
      images.map(i => ({
        path: i.path,
        providerId: i.id,
        order: i.order,
      })),
    )
  }

  public async remove(id: number) {
    return await db
      .delete(galleryTable)
      .where(eq(galleryTable.id, id))
  }

  public async removeMany(ids: number[]) {
    return await db
      .delete(galleryTable)
      .where(inArray(galleryTable.id, ids))
  }
}
