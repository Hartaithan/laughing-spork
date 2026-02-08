import { Settings } from "@/modules/settings";
import { UI } from "@/modules/ui";
import { getForm, getFormValues, setFieldValue } from "./form";
import { isVacancyPage } from "@/utils/navigation";

const init = async () => {
  const ui = UI.getInstance();
  const settingsUI = ui.settings;

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

  settingsUI.toggle.addEventListener("click", () => {
    settingsUI.container.classList.toggle("hidden");
  });

  settingsUI.close.addEventListener("click", () => {
    settingsUI.container.classList.add("hidden");
  });

  if (isVacancyPage()) {
    const generateButton = ui.createGenerateButton();
    generateButton.addEventListener("click", () => {
      console.log("generate button clicked!");
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
