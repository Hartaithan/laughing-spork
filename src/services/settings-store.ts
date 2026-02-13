export interface SettingsValues {
  api_key: string;
  experience: string;
  model: string;
}

type SettingsData = Record<string, SettingsValues>;

export class SettingsStore {
  private static instance: SettingsStore;
  private static readonly KEY = "laughing-spork-settings";
  public values: SettingsValues = this.getDefaultValues();

  public static getInstance(): SettingsStore {
    if (!SettingsStore.instance) SettingsStore.instance = new SettingsStore();
    return SettingsStore.instance;
  }

  public getDefaultValues(): SettingsValues {
    return { api_key: "", experience: "", model: "openai/gpt-oss-20b:free" };
  }

  public async loadValues(): Promise<void> {
    try {
      const result = await chrome.storage.local.get<SettingsData>(
        SettingsStore.KEY,
      );
      this.values = result?.[SettingsStore.KEY] || this.getDefaultValues();
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

  public async save(values: SettingsValues): Promise<void> {
    this.values = values;
    await chrome.storage.local.set({ [SettingsStore.KEY]: values });
  }

  public async reset(): Promise<void> {
    this.values = this.getDefaultValues();
    await chrome.storage.local.set({ [SettingsStore.KEY]: this.values });
  }
}
