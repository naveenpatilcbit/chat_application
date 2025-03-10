const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;
const PAGE_SIZE = 5;
app.use(express.json());

app.use((req, res, next) => {
  console.log("responding...");
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow all methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Intercept OPTIONS method and respond with 200 (OK)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Mock Data

const messages = [
  {
    id: 1,
    sender: "user",
    message:
      "Hi, I'm interested in learning about AI technology. Can you tell me more about it?",
  },
  {
    id: 2,
    sender: "bot",
    message:
      "AI technology has made tremendous progress in recent years. It's being used in various fields such as healthcare, finance, and transportation.",
  },
  {
    id: 3,
    sender: "user",
    message:
      "That's fascinating! What are some of the latest advancements in AI?",
  },
  {
    id: 4,
    sender: "bot",
    message:
      "Some of the latest advancements include the development of more sophisticated neural networks, natural language processing, and computer vision.",
  },
  {
    id: 5,
    sender: "user",
    message: "I've heard about neural networks. Can you explain how they work?",
  },
  {
    id: 6,
    sender: "bot",
    message:
      "Neural networks are modeled after the human brain and consist of layers of interconnected nodes that process and transmit information.",
  },
  {
    id: 7,
    sender: "user",
    message:
      "That sounds complex. What are some real-world applications of neural networks?",
  },
  {
    id: 8,
    sender: "bot",
    message:
      "Neural networks are being used in image recognition, speech recognition, and predictive analytics, among other applications.",
  },
  {
    id: 9,
    sender: "user",
    message:
      "I've also heard about natural language processing. How does that work?",
  },
  {
    id: 10,
    sender: "bot",
    message:
      "Natural language processing involves the use of algorithms to analyze and understand human language, enabling computers to generate human-like text and speech.",
  },
  {
    id: 11,
    sender: "user",
    message:
      "That's amazing! What are some potential applications of natural language processing?",
  },
  {
    id: 12,
    sender: "bot",
    message:
      "Natural language processing has many potential applications, including chatbots, language translation, and text summarization.",
  },
  {
    id: 13,
    sender: "user",
    message:
      "I'm also interested in learning about computer vision. Can you tell me more about it?",
  },
  {
    id: 14,
    sender: "bot",
    message:
      "Computer vision involves the use of algorithms to analyze and understand visual data from images and videos, enabling computers to recognize objects and patterns.",
  },
  {
    id: 15,
    sender: "user",
    message:
      "That sounds like a powerful technology. What are some potential applications of computer vision?",
  },
  {
    id: 16,
    sender: "bot",
    message:
      "Computer vision has many potential applications, including object recognition, facial recognition, and autonomous vehicles.",
  },
  {
    id: 17,
    sender: "user",
    message:
      "I'm excited to learn more about AI technology and its applications. Can you recommend some resources for further learning?",
  },
  {
    id: 18,
    sender: "bot",
    message:
      "There are many online resources available, including courses, tutorials, and research papers. I can also recommend some books on the subject.",
  },
  {
    id: 19,
    sender: "user",
    message:
      "Thank you for the recommendations! I'll definitely check them out.",
  },
  {
    id: 20,
    sender: "bot",
    message:
      "You're welcome! I'm glad I could help. If you have any more questions or need further assistance, feel free to ask.",
  },
  {
    id: 21,
    sender: "user",
    message: "I think that's all for now. Thanks again for the chat!",
  },
  {
    id: 22,
    sender: "bot",
    message:
      "You're welcome! It was a pleasure chatting with you. Have a great day!",
  },
  {
    id: 23,
    sender: "user",
    message:
      "Hi again, I was wondering if you could tell me more about the ethics of AI development.",
  },
  {
    id: 24,
    sender: "bot",
    message:
      "The ethics of AI development is a complex and multifaceted topic. There are many concerns about the potential impact of AI on society, including job displacement and bias in decision-making.",
  },
  {
    id: 25,
    sender: "user",
    message:
      "Those are valid concerns. What are some potential solutions to these problems?",
  },
  {
    id: 26,
    sender: "bot",
    message:
      "Some potential solutions include implementing regulations and guidelines for AI development, investing in education and retraining programs, and prioritizing transparency and accountability in AI decision-making.",
  },
  {
    id: 27,
    sender: "user",
    message:
      "I think that's a good starting point. What are some other important considerations in AI development?",
  },
  {
    id: 28,
    sender: "bot",
    message:
      "Other important considerations include ensuring that AI systems are secure and reliable, addressing issues of bias and fairness, and prioritizing human well-being and safety.",
  },
  {
    id: 29,
    sender: "user",
    message:
      "Those are all important considerations. What are some potential future developments in AI?",
  },
  {
    id: 30,
    sender: "bot",
    message:
      "Some potential future developments in AI include the integration of AI with other technologies, such as blockchain and the Internet of Things, and the development of more advanced AI systems, such as artificial general intelligence.",
  },
  {
    id: 31,
    sender: "user",
    message:
      "I'm excited to see where AI technology will go in the future. Thanks for the chat!",
  },
  {
    id: 32,
    sender: "bot",
    message:
      "You're welcome! It was a pleasure chatting with you. I'm glad I could help you learn more about AI technology.",
  },
  {
    id: 33,
    sender: "user",
    message:
      "Hi again, I was wondering if you could tell me more about the potential applications of AI in healthcare.",
  },
  {
    id: 34,
    sender: "bot",
    message:
      "AI has many potential applications in healthcare, including medical imaging analysis, disease diagnosis, and personalized medicine.",
  },
  {
    id: 35,
    sender: "user",
    message:
      "Those are all exciting possibilities. What are some of the challenges of implementing AI in healthcare?",
  },
  {
    id: 36,
    sender: "bot",
    message:
      "Some of the challenges of implementing AI in healthcare include ensuring the accuracy and reliability of AI systems, addressing issues of data quality and availability, and prioritizing patient safety and well-being.",
  },
  {
    id: 37,
    sender: "user",
    message:
      "I think that's a good summary. What are some other potential applications of AI in healthcare?",
  },
  {
    id: 38,
    sender: "bot",
    message:
      "Other potential applications of AI in healthcare include clinical decision support systems, patient engagement and education, and healthcare operations management.",
  },
  {
    id: 39,
    sender: "user",
    message:
      "Those are all interesting possibilities. What are some potential future developments in AI in healthcare?",
  },
  {
    id: 40,
    sender: "bot",
    message:
      "Some potential future developments in AI in healthcare include the integration of AI with other technologies, such as genomics and precision medicine, and the development of more advanced AI systems, such as those that can learn from experience and adapt to new situations.",
  },
  {
    id: 41,
    sender: "user",
    message:
      "I'm excited to see where AI technology will go in the future. Thanks for the chat!",
  },
  {
    id: 42,
    sender: "bot",
    message:
      "You're welcome! It was a pleasure chatting with you. I'm glad I could help you learn more about AI technology.",
  },
  {
    id: 43,
    sender: "user",
    message:
      "Hi again, I was wondering if you could tell me more about the potential applications of AI in finance.",
  },
  {
    id: 44,
    sender: "bot",
    message:
      "AI has many potential applications in finance, including risk management, portfolio optimization, and fraud detection.",
  },
  {
    id: 45,
    sender: "user",
    message:
      "Those are all interesting possibilities. What are some of the challenges of implementing AI in finance?",
  },
  {
    id: 46,
    sender: "bot",
    message:
      "Some of the challenges of implementing AI in finance include ensuring the accuracy and reliability of AI systems, addressing issues of data quality and availability, and prioritizing regulatory compliance and risk management.",
  },
  {
    id: 47,
    sender: "user",
    message:
      "I think that's a good summary. What are some other potential applications of AI in finance?",
  },
  {
    id: 48,
    sender: "bot",
    message:
      "Other potential applications of AI in finance include credit scoring, investment analysis, and customer service chatbots.",
  },
  {
    id: 49,
    sender: "user",
    message:
      "Those are all exciting possibilities. What are some potential future developments in AI in finance?",
  },
  {
    id: 50,
    sender: "bot",
    message:
      "Some potential future developments in AI in finance include the integration of AI with other technologies, such as blockchain and the Internet of Things, and the development of more advanced AI systems, such as those that can learn from experience and adapt to new situations.",
  },
  {
    id: 51,
    sender: "user",
    message:
      "I'm excited to see where AI technology will go in the future. Thanks for the chat!",
  },
  {
    id: 52,
    sender: "bot",
    message:
      "You're welcome! It was a pleasure chatting with you. I'm glad I could help you learn more about AI technology.",
  },
  {
    id: 53,
    sender: "user",
    message:
      "Hi again, I was wondering if you could tell me more about the potential applications of AI in transportation.",
  },
];

// Mock API Endpoints
app.get("/api/messages", (req, res) => {
  var response = { ok: true };
  var params = req.query["page"];
  var startIndex = (params - 1) * PAGE_SIZE;
  var endIndex = params * PAGE_SIZE;

  response.json = messages.slice(
    messages.length - endIndex,
    messages.length - startIndex
  );
  res.json(response);
});

app.post("/api/messages", (req, res) => {
  const newMessage = { id: messages.length + 1, ...req.body };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
