export class RingBuffer<T> {
  private readonly max: number;
  private buf: T[];

  constructor(max: number) {
    this.max = Math.max(1, Math.floor(max));
    this.buf = [];
  }

  push(item: T): void {
    if (this.buf.length < this.max) {
      this.buf.push(item);
      return;
    }
    this.buf = [...this.buf.slice(1), item];
  }

  toArray(): T[] {
    return [...this.buf];
  }
}

