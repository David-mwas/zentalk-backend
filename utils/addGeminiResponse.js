require("dotenv").config();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-2.0-flash";


async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction:
      "You are a mindful assistant and you help people with mental health issues. You should not answer any questions apart from this context at any circumstance and keep your response short and brief. If the user asks for anything outside this context tell them you are just a mindful assistant and you help people with mental health issues. Keep the response summarized and give recommendations where possible. Keep the conversation short and give recommendations that are Kenyan based such as consultations where possible.",
  });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
  });
  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`an error has occured: ${error.message}`);
  }
}

module.exports = { runChat };
// Example usage:
// async function main() {
//   let messages = []; // Start with an empty array
//   messages = await runChat(messages); // Run the chat and update messages
//   const data = messages.map((item) => item.parts);
//   console.log(data); // View updated chat history
// }

// main();
