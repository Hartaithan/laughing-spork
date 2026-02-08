import { SettingsValues } from "@/models/settings";
import { UI } from "@/modules/ui";

export const getForm = (): HTMLFormElement => {
  const ui = UI.getInstance();
  const form = ui.shadow?.querySelector("#form");
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

export const setFieldValue = (
  name: keyof SettingsValues,
  value: string,
  form?: HTMLFormElement,
) => {
  const element = form ?? getForm();
  const field = element.elements.namedItem(name);
  if (!isFormElement(field)) throw new Error(`field "${name}" not found`);
  field.value = value;
};

export const getFormValues = (): SettingsValues => {
  const form = new FormData(getForm());
  return {
    api_key: String(form.get("api_key") ?? ""),
    experience: String(form.get("experience") ?? ""),
  };
};
