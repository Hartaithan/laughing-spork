import { SettingsValues } from "@/models/settings";
import { UI } from "./ui";
import { isFormElement } from "@/utils/form";

type SettingsData = Record<string, SettingsValues>;

export class Settings {
  private static instance: Settings;
  private static readonly STORAGE_KEY = "laughing-spork-settings";
  public values: SettingsValues = this.getDefaultValues();

  public static getInstance(): Settings {
    if (!Settings.instance) Settings.instance = new Settings();
    return Settings.instance;
  }

  public getDefaultValues(): SettingsValues {
    return { api_key: "", experience: "" };
  }

  public async loadValues(): Promise<void> {
    try {
      const result = await chrome.storage.local.get<SettingsData>(
        Settings.STORAGE_KEY,
      );
      this.values = result?.[Settings.STORAGE_KEY] || this.getDefaultValues();
      console.log("settings values loaded");
    } catch (error) {
      this.values = this.getDefaultValues();
      console.log("unable to load settings values");
    }
  }

  public getValues(): SettingsValues {
    return this.values;
  }

  public getValue<K extends keyof SettingsValues>(key: K): SettingsValues[K] {
    return this.values[key];
  }

  public getForm(): HTMLFormElement {
    const ui = UI.getInstance();
    const form = ui.shadow?.querySelector("#form");
    if (form instanceof HTMLFormElement === false) {
      throw new Error("form element not found");
    }
    return form;
  }

  public getFormValues(): SettingsValues {
    const form = new FormData(this.getForm());
    return {
      api_key: String(form.get("api_key") ?? ""),
      experience: String(form.get("experience") ?? ""),
    };
  }

  public setFieldValue(
    name: keyof SettingsValues,
    value: string,
    form?: HTMLFormElement,
  ) {
    const element = form ?? this.getForm();
    const field = element.elements.namedItem(name);
    if (!isFormElement(field)) throw new Error(`field "${name}" not found`);
    field.value = value;
  }

  public async save(values: SettingsValues): Promise<void> {
    this.values = values;
    await chrome.storage.local.set({ [Settings.STORAGE_KEY]: values });
  }
}
