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

    export async function fetchBanis() {
        return await fetcher(API_URL + '/banis');
    }
    export const fetchBani = async (id: number) => {
        return await fetcher(API_URL + '/banis/' + id)
    }

