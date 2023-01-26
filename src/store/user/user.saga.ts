import { all, call, put, takeLatest } from 'typed-redux-saga/macro'
import { User } from 'firebase/auth'
import { USER_ACTION_TYPES } from './user.types'
import {
  signInSuccess,
  signInFailed,
  signUpSuccess,
  signUpFailed,
  signOutFailed,
  signOutSuccess,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess
} from './user.action'
import {
  getCurrentUser,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser,
  AdditionalInformation,
} from '../../utils/firebase/firebase.utils'

// Called by the isUserAuthenticated, checks if there is a userSnapshopt for the userAuth that it receives; if it isn't it'll make one, either way we have the userSnapshot
export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalDetails?: AdditionalInformation
) {
  try {
    // Create the user snapshop by yield* calling the createUserDocumentFromAuth with the userAuth and additionalDetails parameters (that's how we write parameters when calling functions in redux saga)
    const userSnapshot = yield* call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    )
    // Extract the id from userSnapshot and add it to userSnapshot.data
    if (userSnapshot)
      yield* put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }))
  } catch (error) {
    yield* put(signInFailed(error as Error))
  }
}

// Called by onCheckUserSession and check if the user is authenticated
export function* isUserAuthenticated() {
  try {
    // Yield* call the getCurrentUser, which gets the userAuth if it exists
    const userAuth = yield* call(getCurrentUser)
    if (!userAuth) return
    // Once we have the userAuth from above, pass it to the getSnapshotFromUserAuth and yield* call it
    yield* call(getSnapshotFromUserAuth, userAuth)
  } catch (error) {
    yield* put(signInFailed(error as Error))
  }
}

// Sign in with google pop up
export function* signInWithGoogle() {
  try {
    // Trigger google sign in pop up, take auth object, pull of the user
    const { user } = yield* call(signInWithGooglePopup)
    // Run user through getSnapshot
    yield* call(getSnapshotFromUserAuth, user)
  } catch (error) {
    yield* put(signInFailed(error as Error))
  }
}

export function* signInWithEmail({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    const userCredential = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    )
    if (userCredential) {
      const {user} = userCredential
      yield* call(getSnapshotFromUserAuth, user)
    }
  } catch (error) {
    yield* put(signInFailed(error as Error))
  }
}

export function* signUp({ payload: { email, password, displayName } }: SignUpStart) {
  try {
    const userCredential = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    )
    if (userCredential) {
      const { user } = userCredential
      yield* put(signUpSuccess(user, { displayName }))
    }
  } catch (error) {
    yield* put(signUpFailed(error as Error))
  }
}

export function* signInAfterSignUp({ payload: { user, additionalDetails } }: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails)
}

export function* signOut() {
  try {
    yield* call(signOutUser)
    yield* call(signOutSuccess)
  } catch (error) {
    yield* put(signOutFailed(error as Error))
  }
}

export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle)
}

//  Saga which is listening to the check user session action type (called by checkUserSession) and when it's heard, it calls the isUserAuthenticated function
export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated)
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail)
}

export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp)
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp)
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut)
}

export function* userSagas() {
  yield* all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOutStart),
  ])
}