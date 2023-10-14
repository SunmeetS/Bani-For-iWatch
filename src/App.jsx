import './App.css'
import Banis from './Banis';

export const API_URL = 'https://api.banidb.com/v2/'
export async function fetcher(url) {
  return await fetch(url).then(res => res.json());
}

function App() {

  return (
    <div className="App">
      <Banis/>
    </div>
  );
}

export default App;

