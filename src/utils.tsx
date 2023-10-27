import { API_URL, fetcher, getFromLS, saveToLS } from './App';

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
  return textWithoutMatras;
}


    export function utils(setError, setLoading) {
      async function fetchBanis() {
        return await fetcher(API_URL + '/banis', setLoading, setError);
      }
      const fetchBani = async (id: number) => {
        const baniFromLS = getFromLS('bani' + id);
        if (!baniFromLS) {
          const newBaniData = await fetcher(API_URL + '/banis/' + id, setLoading, setError);
          saveToLS('bani' + id, JSON.stringify(newBaniData));
          return newBaniData;
        }
        return baniFromLS
      }
      return {
        fetchBani, fetchBanis
      }
    }
