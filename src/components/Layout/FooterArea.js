import React from 'react'
import './../../styles/FooterArea.css';
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp} from "react-icons/fa"




function FooterArea() {
  return (
    <>
        <div>
        <div className="footer-area">
            <div className="container">
                <div className="row"> 
                    <div className="col-md-3">
                        <h4 className="footer-heading">Let's Shop Hear</h4>
                        <div className="footer-underline"></div>
                        <p>
                            This is E-commerce Website for selling All type Clothe's. Under Best  Market Price.<br>
                            </br>
                            My cart is a web application that allows users to add items into their shopping cart and then purchase them through the Stripe API.
                            My cart is a ecommerce website that allows you to buy  products online,
                            and also buy them through the same platform.<br></br>
                        </p>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-heading">Quick Links</h4>
                        <div className="footer-underline"></div>
                        <div className="mb-2"><Link to="/" className="text-white">Home</Link></div>
                        <div className="mb-2"><Link to="/about" className="text-white">About Us</Link></div>
                        <div className="mb-2"><Link to="/contact" className="text-white">Contact Us</Link></div>
                        <div className="mb-2"><Link to="/policy" className="text-white">Provacy Policy</Link></div>
                        <div className="mb-2"><Link to="/blogs" className="text-white">Blogs</Link></div>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-heading">Shop Now</h4>
                        <div className="footer-underline"></div>
                        <div className="mb-2"><Link to="/products" className="text-white">Collections</Link></div>
                        <div className="mb-2"><Link to="/products" className="text-white">Trending Products</Link></div>
                        <div className="mb-2"><Link to="/products" className="text-white">New Arrivals Products</Link></div>
                        <div className="mb-2"><Link to="/products" className="text-white">Featured Products</Link></div>
                        <div className="mb-2"><Link to="cart" className="text-white">Cart</Link></div>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-heading">Reach Us</h4>
                        <div className="footer-underline"></div>
                        <div className="mb-2">
                            <p>
                                <i className="fa fa-map-marker"></i> Sector 24, Rohani, New Delhi ,India
                            </p>
                        </div>
                        <div className="mb-2">
                            <a href="/" className="text-white">
                                <i className="fa fa-phone"></i> +91 100000000
                            </a>
                        </div>
                        
                        <div className="mb-2">
                            <a href="/" className="text-white">
                                <i className="fa fa-envelope"></i> letsshop@gmail.com
                            </a>
                        </div>
                        <span className='text-bold'>
                        <span className='social-Icons'>
                            <Link to="/" ><FaFacebook size={16} className='icon' /></Link>
                            <Link to="/" ><FaTwitter size={16} className='icon' /></Link>
                            <Link to="/" ><FaInstagram size={16}  className='icon'/></Link>
                            <Link to="/" ><FaWhatsapp size={16}  className='icon'/></Link>
                        </span>
                        </span>
                       
                    </div>
                </div>
            </div>
        </div>
        <div className="copyright-area">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <p className=""> &copy; 2023 - Lets Shop - Ecommerce. All rights reserved.</p>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

    </>
  )
}

export default FooterArea