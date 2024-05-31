// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myName, myAge, myLike, myHateFood, myStoryContent;
let backcontent;

async function start() {
    myName = document.getElementById('name').value;
    myAge = document.getElementById('age').value;
    myGender = document.getElementById('gender').value;
    myLike = document.getElementById('like').value;
    myHateFood = document.getElementById('hateFood').value;
    myStoryContent = document.getElementById('storyContent').value;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";
    document.getElementById("dalle-image").style.display = "block";


    //로딩 아이콘 보여주기
    document.getElementById('loader').style.display = "block";

    //동화책 생성 자동화 입력
    const message = '동화책 생성해줘';  
    
    //Push
    userMessages.push(message);

    //백엔드 서버에 메시지를 보내고 응답 출력
    try {
        const response = await fetch('http://localhost:3002/fortuneTell', {
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

        // GPT 응답 내용을 변수 word에 저장
        backcontent = data.assistant;

        //채팅 말풍선에 챗GPT 응답 출력
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = backcontent;
        document.getElementById('fortuneResponse').appendChild(botBubble);

        //이미지 생성 요청 함수
        //dall.e 불러오기
        showLoading();
        const d_response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: backcontent})
        })
    
        if(!d_response.ok) {
            throw new Error('이미지 생성 오류')
        }
    
        const d_data = await d_response.json();
        console.log(d_data)
        const imageUrl = d_data.data;
        document.querySelector('#image').src = imageUrl;
        removeLoading();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

//로딩 첵스트 표시
function showLoading(){
    document.querySelector('.loading').classList.add('show');
}
//로딩 텍스트 비표시
function removeLoading(){
    document.querySelector('.loading').classList.remove('show');
}

async function next() {
    // 로딩 아이콘 보여주기 (두 번째 챗 컨테이너에서)
    //document.getElementById('loader').style.display = "block";

    //1페이지 글 불러오기
    const backstory = backcontent;
    // 동화책 이어서 생성 자동화 입력
    const message = `다음 이야기를 이어서 써줘: ${backstory}`;  
    // Push
    userMessages.push(message);

    try{
        const response = await fetch('http://localhost:3002/fortuneTell', {
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
        //document.getElementById('loader').style.display = "none";
        
        //Push
        assistantMessages.push(data.assistant);
        console.log('Response:', data);

        // GPT 응답 내용을 변수 backcontent에 저장
        backstory = data.assistant;

        //2페이지 글 공간에 backstory 집어넣기
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = backstory;
        document.getElementById('fortuneResponse2').appendChild(botBubble);
    }
    catch (error) {
        console.error('Error:', error);
    }
}