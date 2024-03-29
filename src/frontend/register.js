// register.js
import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Basic frontend validations
    if (formData.username.length < 5) {
      formErrors.username = 'Username must be at least 5 characters';
    }
  
    if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }
  
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
  
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      formErrors.email = 'Invalid email address';
    }
  
    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must be 11 digits';
    }
  
    if (Object.keys(formErrors).length === 0) {
      // If no errors, send data to backend
      try {
        const response = await fetch('http://localhost:8000/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log response from the backend
          // handle successful response
          alert('User registered successfully!');
        } else {
          // handle unsuccessful response
          alert('ERROR! User registration unsuccessful!');
        }
      } catch (error) {
        console.error('Error:', error);
        // handle error
        alert('ERROR! User registration unsuccessful!');
      }
    } else {
      console.log('Form validation errors:', formErrors);
      setErrors(formErrors);
    }
  };
  

  return (
    <div className="App">
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
