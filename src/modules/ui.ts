import css from "@/content/style.css?inline";
import html from "@/content/index.html?raw";

const ids = {
  container: "laughing-spork-settings-container",
  wrapper: "laughing-spork-settings-wrapper",
  styles: "laughing-spork-settings-styles",
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
}
