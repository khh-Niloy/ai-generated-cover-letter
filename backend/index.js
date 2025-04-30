import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";
import path from "path";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  "/generated_files",
  express.static(path.join(process.cwd(), "generated_files"))
);

const launchBrowser = async () => {
  const browser = await puppeteer.launch({ headless: true });
  return browser;
};

app.post("/generate-text", (req, res) => {
  const body = req.body;
  const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

  try {
    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Please generate a professional cover letter based on the following job description (${
          body.jobDescription
        }) and my resume (${
          body.resumeContent
        }). The letter should adhere to standard cover letter format, ensuring that the content is clear, concise, 
        and tailored to the job. The letter must include the following: 
        1. **Header**: Include my name, location, phone number and email. 
        2. **Employers Details**: Include the employer's name, position (if available), 
        company name, and address (omit if not available). 3. **Date**: use this date ${new Date().toDateString()}. 
        4. **Salutation**: Address as "Dear Hiring Manager" if no specific name is provided. 
        5. **Introduction**: Express enthusiasm for the role and interest in the company, mentioning your 
        relevant skills and how they align with the position. Do not make it too long, please, please 
        6. **Body Paragraphs**: Focus on the technical skills and experiences that match the job requirements. 
        Adapt your discussion around the technologies worked with. Mention specific projects or experiences 
        where these skills were successfully applied, demonstrating your impact. Do not make it too long, please, please 
        7. **Closing Paragraph**: Reaffirm interest and availability. 
        8. **Closing Line**: End with "Sincerely," followed by name. The letter should be professional in tone, 
        concise, and ready to send without any placeholders or notes. 
        Please emphasize my technical skills and problem-solving abilities 
        while maintaining authenticity. 
        Important: - Do not make it too long. - No placeholders like "[Address if available]" in output. 
        - The letter should be 100% ready to send - Keep it concise (one page max) - Use a professional tone 
        - Avoid generic or placeholder text again i am sharing job description and resume content Here is the 
        **Job Description**: ${
          body.jobDescription
        } Here is my **Resume content**: ${body.resumeContent},`,
      });
      // console.log(response.text);

      const generatedText = response.text;

      const basicHtml = `
        <html>
          <head>
            <style>
              body {
                font-family: Calibri, sans-serif;
                padding: 10px;
                font-size: 15px;
                line-height: 1.5;
              }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap;">${generatedText}</pre>
          </body>
        </html>
      `;

      const modernHtml = `
      <html>
    <head>
      <style>
        body {
          font-family: "Times New Roman";
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div>
        <div style="height: 30px; background-color: #f01938"></div>
        <pre
          style="
            white-space: pre-wrap;
            padding: 10px;
            font-size: 15px;
            line-height: 1.5;
          "
        >
        ${generatedText}
      </pre
        >
      </div>
  
      <div style="position: relative; width: 100%">
        <div
          style="
            height: 20px;
            position: absolute;
            background-color: #2f2f2f;
            width: 100%;
            top: 20px;
          "
        ></div>
        <div
          style="
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            height: 33px;
            width: 160px;
            background-color: #f01938;
            clip-path: polygon(0 0, 130px 0, 160px 100%, 0% 100%);
            z-index: 2;
          "
        ></div>
      </div>
    </body>
  </html>
  
      `;

      const createImageAndPdf = async (html, imagePath, pdfPath, browser) => {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.setViewport({ width: 612, height: 792 });

        await page.screenshot({
          path: imagePath,
          type: "jpeg",
          quality: 100,
          fullPage: true,
        });

        await page.pdf({
          path: pdfPath,
          format: "A4",
          printBackground: true,
          margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
        });

        await page.close();
      };

      const browser = await launchBrowser();

      const dir = path.join(process.cwd(), "generated_files");
      const basicImagePath = path.join(dir, "output-basic.jpg");
      const modernImagePath = path.join(dir, "output-modern.jpg");
      const basicPdfPath = path.join(dir, "output-basic.pdf");
      const modernPdfPath = path.join(dir, "output-modern.pdf");

      await createImageAndPdf(basicHtml, basicImagePath, basicPdfPath, browser);
      await createImageAndPdf(
        modernHtml,
        modernImagePath,
        modernPdfPath,
        browser
      );

      await browser.close();

      res.status(200).json({
        message: "Cover letter generated successfully",
        pdfUrls: [
          `${process.env.URL}/generated_files/output-basic.pdf`,
          `${process.env.URL}/generated_files/output-modern.pdf`,
        ],
        imageUrls: [
          `${process.env.URL}/generated_files/output-basic.jpg`,
          `${process.env.URL}/generated_files/output-modern.jpg`,
        ],
      });
    }
    main();
  } catch (error) {
    const errorMessage = error?.message || "An unexpected error occurred";

    console.error("Error:", errorMessage);

    res.status(500).json({
      errorMessage: errorMessage,
      details: error.response?.data || error,
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running at 8000");
});
