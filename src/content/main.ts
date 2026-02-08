import { UI } from "@/modules/ui";

const init = async () => {
  const ui = UI.getInstance();

  const container = ui.shadow?.querySelector(".container");
  const button = ui.shadow?.querySelector("#toggle");
  const close = ui.shadow?.querySelector("#close");
  if (!container || !button || !close) return;

  button.addEventListener("click", () => {
    container.classList.toggle("hidden");
  });

  close.addEventListener("click", () => {
    container.classList.add("hidden");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
