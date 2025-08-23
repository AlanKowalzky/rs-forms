import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  formType: 'uncontrolled' | 'react-hook-form' | null;
}

const initialState: ModalState = {
  isOpen: false,
  formType: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<'uncontrolled' | 'react-hook-form'>
    ) => {
      state.isOpen = true;
      state.formType = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.formType = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;