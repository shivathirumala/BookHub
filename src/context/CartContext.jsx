import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems')
        if (storedCart) {
            setCartItems(JSON.parse(storedCart))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = book => {
        const existingBook = cartItems.find(each => each.id === book.id)

        if (existingBook) {
            setCartItems(
                cartItems.map(each =>
                    each.id === book.id
                        ? { ...each, quantity: each.quantity + 1 }
                        : each,
                ),
            )
        } else {
            const newBook = {
                ...book,
                quantity: 1,
                price: 499,
            }

            setCartItems([...cartItems, newBook])
        }
    }

    const increaseQuantity = id => {
        setCartItems(
            cartItems.map(each =>
                each.id === id
                    ? { ...each, quantity: each.quantity + 1 }
                    : each,
            ),
        )
    }

    const decreaseQuantity = id => {
        const updated = cartItems
            .map(each =>
                each.id === id
                    ? { ...each, quantity: each.quantity - 1 }
                    : each,
            )
            .filter(each => each.quantity > 0)

        setCartItems(updated)
    }

    const getQuantity = id => {
        const item = cartItems.find(each => each.id === id)

        return item ? item.quantity : 0
    }

    const removeCartItem = id => {
        setCartItems(cartItems.filter(each => each.id !== id))
    }

    const clearCart = () => {
        setCartItems([])
    }

    const cartCount = cartItems.reduce(
        (total, each) => total + each.quantity,
        0,
    )

    const totalPrice = cartItems.reduce(
        (total, each) => total + each.quantity * each.price,
        0,
    )

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                getQuantity,
                removeCartItem,
                clearCart,
                cartCount,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider