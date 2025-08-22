import { describe, it, expect } from 'vitest';
import formsReducer, { addFormSubmission, clearNewSubmissionFlag, FormData } from './formsSlice';

describe('formsSlice', () => {
  const initialState = {
    submissions: [],
    newSubmissionId: null,
  };

  it('should return the initial state', () => {
    expect(formsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addFormSubmission', () => {
    const newSubmission: FormData = {
      id: '1',
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      password: 'Password123!',
      gender: 'male',
      termsAccepted: true,
      image: null,
      country: 'USA',
      formType: 'react-hook-form',
      timestamp: Date.now(),
    };

    const nextState = formsReducer(initialState, addFormSubmission(newSubmission));

    expect(nextState.submissions).toHaveLength(1);
    expect(nextState.submissions[0]).toEqual(newSubmission);
    expect(nextState.newSubmissionId).toBe('1');
  });

  it('should handle clearNewSubmissionFlag', () => {
    const currentState = {
      submissions: [],
      newSubmissionId: '1',
    };

    const nextState = formsReducer(currentState, clearNewSubmissionFlag());

    expect(nextState.newSubmissionId).toBeNull();
  });
});
