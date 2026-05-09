import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BsStarFill } from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
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
            <div className="rating-section">
              <p className="avg-rating">
                {avg_rating}
                <BsStarFill className="star-icon" />
              </p>
              <p className="rating-count">{rating_count} Ratings</p>
            </div>
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
