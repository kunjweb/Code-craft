import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Message {
  role: "user" | "model";
  content: string;
}

export async function chatWithAI(messages: Message[]): Promise<string> {
  const model = "gemini-3.1-pro-preview";
  
  // Format messages for Gemini API
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
  
  const currentMessage = messages[messages.length - 1].content;

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are CodeCraft AI, a world-class senior software engineer and coding mentor. 
      Your goal is to help users write high-quality, efficient, and secure code.
      
      Guidelines:
      1. Provide clear, concise explanations.
      2. When writing code, use best practices and modern syntax.
      3. Include comments in the code to explain complex logic.
      4. If a user's request is ambiguous, ask for clarification.
      5. If you see potential bugs or security issues in user-provided code, point them out politely.
      6. Support multiple programming languages.
      7. Format your responses using Markdown, especially for code blocks.`,
    },
    history: history,
  });

  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message: currentMessage });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while communicating with the AI. Please check your API key and connection.";
  }
}
