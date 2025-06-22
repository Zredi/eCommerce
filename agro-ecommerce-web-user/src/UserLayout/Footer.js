import React from 'react';
import { 
  IoLogoFacebook, 
  IoLogoTwitter, 
  IoLogoInstagram, 
  IoLogoYoutube,
  IoMail,
  IoCall,
  IoLocationSharp
} from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-100 pt-16 pb-8 border-t">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ecommerce</h3>
            <p className="text-gray-600 mb-4">
              Your trusted partner since 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#3498DB] transition-colors">
                <IoLogoFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3498DB] transition-colors">
                <IoLogoTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3498DB] transition-colors">
                <IoLogoInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3498DB] transition-colors">
                <IoLogoYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#3498DB] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-[#3498DB] transition-colors">
                  Products
                </Link>
              </li>
              
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#3498DB] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping-policy" className="text-gray-600 hover:text-[#3498DB] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-[#3498DB] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-[#3498DB] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                <IoLocationSharp className="text-[#3498DB]" size={20} />
                123 Road, abc District, 123456
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <IoCall className="text-[#3498DB]" size={20} />
                +91 123 456 7890
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <IoMail className="text-[#3498DB]" size={20} />
                support@ecommerce.com
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="text-center text-gray-600 pt-8 border-t">
          <p>© {new Date().getFullYear()} Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;