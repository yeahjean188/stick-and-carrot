// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myName, myAge, myGender, myLike, myHateFood, myStoryContent;
let backcontent, nextstory;
let nextCallCount = 1; // 호출 횟수를 추적하는 변수

async function start() {
    myName = document.getElementById('name').value;
    myAge = document.getElementById('age').value;
    myGender = document.getElementById('gender').value;
    myLike = document.getElementById('like').value;
    myHateFood = document.getElementById('hateFood').value;
    myStoryContent = document.getElementById('storyContent').value;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";
    // document.getElementById("dalle-image").style.display = "block";
    // document.getElementById("next").style.display = "block";

    //로딩 아이콘 보여주기
    document.getElementById('loader').style.display = "block";

    //동화책 생성 자동화 입력
    const message = 'Please create a children book with less than 400 characters in English.';  
    
    //Push
    userMessages.push(message);

    //백엔드 서버에 메시지를 보내고 응답 출력
    try {
        const response = await fetch('https://62x2jqh5bc6s353c7rzm77iq3u0dubtg.lambda-url.ap-northeast-2.on.aws/fortuneTell', {
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
        //console.log('Response:', data);

        // GPT 응답 내용을 변수 word에 저장
        backcontent = data.assistant;

        //채팅 말풍선에 챗GPT 응답 출력
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = backcontent;
        document.getElementById('fortuneResponse').appendChild(botBubble);

    } catch (error) {
        console.error('Error:', error);
    }
}