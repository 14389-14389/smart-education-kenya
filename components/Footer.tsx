
import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { WhatsAppIcon, TwitterIcon, FacebookIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bright-blue-900 text-white">
      <div className="container mx-auto py-12 px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            {/* About */}
            <div>
                 <h3 className="font-bold text-lg mb-2">Smart Education</h3>
                 <p className="text-sm text-bright-blue-200">
                    Empowering the next generation of leaders in Kenya through mentorship, motivation, and educational support.
                </p>
            </div>
            {/* Contact */}
            <div>
                <h3 className="font-bold text-lg mb-2">Get in Touch</h3>
                <ul className="text-sm text-bright-blue-200 space-y-1">
                    <li><a href="mailto:starletlucky71@gmail.com" className="hover:text-white transition">starletlucky71@gmail.com</a></li>
                    <li><a href="tel:+254742180636" className="hover:text-white transition">+254 742 180 636</a></li>
                    <li>Kibauni, Mwala, Kenya</li>
                </ul>
            </div>
            {/* Social */}
            <div>
                 <h3 className="font-bold text-lg mb-2">Follow Us</h3>
                 <div className="flex justify-center md:justify-start space-x-4">
                    <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-bright-blue-200 hover:text-white transition"><WhatsAppIcon /></a>
                    <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-bright-blue-200 hover:text-white transition"><TwitterIcon /></a>
                    <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-bright-blue-200 hover:text-white transition"><FacebookIcon /></a>
                 </div>
            </div>
        </div>
         <div className="border-t border-bright-blue-700 mt-8 pt-6 text-center">
            <p className="font-semibold text-lg mb-2 italic">
            “Smart Education – Empowering Minds, Shaping Futures.”
            </p>
            <p className="text-sm text-bright-blue-200">
            © 2025 Smart Education | Founded by Lucky Kitonyi & Kevin Muli.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;