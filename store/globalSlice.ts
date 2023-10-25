import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  errorPage: null | number;
  modalCounter: string[];
  authenticated: null | object;
}

const initialState: State = {
  errorPage: null,
  modalCounter: [],
  authenticated: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAuthenticated: (state: State, action: PayloadAction<any>) => {
      state.authenticated = action.payload;
    },
    setErrorPage: (state: State, action: PayloadAction<number>) => {
      state.errorPage = action.payload;
    },
    resetErrorPage: (state: State) => {
      state.errorPage = null;
    },
    setModalCounter: (state: State, action: PayloadAction<string>) => {
      let arr = state.modalCounter;
      if (arr.includes(action.payload)) {
        arr.filter((item) => item !== action.payload);
      } else {
        arr = [...arr, action.payload];
      }
      state.modalCounter = arr;
    },
  },
});

export const {
  setErrorPage,
  setModalCounter,
  resetErrorPage,
  setAuthenticated,
} = globalSlice.actions;

export default globalSlice.reducer;
