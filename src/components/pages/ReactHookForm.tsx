import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store';
import { addFormSubmission } from '../../store/formsSlice';
import { formValidationSchema, getPasswordStrength } from '../../utils/validationSchema';
import '../../styles/Form.css';

interface FormInputs {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  termsAccepted: boolean;
  image: FileList | string | null;
  country: string;
}

const ReactHookFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.list);
  
  // State for filtered countries, password strength, and image preview
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // React Hook Form setup with yup resolver
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<FormInputs>({
    resolver: yupResolver(formValidationSchema),
    mode: 'onChange', // Enable live validation
  });
  
  // Watch password field for strength meter
  const password = watch('password', '');
  
  // Update password strength when password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strength = getPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };
  
  // Handle country input for autocomplete
  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    if (input.length > 0) {
      const filtered = countries.filter(country => 
        country.toLowerCase().includes(input)
      );
      setFilteredCountries(filtered);
      setShowCountryDropdown(true);
    } else {
      setFilteredCountries([]);
      setShowCountryDropdown(false);
    }
  };
  
  // Select country from dropdown
  const selectCountry = (country: string) => {
    setValue('country', country, { shouldValidate: true });
    setShowCountryDropdown(false);
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Form submission handler
  const onSubmit = (data: FormInputs) => {
    // Dispatch to Redux and navigate to main page
    dispatch(addFormSubmission({
      id: uuidv4(),
      ...data,
      image: imagePreview,
      formType: 'react-hook-form',
      timestamp: Date.now(),
    }));
    
    navigate('/');
  };
  
  return (
    <div className="form-container">
      <h1>React Hook Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            {...register('name')} 
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input 
            type="number" 
            id="age" 
            {...register('age', { valueAsNumber: true })} 
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <div className="error-message">{errors.age.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            {...register('email')} 
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            {...register('password')} 
            onChange={(e) => {
              register('password').onChange(e);
              handlePasswordChange(e);
            }}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <div className="error-message">{errors.password.message}</div>}
          <div className="password-strength">
            <div className="strength-meter">
              <div 
                className="strength-meter-fill" 
                style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: passwordStrength > 3 ? '#4caf50' : passwordStrength > 2 ? '#ffeb3b' : '#f44336' }}
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
            {...register('confirmPassword')} 
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select 
            id="gender" 
            {...register('gender')} 
            className={errors.gender ? 'error' : ''}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <div className="error-message">{errors.gender.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <div className="autocomplete">
            <input 
              type="text" 
              id="country" 
              {...register('country')} 
              onChange={(e) => {
                register('country').onChange(e);
                handleCountryInput(e);
              }}
              onFocus={() => handleCountryInput({ target: { value: watch('country') } } as React.ChangeEvent<HTMLInputElement>)}
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
          {errors.country && <div className="error-message">{errors.country.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Upload Image (PNG or JPEG, max 5MB):</label>
          <input 
            type="file" 
            id="image" 
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              register('image').onChange(e);
              handleImageChange(e);
            }}
            className={errors.image ? 'error' : ''}
          />
          {errors.image && <div className="error-message">{errors.image.message}</div>}
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
            {...register('termsAccepted')} 
            className={errors.termsAccepted ? 'error' : ''}
          />
          <label htmlFor="termsAccepted">I accept the Terms and Conditions</label>
          {errors.termsAccepted && <div className="error-message">{errors.termsAccepted.message}</div>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!isValid}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReactHookFormPage;