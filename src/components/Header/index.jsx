import { Link, useNavigate } from 'react-router-dom'
import './index.css'

const Header = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('jwt_token')
        navigate('/login')
    }

    return (
        <nav className="header">
            <Link to="/">
                <h1 className="logo">Book Hub</h1>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>

                <Link to="/shelf">Bookshelves</Link>

                <button type="button" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Header