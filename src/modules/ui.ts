import styles from "@/content/style.css?inline";

export class UI {
  private static instance: UI;
  private _shadow: ShadowRoot | null = null;
  public id: string = "laughing-spork-settings";

  private constructor() {}

  public static getInstance(): UI {
    if (!UI.instance) UI.instance = new UI();
    return UI.instance;
  }

  public get shadow(): ShadowRoot | null {
    return this._shadow;
  }

  public async create() {
    if (document.getElementById(this.id)) return;

    const container = document.createElement("div");
    container.id = this.id;

    this._shadow = container.attachShadow({ mode: "open" });

    const html = chrome.runtime.getURL("src/content/index.html");

    try {
      const response = await fetch(html);
      const content = await response.text();

      const style = document.createElement("style");
      style.textContent = styles;

      this._shadow.innerHTML = content;
      this._shadow.appendChild(style);

      document.body.appendChild(container);
    } catch (error) {
      console.error("Failed to load UI content:", error);
    }
  }
}
