import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import {jwtDecode,JwtPayload} from "jwt-decode"

interface User {
    userId: number,
    username: string,
    email: string
}
interface CustomJwtPayload extends JwtPayload {
    userinfo?: {
      userId: string
    }
  }

interface AuthState {
  user: User|null,
  token: string, 
}

const initialState: AuthState = {
  token: "",
  user:null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
        state.token = action.payload.accessToken
    },
    setUserInfo:(state, action: PayloadAction<User>) => {
        state.user = action.payload
    },
    logout: (state) => {
        state.token = ""
        localStorage.removeItem("persist:auth") 
    },
  },
})

export const { setCredentials, logout,setUserInfo } = authSlice.actions
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user

export const selectCurrentUserId = createSelector(
    [selectCurrentToken],
    (token) => {
        if (!token) return ""
        const decoded: CustomJwtPayload = jwtDecode<CustomJwtPayload>(token)
        return decoded?.userinfo?.userId || ""
     
    }
  )

export default authSlice.reducer
