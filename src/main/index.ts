import { GenerateButton } from "@/generate-button";
import { LetterForm } from "@/letter-form";
import { Modal } from "@/modal";
import { API } from "@/services/api";
import { SettingsStore } from "@/services/settings-store";
import { UIManager } from "@/services/ui-manager";
import { Settings } from "@/settings";
import { copyToClipboard } from "@/utils/clipboard";
import { FormSubmitHandler } from "@/utils/form";
import {
  getResponseButton,
  pasteLetter,
  submitLetter,
  waitUntilResponseLetter,
} from "@/utils/letter-submit";
import { generatePrompt } from "@/utils/prompt";
import { createLoadingManager, showTemporaryText } from "@/utils/ui";
import { isVacancyPage } from "@/utils/vacancy";

const init = async () => {
  const ui = UIManager.getInstance();
  ui.init();

  const store = SettingsStore.getInstance();
  await store.loadValues();

  const settings = Settings.getInstance();
  settings.render();

  const setValues = () => {
    const values = store.getValues();
    settings.setFieldValue("api_key", values.api_key);
    settings.setFieldValue("experience", values.experience);
    settings.setFieldValue("links", values.links);
    settings.setFieldValue("model", values.model);
  };

  setValues();

  const settingsUI = settings.elements.getAll();
  settingsUI.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = settings.getFormValues();
    store.save(data).then(() => {
      showTemporaryText(settingsUI.save, "Saved!");
    });
  });
  settingsUI.toggle.addEventListener("click", () => {
    settingsUI.container.classList.toggle("hidden");
  });
  settingsUI.close.addEventListener("click", () => {
    settingsUI.container.classList.add("hidden");
  });
  settingsUI.reset.addEventListener("click", () => {
    store.reset().then(() => {
      showTemporaryText(settingsUI.reset, "Resetted!");
      setValues();
    });
  });

  if (!isVacancyPage()) return;

  const onLetterSubmit: FormSubmitHandler = async (e: Event) => {
    e.preventDefault();

    const modal = Modal.getInstance();
    const letterForm = LetterForm.getInstance();

    const button = getResponseButton();
    if (!button) {
      console.error("response button not found");
      return;
    }
    button.click();

    const form = e.target as HTMLFormElement;
    const letter = form.letter.value;

    const submit = letterForm.elements.get("submit");
    const loader = createLoadingManager(submit, "Submitting...");
    loader.start();

    waitUntilResponseLetter()
      .then((textarea) => {
        pasteLetter(textarea, letter);
        submitLetter();
        modal.close();
      })
      .catch((error) => {
        console.error("unable to paste letter", error);
      })
      .finally(() => {
        loader.end();
      });
  };

  const onGenerateResponse = (response: string) => {
    copyToClipboard(response);

    const letterForm = LetterForm.getInstance();
    const content = letterForm.create(response);

    const form = letterForm.elements.get("form");
    form.addEventListener("submit", onLetterSubmit);

    const copy = letterForm.elements.get("copy");
    copy.addEventListener("click", () => {
      const textarea = letterForm.elements.get("textarea");
      copyToClipboard(textarea.value);
      showTemporaryText(copy, "Copied!");
    });

    const modal = Modal.getInstance();
    modal.open({ title: "Letter", content });
  };

  const onGenerateClick = () => {
    const generate = GenerateButton.getInstance();
    const loader = createLoadingManager(generate.button, "Generating...");
    loader.start();
    API.getInstance()
      .generate(generatePrompt())
      .then(onGenerateResponse)
      .catch((error) => {
        console.error("unable to generate letter", error);
      })
      .finally(() => {
        loader.end();
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
