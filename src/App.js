import { useEffect, lazy, Suspense } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { GlobalStyle } from './global.styles'
import { setCurrentUser } from './store/user/user.reducer'
import Spinner from './components/spinner/spinner.component'
import ProtectedRoute from './utils/protected-route/protected-route.utils'
import NotFound from './routes/not-found/not-found.component'
import Search from './routes/search/search.component'
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from './utils/firebase/firebase.utils'

const Home = lazy(() => import('./routes/home/home.component'))
const Navigation = lazy(() =>
  import('./routes/navigation/navigation.component')
)
const Authentication = lazy(() =>
  import('./routes/authentication/authentication.component')
)
const Shop = lazy(() => import('./routes/shop/shop.component'))
const Checkout = lazy(() => import('./routes/checkout/checkout.component'))

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(user => {
      if (user) {
        createUserDocumentFromAuth(user)
      }
      console.log(setCurrentUser(user))
      dispatch(setCurrentUser(user))
    })
    return unsubscribe
  }, [])

  return (
    <Suspense fallback={<Spinner />}>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path='search' element={<Search />} />
          <Route path='shop/*' element={<Shop />} />
          <Route element={<ProtectedRoute />}>
            <Route path='auth' element={<Authentication />} />
          </Route>
          <Route path='checkout' element={<Checkout />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
// Routes enables react route use
// Route enables one route
// <Route path='/' element={<Home />} /> means render the Home element when the path "/" is matched
// Index matches the '/' of the parent route; in this case we make the nav bar appear on every route
// The /* in path means that there will be another path after that one

export default App
