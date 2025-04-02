import { useContext } from "react";
import { GeneralContext } from "../context/GeneralProvider";

function useGeneral(){
    return useContext(GeneralContext)
}

export default useGeneral;