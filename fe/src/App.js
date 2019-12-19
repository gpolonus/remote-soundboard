
import React, { useState, useEffect } from 'react'
import webRTCSocket from './services/WebRTCSignalPassing'
import ConnectionButtons from './components/ConnectionButtons'
import SoundBoard from './components/SoundBoard'
import { Sound } from './services/Sound'

const startupSocket = webRTCSocket(process.env.REACT_APP_SOCKET_URL)

const sounds = [
  'Stuff',
  'Things',
  'Other Stuff',
  'Other Things'
]

const audio = new Sound('/sounds/blop.wav');

function playSound(sound) {
  console.log(`play sound: ${sound}`)
  audio.play()
}

function App() {
  const [ { socketConnected, emit }, setConn ] = useState({
    socketConnected: false,
    emit: () => {}
  })

  const [ hostHere, setHostHere ] = useState(false)

  const [ amHost, setAmHost ] = useState(undefined)

  const [ { peerConnected, peerSend }, setPeerConn ] = useState({ peerConnected: false, peerSend: () => {} })

  function host() {
    console.log('sending role host')
    emit('setRole', 'host')
    setAmHost(true)
  }

  function sounder() {
    console.log('sending role sounder')
    emit('setRole', 'sounder')
    setAmHost(false)
  }

  function peerConnect(peerSend) {
    console.log('peer has connected')
    peerConnected || setPeerConn({
      peerConnected: true,
      peerSend
    })
  }

  function play(sound) {
    amHost || peerSend(sound)
  }

  useEffect(() => {
    (async () => {
      if(!socketConnected) {
        console.log('starting webrtc socket connection')
        const emit = await startupSocket({
            connect: peerConnect,
            receive: playSound
          },
          {
            hostHere: (...data) => (
              console.log('got host avail data', data[0]),
              setHostHere(...data)
            )
          }
        )
        setConn({ socketConnected: true, emit })
      }
    })()
    // these dependencies are causing warnings
  }, [socketConnected, peerConnected, peerConnect])

  return (
    <div className="App">
      <h1>Many Sounds</h1>
      <div>
        {
            peerConnected ?
              amHost ?
                <div>Have fun!</div> :
                <SoundBoard sounds={sounds} play={play} />
              :
              socketConnected && amHost === undefined ?
                <ConnectionButtons showHost={!hostHere} host={host} sounder={sounder} />
                :
                <div>Wait</div>
        }
      </div>
    </div>
  );
}

export default App;
