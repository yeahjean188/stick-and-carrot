// 변수 생성
let userMessages = [];
let assistantMessages = [];



async function start() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const like = document.getElementById('like').value;
    const hateFood = document.getElementById('hateFood').value;
    const storyContent = document.getElementById('storyContent').value;

    myName = name;
    myAge = age;
    myGender = gender;
    myLike = like;
    myHateFood = hateFood;
    myStoryContent = storyContent;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";

    //로딩 아이콘 보여주기
    document.getElementById('loader').style.display = "block";

    //동화책 생성 자동화 입력
    const message = '동화책 생성해줘';  

    //채팅 말풍선에 사용자의 메시지 출력
    // const userBubble = document.createElement('div');
    // userBubble.className = 'chat-bubble user-bubble';
    // userBubble.textContent = message;
    // document.getElementById('fortuneResponse').appendChild(userBubble);
    
    //Push
    userMessages.push(message);

    //백엔드 서버에 메시지를 보내고 응답 출력
    try {
        const response = await fetch('http://localhost:3000/fortuneTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                myName: myName,
                myAge: myAge,
                myGender: myGender,
                myLike: myLike,
                myHateFood: myHateFood,
                myStoryContent: myStoryContent,
                userMessages: userMessages,
                assistantMessages: assistantMessages,
            })
        });

        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }

        const data = await response.json();
        
        //로딩 아이콘 숨기기
        document.getElementById('loader').style.display = "none";
        
        //Push
        assistantMessages.push(data.assistant);
        console.log('Response:', data);

        //채팅 말풍선에 챗GPT 응답 출력
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = data.assistant;
        document.getElementById('fortuneResponse').appendChild(botBubble);
        
    
    } catch (error) {
        console.error('Error:', error);
    }
}
//전송 버튼 이벤트
document.querySelector('#image-form').addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    document.querySelector('#image').src='';

    //입력 테스트
    const text = document.querySelector('#text').value;
    //입력이 없는 경우
    if(text === '') return;
    generateImageRequest(text);
}


//이미지 생성 요청 함수
async function generateImageRequest(text){
    const response = await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({text: text})
    })
    if (!response.ok) {
        throw new Error('이미지 생성 오류');
    }

    const data = await response.json();
    console.log(data)
    const imageUrl = data.data;
    document.querySelector('#image').src = imageUrl;
}