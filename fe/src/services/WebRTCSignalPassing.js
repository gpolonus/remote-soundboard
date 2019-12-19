
import Peer from 'simple-peer'
import io from 'socket.io-client'

export default function(socketURL) {
  return async function({ connect, receive }, socketEvents = {}) {
    const socket = io(socketURL);

    Object.entries(socketEvents).forEach(([ event, cb ]) => {
      socket.on(event, cb)
    })

    return new Promise(resolve => {
      socket.on('connect', () => {
        console.log('socket has connected')
        setupSocket(socket, connect, receive)
        // weak abstraction layer over the socket
        resolve((event, ...data) => {
          console.log('socket emitting', event, data)
          socket.emit(event, ...data)
        })
      })
    })
  }
}

/**
 * TODO: Allow users to instigate a connection
 *
 * For now the socket server connects the users instead of the other way around
 */

function setupPeer(p, connect, receive) {
  function send(d) {
    console.log(`sending from ${p._id}: `, d)
    d = JSON.stringify(d)
    p.send(d)
  }

  p.on('connect', () => {
    console.log('connected', p._id)
    // other stuff I want
    connect(send)
  })

  p.on('data', d => {
    console.log('got data', d, p._id)
    // other stuff I want
    d = JSON.parse(d)
    receive(d)
  })

  return p
}

function setupSocket(socket, connect, receive) {

  let peers = {}

  socket.on('initiate', (respond) => {
    const p = new Peer({
      initiator: true,
      trickle: false
    })
    console.log(p)
    peers[p._id] = p
    setupPeer(p, connect, receive)
    console.log('initiator signaled', p._id)
    p.on('signal', initData => respond({ data: initData, peerID: p._id}))
  })

  socket.on('initiator-signal-send', (data, respond) => {
    const p = new Peer({ trickle: false })
    p.on('signal', otherData => respond(otherData))
    setupPeer(p, connect, receive)
    p.signal(data)
    console.log('other signaled', p._id)
  })

  socket.on('other-signal-send', ({ otherData: data, peerID: id }) => {
    peers[id].signal(data)
    console.log('initiator signaled back', id)
  })
}
