
import React from 'react'

export default ({ host, sounder, showHost }) => (
  <>
    { showHost ? <button onClick={ host }>Host</button> : []}
    <button onClick={ sounder }>Connect to Host</button>
  </>
)
