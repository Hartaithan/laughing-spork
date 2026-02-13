export const getResponseButton = (): HTMLButtonElement | null => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    'a[role="button"][data-qa="vacancy-response-link-top"]',
  );

  if (buttons.length < 2) {
    console.error("response button not found");
    return null;
  }

  return buttons[1];
};

const searchTextarea = (document: Element): HTMLTextAreaElement | null => {
  return document.querySelector<HTMLTextAreaElement>(
    'div[data-qa="textarea-native-wrapper"] > textarea',
  );
};

export const waitUntilResponseLetter = (
  timeout = 10000,
): Promise<HTMLTextAreaElement> => {
  return new Promise((resolve, reject) => {
    const parentElement = document.querySelector(
      "div.bloko-v-spacing.bloko-v-spacing_base-8",
    );
    const parent = parentElement?.parentElement;

    if (!parent) return reject(new Error("Response letter parent not found"));

    const textarea = searchTextarea(parent);
    if (textarea) return resolve(textarea);

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error("Wait for textarea timed out"));
    }, timeout);

    const observer = new MutationObserver((_, obs) => {
      const textarea = searchTextarea(parent);
      if (!textarea) return;
      obs.disconnect();
      clearTimeout(timer);
      resolve(textarea);
    });

    observer.observe(parent, {
      childList: true,
      subtree: true,
    });
  });
};

export const pasteLetter = (textarea: HTMLTextAreaElement, letter: string) => {
  textarea.value = letter;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  navigator.clipboard.writeText(textarea.value);
};

export const submitLetter = () => {
  const button = document.querySelector<HTMLButtonElement>(
    'button[data-qa="vacancy-response-letter-submit"]',
  );
  button?.click();
};
