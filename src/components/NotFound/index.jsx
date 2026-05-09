import { Link } from 'react-router-dom'
import './index.css'

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png"
          alt="not found"
          className="not-found-img"
        />
        <h2>Page Not Found</h2>
        <p>We can't seem to find the page you're looking for.</p>
        <Link to="/">
          <button type="button" className="home-btn">Go to Home</button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
