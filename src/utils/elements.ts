import { UIManager } from "@/services/ui-manager";

export class Elements<T> {
  private cached: T | null = null;

  constructor(
    private selectors: Record<keyof T, string>,
    private root?: Element,
  ) {}

  private cache(): T {
    if (this.cached) return this.cached;

    const elements = {} as T;

    const container = this.root ?? UIManager.getInstance().shadow;
    const entries = Object.entries(this.selectors) as [string, string][];
    for (const [key, selector] of entries) {
      const el = container.querySelector(selector);
      if (!el) throw new Error(`element not found: ${selector} [key: ${key}]`);
      elements[key as keyof T] = el as T[keyof T];
    }

    this.cached = elements;
    return this.cached;
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this.cache()[key];
  }

  public getAll(): T {
    return this.cache();
  }

  public reset(): void {
    this.cached = null;
  }
}
