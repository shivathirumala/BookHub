import {
    FaGoogle,
    FaTwitter,
    FaInstagram,
    FaYoutube,
} from 'react-icons/fa'

import './index.css'

const Footer = () => (
    <div className="footer">
        <div className="icons">
            <FaGoogle />
            <FaTwitter />
            <FaInstagram />
            <FaYoutube />
        </div>

        <p>Contact Us</p>
    </div>
)

export default Footer