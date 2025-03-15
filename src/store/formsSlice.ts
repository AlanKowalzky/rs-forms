import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  termsAccepted: boolean;
  image: string | null;
  country: string;
  formType: 'uncontrolled' | 'react-hook-form';
  timestamp: number;
}

interface FormsState {
  submissions: FormData[];
  newSubmissionId: string | null;
}

const initialState: FormsState = {
  submissions: [],
  newSubmissionId: null,
};

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addFormSubmission: (state, action: PayloadAction<FormData>) => {
      state.submissions.push(action.payload);
      state.newSubmissionId = action.payload.id;
    },
    clearNewSubmissionFlag: (state) => {
      state.newSubmissionId = null;
    },
  },
});

export const { addFormSubmission, clearNewSubmissionFlag } = formsSlice.actions;

export default formsSlice.reducer;
