// src/features/ui/Footer.jsx
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
} from 'react-icons/fa';

const GOLD = '#D4AF37';
const LIGHT_ROSE = '#FDE2E4';
const LIGHT_BG = '#FFF8F5'; // soft off-white

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: LIGHT_BG, color: '#333' }}>
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2
            className="text-3xl font-serif font-semibold mb-4"
            style={{ color: GOLD }}
          >
            Zaynarah
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-sm">
            Handcrafted Kashmiri pashmina shawls — a heritage of artistry and
            quiet luxury.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: LIGHT_ROSE }}
          >
            Explore
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link
                to="/"
                className="hover:text-gold transition-colors"
                style={{ color: '#555' }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="hover:text-gold transition-colors"
                style={{ color: '#555' }}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/the-craft"
                className="hover:text-gold transition-colors"
                style={{ color: '#555' }}
              >
                The Craft
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: LIGHT_ROSE }}
          >
            Help
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <a
                href="/shipping"
                className="hover:text-gold transition-colors"
                style={{ color: '#555' }}
              >
                Shipping
              </a>
            </li>
            <li>
              <a
                href="/returns"
                className="hover:text-gold transition-colors"
                style={{ color: '#555' }}
              >
                Returns
              </a>
            </li>
            <li>
              <a
                href="/support"
                className="hover:text-gold transition-colors"
                style={{ color: '#555' }}
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: LIGHT_ROSE }}
          >
            Connect
          </h3>
          <p>
            Email:{' '}
            <a
              href="mailto:support@zaynarah.com"
              className="hover:text-gold underline transition-colors"
            >
              support@zaynarah.com
            </a>
          </p>
          <p className="mt-2">Phone: +91 90000 00000</p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4 mt-4">
            {[FaInstagram, FaFacebookF, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-600 hover:text-rose-400 transition-colors text-lg"
                aria-label="Social Media"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Separator */}
      <Separator className="border-gray-200" />

      {/* Bottom */}
      <div className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Zaynarah — All rights reserved.
      </div>
    </footer>
  );
}
