import { useEffect, useState, useContext } from 'react'

import Cookies from 'js-cookie'

import { Link } from 'react-router-dom'

import { BsFillStarFill } from 'react-icons/bs'

import { CartContext } from '../../context/CartContext'

import Header from '../Header'

import LoaderView from '../LoaderView'

import './index.css'

const Home = () => {
    const [books, setBooks] = useState([])

    const [search, setSearch] = useState('')

    const [loading, setLoading] = useState(true)

    const { addToCart, increaseQuantity, decreaseQuantity, getQuantity } =
        useContext(CartContext)

    useEffect(() => {
        getBooks()
    }, [])

    const getBooks = async () => {
        setLoading(true)

        const jwtToken = Cookies.get('jwt_token')

        const response = await fetch(
            `https://apis.ccbp.in/book-hub/books?shelf=ALL&search=${search}`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            },
        )

        const data = await response.json()

        if (response.ok) {
            setBooks(data.books)

            setLoading(false)
        }
    }

    const searchBooks = () => {
        getBooks()
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
        return <LoaderView />
    }

    return (
        <>
            <Header />

            <div className="home-container">
                <div className="search-container">
                    <input
                        type="search"
                        placeholder="Search Books"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <button onClick={searchBooks}>Search</button>
                </div>

                <div className="books-container">
                    {books.map(each => {
                        const quantity = getQuantity(each.id)

                        return (
                            <div className="book-card" key={each.id}>
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
                                        onClick={() => addToCart(each)}
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
        </>
    )
}

export default Home