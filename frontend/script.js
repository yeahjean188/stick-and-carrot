// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myName, myAge, myLike, myHateFood, myStoryContent;
let backcontent, nextstory, dalleprompt;
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
    document.getElementById("dalle-image").style.display = "block";
    document.getElementById("next").style.display = "block";

    //로딩 아이콘 보여주기
    document.getElementById('loader').style.display = "block";

    //동화책 생성 자동화 입력
    const message = 'Please create a children book with less than 400 characters in English.';  
    
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
        //console.log('Response:', data);

        // GPT 응답 내용을 변수 word에 저장
        backcontent = data.assistant;

        //채팅 말풍선에 챗GPT 응답 출력
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot-bubble';
        botBubble.textContent = backcontent;
        document.getElementById('fortuneResponse').appendChild(botBubble);
        

        //gpt에 달리 프롬프트 짜달라고 호출할 거임.
        let imgRequestMessage;
        imgRequestMessage = `${backcontent} is the story of a fairy tale book. Please describe the image so that I can put this scene in dall-e's prompt.`;
        
        // Push
        userMessages.push(imgRequestMessage);

        try{
            const response1 = await fetch('http://localhost:3002/fortuneTell', {
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

            if (!response1.ok) {
                throw new Error('Request failed with status ' + response2.status);
            }

            const data1 = await response1.json();

            //Push
            assistantMessages.push(data1.assistant);
            dalleprompt = data1.assistant;
            // backcontent = nextstory; //backcontent를 업데이트합니다.
            //console.log('Response:', data1);
        }
        catch (error) {
            console.error('Error:', error);
        }

        //이미지 생성 요청 함수
        //dall.e 불러오기
        showLoading();
        const d_response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: dalleprompt})
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

//로딩 텍스트 표시
function showLoading(){
    document.querySelector('.loading').classList.add('show');
}
//로딩 텍스트 비표시
function removeLoading(){
    document.querySelector('.loading').classList.remove('show');
}



async function next() {
    myHateFood = document.getElementById('hateFood').value;
    nextCallCount++; // 함수 호출 시마다 카운트 증가

    if (nextCallCount <= 5){
        document.getElementById("chat2").style.display = "block";
        document.getElementById("dalle-image2").style.display = "block";
        document.getElementById("chat").style.display = "none";
        document.getElementById("dalle-image").style.display = "none";

        if(nextCallCount>2){
            // 이전 글 지우기
            document.getElementById('fortuneResponse2').innerHTML = "";
            // 이전 그림 지우기
            document.querySelector('#image2').src = "";
        }

        // 로딩 아이콘 보여주기 (두 번째 챗 컨테이너에서)
        document.getElementById('loader2').style.display = "block";

        //이전 페이지 글 불러오기
        const backcontent2 = backcontent;
        let message2;
        // 동화책 이어서 생성 자동화 입력 : 페이지에 맞게 작성, 마지막 페이지 이후에는 솔루션 프롬프트로 넣기
        if(nextCallCount<=4){
            const n = nextCallCount;
            message2 = `Write the ${n}th story out of a total of five pages. It's the backstory of '${backcontent2}'.`;  
        }else{
            message2 = `'${backcontent2}' Please wrap up the story by writing the following story.`;
        }
        console.log(nextCallCount);

        // Push
        userMessages.push(message2);

        try{
            const response2 = await fetch('http://localhost:3002/fortuneTell', {
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

            if (!response2.ok) {
                throw new Error('Request failed with status ' + response2.status);
            }

            const data2 = await response2.json();
            
            //로딩 아이콘 숨기기
            document.getElementById('loader2').style.display = "none";
            
            //Push
            assistantMessages.push(data2.assistant);
            nextstory = data2.assistant;
            backcontent = nextstory; //backcontent를 업데이트합니다.
            console.log('Response:', data2);

            // GPT 응답 내용을 변수 nextstory에 저장
            nextstory = data2.assistant;

            //2페이지 글 공간에 backstory 집어넣기
            const botBubble = document.createElement('div');
            botBubble.className = 'chat-bubble bot-bubble';
            botBubble.textContent = nextstory;
            document.getElementById('fortuneResponse2').appendChild(botBubble);
            
            //gpt에 달리 프롬프트 짜달라고 호출할 거임.
            let imgRequestMessage;
            imgRequestMessage = `${nextstory} is the story of a fairy tale book. Please describe the image so that I can put this scene in dall-e's prompt.`;
            
            // Push
            userMessages.push(imgRequestMessage);

            try{
                const response1 = await fetch('http://localhost:3002/fortuneTell', {
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

                if (!response1.ok) {
                    throw new Error('Request failed with status ' + response2.status);
                }

                const data1 = await response1.json();

                //Push
                assistantMessages.push(data1.assistant);
                dalleprompt = data1.assistant;
                // console.log('Response:', data1);
            }
            catch (error) {
                console.error('Error:', error);
            }


            //이미지 생성 요청 함수
            //dall.e 불러오기
            showLoading2();
            const d2_response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: dalleprompt})
            })
        
            if(!d2_response.ok) {
                throw new Error('이미지 생성 오류')
            }
        
            const d2_data = await d2_response.json();
            console.log(d2_data)
            const imageUrl2 = d2_data.data;
            document.querySelector('#image2').src = imageUrl2;
            removeLoading2();
        }
        catch (error) {
            console.error('Error:', error);
        }
    } else {
        document.getElementById("chat2").style.display = "none";
        document.getElementById("dalle-image2").style.display = "none";
        document.getElementById("chat").style.display = "none";
        document.getElementById("dalle-image").style.display = "none";

        // 세 번째 호출 시 다른 div로 이동
        document.getElementById("chat3").style.display = "block";
        //document.getElementById("dalle-image3").style.display = "block";

        message2 = `Please introduce a recipe that I can eat ${myHateFood} well`;
        // Push
        userMessages.push(message2);

        try{
            const response2 = await fetch('http://localhost:3002/fortuneTell', {
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

            if (!response2.ok) {
                throw new Error('Request failed with status ' + response2.status);
            }

            const data3 = await response2.json();
            
            //로딩 아이콘 숨기기
            document.getElementById('loader2').style.display = "none";
            
            //Push
            assistantMessages.push(data3.assistant);
            nextstory = data3.assistant;
            backcontent = nextstory; //backcontent를 업데이트합니다.
            console.log('Response:', data3);

            // GPT 응답 내용을 변수 nextstory에 저장
            nextstory = data3.assistant;

            //2페이지 글 공간에 backstory 집어넣기
            const botBubble = document.createElement('div');
            botBubble.className = 'chat-bubble bot-bubble';
            botBubble.textContent = nextstory;
            document.getElementById('fortuneResponse3').appendChild(botBubble);

            //이미지 생성 요청 함수
            //dall.e 불러오기
            
            showLoading2();
            const d2_response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: nextstory})
            })
        
            if(!d2_response.ok) {
                throw new Error('이미지 생성 오류')
            }
        
            const d2_data = await d2_response.json();
            console.log(d2_data)
            const imageUrl2 = d2_data.data;
            document.querySelector('#image2').src = imageUrl2;
            removeLoading2();
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
}

//로딩 텍스트 표시
function showLoading2(){
    document.querySelector('.loading2').classList.add('show');
}
//로딩 텍스트 비표시
function removeLoading2(){
    document.querySelector('.loading2').classList.remove('show');
}