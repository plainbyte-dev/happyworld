import { ArrowRight, Menu, X } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { content } from '@/data/content';

type SiteHeaderProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEnquire: () => void;
};

function SiteHeader({ scrolled, menuOpen, onToggleMenu, onEnquire }: SiteHeaderProps) {
  return (
    <header className={`site-nav fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'site-nav-scrolled' : ''}`}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" data-testid="link-brand">
          <BrandMark inverse={!scrolled} />
          <span className="brand-wordmark">
            <span>Happy</span>
            <span>World</span>
          </span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
          {content.nav.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <button type="button" className="nav-enquire hidden lg:inline-flex" onClick={onEnquire} data-testid="button-nav-enquire">
          Start a conversation <ArrowRight size={15} strokeWidth={1.8} />
        </button>
        <button type="button" className="mobile-menu-button lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={onToggleMenu} data-testid="button-mobile-menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

export default SiteHeader;
