import App, { API_URL, fetcher } from './App';

export type Bani = {
    ID: number;
    token: string;
    gurmukhi: string;
    gurmukhiUni: string;
    transliteration: string;
    transiterations: {
        english: string;
        hindi: string;
        en: string;
        hi: string;
        ipa: string;
        ur: string;
    };
    updated: string;
};

export const GurmukhiRaagList = [
    "ਆਸਾ",
    "ਗੂਜਰੀ",
    "ਗਉੜੀ ਦੀਪਕੀ",
    "ਧਨਾਸਰੀ",
    "ਗਉੜੀ ਪੂਰਬੀ",
    "ਸਿਰੀ ",
    "ਮਾਝ",
    "ਗਉੜੀ ਗੁਆਰੇਰੀ",
    "ਗਉੜੀ",
    "ਗਉੜੀ ਦਖਣੀ",
    "ਗਉੜੀ ਚੇਤੀ",
    "ਗਉੜੀ ਬੈ",
    "ਗਉੜੀ ਪੂਰਬੀ ਦੀਪਕੀ",
    "ਗਉੜੀ ਮਾਝ",
    "ਗੌੜੀ ਮਾਲਵਾ",
    "ਗਉੜੀ ਮਾਲਾ",
    "ਗਉੜੀ ਸੋਰਠਿ",
    "ਆਸਾ ਕਾਫੀ",
    "ਆਸਾਵਰੀ",
    "ਆਸਾ ਆਸਾਵਰੀ",
    "ਦੇਵਗੰਧਾਰੀ",
    "ਬਿਹਾਗੜਾ",
    "ਵਡਹੰਸੁ",
    "ਵਡਹੰਸੁ ਦਖਣੀ",
    "ਸੋਰਠਿ",
    "ਜੈਤਸਰੀ",
    "ਟੋਡੀ",
    "ਬੈਰਾੜੀ",
    "ਤਿਲੰਗ",
    "ਤਿਲੰਗ ਕਾਫੀ",
    "ਸੂਹੀ",
    "ਸੂਹੀ ਕਾਫੀ",
    "ਸੂਹੀ ਲਲਿਤ",
    "ਬਿਲਾਵਲ",
    "ਬਿਲਾਵਲ ਦਖਣੀ",
    "ਗੋਂਡ",
    "ਬਿਲਾਵਲ ਗੋਂਡ",
    "ਰਾਮਕਲੀ",
    "ਰਾਮਕਲੀ ਦਖਣੀ",
    "ਨਟ ਨਾਰਾਇਨ",
    "ਨਟ"
  ];  

export const debounce = (func, delay) => {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
export function isGurmukhiWord(word) {
  const gurmukhiRegExp = /^[\u0A00-\u0A7F]+$/;
  return gurmukhiRegExp.test(word);
}

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export function removeMatras(text) {
  var matraPattern = /[\u0A3E-\u0A4B\u0A66-\u0A75]/g;
  var textWithoutMatras = text.replace(matraPattern, '');
  return textWithoutMatras as string;
}
export function getFirstLetters(text) {
  const words = text.split(' ');
  const firstLetters = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > 0) {
      firstLetters.push(word[0]);
    }
  }
  return firstLetters;
}

export const baniCache = {bani: {}, shabad: {}};
    export function utils() {
      async function fetchBanis() {
        return await fetcher(API_URL + '/banis');
      }
      
      const fetchShabads = async (searchInput: string) => {
        if(searchInput.length < 3) return;
        const searchShabadsUrl = `${API_URL}search/${searchInput}?source=all&searchtype=1&writer=all&page=1&livesearch=1`
        const shabads = await fetcher(searchShabadsUrl)
        return shabads
      }
      const fetchBani = async (id: number) => {
        const fetchBaniUrl = API_URL + 'banis/' + id;
        const bani = await fetcher(fetchBaniUrl);

        const baniDetails = bani.verses.map((ele) => {

          ele = ele.verse;
          const tuk = ele.verse.unicode;
          const englishTuk = ele.transliteration.english;
          const {bdb, ms, ssk} = ele.translation.en;
          const englishMeaning = bdb ?? ms ?? ssk;
          const {bdb: pu1, ms: pu2, ft, ss} = ele.translation.pu;
          const punjabiMeaning = pu1?.unicode ?? pu2?.unicode ?? ft?.unicode ?? ss?.unicode;

          return {
            tuk, englishTuk, englishMeaning, punjabiMeaning
          }

        })

        return {details: [...baniDetails], previous: '', next: ''};
      }

      const fetchShabad = async (id: number) => {
        const fetchShabadUrl = API_URL+`shabads/${id}`

        const shabad = await fetcher(fetchShabadUrl);
        const {previous, next} = shabad.navigation
        const shabadDetails = shabad.verses.map((ele) => {

          const tuk = ele.verse.unicode;
          const englishTuk = ele.transliteration.english;
          const {bdb, ms, ssk} = ele.translation.en;
          const englishMeaning = bdb ?? ms ?? ssk;
          const {bdb: pu1, ms: pu2, ft, ss} = ele.translation.pu;
          const punjabiMeaning = pu1?.unicode ?? pu2?.unicode ?? ft?.unicode ?? ss?.unicode;

          return {
            tuk, englishTuk, englishMeaning, punjabiMeaning
          }

        })

        return {details: [...shabadDetails], previous, next}
      }
      return {
        fetchBani, fetchBanis, fetchShabad, fetchShabads
      }
    }
