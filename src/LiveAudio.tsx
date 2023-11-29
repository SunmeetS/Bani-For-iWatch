import React from 'react'

type Props = {}

const LiveAudio = (props: Props) => {
  return (
    <div className="App">
      <div className='liveAudio Banis'>
        <img className='darbarSahibImage' src="https://images6.alphacoders.com/130/1308158.jpeg" alt="" />
        <audio id="audio_1" preload="none" autoplay="autoplay" >
            <source src="https://live.sgpc.net:8443/;nocache=889869" type="audio/mpeg"/>
        </audio>
      </div>
    </div>
  )
}

export default LiveAudio