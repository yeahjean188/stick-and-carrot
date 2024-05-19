const OpenAI = require('openai');
//const openai = process.env.OPEN_API_KEY
const openai = new OpenAI({
    apiKey: "sk-proj-2Oz9jp8nCySJbg17I1pGT3BlbkFJYWPl8TT4EZRfBV8Vl8SZ",
});

//port 설정
const port = process.env.PORT || 3000;

//express 설정
const express = require('express')
const app = express()

//dotenv 설정
const dotenv = require('dotenv').config();

//CORS 문제 해결
const cors = require('cors')
app.use(cors())

//path 설정
const path = require('path');

//POST 요청 받을 수 있게 만듦
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'frontend')));

//Image generate function
const generateImage = async (req, res) => {
    const response = await openai.createImage({
        prompt: "A cute baby sea otter",
        n: 1,
        size: "512X512",
    });
    const image_url = response.data.data[0].url;
    res.json({ data: image_url});
} 

//POST 요청
app.post('/fortuneTell', async function (req, res) {

    //프론트엔드에서 보낸 메시지 출력
    let { myName, myAge, myGender, myLike, myHateFood, myStoryContent, userMessages, assistantMessages } = req.body

    let messages = [
        { "role": "system", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 7~11세 아이들을 위한 동화책을 생성할 수 있습니다. .1페이지, .2페이지의 형식을 적용해 10페이지를 만들어 제공합니다. 한페이지 이후 줄바꿈하고 다음 페이지 생성후 다시 줄바꿈합니다. 당신의 이름은 CarrotTales입니다." },
        { "role": "user", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 7~11세 아이들을 위한 동화책을 생성할 수 있습니다. 쉬운 단어로 창의적인 스토리를 만들수 있고, 모든 질문에 대해서 명확히 답변해줄 수 있습니다. 당신의 이름은 CarrotTales입니다." },
        { "role": "assistant", "content": "안녕하세요! 저는 동화책 생성 서비스 CarrotTales입니다. 여러분의 이름, 나이, 성별, 관심사, 편식하는 재료, 글밥을 고려하여 10페이지를 만들 수 있습니다. 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 드리겠습니다. 어떤 질문이든지 해주시면 최선을 다해 도와드리겠습니다." },
        { "role": "user", "content": `저의 이름은 ${myName}이고, 나이는 ${myAge}이고, 성별은 ${myGender}이고, 관심사는 ${myLike}이고, 편식하는 재료는 ${myHateFood}이고, 글밥은 ${myStoryContent}입니다. ` },
        { "role": "assistant", "content": `당신의 이름은 책속 주인공이름과 같은 ${myName}이고, 나이는 ${myAge}이고, 성별은 ${myGender}입니다. 스토리는 관심사인 ${myLike}와 편식하는 재료인 ${myHateFood}를 고려해 작성합니다. 글밥은 ${myStoryContent}인것을 확인하였습니다. 동화책 생성을 요청해보세요!` }
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

//HOME
// app.get('/', (req, res) => {
//     res.render('index.html')
// })

//Image generator(post)
app.post('/generate', generateImage);

//app.listen(3000)
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})