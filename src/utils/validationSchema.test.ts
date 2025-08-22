import { describe, it, expect } from 'vitest';
import { formValidationSchema, getPasswordStrength } from './validationSchema';

describe('formValidationSchema', () => {
  // Name validation
  it('should require a name', async () => {
    await expect(formValidationSchema.validateAt('name', { name: '' })).rejects.toThrow('Name is required');
  });

  it('should require name to start with an uppercase letter', async () => {
    await expect(formValidationSchema.validateAt('name', { name: 'john' })).rejects.toThrow('Name must start with an uppercase letter');
  });

  it('should accept a valid name', async () => {
    await expect(formValidationSchema.validateAt('name', { name: 'John' })).resolves.toBe('John');
  });

  // Age validation
  it('should require an age', async () => {
    await expect(formValidationSchema.validateAt('age', { age: undefined })).rejects.toThrow('Age is required');
  });

  it('should require age to be a positive number', async () => {
    await expect(formValidationSchema.validateAt('age', { age: -5 })).rejects.toThrow('Age must be a positive number');
  });

  it('should accept a valid age', async () => {
    await expect(formValidationSchema.validateAt('age', { age: 25 })).resolves.toBe(25);
  });

  // Email validation
  it('should require an email', async () => {
    await expect(formValidationSchema.validateAt('email', { email: '' })).rejects.toThrow('Email is required');
  });

  it('should require a valid email format', async () => {
    await expect(formValidationSchema.validateAt('email', { email: 'invalid-email' })).rejects.toThrow('Invalid email format');
  });

  it('should accept a valid email', async () => {
    await expect(formValidationSchema.validateAt('email', { email: 'test@example.com' })).resolves.toBe('test@example.com');
  });

  // Password validation
  it('should require a password', async () => {
    await expect(formValidationSchema.validateAt('password', { password: '' })).rejects.toThrow('Password is required');
  });

  it('should require password to be at least 8 characters', async () => {
    await expect(formValidationSchema.validateAt('password', { password: 'short' })).rejects.toThrow('Password must be at least 8 characters');
  });

  it('should require password to have a number', async () => {
    await expect(formValidationSchema.validateAt('password', { password: 'PasswordWithoutNumber!' })).rejects.toThrow('Password must contain at least 1 number');
  });
    
  it('should accept a valid password', async () => {
    await expect(formValidationSchema.validateAt('password', { password: 'Password123!' })).resolves.toBe('Password123!');
  });

  // Confirm Password validation
  it('should require a confirm password', async () => {
    await expect(formValidationSchema.validateAt('confirmPassword', { password: 'Password123!', confirmPassword: '' })).rejects.toThrow('Passwords must match');
  });

  it('should require passwords to match', async () => {
    await expect(formValidationSchema.validateAt('confirmPassword', { password: 'Password123!', confirmPassword: 'Password123' })).rejects.toThrow('Passwords must match');
  });

  it('should accept matching passwords', async () => {
    await expect(formValidationSchema.validateAt('confirmPassword', { password: 'Password123!', confirmPassword: 'Password123!' })).resolves.toBe('Password123!');
  });

  // Country validation
  it('should require a country', async () => {
    await expect(formValidationSchema.validateAt('country', { country: '' })).rejects.toThrow('Country is required');
  });

  it('should accept a valid country', async () => {
    await expect(formValidationSchema.validateAt('country', { country: 'Poland' })).resolves.toBe('Poland');
  });
});

describe('getPasswordStrength', () => {
  it('should return 0 for an empty password', () => {
    expect(getPasswordStrength('')).toBe(0);
  });

  it('should return 1 for a password with only length requirement met', () => {
    expect(getPasswordStrength('password')).toBe(2);
  });

  it('should return 5 for a strong password', () => {
    expect(getPasswordStrength('Password123!')).toBe(5);
  });
});