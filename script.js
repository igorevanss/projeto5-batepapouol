function startChat() {

  bringData()

  setInterval(bringData, 3000)
}

function bringData() {
  const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
  promise.then(renderMessages);
}

function renderMessages(reply){
  console.log(reply.data)

  const msg = document.querySelector('main');

  msg.innerHTML = '';
  for (let i = 0; i < reply.data.length; i++) {
    if (reply.data[i].type === 'status') {
      msg.innerHTML += `
      <div class="joined-chat">
        <p>
          <span>(${reply.data[i].time})</span><strong>${reply.data[i].from}</strong>${reply.data[i].text}
        </p>
      </div>
      `;
    }if (reply.data[i].type === 'private_message') {
      msg.innerHTML += `
      <div class="private-talk">
        <p>
          <span>(${reply.data[i].time})</span><strong>${reply.data[i].from}</strong>reservadamente para<strong>${reply.data[i].to}:</strong>${reply.data[i].text}
        </p>
      </div>
      `;
    }if (reply.data[i].type === 'message') {
      msg.innerHTML += `
      <div class="everyone-talk">
        <p>
          <span>(${reply.data[i].time})</span><strong>${reply.data[i].from}</strong>para<strong>${reply.data[i].to}:</strong>${reply.data[i].text}
        </p>
    </div>
      `
    }
  }
  lastMsg()
}

function lastMsg(){
  const viewLastMsg = document.querySelector('main div:last-of-type')

  viewLastMsg.scrollIntoView()
}

startChat()