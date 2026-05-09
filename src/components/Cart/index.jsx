import { useContext, useState } from 'react'

import { ThreeDots } from 'react-loader-spinner'

import { CartContext } from '../../context/CartContext'

import Header from '../Header'

import './index.css'

const Cart = () => {
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeCartItem,
        totalPrice,
        clearCart,
    } = useContext(CartContext)

    const [showPayment, setShowPayment] = useState(false)

    const [selectedMethod, setSelectedMethod] = useState('')

    const [paymentStatus, setPaymentStatus] = useState('')

    const [loading, setLoading] = useState(false)

    const processPayment = () => {
        if (selectedMethod === '') {
            alert('Please select payment method')

            return
        }

        setLoading(true)

        setPaymentStatus('')

        setTimeout(() => {
            const success = Math.random() < 0.7

            setLoading(false)

            if (success) {
                setPaymentStatus('success')

                clearCart()
            } else {
                setPaymentStatus('failed')
            }
        }, 3000)
    }

    return (
        <>
            <Header />

            <div className="cart-container">
                <h1>My Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your Cart is Empty</h2>
                    </div>
                ) : (
                    <>
                        {cartItems.map(each => (
                            <div className="cart-item" key={each.id}>
                                <img src={each.cover_pic} alt={each.title} />

                                <div className="cart-details">
                                    <h2>{each.title}</h2>

                                    <p>{each.author_name}</p>

                                    <h3>₹{each.price}</h3>

                                    <div className="quantity-container">
                                        <button
                                            onClick={() => decreaseQuantity(each.id)}
                                        >
                                            -
                                        </button>

                                        <p>{each.quantity}</p>

                                        <button
                                            onClick={() => increaseQuantity(each.id)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <h3>
                                        Total: ₹{each.quantity * each.price}
                                    </h3>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeCartItem(each.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="cart-summary">
                            <h2>Grand Total: ₹{totalPrice}</h2>

                            <button
                                className="payment-btn"
                                onClick={() => setShowPayment(true)}
                            >
                                Proceed Payment
                            </button>
                        </div>
                    </>
                )}

                {showPayment && (
                    <div className="payment-overlay">
                        <div className="payment-modal">
                            <button
                                className="close-btn"
                                onClick={() => setShowPayment(false)}
                            >
                                ✖
                            </button>

                            <h2>Select Payment Method</h2>

                            <div className="payment-options">
                                <label>
                                    <input
                                        type="radio"
                                        value="UPI"
                                        checked={selectedMethod === 'UPI'}
                                        onChange={e =>
                                            setSelectedMethod(e.target.value)
                                        }
                                    />
                                    UPI
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="Credit Card"
                                        checked={
                                            selectedMethod === 'Credit Card'
                                        }
                                        onChange={e =>
                                            setSelectedMethod(e.target.value)
                                        }
                                    />
                                    Credit Card
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="Debit Card"
                                        checked={
                                            selectedMethod === 'Debit Card'
                                        }
                                        onChange={e =>
                                            setSelectedMethod(e.target.value)
                                        }
                                    />
                                    Debit Card
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="Net Banking"
                                        checked={
                                            selectedMethod === 'Net Banking'
                                        }
                                        onChange={e =>
                                            setSelectedMethod(e.target.value)
                                        }
                                    />
                                    Net Banking
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="Cash On Delivery"
                                        checked={
                                            selectedMethod === 'Cash On Delivery'
                                        }
                                        onChange={e =>
                                            setSelectedMethod(e.target.value)
                                        }
                                    />
                                    Cash On Delivery
                                </label>
                            </div>

                            {loading ? (
                                <div className="loader-container">
                                    <ThreeDots
                                        height="60"
                                        width="60"
                                        color="#0284c7"
                                    />

                                    <p>Processing Payment...</p>
                                </div>
                            ) : (
                                <button
                                    className="confirm-btn"
                                    onClick={processPayment}
                                >
                                    Confirm Payment
                                </button>
                            )}

                            {paymentStatus === 'success' && (
                                <div className="success-msg">
                                    Payment Successful ✅
                                </div>
                            )}

                            {paymentStatus === 'failed' && (
                                <div className="failed-msg">
                                    Payment Failed ❌

                                    <button
                                        className="retry-btn"
                                        onClick={processPayment}
                                    >
                                        Retry Payment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Cart