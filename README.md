# AI Cover Letter Generator

A Chrome extension that automates the process of writing and sending cover letters on [hh.ru](https://hh.ru) using AI.

## Features

- **AI-Powered Generation**: Uses the OpenRouter API to generate personalized cover letters based on the vacancy description.
- **Smart Customization**: Generates letters using your configured professional experience and personal links.
- **Fully Automated Flow**:
  - Parses the vacancy text automatically.
  - Clicks the "Apply" button.
  - Generates and inserts the cover letter.
  - The entire process takes less than 5 seconds.
- **User Control**: You provide your own OpenRouter API key and select the AI model you want to use.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hartaithan/laughing-spork.git
   cd laughing-spork
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

   This will create a `dist` directory with the compiled extension.

4. **Load into Google Chrome**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top right corner).
   - Click **Load unpacked**.
   - Select the `dist` directory from the project folder.

## Configuration

Before using the extension, you need to configure it with your details and API credentials.

1. Open the extension injected ui settings on hh.ru.
2. Enter the following information:
   - **OpenRouter API Key**: Your API key from [OpenRouter](https://openrouter.ai/).
   - **Model**: The AI model you wish to use (e.g., `openai/gpt-oss-20b:free`).
   - **Experience**: A brief summary of your skills and experience that the AI should highlight.
   - **Links**: Your portfolio, GitHub, LinkedIn, or other relevant links.

## How It Works

1. Open any vacancy page on `hh.ru`.
2. Click the extension’s injected UI action button.
3. The extension extracts the job description and relevant vacancy data from the page.
4. Using this data and your saved settings, a structured prompt is created.
5. The prompt is sent to the LLM to generate a personalized cover letter.
6. The generated letter is shown in a modal window, where you can review and edit it.
7. After clicking "Submit", the extension automatically responds to the vacancy and fills in the cover letter field.
