import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PL</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">PestxLawn</h3>
                <p className="text-xs">Pest & Lawn Care</p>
              </div>
            </div>
            <p className="text-sm">
              Your trusted partner for professional pest control and lawn care services.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-green-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-green-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Pest Control</li>
              <li>Lawn Care & Fertilization</li>
              <li>Weed Control</li>
              <li>Tree & Shrub Care</li>
              <li>Mosquito Control</li>
              <li>Commercial Services</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Norman, OK 73069</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-green-400 transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@pestxlawn.com" className="hover:text-green-400 transition-colors">
                  info@pestxlawn.com
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2026 PestxLawn Pest & Lawn Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
