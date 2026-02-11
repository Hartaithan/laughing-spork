import { Settings } from "@/modules/settings";
import { UI } from "@/modules/ui";
import { isVacancyPage } from "@/utils/vacancy";
import { generatePrompt } from "@/utils/prompt";
import { API } from "@/modules/api";
import { LetterForm } from "@/modules/letter-form";
import { Modal } from "@/modules/modal";
import { FormSubmitHandler } from "@/models/form";
import {
  getResponseButton,
  pasteLetter,
  submitLetter,
  waitUntilResponseLetter,
} from "@/utils/letter-submit";

const init = async () => {
  const ui = UI.getInstance();
  const settingsUI = ui.settings;

  const settings = Settings.getInstance();
  await settings.loadValues();
  const values = settings.getValues();

  const settingsForm = settings.getForm();
  settings.setFieldValue("api_key", values.api_key, settingsForm);
  settings.setFieldValue("experience", values.experience, settingsForm);

  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = settings.getFormValues();
    settings.save(data);
  });

  settingsUI.toggle.addEventListener("click", () => {
    settingsUI.container.classList.toggle("hidden");
  });

  settingsUI.close.addEventListener("click", () => {
    settingsUI.container.classList.add("hidden");
  });

  if (!isVacancyPage()) return;

  const onLetterSubmit: FormSubmitHandler = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const letter = form.letter.value;
    const modal = Modal.getInstance();
    modal.close();

    const button = getResponseButton();
    if (!button) {
      console.error("response button not found");
      return;
    }
    button.click();

    waitUntilResponseLetter()
      .then((textarea) => {
        pasteLetter(textarea, letter);
        submitLetter();
      })
      .catch((error) => {
        console.error("unable to paste letter", error);
      });
  };

  const onGenerateResponse = (response: string) => {
    const form = LetterForm.getInstance();
    const content = form.create(response, onLetterSubmit);
    const modal = Modal.getInstance();
    modal.open({ title: "Letter", content });
  };

  const onGenerateClick = () => {
    API.getInstance()
      .generate(generatePrompt())
      .then(onGenerateResponse)
      .catch((error) => {
        console.error("unable to generate letter", error);
      });
  };

  const generateButton = ui.createGenerateButton();
  generateButton.addEventListener("click", onGenerateClick);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
