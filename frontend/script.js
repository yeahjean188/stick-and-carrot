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
        const word = data.assistant;

        //채팅 말풍선에 챗GPT 응답 출력
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = word;
        document.getElementById('fortuneResponse').appendChild(botBubble);


        const d_response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: word})
        })
    
        if(!d_response.ok) {
            throw new Error('이미지 생성 오류')
        }
    
        const d_data = await d_response.json();
        console.log(d_data)
        const imageUrl = d_data.data;
        document.querySelector('#image').src = imageUrl;
        
    } catch (error) {
        console.error('Error:', error);
    }
}


// function onSubmit(e) {
//     e.preventDefault();
//     document.querySelector('#image').src = '';

//     // 입력 텍스트
//     const text = document.querySelector('#text').value;
//     // 입력이 없는 경우
//     if(text == '') return;
//     generateImageRequest(text);
// }

// // 전송 버튼 이벤트
// document.querySelector('#image-form').addEventListener('submit', onSubmit);

// 이미지 생성 요청 함수
// async function generateImageRequest(word) {
//     const response = await fetch('/generate', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({text: word})
//     })

//     if(!response.ok) {
//         throw new Error('이미지 생성 오류')
//     }

//     const data = await response.json();
//     console.log(data)
//     const imageUrl = data.data;
//     document.querySelector('#image').src = imageUrl;
// }