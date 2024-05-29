//dotenv 설정
const dotenv = require('dotenv').config();

//port 설정
const port = process.env.PORT || 3000;

//express 설정
const express = require('express')
const app = express()

//CORS 문제 해결
const cors = require('cors')
app.use(cors())

//path 설정
const path = require('path');

//POST 요청 받을 수 있게 만듦
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'frontend')));

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

// const {Configuration, OpenAI} = require("openai");
// const configuration = new Configuration({
//     apiKey: process.env.OPEN_API_KEY,
// });
// const openai = new OpenAI(configuration);

//Image Generate Function
const generateImage = async (req, res) => {
    const {text} = req.body;
    const response = await openai.images.generate({
        //openai.createImage가 원래
        model: 'dall-e-3',
        prompt: text,
        n: 1,
        size: "1024x1024",
    })
    //console.log("response", response);
    const url = response.data.url;
    console.log("url", url);

    // 데이터 구조 확인 및 방어적 접근
    const image_url = response.data.data[0].url;
    //const image_url = response.data.data[0].url;
    //이미지 응답
    res.json({data: image_url});
}
//generateImage();

//HOME
// app.get('/fortuneTell', async function (req, res) {
//     res.render('index.html')
// })
app.get('/', (req, res) => {
    res.render('index.html')
})

//Image Generator(Post)
app.post('/generate', generateImage);

//POST 요청
app.post('/fortuneTell', async function (req, res) {

    //프론트엔드에서 보낸 메시지 출력
    let { myName, myAge, myGender, myLike, myHateFood, myStoryContent, userMessages, assistantMessages } = req.body

    let messages = [
        { "role": "system", "content": "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 7~11세 아이들을 위한 동화책을 생성할 수 있습니다. .1페이지, .2페이지의 형식을 적용해 10페이지를 만들어 제공합니다. 한페이지 이후 줄바꿈하고 다음 페이지 생성후 다시 줄바꿈합니다. 당신의 이름은 CarrotTales입니다." },
        { "role": "system", "content": "당신의 이름은 CarrotTales입니다. 생성한 내용중 페이지 1 부분만 출력하할건데 분량은 300자 정도고, 나머지는 기억합니다." },
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

//app.listen(3000)
app.listen(port, () => {
    console.log(`Server running at ${port}`);
})