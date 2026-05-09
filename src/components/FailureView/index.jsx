import './index.css'

const FailureView = ({ retry }) => (
    <div className="failure-container">
        <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
            alt="failure view"
            className="failure-img"
        />

        <h1>Something Went Wrong</h1>

        <button type="button" onClick={retry}>
            Try Again
        </button>
    </div>
)

export default FailureView