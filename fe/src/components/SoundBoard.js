
import React from 'react'

export default ({ sounds, play }) => (
  <div className="SoundBoard">
    {
      sounds.map(sound => (
        <button className="sound" key={sound} onClick={() => play(sound)}>
          {sound}
        </button>
      ))
    }
  </div>
)
