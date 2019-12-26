
import React from 'react'

export default ({ sounds, play }) => (
  <div className="SoundBoard">
    {
      sounds.map(({ id, display }) => (
        <button className="sound" key={id} onClick={() => play(id)}>
          {display}
        </button>
      ))
    }
  </div>
)
