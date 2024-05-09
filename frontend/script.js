// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myDateTime = '';


function start() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const like = document.getElementById('like').value;
    const hateFood = document.getElementById('hateFood').value;
    const storyContent = document.getElementById('storyContent').value;
    // if (date === '') {
    //     alert('생년월일을 입력해주세요.');
    //     return;
    // }
    myName = name;
    myAge = age;
    myGender = gender;
    myLike = like;
    myHateFood = hateFood;
    myStoryContent = storyContent;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";
}

async function sendMessage() {
    //로딩 아이콘 보여주기
    document.getElementById('loader').style.display = "block";

    //사용자의 메시지 가져옴
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;  

    //채팅 말풍선에 사용자의 메시지 출력
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.textContent = message;
    document.getElementById('fortuneResponse').appendChild(userBubble);
    
    //Push
    userMessages.push(messageInput.value);

    //입력 필드 초기화
    messageInput.value = '';

    //백엔드 서버에 메시지를 보내고 응답 출력
    try {
        const response = await fetch('https://mxewedwbxdnjndefvix4t2njca0wvqrx.lambda-url.ap-northeast-2.on.aws/fortuneTell', {
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