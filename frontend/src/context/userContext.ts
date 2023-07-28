import { Dispatch, SetStateAction, createContext } from "react"
import UserAttributes  from "../types/User"

export const UserContext = createContext<{
  currentUser:UserAttributes|null,
  setCurrentUser:Dispatch<SetStateAction<UserAttributes|null>>
}|null>(null);