import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ReactHookFormPage from './ReactHookForm';
import { thunk } from 'redux-thunk';
import { addFormSubmission } from '../../store/formsSlice';

// Mock react-router-dom
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => '987654321',
}));

const mockStore = configureStore([thunk]);

describe('ReactHookFormPage', () => {
  let store:any;

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
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <ReactHookFormPage />
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
    expect(screen.getByLabelText(/i accept the terms and conditions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should show validation error when name is invalid', async () => {
    renderComponent();
    const nameInput = screen.getByLabelText('Name:');
    fireEvent.change(nameInput, { target: { value: 'john' } });
    await waitFor(() => {
      expect(screen.getByText('Name must start with an uppercase letter')).toBeInTheDocument();
    });
  });

  it('should disable submit button when form is invalid', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should enable submit button and submit the form with valid data', async () => {
    renderComponent();

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Gender:'), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText('Country:'), { target: { value: 'USA' } });
    fireEvent.click(screen.getByLabelText(/i accept the terms and conditions/i));
    
    const imageInput = screen.getByLabelText(/upload image/i);
    fireEvent.change(imageInput, { target: { files: [file] } });

    await screen.findByAltText('Preview');

    await waitFor(() => {
        expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe(addFormSubmission.type);
        expect(actions[0].payload).toEqual(expect.objectContaining({
            name: 'Jane',
            age: 25,
            email: 'jane.doe@example.com',
            password: 'Password123!',
            gender: 'female',
            country: 'USA',
            termsAccepted: true,
        }));
        expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });
});