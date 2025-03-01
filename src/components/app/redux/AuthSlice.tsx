import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode,JwtPayload} from "jwt-decode";

interface User {
    userId: number;
    username: string;
    email: string;
}

interface CustomJwtPayload extends JwtPayload {
    userinfo?: {
      userId: number;
    };
  }

interface AuthState {
  user: User|null
  token: string | null
  userid: number|null
}

// interface UserId {
// userId: number
// }

const initialState: AuthState = {
  token: null,
  user:null,
  userid:null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
        state.token = action.payload.accessToken;
        const decoded: CustomJwtPayload = jwtDecode<CustomJwtPayload>(action.payload.accessToken);
        state.userid = decoded?.userinfo?.userId || null;
    },
    setUserInfo:(state, action: PayloadAction<User>) => {
        state.user = action.payload;
    },
    logout: (state) => {
        state.token = null;
        state.userid = null;
        state.user = null;
        localStorage.removeItem("persist:auth"); 
    },
  },
});

export const { setCredentials, logout,setUserInfo } = authSlice.actions;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentUserId = (state: { auth: AuthState }) => state.auth.userid;
export default authSlice.reducer;
