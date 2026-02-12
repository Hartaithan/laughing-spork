import { SettingsValues } from "@/services/settings-store";
import { UIManager } from "@/services/ui-manager";
import html from "@/settings/layout.html?raw";
import css from "@/settings/styles.css?inline";
import { Elements } from "@/utils/elements";
import { isFormElement } from "@/utils/form";

interface SettingsElements {
  container: HTMLDivElement;
  toggle: HTMLButtonElement;
  close: HTMLButtonElement;
  form: HTMLFormElement;
  save: HTMLButtonElement;
}

export class Settings {
  private static instance: Settings;
  public elements!: Elements<SettingsElements>;

  public static getInstance(): Settings {
    if (!Settings.instance) Settings.instance = new Settings();
    return Settings.instance;
  }

  public render() {
    const ui = UIManager.getInstance();
    const shadow = ui.shadow;

    const layout = document.createElement("div");
    layout.innerHTML = html;
    shadow.appendChild(layout);

    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);

    const toggle = document.createElement("button");
    toggle.id = "settings-toggle";
    toggle.className = "toggle";
    toggle.innerHTML = "⚙";
    shadow.appendChild(toggle);

    this.elements = new Elements<SettingsElements>({
      container: "#settings-container",
      toggle: "#settings-toggle",
      close: "#settings-close",
      form: "#settings-form",
      save: "#settings-save",
    });
  }

  public getFormValues(): SettingsValues {
    const data = new FormData(this.elements.get("form"));
    return {
      api_key: String(data.get("api_key") ?? ""),
      experience: String(data.get("experience") ?? ""),
    };
  }

  public setFieldValue(name: keyof SettingsValues, value: string) {
    const form = this.elements.get("form");
    const field = form.elements.namedItem(name);
    if (!isFormElement(field)) throw new Error(`field "${name}" not found`);
    field.value = value;
  }
}
