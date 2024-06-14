import { createSlice } from "@reduxjs/toolkit";
import { deleteCookie, getCookie, setCookie } from "cookies-next";



export const loginAction = (data,onSuccess) => (dispatch) => {
  dispatch(loginUser(data));
  onSuccess()
};

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser:(state,action)=>{
           state.user = action.payload;
           setCookie('user', action.payload, {
            maxAge: 60 * 60 * 24 
          });
    },
    logoutUser: (state) => {
      state.user = null;
      deleteCookie("user");
      localStorage.clear();
      //window.location.href = "/auth/login";
    },
    addUser: (state) => {
      const isUser=getCookie("user")
      let user = isUser ? JSON.parse(isUser) : null;
      console.log("user",user)
       state.user =user ? user:  null;
    },

  },
  // extraReducers: (builder) => {
  //   builder
  //     // Handle Login Api
      
  //     .addCase(loginUser.pending, (state, action) => {
  //       state.isLoading = true;
  //     })
      
  //     .addCase(loginUser.fulfilled, (state, action) => {
  //         state.user = action.payload;
  //         state.token = action.payload.detail.AccessToken;
  //         setCookie("user", action.payload);
  //         setCookie("token", action.payload.detail.AccessToken);
  //        state.isLoading = false;
  //     })
  //     .addCase(loginUser.rejected, (state, action) => {
  //       // toast.error(action.payload?.data?.message);
  //       state.isLoading = false;
  //     })
  // },
});

export const { loginUser,logoutUser,addUser } = userSlice.actions;

export default userSlice.reducer;
