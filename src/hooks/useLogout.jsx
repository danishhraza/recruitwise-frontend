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
            const response = await axios.post('/auth/logout',{
                withCredentials: true
            })
            console.log(response.data)
        }catch(err){
            console.log(err)
        }
    }
    return logout
}


export default useLogout;