import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiPassword, axiosInstance } from "utils/axios";



export const uploadDocumentAction = createAsyncThunk(
  "document/uploadDocument",
  async ({ form, onSuccess }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/upload22?password=${apiPassword}`,
        form
      );
      if(data?.result=="Success"){
        onSuccess(data?.contract_id)
      }else{
        onSuccess("error")
        toast.error("error",data)
           
      }
    } catch (error) {
      onSuccess("error")
      console.log("error",error)
      toast.error("error")
     
      return rejectWithValue(error.message);
    }
  }
);

export const processingDocumentAction = createAsyncThunk(
  "document/processingDocument",
  async ({ id, onSuccess }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/status?password=${apiPassword}&contract_id=40`,
      );
      if(data?.status=="100"){
        onSuccess()
      }else{
        toast.error("error")
             console.log("err")
             onSuccess("error")
      }
    } catch (error) {
      toast.error("error")
      onSuccess("error")
      return rejectWithValue(error.message); // Handle the error state in Redux
    }
  }
);



// Function to load subscriptions into the Redux store
export const getDocumentAction = (data) => (dispatch) => {
  dispatch(setDocumentData(data));
};

const documentSlice = createSlice({
  name: "document",
  initialState: {
    documentData: [],
  },
  reducers: {
    setDocumentData: (state, action) => {
      state.documentData = action.payload;
    },
  },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSubscriptions.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchSubscriptions.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.items = action.payload;
//       })
//       .addCase(fetchSubscriptions.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
});
export const {
    setDocumentData,
} = documentSlice.actions;
export default documentSlice.reducer;
