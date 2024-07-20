//send message when pressing enter key
document.querySelector('#user-input').addEventListener('keydown',async(event)=>{
  if(event.key==='Enter'){
    event.preventDefault();
    messageHandler();
  }
});

document.querySelector('#send-button').addEventListener('click',async ()=>{
  messageHandler();
});

//Function to handle sending request
async function messageHandler(){
  const userInput=document.querySelector('#user-input').value;
  //make sure the user input is not empty
  if (userInput.trim()==='') return;
  const messageDiv=document.querySelector('#messages');
  const userMessageDiv=document.createElement("div");
  userMessageDiv.className='message user-message';
  userMessageDiv.textContent=userInput;
  messageDiv.appendChild(userMessageDiv);
  //reset uset input
  document.querySelector('#user-input').value='';
  //get response from backend API
  try{
    const response=await fetch('/chat',{
      method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
    });
    const data=await response.json();
    const botMessageDiv=document.createElement("div");
    botMessageDiv.className='message bot-message';
    // botMessageDiv.textContent=data.reply;
    botMessageDiv.innerHTML=`
      <img src='${botImg}' alt='bot-img' class="bot-img">
      ${data.reply}`
    messageDiv.appendChild(botMessageDiv);
    //scroll to the bottom of message container
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }catch(error){
    console.error('Error fetching response:', error);
  }
}
