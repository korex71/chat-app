const socket = io.connect(window.location.origin);

socket.on('connect', client => {
  socket.emit('join', socket.id)
})

const act = {
  hora: () => {
    let d = new Date(),
    h = d.getHours(),
    m = d.getMinutes();
    return (h + ':' + (m < 10 || m == 0 ? '0' + m : m))
  },
  data: () => {
    let d = new Date(),
      [dia, m] = [d.getDate(), d.getMonth()],
      mes = [
        'janeiro', 'fevereiro', 'março', 
        'abril', 'maio', 'junho', 
        'julho', 'agosto', 'setembro', 
        'outubro', 'novembro', 'dezembro'
      ];
    return `${dia} de ${mes[m]}`
  }
  
}

socket.on('history', data => {
  msgHistory(data)
  console.log('*** Histórico recebido:', data)
})

$('#msg').keypress(e => {
    if(e.keyCode == 13) {
      e.preventDefault()
      sendMessage()
    }
})

$('#send_msg').on('click', () => sendMessage())

function sendMessage() {
  if(!$('#msg').val()) return
  let msg = $('#msg').val(); $('#msg').val('')
  let send = {msg, hora: act.hora(), data: act.data()}
  console.log('*** Emitindo: new_message com', send)
  socket.emit('new_message', send)
}

socket.on('user_msg', data => {
  if(!data) return
  window.scrollTo(0, document.body.scrollHeight);
  console.log('Mensagem:', data)
  if(data.username == socket.id){
    $('#appCapsule').append(`
      <div class="message-item user">
      <div class="content">
          <div class="bubble">
              ${data.message}
          </div>
          <div class="footer">${data.hour}</div>
      </div>
      </div>
    `) 
  }else{
    $('#appCapsule').append(`
      <div class="message-item">
      <img src="assets/img/default-user-image.png" alt="avatar" class="avatar">
      <div class="content">
          <div class="title">${data.username}</div>
          <div class="bubble">
              ${data.message}
          </div>
          <div class="footer">${data.hour}</div>
      </div>
      </div>
    `) 
  }
});

function msgHistory(data) {
  if(!data) return
  $('#appCapsule').empty()
  $('#appCapsule').append(`
  <div class="message-divider">
    ${act.data()}
  </div> `);
  data.map(item => {
    let user = item.username == socket.id ? 'user' : ''
      $('#appCapsule').append(`
      <div class="message-item ${user}">
      <div class="content">
          <div class="bubble">
              ${item.message}
          </div>
          <div class="footer">${item.hour}</div>
      </div>
      </div>
    `) 
  })
}