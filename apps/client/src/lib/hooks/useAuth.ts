import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { ME_QUERY } from "@/graphql/auth.gql";
import { useAuthStore } from "@/store/authStore";