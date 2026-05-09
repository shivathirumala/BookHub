import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'

import { CartContext } from '../../context/CartContext'

import './index.css'

const Header = () => {
    const navigate = useNavigate()

    const { cartCount } = useContext(CartContext)

    const logout = () => {
        Cookies.remove('jwt_token')

        navigate('/login')
    }

    return (
        <nav className="header">
            <Link to="/" className="logo-link">
                <h1 className="logo">Book Hub</h1>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>

                <Link to="/shelf">Bookshelves</Link>

                <Link to="/cart" className="cart-link">
                    🛒 Cart

                    {cartCount > 0 && (
                        <span className="cart-badge">
                            {cartCount}
                        </span>
                    )}
                </Link>

                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Header