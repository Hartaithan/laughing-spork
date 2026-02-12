import { UIManager } from "@/services/ui-manager";
import css from "@/generate-button/styles.css?inline";

export class GenerateButton {
  private static instance: GenerateButton;
  public _button: HTMLButtonElement | null = null;

  public static getInstance(): GenerateButton {
    if (!GenerateButton.instance) {
      GenerateButton.instance = new GenerateButton();
    }
    return GenerateButton.instance;
  }

  public create() {
    const ui = UIManager.getInstance();
    const shadow = ui.shadow;

    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);

    this._button = document.createElement("button");
    this._button.id = "generate-button";
    this._button.textContent = "Generate Letter";
    shadow.appendChild(this._button);

    return this._button;
  }

  public get button() {
    if (!this._button) throw new Error("generate button not found");
    return this._button;
  }
}
