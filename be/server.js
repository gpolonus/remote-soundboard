
const server = require('http').createServer()
const io = require('socket.io')(server)
const webrtcConnect = require('./services/WebRTCSignalPassing')

let host = false
let sounders = []

const addSounder = sounder => {
  // try to get rid of sounder on disconnect
  sounder.socket.on('disconnect', () => sounders = sounders.filter(s => sounder === s))
  return [
    ...sounders,
    sounder
  ]
}

io.of('/socket').on('connection', (socket) => {

  const localClient = {
    socket,
    data: {}
  }

  console.log(`CONNECTED! There are ${sounders.length} clients here and the host is${!!host ? '' : ' not'} here.`)

  if(host) {
    sounders = addSounder(localClient)
    webrtcConnect(localClient.socket, host.socket)
  } else {
    socket.emit('hostTaken', false)
  }

  socket.on('setRole', (role) => {
    localClient.data.role = role
    console.log(`got role ${role}`)
    switch(role) {
      case 'host':
        if(!host) {
          console.log('set the host')
          host = localClient
          localClient.socket.on('disconnect', () => host = undefined)

          if(sounders.length) {
            sounders.map(({ socket: sounderSocket }) => {
              console.log('connect to sounder')
              webrtcConnect(localClient.socket, sounderSocket)
            })
          }
        }
        break
      case 'sounder':
        sounders = addSounder(localClient)

        if(host) {
          // this case should never actually happen
          webrtcConnect(localClient.socket, host.socket)
        }
        break
    }
  })
})

server.listen(8082)
console.log('Server is listening on Port 8082')
