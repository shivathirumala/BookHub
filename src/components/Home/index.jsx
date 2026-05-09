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

const Home = () => {
    const [books, setBooks] = useState([])
    const [status, setStatus] = useState(apiStatus.initial)

    useEffect(() => {
        getBooks()
    }, [])

    const navigate = useNavigate()

    const getBooks = async () => {
        setStatus(apiStatus.loading)

        const token = localStorage.getItem('jwt_token')

        if (!token) {
            navigate('/login', { replace: true })
            return
        }

        const response = await fetch(
            'https://apis.ccbp.in/book-hub/top-rated-books',
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

    const renderSuccessView = () => {
        if (books.length === 0) {
            return <p className="no-books-message">No books available right now.</p>
        }

        return (
            <div className="books-list">
                {books.map(each => (
                    <Link to={`/books/${each.id}`} key={each.id} className="book-link">
                        <div className="book-card">
                            <img
                                src={each.cover_pic || each.image_url}
                                alt={each.title}
                                className="book-img"
                            />
                            <div className="book-meta">
                                <h3>{each.title}</h3>
                                <p>{each.author_name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )
    }

    const renderView = () => {
        switch (status) {
            case apiStatus.loading:
                return <LoaderView />

            case apiStatus.success:
                return renderSuccessView()

            case apiStatus.failure:
                return <FailureView retry={getBooks} />

            default:
                return null
        }
    }

    return (
        <>
            <Header />

            <div className="home-container">
                <div className="home-top">
                    <h1>Find Your Next Favorite Books?</h1>

                    <Link to="/shelf">
                        <button type="button">Find Books</button>
                    </Link>
                </div>

                <div className="slider-container">
                    <h2>Top Rated Books</h2>

                    {renderView()}
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Home