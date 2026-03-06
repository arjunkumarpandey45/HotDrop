import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAI = async (message) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",

      systemInstruction: `
You are HOTDROP AI Assistant.

Your job is to help users of a developer project platform.

You can:
- Suggest unique project ideas
- Explain project improvements
- Answer questions about followers, posts, and engagement
- Give advice for developers

Always respond clearly and concisely.
`
    });

    const result = await model.generateContent(message);

    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error(error);
    return "AI failed to respond.";
  }
};