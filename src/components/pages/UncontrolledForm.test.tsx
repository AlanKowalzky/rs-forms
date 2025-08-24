/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UncontrolledForm from './UncontrolledForm';
import { thunk } from 'redux-thunk';
import { addFormSubmission } from '../../store/formsSlice';

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => '123456789',
}));

const mockStore = configureStore([thunk]);

describe('UncontrolledForm', () => {
  let store: ReturnType<typeof mockStore>;
  let mockOnClose: vi.Mock; // Declare mockOnClose

  beforeEach(() => {
    store = mockStore({
      countries: {
        list: ['Poland', 'Germany', 'USA'],
      },
      forms: {
        submissions: [],
        newSubmissionId: null,
      },
    });
    vi.clearAllMocks();
    mockOnClose = vi.fn(); // Initialize mockOnClose
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <UncontrolledForm onClose={mockOnClose} /> {/* Pass mockOnClose */}
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render the form correctly', () => {
    renderComponent();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Age:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Gender:')).toBeInTheDocument();
    expect(screen.getByLabelText('Country:')).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i accept the terms and conditions/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should show validation errors on submit with empty fields', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Name must start with an uppercase letter')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Age must be a positive number')
      ).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(
        screen.getByText('Password must contain at least 1 special character')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Confirm password is required')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please select a valid gender')
      ).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
      expect(
        screen.getByText('You must accept the terms and conditions')
      ).toBeInTheDocument();
    });
  });

  it('should submit the form with valid data', async () => {
    renderComponent();

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Name:'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Age:'), {
      target: { value: '30' },
    });
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Gender:'), {
      target: { value: 'male' },
    });
    fireEvent.change(screen.getByLabelText('Country:'), {
      target: { value: 'Poland' },
    });
    fireEvent.click(
      screen.getByLabelText(/i accept the terms and conditions/i)
    );

    const imageInput = screen.getByLabelText(/upload image/i);
    fireEvent.change(imageInput, {
      target: { files: [file] },
    });

    // Wait for the image preview to appear
    await screen.findByAltText('Preview');

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0].type).toBe(addFormSubmission.type);
      expect(actions[0].payload).toEqual(
        expect.objectContaining({
          name: 'John',
          age: 30,
          email: 'john.doe@example.com',
          password: 'Password123!',
          gender: 'male',
          country: 'Poland',
          termsAccepted: true,
        })
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
