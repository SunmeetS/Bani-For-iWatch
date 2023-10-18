import React, { useState } from 'react'
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

    export function utils (setError, setLoading){
      async function fetchBanis() {
          return await fetcher(API_URL + '/banis', setLoading, setError);
      }
      const fetchBani = async (id: number) => {
          const baniFromLS = getFromLS('bani'+id);
          if(!baniFromLS) return await fetcher(API_URL + '/banis/' + id, setLoading, setError);
          if(baniFromLS === 'Refetch and Save to Localstorage') {
            const newBaniData = await fetcher(API_URL + '/banis/' + id, setLoading, setError);
            saveToLS('bani'+id, JSON.stringify(newBaniData));
            return newBaniData;
          }
          return baniFromLS
      }
      return {
        fetchBani, fetchBanis
      }
    }
