import { FaFacebook, FaInstagram } from 'react-icons/fa';
import BrandMark from '@/components/brand-mark';
import { content } from '@/data/content';

function SiteFooter() {
  return (
    <footer className="footer-section px-5 pb-7 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-[#263a63] pb-14 md:grid-cols-[1.4fr_.7fr_.7fr]">
          <div>
            <div className="flex items-center gap-3"><div className="footer-logo-badge"><BrandMark /></div></div>
            <h2 className="mt-12 max-w-[450px] font-display text-5xl leading-[.92] text-[#ffffff] sm:text-6xl" data-testid="text-footer-statement">{content.footer.statement}</h2>
          </div>
          <div>
            <p className="eyebrow text-[#c9a227]">NAVIGATE</p>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Footer navigation">
              {content.nav.map((item) => (
                <a key={item.href} href={item.href} className="footer-nav-link" data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="eyebrow text-[#c9a227]">FOLLOW ALONG</p>
            <div className="mt-5 flex gap-3">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram" data-testid="link-social-instagram"><FaInstagram size={17} /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook" data-testid="link-social-facebook"><FaFacebook size={17} /></a>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] tracking-[.13em] text-[#8890b0] sm:flex-row">
          <span>© 2024 HAPPY WORLD · MADE IN KATHMANDU</span>
          <span>TRAVEL WITH CARE · LEAVE A LIGHT TRACE</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
