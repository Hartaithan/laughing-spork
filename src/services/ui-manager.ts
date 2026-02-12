import css from "@/main/global.css?inline";

export class UIManager {
  private static instance: UIManager;
  private _shadow: ShadowRoot | null = null;
  public container: HTMLElement | null = null;
  public content: HTMLElement | null = null;

  public static getInstance(): UIManager {
    if (!UIManager.instance) UIManager.instance = new UIManager();
    return UIManager.instance;
  }

  public init() {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.id = "lg-sk-container";
    this._shadow = this.container.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = css;
    this._shadow.appendChild(style);

    const content = document.createElement("div");
    content.id = "lg-sk-content";
    this._shadow.appendChild(content);

    document.body.appendChild(this.container);
  }

  public get shadow(): ShadowRoot {
    if (!this._shadow) throw new Error("shadow is not initialized");
    return this._shadow;
  }
}
