import { useEffect, useState, useContext } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { BsFillStarFill } from 'react-icons/bs'

import Header from '../Header'

import LoaderView from '../LoaderView'

import { CartContext } from '../../context/CartContext'

import './index.css'

const bookshelvesList = [
    {
        id: '1',
        value: 'ALL',
        label: 'All',
    },
    {
        id: '2',
        value: 'READ',
        label: 'Read',
    },
    {
        id: '3',
        value: 'CURRENTLY_READING',
        label: 'Currently Reading',
    },
    {
        id: '4',
        value: 'WANT_TO_READ',
        label: 'Want To Read',
    },
]

const Bookshelves = () => {
    const [books, setBooks] = useState([])
    const [activeShelf, setActiveShelf] = useState('ALL')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { addToCart, increaseQuantity, decreaseQuantity, getQuantity } =
        useContext(CartContext)

    useEffect(() => {
        getBooks()
    }, [activeShelf])

    const getBooks = async () => {
        setLoading(true)
        setError(null)

        const jwtToken = localStorage.getItem('jwt_token')

        if (!jwtToken) {
            navigate('/login', { replace: true })
            return
        }

        try {
            const response = await fetch(
                `https://apis.ccbp.in/book-hub/books?shelf=${activeShelf}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            )

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('jwt_token')
                    navigate('/login', { replace: true })
                    return
                }
                throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            setBooks(data.books || [])
            setLoading(false)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const renderStars = rating => {
        const rounded = Math.round(rating)

        return Array.from({ length: rounded }, (_, index) => (
            <BsFillStarFill
                key={index}
                className="star-icon"
            />
        ))
    }

    if (loading) {
        return (
            <>
                <Header />
                <LoaderView />
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="error-container">
                    <p>Error loading books: {error}</p>
                    <button onClick={getBooks}>Retry</button>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />

            <div className="bookshelves-container">
                <div className="sidebar">
                    <h2>Bookshelves</h2>

                    {bookshelvesList.map(each => (
                        <button
                            key={each.id}
                            className={
                                activeShelf === each.value
                                    ? 'active-shelf'
                                    : 'shelf-btn'
                            }
                            onClick={() =>
                                setActiveShelf(each.value)
                            }
                        >
                            {each.label}
                        </button>
                    ))}
                </div>

                <div className="books-section">
                    <div className="search-container">
                        <input
                            type="search"
                            placeholder="Search Books"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        <button onClick={getBooks}>
                            Search
                        </button>
                    </div>

                    <div className="books-container">
                        {books.map(each => {
                            const quantity = getQuantity(each.id)

                            return (
                                <div
                                    className="book-card"
                                    key={each.id}
                                >
                                    <Link
                                        to={`/books/${each.id}`}
                                        className="book-link"
                                    >
                                        <img
                                            src={each.cover_pic}
                                            alt={each.title}
                                        />

                                        <h3>{each.title}</h3>

                                        <p>{each.author_name}</p>

                                        <div className="rating-container">
                                            {renderStars(each.rating)}
                                        </div>

                                        <h2 className="price">
                                            ₹499
                                        </h2>
                                    </Link>

                                    {quantity === 0 ? (
                                        <button
                                            className="cart-btn"
                                            onClick={() =>
                                                addToCart(each)
                                            }
                                        >
                                            Add To Cart
                                        </button>
                                    ) : (
                                        <div className="quantity-box">
                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(each.id)
                                                }
                                            >
                                                -
                                            </button>

                                            <p>{quantity}</p>

                                            <button
                                                onClick={() =>
                                                    increaseQuantity(each.id)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Bookshelves