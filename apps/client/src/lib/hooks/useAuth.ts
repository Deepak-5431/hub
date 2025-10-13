// hooks/useAuth.ts - FIXED IMPORT
import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { ME_QUERY } from "@/graphql/auth.gql";
import { useAuthStore } from "@/store/authStore";
import { MeQueryResult } from '../types/graphql'

export const useAuth = () => {
  const { setUser, logout, user, isAuthenticated, isLoading } = useAuthStore();

  const isAuthPage = typeof window !== 'undefined' && 
    ['/login', '/register'].includes(window.location.pathname);

  const { data, loading, error } = useQuery<MeQueryResult>(ME_QUERY, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
    skip: isAuthPage,
  });

  useEffect(() => {
    if (!loading) {
      if (data?.me) {
        setUser(data.me);
      } else {
         
        setUser(null);
         
      }
    }
  }, [data, loading, setUser]);

  useEffect(() => {
    if (error) {
      console.log("Auth check: User not authenticated (this is normal)");
      setUser(null);
    }
  }, [error, setUser]);

  return {
    user,
    authenticated: !!user, 
    isLoading: isAuthPage ? false : (loading || isLoading),
    setUser,
    logout,
  };
};