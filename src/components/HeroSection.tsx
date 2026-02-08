import { useState, useEffect } from "react";
import heroPattern from "@/assets/hero-pattern.jpg";

function getRamadanStart(): Date {
  // Ramadan 2026 is approximately Feb 18 – Mar 19
  return new Date(2026, 1, 18, 0, 0, 0);
}

function getCountdown(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, started: false };
}

interface HijriDate {
  day: string;
  month: { en: string };
  year: string;
}

interface HeroProps {
  hijriDate: HijriDate | null;
  gregorianDate: string;
}

export default function HeroSection({ hijriDate, gregorianDate }: HeroProps) {
  const [countdown, setCountdown] = useState(getCountdown(getRamadanStart()));

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(getRamadanStart())), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownUnits = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-0">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroPattern} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-emerald-deep/95" />
      </div>

      <div className="relative z-10 px-6 py-16 md:py-24 text-center">
        {/* Bismillah */}
        <p className="text-gold font-serif text-lg md:text-xl mb-2 animate-fade-in-up">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>

        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Ramadan Journey
        </h1>

        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Prepare your heart and soul for the blessed month
        </p>

        {/* Dates */}
        <div className="flex items-center justify-center gap-3 text-primary-foreground/70 text-sm mb-10 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <span>{gregorianDate}</span>
          {hijriDate && (
            <>
              <span className="text-gold">✦</span>
              <span>{hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH</span>
            </>
          )}
        </div>

        {/* Countdown */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-gold font-semibold text-xs sm:text-sm uppercase tracking-widest mb-4">
            {countdown.started ? "Ramadan Mubarak!" : "Days Until Ramadan"}
          </p>
          {!countdown.started && (
            <div className="flex justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              {countdownUnits.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <div className="w-14 h-14 xs:w-16 xs:h-16 md:w-20 md:h-20 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-gold/20 flex items-center justify-center">
                    <span className="text-xl xs:text-2xl md:text-3xl font-bold text-primary-foreground font-sans">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] xs:text-xs text-primary-foreground/60 mt-1.5 sm:mt-2 uppercase tracking-wider">{unit.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
