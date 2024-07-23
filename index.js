const express=require('express')
const fetch=require('node-fetch')
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app=express();
const API_KEY = process.env['GoogleGenerativeAI_APIKey'];
const genAI = new GoogleGenerativeAI(API_KEY);

app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.json())

app.get('/intro',(req,res)=>{
  res.render('intro')
})

app.get('/ML',(req,res)=>{
  res.render('machineLearning')
})

app.get('/DL',(req,res)=>{
  res.render('deepLearning')
})

app.get('/NLP',(req,res)=>{
  res.render('NLP')
})

app.get('/',async (req,res)=>{
  try {
    const response = await fetch('https://randomuser.me/api/?results=1');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data=await response.json();
    const botImg=data.results[0].picture.thumbnail;
    const botFirstName=data.results[0].name.first;
    res.render('chatbot',{botImg,botFirstName });
  } catch (error) {
    console.error('Error fetching data:',error);
    res.status(500).send('Error fetching data');
  }
})

//from ai.google.dev/gemini-ai/docs/quickstart
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, how are you?" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content..."});
  }
});

app.listen(3000,()=>{
  console.log('server started on port 3000...');
});
