import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  text: "",
  icon: "", 
  id: "", 
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    createMessage(state, action) {
      const { title, text, icon } = action.payload;
      state.title = title;
      state.text = text;
      state.icon = icon;
      state.id = Date.now(); 
    },
  },
});

export const { createMessage } = messageSlice.actions;

export default messageSlice.reducer;