import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "sonner";

const GeneralContext = createContext();

function GeneralProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    return <GeneralContext.Provider value={{isLoggedIn, setIsLoggedIn,user,setUser}}>
        {children}
    </GeneralContext.Provider>
}

export {GeneralProvider, GeneralContext}