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

  it('should show validation errors on submit with empty fields', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Name must start with an uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('Age must be a positive number')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Confirm password is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a valid gender')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
    });
  });