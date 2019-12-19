
module.exports = function(socket, otherSocket) {
  socket.emit('initiate', ({ data, peerID }) =>
    (console.log('initiated', data, peerID),
    otherSocket.emit('initiator-signal-send', data, otherData =>
      (console.log('initiator-signal-sent and other-signal-sending', peerID),
      socket.emit('other-signal-send', { otherData, peerID }))
    ))
  )
}
