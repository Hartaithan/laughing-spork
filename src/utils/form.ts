export type FormSubmitHandler = (event: SubmitEvent) => void;

export const isFormElement = (
  element: Element | RadioNodeList | null,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
};
