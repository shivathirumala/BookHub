import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Bookshelves from './components/Bookshelves'
import BookDetails from './components/BookDetails'
import Cart from './components/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />

    <Route
      path="/shelf"
      element={
        <ProtectedRoute>
          <Bookshelves />
        </ProtectedRoute>
      }
    />

    <Route
      path="/books/:id"
      element={
        <ProtectedRoute>
          <BookDetails />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/not-found" />} />
  </Routes>
)

export default App