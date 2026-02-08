import css from "@/content/style.css?inline";
import html from "@/content/index.html?raw";

const ids = {
  container: "laughing-spork-container",
  wrapper: "laughing-spork-settings-wrapper",
  styles: "laughing-spork-settings-styles",
  generate: "laughing-spork-generate-button",
};

export class UI {
  private static instance: UI;
  public container: HTMLElement | null = null;
  private _shadow: ShadowRoot | null = null;

  private constructor() {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.id = ids.container;
    this._shadow = this.container.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.id = ids.styles;
    style.textContent = css;
    this._shadow.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.id = ids.wrapper;
    wrapper.innerHTML = html;
    this._shadow.appendChild(wrapper);

    document.body.appendChild(this.container);
  }

  public static getInstance(): UI {
    if (!UI.instance) UI.instance = new UI();
    return UI.instance;
  }

  public get shadow(): ShadowRoot | null {
    return this._shadow;
  }

  public get settings() {
    if (!this._shadow) throw new Error("shadow not found");
    const selector = this._shadow.querySelector.bind(this._shadow);

    const container = selector<HTMLElement>(".container");
    if (!container) throw new Error("container not found");

    const toggle = selector<HTMLButtonElement>("#toggle");
    if (!toggle) throw new Error("toggle not found");

    const close = selector<HTMLButtonElement>("#close");
    if (!close) throw new Error("close not found");

    return { container, toggle, close };
  }

  public createGenerateButton(): HTMLButtonElement {
    if (!this._shadow) throw new Error("shadow not found");
    const button = document.createElement("button");
    button.id = ids.generate;
    button.textContent = "Generate Letter";
    this._shadow.appendChild(button);
    return button;
  }

  public get generateButton(): HTMLButtonElement {
    if (!this._shadow) throw new Error("shadow not found");
    const button = this._shadow.querySelector<HTMLButtonElement>("#generate");
    if (!button) throw new Error("generate button not found");
    return button;
  }
}
