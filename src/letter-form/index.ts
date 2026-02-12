import { UIManager } from "@/services/ui-manager";
import html from "@/letter-form/layout.html?raw";
import css from "@/letter-form/styles.css?inline";
import { Elements } from "@/utils/elements";

interface LetterFormElements {
  form: HTMLFormElement;
  textarea: HTMLTextAreaElement;
  copy: HTMLButtonElement;
  submit: HTMLButtonElement;
}

export class LetterForm {
  private static instance: LetterForm;
  public elements!: Elements<LetterFormElements>;

  public static getInstance(): LetterForm {
    if (!LetterForm.instance) LetterForm.instance = new LetterForm();
    return LetterForm.instance;
  }

  public create(letter: string) {
    const ui = UIManager.getInstance();
    const shadow = ui.shadow;

    const layout = document.createElement("div");
    layout.innerHTML = html;

    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);

    this.elements = new Elements<LetterFormElements>(
      {
        form: "#letter-form",
        textarea: "#letter-textarea",
        copy: "#letter-copy",
        submit: "#letter-submit",
      },
      layout,
    );

    const textarea = this.elements.get("textarea");
    textarea.value = letter;

    const copy = this.elements.get("copy");
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(textarea.value);
    });

    return layout;
  }
}
