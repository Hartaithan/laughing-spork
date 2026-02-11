import { FormSubmitHandler } from "@/models/form";

const ids = {
  form: "letter-form",
  textarea: "letter-textarea",
  submit: "letter-submit",
  copy: "letter-copy",
};

export class LetterForm {
  private static instance: LetterForm;
  public form: HTMLFormElement | null = null;

  private constructor() {}

  public static getInstance(): LetterForm {
    if (!LetterForm.instance) LetterForm.instance = new LetterForm();
    return LetterForm.instance;
  }

  public create(letter: string, onSubmit: FormSubmitHandler) {
    this.form = document.createElement("form");
    this.form.id = ids.form;
    this.form.className = ids.form;

    const textarea = document.createElement("textarea");
    textarea.id = ids.textarea;
    textarea.className = ids.textarea;
    textarea.value = letter;
    textarea.name = "letter";
    this.form.appendChild(textarea);

    this.form.addEventListener("submit", onSubmit);

    const copy = document.createElement("button");
    copy.id = ids.copy;
    copy.className = ids.copy;
    copy.textContent = "Copy Letter";
    copy.type = "button";
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(textarea.value);
    });
    this.form.appendChild(copy);

    const submit = document.createElement("button");
    submit.id = ids.submit;
    submit.className = ids.submit;
    submit.textContent = "Submit";
    submit.type = "submit";
    this.form.appendChild(submit);

    return this.form;
  }
}
