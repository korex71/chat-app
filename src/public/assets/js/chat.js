const socket = io.connect(window.location.origin);

if(localStorage.getItem('name') === null) {
  var person = prompt("Como quer ser chamado(a) ?", "");
  if (person == null || person == "" || undefined) {
    person = prompt("Como quer ser chamado(a) ?", "");
  } else {
    localStorage.setItem('name', person);
    socket.emit('join', person);
  };
}else{
  socket.emit('join', localStorage.getItem('name'))
}

socket.on('getName', () => {
  socket.emit('join', localStorage.getItem('name'))
})

const act = {
  hora: () => {
    let d = new Date();
    let n = d.getHours();
    let s = d.getMinutes();
    let hours = n + ':' + (s < 10 ? '0' + s : s)
    return hours
  },
  data: () => {
    let d = new Date();
    let dia = d.getDate();
    let m = d.getMonth();
    let mes = new Array(
      'janeiro', 'fevereiro', 'março', 'abril', 'maio',
      'junho', 'julho', 'agosto', 'setembro', 'outubro',
      'novembro', 'dezembro'
    )
    return (dia + ' de ' + mes[m])
  }
  
}

socket.on('history', data => {
  msgHistory(data)
  console.log(data)
})

$('#msg').keypress(e => {
  if(e.keyCode == 13){
    e.preventDefault()
    sendMessage()
  }
})

$('#send_msg').on('click', () => {
  sendMessage()
})

function sendMessage() {
  let msg = $('#msg').val(); $('#msg').val('')
  let hora = act.hora();
  let send = {msg, hora, data: act.data()}
  console.log($('#msg').val(), act.hora(), act.data())
  socket.emit('new_message', send)
}

socket.on('user_msg', data => {
  if(!data) return
  console.log('Mensagem:', data)
  if(data.username == localStorage.getItem('name')){
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
    if(item.username == localStorage.getItem('name')){
      $('#appCapsule').append(`
      <div class="message-item user">
      <div class="content">
          <div class="bubble">
              ${item.message}
          </div>
          <div class="footer">${item.hour}</div>
      </div>
      </div>
    `) 
    }else{
      $('#appCapsule').append(`
      <div class="message-item">
      <img src="assets/img/default-user-image.png" alt="avatar" class="avatar">
      <div class="content">
          <div class="title">${item.username}</div>
          <div class="bubble">
              ${item.message}
          </div>
          <div class="footer">${item.hour}</div>
      </div>
      </div>
    `) 
    }
  })
}