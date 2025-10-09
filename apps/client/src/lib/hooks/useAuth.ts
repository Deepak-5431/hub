import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { ME_QUERY } from "@/graphql/auth.gql";
import { useAuthStore } from "@/store/authStore";
import { MeQueryResult,User} from '../types/graphql'

//checking for user
export const useAuth = () => {
  const { setUser,setLoading,logout } = useAuthStore();

  const { data,loading,error } = useQuery<MeQueryResult>(ME_QUERY,{
    fetchPolicy: 'network-only',
    errorPolicy:'all',
  });

  useEffect(()=>{
  if(!loading){
   if(data?.me){
     setUser({
      id:data.me.id,
      email: data.me.email,
      createdAt: data.me.createdAt,
      updatedAt: data.me.updatedAt,

      
     })
   }else{
    setUser(null);
   }
  }
},[data,loading,setUser]);


useEffect(()=>{
  if(error){
    console.error("error is this",error);
    setUser(null);
  }
},[error,setUser])

return {
  user: useAuthStore((state) => state.user),
  authenticated: useAuthStore((state) => state.isAuthenticated),
  isLoading: useAuthStore((state)=> state.isLoading),
  logout,
}
}

