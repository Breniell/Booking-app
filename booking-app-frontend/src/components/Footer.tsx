// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-white py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">ReservEase</h3>
            <p className="text-gray-400">
              Simplifiez vos rendez-vous en ligne avec notre plateforme intuitive.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Liens Rapides</h4>
            <ul className="space-y-2">
              {[
                { to: "/experts", label: "Trouver un Expert" },
                { to: "/how-it-works", label: "Comment ça marche" },
                { to: "/register", label: "Devenir Expert" }
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Contact</h4>
            <p className="text-gray-400">📧 contact@reservease.com</p>
            <p className="text-gray-400">📞 +123 456 7890</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Suivez-nous</h4>
            <div className="flex space-x-4">
              {[
                { href: "https://facebook.com", icon: Facebook },
                { href: "https://twitter.com", icon: Twitter },
                { href: "https://instagram.com", icon: Instagram }
              ].map((social) => (
                <a key={social.href} href={social.href} className="text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer" aria-label="Réseau social">
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-10 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ReservEase. Tous droits réservés.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
