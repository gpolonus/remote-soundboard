
import React from 'react'

export default ({ host, sounder, showHost }) => (
  <div className="ConnectionButtons">
    { showHost ? <div><button onClick={ host }>Host</button></div> : []}
    <div><button onClick={ sounder }>Connect to Host</button></div>
  </div>
)
