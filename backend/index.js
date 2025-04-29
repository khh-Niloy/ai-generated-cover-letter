import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/generate-text", (req, res) => {
  const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
  }

  main();
});

// app.get("/", (req, res) => {
//   res.send("all okay");
// });

app.listen(8000, () => {
  console.log("Server is running at 8000");
});
