import { ThreeDots } from 'react-loader-spinner'

const LoaderView = () => (
    <div data-testid="loader">
        <ThreeDots
            height="50"
            width="50"
            radius="9"
            color="#0284c7"
            ariaLabel="three-dots-loading"
            visible
        />
    </div>
)

export default LoaderView