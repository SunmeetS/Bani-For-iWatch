import { CircularProgress } from '@mui/joy';
import React, { useEffect, useRef, useState, useContext } from 'react'
import { BaniContext } from './main';


type Props = {}

const LiveAudio = (props: Props) => {
  const baniContext = useContext(BaniContext);
  const {setHeading, heading} = baniContext
  
  const audioRef = useRef(null);
  const [selectedGurudwara, setSelectedGurudwara] = useState<{
    liveLink?: string,
    videoLink?: string,
    name?: string
  }>({})
  const [loading, setLoading] = useState({
    status: true, 
    message: `Please Wait. It usually takes around 10 - 15 Seconds to fetch Live Gurbani from Gurudwara Sahib...`
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

  }, [selectedGurudwara.liveLink]); 

  useEffect(() => {
    const handlePlay = () => {
      setLoading({message: `Please Wait. It usually takes around 10 - 15 Seconds to fetch Live Gurbani from Gurudwara Sahib...`, status: false});
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
  }, [selectedGurudwara.liveLink])

  useEffect(() => {
    setHeading?.('Live Gurbani')
  }, [])

  const liveLinks = {
    'Darbar Sahib': {
      liveLink: 'https://live.sgpc.net:8443/;nocache=889869',
      videoLink: 'https://www.youtube.com/embed/qeC0ibeyhRY?loop=1&playlist=qeC0ibeyhRY&controls=0&autoplay=1&mute=1',
    },
    'Bangla Sahib': {
      liveLink: 'http://radio2.sikhnet.com:8050/live',
      videoLink: 'https://www.youtube.com/embed/SHnY6W3z8DE?loop=1&playlist=SHnY6W3z8DE&controls=0&autoplay=1&mute=1'
    },
    'Dukh Niwaran Sahib': {
      liveLink: 'http://akalmultimedia.net:8000/GDNSLDH',
      videoLink: 'https://www.youtube.com/embed/ozT6KyhL5jE?start=10&loop=1&playlist=ozT6KyhL5jE&controls=0&autoplay=1&mute=1'
    }
  }

  return (
    <div className="App">
      <div className='liveAudio Banis'>
        { selectedGurudwara.liveLink && !loading.status && 
        <>
          <iframe className='gurudwaraImage' src={selectedGurudwara.videoLink} frameBorder="0" allow="autoplay; "></iframe>
          <h1 style={{fontWeight: 600, textDecoration: 'underline'}}>{selectedGurudwara.name}</h1>
        </>
        }
        {selectedGurudwara.liveLink && loading.status && <>
          <CircularProgress />
          <h4 style={{marginTop: '1rem'}}>{loading.message}</h4>
        </>}

        <div className="chooseGurudwara">
          {!selectedGurudwara.liveLink ? Object.keys(liveLinks).map((item, index) => {
            return (
              <>
                <button className='tuk button' onClick={() => setSelectedGurudwara({...liveLinks[item], name: item})}>{item}</button>
              </>
            )}
          ) : <button className='tuk button' onClick={() => {
            setSelectedGurudwara({});
            setLoading({...loading, status: true})
          }}>Watch another live</button>}
        </div>

        {selectedGurudwara.liveLink && <audio ref={audioRef} id="audio_1" preload="none" autoPlay={true} >
            <source src={selectedGurudwara.liveLink} type="audio/mpeg"/>
        </audio>}
      </div>
    </div>
  )
}

export default LiveAudio