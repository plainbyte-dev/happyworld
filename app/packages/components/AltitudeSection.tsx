'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { ItineraryDay } from '@/lib/packages';
import type { IconName } from '@/components/ui/AppIcon';

type AltitudeSectionProps = {
  altitudeProfile: number[];
  itinerary: ItineraryDay[];
};

const BAR_COLORS = ['bg-emerald-400', 'bg-primary', 'bg-amber-400', 'bg-sky-400', 'bg-violet-400', 'bg-orange-400', 'bg-red-400'];

const acclimatizationTips: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'ClockIcon', title: 'Arrive a Day Early', desc: 'Spend at least one extra night acclimatising before the highest point of the trip.' },
  { icon: 'NoSymbolIcon', title: 'Go Easy on Alcohol', desc: 'Alcohol widens blood vessels and worsens altitude symptoms — best avoided on high-altitude days.' },
  { icon: 'BeakerIcon', title: 'Try Ginger or Garlic Tea', desc: 'Local remedies served along the route are a traditional way to ease altitude discomfort.' },
  { icon: 'HeartIcon', title: 'Take It Slow', desc: 'Walk at a steady pace, breathe deeply, and rest often — your guide will set the rhythm.' },
  { icon: 'GlobeAltIcon', title: 'Stay Hydrated', desc: 'Drink 3–4 litres of water a day. Dehydration makes altitude effects noticeably worse.' },
  { icon: 'PlusCircleIcon', title: 'Ask About Diamox', desc: 'Acetazolamide (Diamox) is a commonly used preventative — consult your doctor before travel.' },
];

export default function AltitudeSection({ altitudeProfile, itinerary }: AltitudeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setBarsVisible(true);
          section.querySelectorAll('.reveal-up').forEach((item) => item.classList.add('visible'));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const maxAltitude = Math.max(...altitudeProfile, 1);
  const points = altitudeProfile.map((elevation, i) => ({
    name: itinerary[i]?.title ?? `Day ${i + 1}`,
    elevation,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  return (
    <div ref={sectionRef}>
      <span className="section-label">Altitude Information</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-4">
        Know Before
        <span className="italic"> You Go</span>
      </h2>
      <p className="text-foreground/60 text-sm font-light mb-10 max-w-xl">
        Altitude affects everyone differently. Here's how elevation changes day by day, so you can prepare and stay
        comfortable throughout the trip.
      </p>

      {/* Altitude Bar Chart */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 reveal-up">
        <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">Elevation Profile — Day by Day</h3>
        <div className="flex flex-col gap-5">
          {points.map((point, i) => {
            const pct = Math.round((point.elevation / maxAltitude) * 100);
            return (
              <div key={`${point.name}-${i}`} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-foreground truncate">
                    Day {i + 1} — {point.name}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground flex-shrink-0">{point.elevation.toLocaleString()} m</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`altitude-bar ${point.color} h-full rounded-full`}
                    style={{ width: barsVisible ? `${pct}%` : '0%', transitionDelay: `${i * 80}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-start gap-3 bg-amber-400/5 rounded-2xl p-4 border border-amber-400/20">
          <Icon name="ExclamationTriangleIcon" size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70 leading-relaxed">
            <strong className="text-foreground">Note:</strong> Altitude sickness is unpredictable — it can affect fit,
            young travellers as much as older ones. Fitness level does not protect you. Acclimatisation time is the
            most reliable prevention.
          </p>
        </div>
      </div>

      {/* Acclimatization Tips */}
      <div className="reveal-up stagger-2">
        <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">Acclimatisation Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {acclimatizationTips.map((tip, i) => (
            <div key={tip.title} className={`glass-card rounded-2xl p-5 flex gap-4 items-start reveal-up stagger-${i + 1}`}>
              <div className="w-10 h-10 rounded-xl bg-[#2f5f9e]/10 flex items-center justify-center flex-shrink-0">
                <Icon name={tip.icon} size={18} className="text-[#2f5f9e]" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm mb-1">{tip.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
