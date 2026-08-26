'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, Clock, Gauge, MapPin, Mountain, Users } from 'lucide-react';
import SiteHeader from '@/components/sections/site-header';
import MobileMenu from '@/components/sections/mobile-menu';
import type { PackageDetail } from '@/lib/packages';

type PackageDetailViewProps = {
  detail: PackageDetail;
  related: PackageDetail[];
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'best-time', label: 'Best time to visit' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'cost', label: 'Cost' },
];

const RATING_LABEL: Record<string, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

function AltitudeChart({ profile }: { profile: number[] }) {
  const width = 640;
  const height = 240;
  const sidePadding = 30;
  const topPadding = 38;
  const bottomPadding = 40;
  const max = Math.max(...profile);
  const min = Math.min(...profile);
  const range = Math.max(max - min, 1);
  const points = profile.map((value, i) => {
    const x = profile.length === 1 ? width / 2 : sidePadding + (i / (profile.length - 1)) * (width - sidePadding * 2);
    const y = height - bottomPadding - ((value - min) / range) * (height - topPadding - bottomPadding);
    return { x, y, value, day: i + 1 };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const baseline = height - bottomPadding;

  // pick a label set that never puts two labels closer than minGap px apart,
  // always keeping the first, last, and highest point.
  const minGap = 56;
  const maxIndex = points.reduce((best, p, i) => (p.value > points[best].value ? i : best), 0);
  const mustShow = [0, maxIndex, points.length - 1];
  const shown = new Set<number>();
  const shownXs: number[] = [];
  const tryShow = (i: number) => {
    const x = points[i].x;
    if (shownXs.every((sx) => Math.abs(sx - x) >= minGap)) {
      shown.add(i);
      shownXs.push(x);
    }
  };
  mustShow.forEach(tryShow);
  points.forEach((_, i) => tryShow(i));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="pkg-altitude-svg" role="img" aria-label="Altitude profile across the trip">
      <line x1={sidePadding} y1={baseline} x2={width - sidePadding} y2={baseline} className="pkg-altitude-baseline" />
      <path d={path} fill="none" stroke="#2f8f6f" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const showLabel = shown.has(i);
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y + 6} x2={p.x} y2={baseline} className="pkg-altitude-tick" />
            <circle cx={p.x} cy={p.y} r={3.5} fill="#2f8f6f" />
            {showLabel ? (
              <>
                <text x={p.x} y={p.y - 12} textAnchor="middle" className="pkg-altitude-value">
                  {p.value.toLocaleString()} m
                </text>
                <text x={p.x} y={baseline + 18} textAnchor="middle" className="pkg-altitude-day">
                  Day {p.day}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function PackageDetailView({ detail, related }: PackageDetailViewProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [openDay, setOpenDay] = useState(1);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const goToEnquiry = () => {
    setMenuOpen(false);
    router.push('/#enquiry');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 },
    );
    TABS.forEach((tab) => {
      const el = sectionRefs.current[tab.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="site-noise overflow-hidden bg-[#f3efe6] text-[#24443c]">
      <SiteHeader scrolled={scrolled} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onEnquire={goToEnquiry} />
      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} onEnquire={goToEnquiry} />

      <section className="pkg-hero" style={{ backgroundImage: `url(${detail.heroImage})` }}>
        <div className="pkg-hero-overlay" />
        <div className="pkg-hero-inner">
          <p className="eyebrow text-[#f3efe6]/80">
            {detail.categoryLabel.toUpperCase()} · {detail.destinationLabel.toUpperCase()}
          </p>
          <h1 className="pkg-hero-title">{detail.name}</h1>
          <div className="pkg-hero-meta">
            <span className="pkg-chip">
              <Clock size={14} /> {detail.quickFacts.duration}
            </span>
            <span className="pkg-chip">
              <Mountain size={14} /> {detail.quickFacts.maxAltitude}
            </span>
            <span className="pkg-chip">
              <MapPin size={14} /> {detail.destinationLabel}
            </span>
          </div>
          <p className="pkg-hero-price">
            From <strong>NPR {detail.priceFrom.toLocaleString()}</strong> per person
          </p>
        </div>
      </section>

      <div className="pkg-tabs-bar">
        <nav className="pkg-tabs" aria-label="Package sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`pkg-tab ${activeTab === tab.id ? 'pkg-tab-active' : ''}`}
              onClick={() => scrollToSection(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pkg-layout">
        <div className="pkg-main">
          <section id="overview" ref={(el) => { sectionRefs.current.overview = el; }} className="pkg-section">
            <h2 className="pkg-section-title">Overview</h2>
            <p className="pkg-section-body">{detail.description}</p>
            <ul className="pkg-highlights">
              {detail.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p className="pkg-destination-note">
              Destination: <Link href={detail.destinationHref} className="pkg-inline-link">{detail.destinationLabel}</Link>
            </p>
          </section>

          <section id="best-time" ref={(el) => { sectionRefs.current['best-time'] = el; }} className="pkg-section">
            <h2 className="pkg-section-title">Best time to visit</h2>
            <div className="pkg-months">
              {detail.bestTime.map((entry) => (
                <div key={entry.month} className={`pkg-month pkg-month-${entry.rating}`} data-testid={`month-${entry.month.toLowerCase()}`}>
                  <span className="pkg-month-label">{entry.month}</span>
                  <span className="pkg-month-rating">{RATING_LABEL[entry.rating]}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="itinerary" ref={(el) => { sectionRefs.current.itinerary = el; }} className="pkg-section">
            <h2 className="pkg-section-title">Itinerary</h2>
            <div className="pkg-itinerary">
              {detail.itinerary.map((day) => {
                const isOpen = openDay === day.day;
                return (
                  <div key={day.day} className={`pkg-day-card ${isOpen ? 'pkg-day-card-open' : ''}`}>
                    <button
                      type="button"
                      className="pkg-day-header"
                      onClick={() => setOpenDay(isOpen ? -1 : day.day)}
                      aria-expanded={isOpen}
                      data-testid={`button-day-${day.day}`}
                    >
                      <span className="pkg-day-number">Day {day.day}</span>
                      <span className="pkg-day-title">{day.title}</span>
                      <ChevronDown size={18} className="pkg-day-chevron" />
                    </button>
                    {isOpen ? (
                      <div className="pkg-day-body">
                        <p>{day.detail}</p>
                        <div className="pkg-day-facts">
                          <span>Meals: {day.meals}</span>
                          <span>Stay: {day.stay}</span>
                          <span>Transport: {day.transport}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pkg-section">
            <h2 className="pkg-section-title">Altitude profile</h2>
            <AltitudeChart profile={detail.altitudeProfile} />
          </section>

          <section id="cost" ref={(el) => { sectionRefs.current.cost = el; }} className="pkg-section">
            <h2 className="pkg-section-title">Cost</h2>
            <div className="pkg-cost-grid">
              <div>
                <p className="pkg-cost-heading">Includes</p>
                <ul className="pkg-cost-list">
                  {detail.costIncludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="pkg-cost-heading">Excludes</p>
                <ul className="pkg-cost-list pkg-cost-list-excludes">
                  {detail.costExcludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="pkg-price-range">
              Price from <strong>NPR {detail.priceFrom.toLocaleString()}</strong> per person, based on group size and season.
            </p>
          </section>
        </div>

        <aside className="pkg-sidebar">
          <div className="pkg-booking-card">
            <p className="pkg-booking-price">
              From <strong>NPR {detail.priceFrom.toLocaleString()}</strong>
              <span> per person</span>
            </p>
            <div className="pkg-booking-field">
              <span>Dates</span>
              <span className="pkg-booking-field-value">Flexible — tell us your window</span>
            </div>
            <div className="pkg-booking-field">
              <span>Travellers</span>
              <span className="pkg-booking-field-value">2 adults</span>
            </div>
            <button type="button" className="button-coral pkg-booking-button" onClick={goToEnquiry} data-testid="button-package-enquire">
              Enquire <ArrowRight size={16} />
            </button>
            <button type="button" className="pkg-custom-trip" onClick={goToEnquiry}>
              Build a custom trip
            </button>
          </div>

          <div className="pkg-facts-card">
            <p className="pkg-facts-title">Quick facts</p>
            <div className="pkg-facts-row">
              <Clock size={15} />
              <span>{detail.quickFacts.duration}</span>
            </div>
            <div className="pkg-facts-row">
              <Mountain size={15} />
              <span>Max altitude {detail.quickFacts.maxAltitude}</span>
            </div>
            <div className="pkg-facts-row">
              <Gauge size={15} />
              <span>{detail.quickFacts.difficulty}</span>
            </div>
            <div className="pkg-facts-row">
              <Users size={15} />
              <span>{detail.quickFacts.groupSize}</span>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="pkg-related">
          <h2 className="pkg-section-title">Related packages</h2>
          <div className="pkg-related-grid">
            {related.map((item) => (
              <Link key={item.slug} href={`/packages/${item.slug}`} className="pkg-related-card" data-testid={`link-related-${item.slug}`}>
                <p className="pkg-related-name">{item.name}</p>
                <p className="pkg-related-desc">{item.description}</p>
                <p className="pkg-related-meta">{item.destinationLabel} · {item.quickFacts.duration}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default PackageDetailView;
