import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BsFillStarFill } from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import { CartContext } from '../../context/CartContext'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const BookDetails = () => {
  const { id } = useParams()
  const [book, setBook] = useState({})
  const [status, setStatus] = useState(apiStatus.initial)
  const navigate = useNavigate()
  const { addToCart, increaseQuantity, decreaseQuantity, getQuantity } =
    useContext(CartContext)

  useEffect(() => {
    getBookDetails()
  }, [id])

  const getBookDetails = async () => {
    setStatus(apiStatus.loading)
    const token = localStorage.getItem('jwt_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const response = await fetch(
      `https://apis.ccbp.in/book-hub/books/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.ok) {
      const data = await response.json()
      setBook(data.book_details)
      setStatus(apiStatus.success)
    } else if (response.status === 401) {
      localStorage.removeItem('jwt_token')
      navigate('/login', { replace: true })
    } else {
      setStatus(apiStatus.failure)
    }
  }

  const renderStars = rating => {
    const rounded = Math.round(rating)

    return Array.from({ length: rounded }, (_, index) => (
      <BsFillStarFill key={index} className="star-icon" />
    ))
  }

  const renderBookDetails = () => {
    const {
      cover_pic,
      title,
      author_name,
      avg_rating,
      about_book,
      pages,
      about_author,
      publication_date,
      rating_count,
    } = book

    return (
      <div className="book-details-container">
        <div className="book-details-header">
          <img src={cover_pic || book.image_url} alt={title} className="detail-book-img" />
          <div className="book-info">
            <h1>{title}</h1>
            <p className="author">by {author_name}</p>
            <div className="detail-cart-row">
              {getQuantity(book.id) === 0 ? (
                <button
                  className="detail-cart-btn"
                  type="button"
                  onClick={() => addToCart(book)}
                >
                  Add To Cart
                </button>
              ) : (
                <div className="detail-quantity-box">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(book.id)}
                  >
                    -
                  </button>
                  <p>{getQuantity(book.id)}</p>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(book.id)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <div className="rating-section">
              <div className="rating-stars">{renderStars(avg_rating)}</div>
              <p className="avg-rating">{avg_rating}</p>
              <p className="rating-count">{rating_count} Ratings</p>
            </div>
            <h2 className="detail-price">₹499</h2>
            <p className="about-section-label">About the Book:</p>
            <p className="about-book">{about_book}</p>
          </div>
        </div>

        <div className="book-details-extra">
          <div className="detail-item">
            <p className="detail-label">Author Name</p>
            <p className="detail-value">{author_name}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Total Pages</p>
            <p className="detail-value">{pages}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Publication Date</p>
            <p className="detail-value">{publication_date}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">About Author</p>
            <p className="detail-value">{about_author}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (status) {
      case apiStatus.loading:
        return <LoaderView />
      case apiStatus.success:
        return renderBookDetails()
      case apiStatus.failure:
        return <FailureView retry={getBookDetails} />
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="book-detail-page-container">{renderView()}</div>
      <Footer />
    </>
  )
}

export default BookDetails
