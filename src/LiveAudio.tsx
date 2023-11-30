import { CircularProgress } from '@mui/joy';
import React, { useEffect, useRef, useState } from 'react'

type Props = {}

const LiveAudio = (props: Props) => {

  const audioRef = useRef(null);
  const [loading, setLoading] = useState({
    status: true, 
    message: 'Please Wait. It usually takes around 10 - 15 Seconds to fetch Live Gurbani from Darbar Sahib...'
  })
  
  useEffect(() => {
    let elapsedSeconds = 0;

    const intervalId = setInterval(() => {
      elapsedSeconds++;

      if (elapsedSeconds === 7) {
        setLoading({
          ...loading,
          message: "Please wait, still loading..."
        });
        clearInterval(intervalId); 
      } 
      
    }, 1000); 


    const handlePlay = () => {
      setLoading({...loading, status: false});
    };

    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener('play', handlePlay);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('play', handlePlay);
      }
    };
  }, []); 


  return (
    <div className="App">
      <div className='liveAudio Banis'>
        {!loading.status && <img className='darbarSahibImage' src="https://images6.alphacoders.com/130/1308158.jpeg" alt="" />}
        {loading.status && <>
          <CircularProgress />
          <h4 style={{marginTop: '1rem'}}>{loading.message}</h4>
        </>}
        <audio ref={audioRef} id="audio_1" preload="none" autoPlay={true} >
            <source src="https://live.sgpc.net:8443/;nocache=889869" type="audio/mpeg"/>
        </audio>
      </div>
    </div>
  )
}

export default LiveAudio