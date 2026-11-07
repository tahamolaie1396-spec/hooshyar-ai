import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
app.use(helmet());
app.use(express.json({limit:"20kb"}));
app.use(express.static("public"));
app.use("/api/chat", rateLimit({windowMs:60000,limit:20}));

app.get("/api/health", (req,res) => res.json({ok:true}));

app.post("/api/chat", async (req,res) => {
 try {
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({error:"کلید هوش مصنوعی تنظیم نشده است."});
  const messages = req.body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) return res.status(400).json({error:"پیام نامعتبر است."});
  const ai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const result = await ai.responses.create({
   model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
   instructions: "تو هوش‌یار هستی، یک دستیار حرفه‌ای و مهربان که همیشه به فارسی روان پاسخ می‌دهد.",
   input: messages
  });
  res.json({reply:result.output_text});
 } catch(error) {
  console.error(error);
  res.status(500).json({error:"در ارتباط با هوش‌یار مشکلی پیش آمد."});
 }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Hooshyar is running!"));
