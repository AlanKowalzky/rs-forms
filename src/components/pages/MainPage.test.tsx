import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import MainPage from './MainPage';
import { thunk } from 'redux-thunk';
import { FormsState } from '../../store/formsSlice';

const mockStore = configureStore([thunk]);

describe('MainPage', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = (initialState: FormsState) => {
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
    const initialState: FormsState = {
      submissions: [],
      newSubmissionId: null,
    };
    renderComponent(initialState);
    expect(screen.getByText('React Forms Application')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No form submissions yet. Please fill out one of the forms.'
      )
    ).toBeInTheDocument();
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
      formType: 'react-hook-form' as const, // Explicitly cast formType
      timestamp: Date.now(),
    };
    const initialState: FormsState = {
      submissions: [submission],
      newSubmissionId: null,
    };
    renderComponent(initialState);
    expect(
      screen.getByText('Form Submission (react-hook-form)')
    ).toBeInTheDocument();
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
