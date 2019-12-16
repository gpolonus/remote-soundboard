
import Peer from 'simple-peer'

export function initiate(sendSignal) {
  return new Promise(resolve => {
    const p = new Peer({ initiator: true })
    p.on('signal', async data => {
      await sendSignal(data)
      resolve(p)
    })
  })
}
