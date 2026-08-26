'use client';

import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandMark from '@/components/brand-mark';
import { content } from '@/data/content';
import { slugify } from '@/lib/packages';

type SiteHeaderProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEnquire: () => void;
};

function SiteHeader({ scrolled, menuOpen, onToggleMenu, onEnquire }: SiteHeaderProps) {
  const [tripsOpen, setTripsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(content.tripsMenu[0].key);
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);

  const closeTrips = () => {
    setTripsOpen(false);
    setActiveCategory(content.tripsMenu[0].key);
    setHoveredDestination(null);
  };

  const lightNav = scrolled || tripsOpen;

  return (
    <header className={`site-nav fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${lightNav ? 'site-nav-scrolled' : ''}`}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" data-testid="link-brand">
          <BrandMark inverse={!lightNav} />
          <span className="brand-wordmark">
            <span>Happy</span>
            <span>World</span>
          </span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
          {content.nav.map((item) =>
            item.label.trim() === 'Trips' ? (
              <div
                key={item.href}
                className="trips-menu-wrap"
                onMouseEnter={() => setTripsOpen(true)}
                onMouseLeave={closeTrips}
              >
                <a
                  href={item.href}
                  className="nav-link trips-trigger"
                  aria-expanded={tripsOpen}
                  data-testid="link-nav-trips"
                >
                  {item.label}
                </a>
                <div className={`trips-mega ${tripsOpen ? 'trips-mega-open' : ''}`} data-testid="menu-trips">
                  <div className="trips-mega-inner">
                    <ul className="trips-categories" aria-label="Trip categories">
                      {content.tripsMenu.map((category) => (
                        <li key={category.key}>
                          <a
                            href={category.href}
                            className={`trips-category-link ${activeCategory === category.key ? 'trips-category-link-active' : ''}`}
                            onMouseEnter={() => setActiveCategory(category.key)}
                            data-testid={`link-trips-category-${category.key}`}
                          >
                            <span>{category.label}</span>
                            <span className="trips-category-desc">{category.description}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="trips-destinations" aria-label="Destinations">
                      {content.tripsMenu.map((category) =>
                        category.key === activeCategory ? (
                          <div key={category.key} className="trips-destinations-panel">
                            <p className="trips-destinations-title">{category.label} destinations</p>
                            <div className="trips-destinations-grid">
                              {category.destinations.map((destination) => (
                                <div
                                  key={destination.label}
                                  className="trips-destination-item"
                                  onMouseEnter={() => setHoveredDestination(destination.label)}
                                  onMouseLeave={() => setHoveredDestination((current) => (current === destination.label ? null : current))}
                                >
                                  <a
                                    href={destination.href}
                                    className="trips-destination-link"
                                    data-testid={`link-destination-${destination.label.toLowerCase()}`}
                                  >
                                    {destination.label}
                                  </a>
                                  {hoveredDestination === destination.label && destination.packages.length > 0 ? (
                                    <div className="trips-packages-flyout" data-testid={`flyout-packages-${destination.label.toLowerCase()}`}>
                                      <p className="trips-destinations-title">Packages in {destination.label}</p>
                                      <div className="trips-destinations-grid">
                                        {destination.packages.map((pkg) => (
                                          <div key={pkg.name} className="trips-destination-item">
                                            <a href={`/packages/${slugify(pkg.name)}`} className="trips-destination-link" data-testid={`link-package-${slugify(pkg.name)}`}>
                                              {pkg.name}
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <a key={item.href} href={item.href} className="nav-link" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </a>
            ),
          )}
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
