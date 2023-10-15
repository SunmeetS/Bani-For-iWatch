import React, { useState } from 'react'
import { API_URL, fetcher } from './App';

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

    export async function fetchBanis() {
        return await fetcher(API_URL + '/banis');
    }
    export const fetchBani = async (id: number) => {
        return await fetcher(API_URL + '/banis/' + id)
    }
    export function isTitle(tuk) {
        tuk = tuk.toLowerCase();
      
        for (let i = 0; i < GurmukhiRaagList.length; i++) {
          const raag = GurmukhiRaagList[i].toLowerCase();
          if (tuk.includes(raag)) {
            return true; // Return true if a raag is found in the sentence
          }
        }
      
        return false;
      }
