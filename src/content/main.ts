import { Settings } from "@/modules/settings";
import { UI } from "@/modules/ui";
import { getForm, getFormValues, setFieldValue } from "./form";

const init = async () => {
  const ui = UI.getInstance();

  const container = ui.shadow?.querySelector(".container");
  const button = ui.shadow?.querySelector("#toggle");
  const close = ui.shadow?.querySelector("#close");
  if (!container || !button || !close) return;

  const settings = Settings.getInstance();
  await settings.loadValues();
  const values = settings.getValues();

  const form = getForm();
  setFieldValue("api_key", values.api_key, form);
  setFieldValue("experience", values.experience, form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getFormValues();
    settings.save(data);
  });

  button.addEventListener("click", () => {
    container.classList.toggle("hidden");
  });

  close.addEventListener("click", () => {
    container.classList.add("hidden");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
