import { Settings } from "@/modules/settings";
import { getVacancyContent } from "./vacancy";

export const generatePrompt = (): string => {
  const settings = Settings.getInstance();

  const prompt = `
    Ты - профессиональный HR-консультант. Твоя задача - написать сопроводительное письмо для отклика на вакансию.
    Инструкции:
    - без воды и общих фраз, только конкретика
    - короткое сопроводительное письмо (не более 150 слов)
    - не используй форматирование текста, лишние символы, эмодзи и markdown
    - верни в ответе только текст сопроводительного письма
    - не добавляй в конце подпись с именем и контактами
    Мой опыт:
    ${settings.getValue("experience")}
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
