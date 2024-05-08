export interface AppContextType {
    banis?: any; // <-- Replace 'any' with appropriate type
    setBanis?: (value: any) => void; // <-- Replace 'any' with appropriate type
    setMode?: (value: any) => void; // <-- Replace 'any' with appropriate type
    isLarivaar?: boolean;
    mode?: any; // <-- Replace 'any' with appropriate type
    setIsLarivaar?: (value: boolean) => void;
    fontSize?: number;
    setFontSize?: (value: number) => void;
    baniID?: any;
    setBaniID?: (value: any) => void;
    isEnglish?: boolean;
    setIsEnglish?: (value: boolean) => void;
    showEnglishMeaning?: boolean;
    setShowEnglishMeaning?: (value: boolean) => void;
    loading?: boolean;
    setLoading?: (value: boolean) => void;
    error?: any; // <-- Replace 'any' with appropriate type
    setError?: (value: any) => void; // <-- Replace 'any' with appropriate type
    showPunjabiMeaning?: boolean;
    search?: any;
    setSearch?: (value: any) => void;
    presenterMode?: boolean;
    setPresenterMode?: (value: boolean) => void;
    setOpacity?: (value: number) => void;
    throttledScroll?: () => void;
    scrollPosition?: number;
    setScrollPosition?: (value: number) => void;
    scrolling?: boolean;
    setScrolling?: (value: boolean) => void;
    expandCustomisations?: boolean;
    setExpandCustomisations?: (value: boolean) => void;
    larivaarAssist?: boolean;
    setLarivaarAssist?: (value: boolean) => void;
    shabadID?: any;
    setShabadID?: (value: any) => void;
    heading: string;
    setHeading?: (value: any) => void;
    baniName?: any;
    setBaniName?: (value: any) => void;
    statusText?: any;
    setStatusText?: (value: any) => void;
    isWrap?: boolean;
    setIsWrap?: (value: boolean) => void;
    setContainerRef?: (ref: any) => void;
    showFavourites?: boolean;
    setShowFavourites?: (value: boolean) => void;
    shabadTuk?: any;
    setShabadTuk?: (value: any) => void;
    logo?: any;
    setLogo?: (value: any) => void;
    showHistory?: boolean;
    searchMethod?: any; // <-- Replace 'any' with appropriate type
    vishraams?: any[]; // <-- Replace 'any[]' with appropriate type
    setVishraams?: (value: any[]) => void; // <-- Replace 'any[]' with appropriate type
    selectedShabad?: any; // <-- Replace 'any' with appropriate type
    setSelectedShabad?: (value: any) => void; // <-- Replace 'any' with appropriate type
    showSnackbar?: (message: string) => void;
    closeSnackbar?: () => void;
}
