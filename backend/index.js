//dotenv 설정
const dotenv = require('dotenv');
dotenv.config();

//express 설정
const express = require('express');
const app = express();

//CORS 문제 해결
const cors = require('cors');
app.use(cors({
    origin: 'https://carrot-tales.pages.dev',
    credentials: true,
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
}));


//path 설정
const path = require('path');

//serverless-http 설정
const serverless = require('serverless-http')

//POST 요청 받을 수 있게 만듦
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '../frontend')));

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://carrot-tales.pages.dev');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.options('/fortuneTell', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://carrot-tales.pages.dev');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.send();
});


//gpt POST 요청
app.post('/fortuneTell', async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://carrot-tales.pages.dev');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');


    //프론트엔드에서 보낸 메시지 출력
    let { myName, myAge, myGender, myLike, myHateFood, myStoryContent, userMessages, assistantMessages } = req.body

    let messages = [
        { "role": "system", "content": "You can make English fairy tales for children." },
        { "role": "system", "content": "You remember the contents of the previous page. You will continue writing the contents on the next page." },
        { "role": "system", "content": "You only write one page of 400 characters in english. You can't move over that." },
        { "role": "assistant", "content": `The name of the main character is ${myName}, the charactor's age is ${myAge}, the charactor's gender is ${myGender}.`}, 
        { "role": "assistant", "content": `The story is about interested ${myLike}. And You make up the story to eat well ${myHateFood} which is the food he hates. And the amount of writing is ${myStoryContent}.` }
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
    }

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo"
    });

    let fortune = completion.choices[0].message['content'];

    res.json({ "assistant": fortune });
});

//Image Generate Function
const generateImage = async (req, res) => {
    try {
        const {text} = req.body;
        console.log(text)

        const response = await openai.images.generate({
            // model: "dall-e-3",
            prompt: text,
            n: 1,
            size: "512x512",
        });


        if (response && response.data && response.data.length > 0 && response.data[0].url) {
            const image_url = response.data[0].url;
            res.json({ data: image_url });
        } else {
            res.status(400).json({ error: "No image data available" });
        }
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Failed to generate image" });
    }
}

//HOME
app.get('/', (req, res) => {
    //res.render('index.html');
    res.sendFile(path.join(__dirname, '../frontend', 'Input-Information.html'));
})

//Image Generator(post)
app.post('/generate', generateImage);

module.exports.handler = serverless(app)