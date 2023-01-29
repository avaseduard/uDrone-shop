import { USER_ACTION_TYPES } from './user.types'

export const INITIAL_STATE = {
  currentUser: null,
  isLoading: false,
  error: null,
}

// The default value of the state is the INITIAL_STATE, which is valid for when the function is run for the first time; the reducer gets triggered every single time there's an action, even in another reducer, like the cart reducer (that's how redux works), that's why we need to set the default action to return the previous state if none of the cases meet the type; the userReducer returns an object made out of state and payload
export const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case USER_ACTION_TYPES.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: payload,
      }
    case USER_ACTION_TYPES.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
      }
    case USER_ACTION_TYPES.SIGN_UP_FAILED:
    case USER_ACTION_TYPES.SIGN_IN_FAILED:
    case USER_ACTION_TYPES.SIGN_OUT_FAILED:
      return {
        ...state,
        error: payload,
      }
    default:
      return state
  }
}