let userName

function joinChat() {
  userName = prompt('Qual seu nome?')

  const promise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    { name: userName }
  )
  promise.then(startChat)
  promise.catch(resetPage)
}
joinChat()

function startChat() {
  bringData()

  setInterval(bringData, 3000)
  setInterval(checkIfActive, 5000)
}

function checkIfActive() {
  axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {
    name: userName
  })
}

function resetPage() {
  alert('Este nome de usuário já está em uso, por favor digite outro nome!!')

  window.location.reload()
}

function ifUnlogged() {
  alert(
    'Você deslogou automaticamente por ficar muito tempo inativo, faça login novamente!'
  )

  window.location.reload()
}

function bringData() {
  const promise = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/messages'
  )
  promise.then(renderMessages)
}

function renderMessages(reply) {
  //console.log(reply.data)

  const msg = document.querySelector('main')

  msg.innerHTML = ''
  for (let i = 0; i < reply.data.length; i++) {
    if (reply.data[i].type === 'status') {
      msg.innerHTML += `
      <div class="joined-chat">
        <p>
          <span>(${reply.data[i].time})</span><strong>${reply.data[i].from}</strong>${reply.data[i].text}
        </p>
      </div>
      `
    }
    if (
      reply.data[i].type === 'private_message' &&
      (reply.data[i].from === userName || reply.data[i].to === userName)
    ) {
      msg.innerHTML += `
      <div class="private-talk">
        <p>
          <span>(${reply.data[i].time})</span><strong>${reply.data[i].from}</strong>reservadamente para<strong>${reply.data[i].to}:</strong>${reply.data[i].text}
        </p>
      </div>
      `
    }
    if (reply.data[i].type === 'message') {
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

function lastMsg() {
  const viewLastMsg = document.querySelector('main div:last-of-type')

  viewLastMsg.scrollIntoView()
}

function sendMsg() {
  const text = document.querySelector('footer > input').value
  const msgModel = {
    from: userName,
    to: 'Todos',
    text: text,
    type: 'message'
  }
  document.querySelector('footer > input').value = ''
  const promise = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    msgModel
  )
  promise.then(bringData)
  promise.catch(ifUnlogged)
}
