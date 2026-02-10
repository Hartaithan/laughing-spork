import { Settings } from "@/modules/settings";
import { UI } from "@/modules/ui";
import { getForm, getFormValues, setFieldValue } from "./form";
import { isVacancyPage } from "@/utils/vacancy";
import { generatePrompt } from "@/utils/prompt";
import { API } from "@/modules/api";
import { LetterForm } from "@/modules/letter-form";
import { Modal } from "@/modules/modal";

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
      const form = LetterForm.getInstance();
      const modal = Modal.getInstance();
      API.getInstance()
        .generate(generatePrompt())
        .then((response) => {
          modal.open({
            title: "Letter",
            content: form.create(response),
          });
        })
        .catch((error) => {
          console.error("unable to generate letter", error);
        });
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
