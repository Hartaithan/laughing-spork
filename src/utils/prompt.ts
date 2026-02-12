import { getVacancyContent } from "./vacancy";
import { SettingsStore } from "@/services/settings-store";

export const generatePrompt = (): string => {
  const store = SettingsStore.getInstance();

  const prompt = `
    Ты - профессиональный HR-консультант. Твоя задача - написать сопроводительное письмо для отклика на вакансию.
    Инструкции:
    - без воды и общих фраз, только конкретика
    - короткое сопроводительное письмо (не более 150 слов)
    - не используй форматирование текста, лишние символы, эмодзи и markdown
    - верни в ответе только текст сопроводительного письма
    - не добавляй в конце подпись с именем и контактами
    Мой опыт:
    ${store.getValue("experience")}
    Описание вакансии:
    ${getVacancyContent()}
  `;

  return prompt
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
};
