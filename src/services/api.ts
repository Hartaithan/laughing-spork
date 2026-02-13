import { SettingsStore } from "./settings-store";

export class API {
  private static instance: API;
  private static readonly API_URL = import.meta.env.VITE_API_BASE_URL;

  public static getInstance(): API {
    if (!API.instance) API.instance = new API();
    return API.instance;
  }

  public generate(prompt: string) {
    const store = SettingsStore.getInstance();
    const model = store.getValue("model");
    if (!model || model.length === 0) throw new Error("model not found");
    return fetch(`${API.API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.getValue("api_key")}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": encodeURIComponent(document.title),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        const content = response.choices?.[0]?.message?.content;
        if (!content) throw new Error("content not found");
        return content;
      });
  }
}
