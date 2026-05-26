declare module 'fuse.js/worker' {
  import Fuse, { FuseResult } from 'fuse.js'

  declare class FuseWorker<T> extends Fuse<T> {
    search(pattern: string): Promise<FuseResult<T>[]>
    terminate(): void
    _pending: Map<number, { resolve(v: unknown): void, reject(err: unknown): void }>
  }
}
