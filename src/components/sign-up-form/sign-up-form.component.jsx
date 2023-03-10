import { useState } from 'react'
import FormInput from '../form-input/form-input.component'
import Button from '../button/button.component'
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils'
import { SignUpContainer } from './sign-up-form.styles'

// Create an empty object with the default form values (empty strings)
const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

// Form component with sign up methods
const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { displayName, email, password, confirmPassword } = formFields

  // Reset form fields after submit
  const resetFormFields = () => {
    setFormFields(defaultFormFields)
  }
  // Submit methods
  const handleSubmit = async event => {
    event.preventDefault()
    // Check if passwords match, alert and return if not
    if (password !== confirmPassword) {
      alert('Sign up failed! Please match your passwords.')
      return
    }
    // Create user auth object with the received information from the below function which in turn triggers the google method and returns
    try {
      const { user } = await createAuthUserWithEmailAndPassword(email, password)
      await createUserDocumentFromAuth(user, { displayName })
      // Reset form fields after submit
      resetFormFields()
    } catch (error) {
      // Alert user if sign up failed
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('Sign up failed! Email address already in use.')
          break
        case 'auth/invalid-email':
          alert('Sign up failed! Email address is invalid.')
          break
        case 'auth/weak-password':
          alert('Sign up failed! Password is too weak. Insert at least 6 characters.')
          break
        default:
          console.log(error.code)
      }
    }
  }

  // Get the typed information from form fields
  const handleChange = event => {
    // When the user types something in the input field, we get the value and the key (name) from the event.target
    const { name, value } = event.target
    // Set the formfields object by spreading it and then dinamically changing the [key], which in turn becomes displayname, email, etc. and give it the value from the input (by event.targer)
    setFormFields({ ...formFields, [name]: value })
  }

  // Sign-up form
  return (
    <SignUpContainer>
      <h2>Don't have an account?</h2>
      <span>sign up with email and password</span>
      <form onSubmit={handleSubmit}>
        {/* Use the FormInput component with props to crate html input */}
        <FormInput
          label='display name'
          type='text'
          required
          onChange={handleChange}
          name='displayName'
          value={displayName}
        />
        {/* The value is passed not by the input, but by the handlechange function */}
        <FormInput
          label='email'
          type='email'
          required
          onChange={handleChange}
          name='email'
          value={email}
        />
        <FormInput
          label='password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />
        <FormInput
          label='confirm pasword'
          type='password'
          required
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
        />
        <Button type='submit'>sign up</Button>
      </form>
    </SignUpContainer>
  )
}

export default SignUpForm
