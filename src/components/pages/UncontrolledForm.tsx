import { useRef, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store';
import { addFormSubmission } from '../../store/formsSlice';
import {
  formValidationSchema,
  getPasswordStrength,
} from '../../utils/validationSchema';
import '../../styles/Form.css';

interface ValidationErrors {
  [key: string]: string;
}

const UncontrolledForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.list);

  // Form refs
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsAcceptedRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  // State for validation errors and filtered countries
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle password input to show strength
  const handlePasswordChange = () => {
    if (passwordRef.current) {
      const strength = getPasswordStrength(passwordRef.current.value);
      setPasswordStrength(strength);
    }
  };

  // Handle country input for autocomplete
  const handleCountryInput = () => {
    if (countryRef.current) {
      const input = countryRef.current.value.toLowerCase();
      if (input.length > 0) {
        const filtered = countries.filter((country) =>
          country.toLowerCase().includes(input)
        );
        setFilteredCountries(filtered);
        setShowCountryDropdown(true);
      } else {
        setFilteredCountries([]);
        setShowCountryDropdown(false);
      }
    }
  };

  // Select country from dropdown
  const selectCountry = (country: string) => {
    if (countryRef.current) {
      countryRef.current.value = country;
      setShowCountryDropdown(false);
    }
  };

  // Handle image upload
  const handleImageChange = () => {
    if (
      imageRef.current &&
      imageRef.current.files &&
      imageRef.current.files[0]
    ) {
      const file = imageRef.current.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Get form values
    const formData = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value || 0),
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      gender: genderRef.current?.value || '',
      termsAccepted: termsAcceptedRef.current?.checked || false,
      image: imagePreview,
      country: countryRef.current?.value || '',
    };

    try {
      // Validate form data
      await formValidationSchema.validate(formData, { abortEarly: false });

      // If validation passes, dispatch to Redux and navigate to main page
      dispatch(
        addFormSubmission({
          id: uuidv4(),
          ...formData,
          formType: 'uncontrolled',
          timestamp: Date.now(),
        })
      );

      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        const yupError = error as import('yup').ValidationError;
        const newErrors: ValidationErrors = {};

        if (yupError.inner) {
          yupError.inner.forEach((err: import('yup').ValidationError) => {
            newErrors[err.path] = err.message;
          });
        }

        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Uncontrolled Components Form</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            ref={ageRef}
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <div className="error-message">{errors.age}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            onChange={handlePasswordChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
          <div className="password-strength">
            <div className="strength-meter">
              <div
                className="strength-meter-fill"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor:
                    passwordStrength > 3
                      ? '#4caf50'
                      : passwordStrength > 2
                        ? '#d6b100'
                        : '#f44336',
                }}
              ></div>
            </div>
            <div className="strength-text">
              {passwordStrength === 0 && 'No password'}
              {passwordStrength === 1 && 'Very weak'}
              {passwordStrength === 2 && 'Weak'}
              {passwordStrength === 3 && 'Medium'}
              {passwordStrength === 4 && 'Strong'}
              {passwordStrength === 5 && 'Very strong'}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            ref={confirmPasswordRef}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            ref={genderRef}
            className={errors.gender ? 'error' : ''}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <div className="error-message">{errors.gender}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <div className="autocomplete">
            <input
              type="text"
              id="country"
              ref={countryRef}
              onChange={handleCountryInput}
              onFocus={() => handleCountryInput()}
              className={errors.country ? 'error' : ''}
            />
            {showCountryDropdown && filteredCountries.length > 0 && (
              <div className="autocomplete-dropdown">
                {filteredCountries.map((country, index) => (
                  <div
                    key={index}
                    className="autocomplete-item"
                    onClick={() => selectCountry(country)}
                  >
                    {country}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.country && (
            <div className="error-message">{errors.country}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image (PNG or JPEG, max 5MB):</label>
          <input
            type="file"
            id="image"
            ref={imageRef}
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            className={errors.image ? 'error' : ''}
          />
          {errors.image && <div className="error-message">{errors.image}</div>}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="termsAccepted"
            ref={termsAcceptedRef}
            className={errors.termsAccepted ? 'error' : ''}
          />
          <label htmlFor="termsAccepted">
            I accept the Terms and Conditions
          </label>
          {errors.termsAccepted && (
            <div className="error-message">{errors.termsAccepted}</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UncontrolledForm;
