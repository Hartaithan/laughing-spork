import { GenerateButton } from "@/generate-button";
import { LetterForm } from "@/letter-form";
import { Modal } from "@/modal";
import { API } from "@/services/api";
import { SettingsStore } from "@/services/settings-store";
import { UIManager } from "@/services/ui-manager";
import { Settings } from "@/settings";
import { FormSubmitHandler } from "@/utils/form";
import {
  getResponseButton,
  pasteLetter,
  submitLetter,
  waitUntilResponseLetter,
} from "@/utils/letter-submit";
import { generatePrompt } from "@/utils/prompt";
import { isVacancyPage } from "@/utils/vacancy";

const init = async () => {
  const ui = UIManager.getInstance();
  ui.init();

  const store = SettingsStore.getInstance();
  await store.loadValues();

  const settings = Settings.getInstance();
  settings.render();

  const values = store.getValues();
  settings.setFieldValue("api_key", values.api_key);
  settings.setFieldValue("experience", values.experience);

  const settingsUI = settings.elements.getAll();
  settingsUI.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = settings.getFormValues();
    store.save(data);
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
    const letterForm = LetterForm.getInstance();
    const content = letterForm.create(response);

    const form = letterForm.elements.get("form");
    form.addEventListener("submit", onLetterSubmit);

    const copy = letterForm.elements.get("copy");
    copy.addEventListener("click", () => {
      const textarea = letterForm.elements.get("textarea");
      navigator.clipboard.writeText(textarea.value);
    });

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

  const generate = GenerateButton.getInstance().create();
  generate.addEventListener("click", onGenerateClick);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
