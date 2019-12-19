
import React from 'react'

export default ({ sounds, play }) => (
  <div className="SoundBoard">
    {
      sounds.map(sound => (
        <h2 key={sound} onClick={() => play(sound)}>
          {sound}
        </h2>
      ))
    }
  </div>
)
