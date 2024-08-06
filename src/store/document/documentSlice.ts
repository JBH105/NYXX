import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiPassword, axiosInstance } from "utils/axios";
import { getRecommendations } from "../../../backendActions/documents"; 

interface UploadDocumentActionProps {
  form: FormData;
  onSuccess: (data: string) => void;
}

export const uploadDocumentAction = createAsyncThunk(
  "document/uploadDocument",
  async ({ form, onSuccess }: UploadDocumentActionProps, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/upload22?password=${apiPassword}`,
        form
      );
      if(data?.result === "Success"){
        let intervalId: any;
        const contractId = data?.contract_id;
        const callRecommendationsApi = async () => {
          try {
            const { data } = await axiosInstance.get(`/recommendations?password=${apiPassword}&contract_id=${contractId}`);
            console.log('data', data)
            if (data?.recommendations) {
              console.log('data.recommendations', data.recommendations)
              clearInterval(intervalId);
            } 
          } catch (error) {
            console.log("error", error.message)
          }
        }
        intervalId = setInterval(callRecommendationsApi, 3000);  
        onSuccess(data?.contract_id)
      } else {
        onSuccess("error")
        toast.error("error", data)
      }
    } catch (error) {
      onSuccess("error")
      console.log("error", error)
      toast.error("error")
      return rejectWithValue(error.message);
    }
  }
);

interface ProcessingDocumentActionProps {
  id: number;
  onSuccess: (data?: string) => void;
}

export const processingDocumentAction = createAsyncThunk(
  "document/processingDocument",
  async ({ id, onSuccess }: ProcessingDocumentActionProps, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/status?password=${apiPassword}&contract_id=40`,
      );
      if(data?.status === "100"){
        onSuccess()
      } else {
        toast.error("error")
        console.log("err")
        onSuccess("error")
      }
    } catch (error) {
      toast.error("error")
      onSuccess("error")
      return rejectWithValue(error.message);
    }
  }
);

export const getDocumentAction = (data: any) => (dispatch: any) => {
  dispatch(setDocumentData(data));
};

interface DocumentState {
  documentData: any[];
}

const initialState: DocumentState = {
  documentData: [],
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocumentData: (state, action: PayloadAction<any>) => {
      state.documentData = action.payload;
    },
  },
});

export const {
  setDocumentData,
} = documentSlice.actions;

export default documentSlice.reducer;