import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  MessageSquare,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Assess<span className="text-blue-600">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The world's most trusted online assessment platform for developers
              and organizations. Build, scale, and hire with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Platform
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-500 transition-colors"
                >
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-blue-500 transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-500 transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-500 transition-colors">
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Resources
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="#" className="hover:text-blue-500 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-500 transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>123 Tech Avenue, Silicon Valley, CA 94025, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a
                  href="mailto:support@assesspro.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  support@assesspro.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>+1 (555) 000-1234</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} AssessPro Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <MessageSquare size={20} />
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Briefcase size={20} />
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Globe size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
