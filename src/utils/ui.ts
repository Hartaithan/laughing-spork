const active = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
const previous = new Map<HTMLElement, string>();

export const showTemporaryText = (
  element: HTMLElement,
  text: string,
  duration: number = 1000,
): void => {
  if (active.has(element)) {
    clearTimeout(active.get(element));
  } else {
    previous.set(element, element.textContent || "");
  }

  element.textContent = text;

  const timeout = setTimeout(() => {
    const originalText = previous.get(element);
    if (originalText !== undefined) element.textContent = originalText;
    active.delete(element);
    previous.delete(element);
  }, duration);

  active.set(element, timeout);
};

interface LoadingHandler {
  start: () => void;
  end: () => void;
}

export const createLoadingManager = (
  element: HTMLElement,
  text: string,
): LoadingHandler => {
  let prev: string | null = null;
  const isButton = element instanceof HTMLButtonElement;
  return {
    start: () => {
      if (prev === null) {
        prev = element.textContent;
      }
      element.textContent = text;
      if (isButton) element.disabled = true;
    },
    end: () => {
      if (prev !== null) {
        element.textContent = prev;
      }
      if (isButton) element.disabled = false;
      prev = null;
    },
  };
};
