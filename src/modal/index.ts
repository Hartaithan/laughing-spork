import { UIManager } from "@/services/ui-manager";
import { Elements } from "@/utils/elements";
import html from "@/modal/layout.html?raw";
import css from "@/modal/styles.css?inline";

export interface ModalOptions {
  title: string;
  content: string | HTMLElement;
  onClose?: () => void;
}

interface ModalOverlayElement extends HTMLElement {
  _onClose?: () => void;
}

interface ModalElements {
  overlay: ModalOverlayElement;
  container: HTMLDivElement;
  title: HTMLHeadingElement;
  close: HTMLButtonElement;
  content: HTMLDivElement;
}

export class Modal {
  private static instance: Modal;
  public elements!: Elements<ModalElements>;

  public static getInstance(): Modal {
    if (!Modal.instance) Modal.instance = new Modal();
    return Modal.instance;
  }

  public open(options: ModalOptions) {
    const ui = UIManager.getInstance();
    const shadow = ui.shadow;

    const layout = document.createElement("div");
    layout.innerHTML = html;
    shadow.appendChild(layout);

    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);

    this.elements = new Elements<ModalElements>({
      overlay: "#modal-overlay",
      container: "#modal-container",
      title: "#modal-title",
      close: "#modal-close",
      content: "#modal-content",
    });

    const overlay = this.elements.get("overlay");
    overlay.addEventListener("click", (e) => {
      if (e.target !== overlay) return;
      this.close();
    });
    if (options.onClose) overlay._onClose = options.onClose;

    const title = this.elements.get("title");
    title.textContent = options.title;

    const close = this.elements.get("close");
    close.addEventListener("click", () => this.close());

    const content = this.elements.get("content");
    if (typeof options.content === "string") {
      content.textContent = options.content;
    } else {
      content.innerHTML = "";
      content.appendChild(options.content);
    }
  }

  public close(): void {
    const ui = UIManager.getInstance();
    const shadow = ui.shadow;
    if (!shadow) return;

    const overlay = this.elements.get("overlay");
    if (!overlay) return;
    overlay?._onClose?.();
    overlay.remove();
  }
}
