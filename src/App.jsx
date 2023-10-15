import { createContext, useEffect, useState } from 'react';
import './App.css'
import Banis from './Banis';
import { fetchBanis } from './utils';

export const API_URL = 'https://api.banidb.com/v2/'
export async function fetcher(url) {
  return await fetch(url).then(res => res.json());
}
export const BaniContext = createContext()

function App() {

  const [banis, setBanis] = useState([]);

  useEffect(() => {  
    fetchBanis().then(banis => setBanis(banis))
  }, [])  

  return (
    <BaniContext.Provider value = {{banis, setBanis}}>
      <div className="App">
        <Banis/>
      </div>
    </BaniContext.Provider>
  );
}

export default App;

