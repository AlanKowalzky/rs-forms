import * as yup from 'yup';

// Password strength regex patterns
const hasNumber = /\d/;
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

// Validation schema for both forms
export const formValidationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter'),

  age: yup
    .number()
    .required('Age is required')
    .positive('Age must be a positive number')
    .integer('Age must be an integer'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test(
      'password-strength',
      'Password must contain at least 1 number',
      (value) => hasNumber.test(value || '')
    )
    .test(
      'password-strength',
      'Password must contain at least 1 uppercase letter',
      (value) => hasUpperCase.test(value || '')
    )
    .test(
      'password-strength',
      'Password must contain at least 1 lowercase letter',
      (value) => hasLowerCase.test(value || '')
    )
    .test(
      'password-strength',
      'Password must contain at least 1 special character',
      (value) => hasSpecialChar.test(value || '')
    ),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),

  termsAccepted: yup
    .boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),

  image: yup
    .mixed<File | string>()
    .test('is-file-or-string', 'Please upload an image', function (value) {
      // Allow null during form initialization, but require a value for submission
      if (this.options.context?.isSubmitting && !value) {
        return false;
      }
      return true;
    })
    .test(
      'is-valid-type',
      'File must be a PNG or JPEG image',
      function (value) {
        if (!value) return true;

        // For File objects (initial upload)
        if (value instanceof File) {
          return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
        }

        // For base64 strings (from Redux store)
        if (typeof value === 'string' && value.startsWith('data:image/')) {
          const mimeType = value.split(';')[0].split(':')[1];
          return ['image/jpeg', 'image/png', 'image/jpg'].includes(mimeType);
        }

        return false;
      }
    )
    .test('is-valid-size', 'File size must be less than 5MB', function (value) {
      if (!value) return true;

      // For File objects (initial upload)
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024; // 5MB
      }

      // For base64 strings, approximate size check
      if (typeof value === 'string') {
        // Rough estimation: base64 string length in bytes / 1.37 gives approximate file size
        const base64WithoutHeader = value.split(',')[1] || value;
        const approximateSize = base64WithoutHeader.length * 0.75;
        return approximateSize <= 5 * 1024 * 1024; // 5MB
      }

      return false;
    }),

  country: yup.string().required('Country is required'),
});

// Helper function to get password strength
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 8) strength += 1;
  if (hasNumber.test(password)) strength += 1;
  if (hasUpperCase.test(password)) strength += 1;
  if (hasLowerCase.test(password)) strength += 1;
  if (hasSpecialChar.test(password)) strength += 1;

  return strength;
};
