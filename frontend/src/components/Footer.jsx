import React from 'react';
import { Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-2 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-6 text-sm text-[var(--color-brand-text-secondary)]">
        <a 
          href="https://github.com/manishcodess" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:text-[var(--color-brand-orange)] transition-colors"
        >
          <Github className="mr-1.5 w-4 h-4" />
          manishcodess
        </a>
        <a 
          href="mailto:manish.sharma.iiit@gmail.com" 
          className="flex items-center hover:text-[var(--color-brand-orange)] transition-colors"
        >
          <Mail className="mr-1.5 w-4 h-4" />
          manish.sharma.iiit@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
