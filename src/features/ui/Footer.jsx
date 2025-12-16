import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      className="
        mt-24
        bg-bg-primary
        text-text-primary
        border-t border-border
      "
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Zaynarah Footer
      </h2>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <h3 className="text-3xl font-serif font-semibold text-brand-gold mb-4">
            Zaynarah
          </h3>

          <p className="max-w-md text-text-secondary leading-relaxed">
            Handcrafted Kashmiri Pashmina, woven by master artisans using
            centuries-old techniques. Quiet luxury, rooted in heritage.
          </p>

          {/* Trust Badges */}
          <ul className="mt-6 space-y-2 text-sm text-text-secondary">
            <li>• 100% Authentic Kashmiri Pashmina</li>
            <li>• Free Shipping on Orders Over ₹1999</li>
            <li>• Easy Returns & Secure Checkout</li>
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-text-primary mb-4">
            Shop
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/shop" className="hover:text-brand-gold transition">
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=shawls"
                className="hover:text-brand-gold transition"
              >
                Shawls
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=stoles"
                className="hover:text-brand-gold transition"
              >
                Stoles
              </Link>
            </li>
            <li>
              <Link
                to="/the-craft"
                className="hover:text-brand-gold transition"
              >
                The Craft
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-text-primary mb-4">
            Help
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/shipping" className="hover:text-brand-gold transition">
                Shipping
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-brand-gold transition">
                Returns
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-brand-gold transition">
                Support
              </Link>
            </li>
            <li>
              <a
                href="mailto:support@zaynarah.com"
                className="hover:text-brand-gold transition"
              >
                support@zaynarah.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social + Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <Separator />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">
          {/* Social */}
          <div className="flex items-center gap-5 text-lg text-text-secondary">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-brand-gold transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-brand-gold transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-brand-gold transition"
            >
              <FaTwitter />
            </a>
          </div>

          {/* Payments / Security hint */}
          <p className="text-xs text-text-secondary">
            Secure payments • Trusted craftsmanship • Since Kashmir
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-text-secondary pb-8">
        © {new Date().getFullYear()} Zaynarah. All rights reserved.
      </div>
    </footer>
  );
}
