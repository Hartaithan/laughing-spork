import { UI } from "./ui";

export interface ModalOptions {
  title: string;
  content: string | HTMLElement;
  onClose?: () => void;
}

interface ModalOverlayElement extends HTMLElement {
  _onClose?: () => void;
}

const ids = {
  overlay: "modal-overlay",
  container: "modal-container",
  header: "modal-header",
  title: "modal-title",
  close: "modal-close",
  content: "modal-content",
};

export class Modal {
  private static instance: Modal;

  private constructor() {}

  public static getInstance(): Modal {
    if (!Modal.instance) Modal.instance = new Modal();
    return Modal.instance;
  }

  public open(options: ModalOptions) {
    const ui = UI.getInstance();
    const shadow = ui.shadow;
    if (!shadow) throw new Error("Shadow root not found");

    const overlay = document.createElement("div") as ModalOverlayElement;
    overlay.id = ids.overlay;
    overlay.className = ids.overlay;

    overlay.addEventListener("click", (e) => {
      if (e.target !== overlay) return;
      this.close();
    });

    const container = document.createElement("div");
    container.className = ids.container;

    const header = document.createElement("div");
    header.className = ids.header;

    const title = document.createElement("div");
    title.className = ids.title;
    title.textContent = options.title;

    const closeButton = document.createElement("button");
    closeButton.className = ids.close;
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => this.close());

    header.appendChild(title);
    header.appendChild(closeButton);

    const content = document.createElement("div");
    content.className = ids.content;

    if (typeof options.content === "string") {
      content.textContent = options.content;
    } else {
      content.appendChild(options.content);
    }

    container.appendChild(header);
    container.appendChild(content);
    overlay.appendChild(container);

    shadow.appendChild(overlay);

    if (options.onClose) {
      overlay._onClose = options.onClose;
    }
  }

  public close(): void {
    const ui = UI.getInstance();
    const shadow = ui.shadow;
    if (!shadow) return;

    const overlay = shadow.getElementById(ids.overlay) as ModalOverlayElement;
    if (!overlay) return;
    overlay?._onClose?.();
    overlay.remove();
  }
}
