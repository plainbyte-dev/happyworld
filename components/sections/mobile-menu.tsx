import { ArrowDownRight, ArrowRight, MapPin } from 'lucide-react';
import { content } from '@/data/content';

type MobileMenuProps = {
  open: boolean;
  onNavigate: () => void;
  onEnquire: () => void;
};

function MobileMenu({ open, onNavigate, onEnquire }: MobileMenuProps) {
  return (
    <div className={`mobile-menu ${open ? 'mobile-menu-open' : ''}`} aria-hidden={!open}>
      <div className="mobile-menu-inner">
        <p className="eyebrow text-[#e17651]">NEPAL · SINCE 2008</p>
        <nav className="mt-12 flex flex-col gap-5" aria-label="Mobile navigation">
          {content.nav.map((item, index) => (
            <a key={item.href} href={item.href} onClick={onNavigate} className="mobile-nav-link" data-testid={`link-mobile-${index}`}>
              {item.label}<ArrowDownRight size={25} strokeWidth={1.4} />
            </a>
          ))}
        </nav>
        <button type="button" className="button-coral mt-14" onClick={onEnquire} data-testid="button-mobile-enquire">
          Start your journey <ArrowRight size={17} />
        </button>
        <div className="mt-auto flex items-center gap-4 border-t border-[#36584e] pt-5 text-sm text-[#d9ddca]">
          <MapPin size={15} /> Kathmandu, Nepal
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
