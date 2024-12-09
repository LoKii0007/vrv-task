import { createContext, useContext, useState } from "react";


const GlobalContext = createContext();

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export function GlobalContextProvider({children}) {
    const [activeCategory, setActiveCategory] = useState("all");
    const {baseUrl} = 'http://localhost:3000/api';
    const [activeView, setActiveView] = useState("all");
    const [activeBlog, setActiveBlog] = useState('all');

    return <GlobalContext.Provider value={{activeCategory, setActiveCategory, baseUrl, activeView, setActiveView, activeBlog, setActiveBlog}}>
        {children}
    </GlobalContext.Provider>
}

export function useGlobal(){
    const context = useContext(GlobalContext);
    if(!context){
        throw new Error("useGlobal must be used within a GlobalContextProvider");
    }
    return context;
};
