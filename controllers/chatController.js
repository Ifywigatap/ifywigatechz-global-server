import Groq from 'groq-sdk';
import { asyncHandler } from '../middleware/errorHandler.js';
import Course from '../models/Course.js';

// Initialize Groq securely on the backend using the environment variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ ok: false, message: 'Message is required' });
  }

  // Fetch active courses from the database to provide dynamic context to the AI
  const courses = await Course.find({ isActive: true }).select('title price category');
  const courseList = courses.map(c => `- ${c.title} (Price: ₦${c.price})`).join('\n');

  const systemPrompt = `You are ChatIFY AI, a helpful, friendly, and concise assistant for IFYWIGATECHZ Academy. 
Keep your answers brief, professional, and highly relevant to a tech academy.

Here is the official list of courses we currently offer:
${courseList}

Only recommend courses exactly as they appear in this list. If a user asks about a topic or course we do not cover, politely let them know and suggest a relevant alternative from our list.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    model: 'llama3-8b-8192', 
  });

  res.status(200).json({
    ok: true,
    reply: chatCompletion.choices[0]?.message?.content
  });
});