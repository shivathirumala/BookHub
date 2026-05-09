import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

const bookshelvesList = [
  { id: '1', value: 'ALL', label: 'All' },
  { id: '2', value: 'READ', label: 'Read' },
  { id: '3', value: 'CURRENTLY_READING', label: 'Currently Reading' },
  { id: '4', value: 'WANT_TO_READ', label: 'Want to Read' },
]

const Bookshelves = () => {
  const [books, setBooks] = useState([])
  const [status, setStatus] = useState(apiStatus.initial)
  const [activeShelf, setActiveShelf] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    getBooks()
  }, [activeShelf])

  const getBooks = async () => {
    setStatus(apiStatus.loading)
    const token = localStorage.getItem('jwt_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const response = await fetch(
      `https://apis.ccbp.in/book-hub/books?shelf=${activeShelf}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.ok) {
      const data = await response.json()
      setBooks(data.books)
      setStatus(apiStatus.success)
    } else if (response.status === 401) {
      localStorage.removeItem('jwt_token')
      navigate('/login', { replace: true })
    } else {
      setStatus(apiStatus.failure)
    }
  }

  const renderBooksView = () => (
    <ul className="books-grid">
      {books.map(each => (
        <li key={each.id}>
          <Link to={`/books/${each.id}`}>
            <img
              src={each.cover_pic || each.image_url}
              alt={each.title}
              className="shelf-book-img"
            />
          </Link>
          <h4>{each.title}</h4>
          <p>{each.author_name}</p>
          <p className="avg-rating">Avg Rating {each.avg_rating}</p>
        </li>
      ))}
    </ul>
  )

  const renderView = () => {
    switch (status) {
      case apiStatus.loading:
        return <LoaderView />
      case apiStatus.success:
        return renderBooksView()
      case apiStatus.failure:
        return <FailureView retry={getBooks} />
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="bookshelves-container">
        <div className="shelves-filter">
          {bookshelvesList.map(each => (
            <button
              key={each.id}
              type="button"
              onClick={() => setActiveShelf(each.value)}
              className={`shelf-button ${
                activeShelf === each.value ? 'active-shelf' : ''
              }`}
            >
              {each.label}
            </button>
          ))}
        </div>
        <div className="shelves-books-container">{renderView()}</div>
      </div>
      <Footer />
    </>
  )
}

export default Bookshelves
