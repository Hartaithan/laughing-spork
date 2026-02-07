import { SettingsValues } from "@/models/settings";
import { Settings } from "@/modules/settings";

const getForm = (): HTMLFormElement => {
  const form = document.getElementById("form");
  if (form instanceof HTMLFormElement === false) {
    throw new Error("form element not found");
  }
  return form;
};

const isFormElement = (
  element: Element | RadioNodeList | null,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
};

const setFieldValue = (
  name: keyof SettingsValues,
  value: string,
  form?: HTMLFormElement,
) => {
  const element = form ?? getForm();
  const field = element.elements.namedItem(name);
  if (!isFormElement(field)) throw new Error(`field "${name}" not found`);
  field.value = value;
};

const getFormValues = (): SettingsValues => {
  const form = new FormData(getForm());
  return {
    api_key: String(form.get("api_key") ?? ""),
    experience: String(form.get("experience") ?? ""),
  };
};

const init = async () => {
  const settings = Settings.getInstance();
  const values = await settings.getValues();

  const form = getForm();
  setFieldValue("api_key", values.api_key, form);
  setFieldValue("experience", values.experience, form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getFormValues();
    settings.save(data);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
