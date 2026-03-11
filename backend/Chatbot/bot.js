// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const askAI = async (message) => {
//   try {

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",

//       systemInstruction: `
// You are HOTDROP AI Assistant.

// Your job is to help users of a developer project platform.

// You can:
// - Suggest unique project ideas
// - Explain project improvements
// - Answer questions about followers, posts, and engagement
// - Give advice for developers

// Rules:
// - Give short answers.
// - Maximum 2–3 sentences.
// - Be concise.

// Always respond clearly and concisely.
// `
//     });

//     const result = await model.generateContent(message);

//     const response = await result.response;

//     return response.text();

//   } catch (error) {
//     console.error(error);
//     return "AI failed to respond.";
//   }
// };




import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeys = process.env.GEMINI_API_KEYS.split(",");

export const askAI = async (message,username) => {

  for (let i = 0; i < apiKeys.length; i++) {

    try {

      const genAI = new GoogleGenerativeAI(apiKeys[i]);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
         systemInstruction: `
You are HOTDROP AI Assistant.
HOTDROP is The elite launchpad for developers where you can Discover Explore & Drop projects for reviews, #Build #Connect #Scale


Your job is to help users of a developer project platform.
The user's name is ${username}.
You can:
- Suggest unique project ideas
- Explain project improvements
- Answer questions about followers, posts, and engagement
- Give advice for developers

Rules:
- Give short answers.
- Maximum 1–2 sentences.
- Be concise.
- If the user greets you or it's the start of the chat, greet them by their name "${username}".
- Always respond clearly and concisely.
`
      });

      const result = await model.generateContent(message);

      const response = await result.response;

      return response.text();

    } catch (error) {

      console.log(`API key ${i + 1} failed`);

      if (i === apiKeys.length - 1) {
        throw new Error("All API keys failed");
      }

    }

  }

};