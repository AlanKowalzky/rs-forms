import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import MainPage from './MainPage';
import { thunk } from 'redux-thunk';
import { clearNewSubmissionFlag } from '../../store/formsSlice';

const mockStore = configureStore([thunk]);

describe('MainPage', () => {
  let store: any;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = (initialState: any) => {
    store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render correctly with no submissions', () => {
    const initialState = {
      forms: {
        submissions: [],
        newSubmissionId: null,
      },
    };
    renderComponent(initialState);
    expect(screen.getByText('React Forms Application')).toBeInTheDocument();
    expect(screen.getByText('No form submissions yet. Please fill out one of the forms.')).toBeInTheDocument();
  });

  it('should render correctly with a submission', () => {
    const submission = {
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
    const initialState = {
      forms: {
        submissions: [submission],
        newSubmissionId: null,
      },
    };
    renderComponent(initialState);
    expect(screen.getByText('Form Submission (react-hook-form)')).toBeInTheDocument();
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  // it('should highlight a new submission and clear the flag after a timeout', async () => {
  //   const submission = {
  //     id: '1',
  //     name: 'John Doe',
  //     age: 30,
  //     email: 'john.doe@example.com',
  //     password: 'Password123!',
  //     gender: 'male',
  //     termsAccepted: true,
  //     image: null,
  //     country: 'USA',
  //     formType: 'react-hook-form',
  //     timestamp: Date.now(),
  //   };
  //   const initialState = {
  //     forms: {
  //       submissions: [submission],
  //       newSubmissionId: '1',
  //     },
  //   };
  //   renderComponent(initialState);

  //   expect(screen.getByText('Form Submission (react-hook-form)').parentElement).toHaveClass('new-submission');

  //   vi.advanceTimersByTime(3000);

  //   await waitFor(() => {
  //     const actions = store.getActions();
  //     expect(actions).toHaveLength(1);
  //     expect(actions[0].type).toBe(clearNewSubmissionFlag.type);
  //   });
  // });
});