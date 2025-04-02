import axios from "../api/axios";
import useAuth from "./useAuth";
import useGeneral from "./useGeneral";


function useLogout(){
    const {isLoggedIn,setIsLoggedIn,setUser} = useGeneral();

    async function logout(){
        if(isLoggedIn){
            setIsLoggedIn(false);
        }
        try{
            const response = await axios('/auth/logout',{
                withCredentials: true
            })
        }catch(err){
            console.log(err)
        }
    }
    return logout
}


export default useLogout;