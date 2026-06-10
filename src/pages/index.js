'use client';

import { useState, useEffect, useRef } from 'react';
import { content } from '@content'

// ─── ICON ────────────────────────────────────────────────────────────────────

const Icon = ({ name, className = 'w-5 h-5' }) => {
  const icons = {
    arrow: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    chevronDown: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
    x: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    quote: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    ),
    whatsapp: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── CTA BUTTON ──────────────────────────────────────────────────────────────

const CTAButton = ({ children, variant = 'primary', href = '/survey', className = '' }) => {
  if (variant === 'primary') {
    return (
      <a
        href={href}
        className={`cursor-pointer inline-flex items-center gap-2 bg-[#ff3b1f] hover:bg-[#f3efe6] hover:text-[#0c0c0e] text-white font-semibold px-7 py-4 rounded-sm transition-all duration-200 shadow-lg shadow-[#ff3b1f]/30 hover:shadow-[#ff3b1f]/50 ft-1 ${className}`}
      >
        {children}
        <Icon name="arrow" className="w-4 h-4" />
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`cursor-pointer inline-flex items-center gap-2 border border-[#ff3b1f] text-[#ff3b1f] hover:bg-[#ff3b1f] hover:text-white font-semibold px-7 py-4 rounded-sm transition-all duration-200 ft-1 ${className}`}
    >
      {children}
    </a>
  );
};

// ─── EYEBROW ─────────────────────────────────────────────────────────────────

const Eyebrow = ({ children }) => (
  <span className="-ft-3 inline-block font-bold tracking-[0.2em] uppercase text-[#ff3b1f] mb-3">
    {children}
  </span>
);

// ─── REVEAL HOOK ─────────────────────────────────────────────────────────────

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
};

// ─── NAV ─────────────────────────────────────────────────────────────────────

const Nav = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0e]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 flex items-center justify-between h-[70px]">
        {/* Brand */}
        <span className="font-black ft-3 text-white tracking-[0.06em] uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>
          {content.nav.brand}
        </span>
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <CTAButton href={content.nav.ctaHref} className="!py-2.5 !px-5 !-ft-1">
            {content.nav.cta}
          </CTAButton>
        </div>
        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#ff3b1f]"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <Icon name={open ? 'x' : 'menu'} className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0c0c0e] px-6 py-4 flex flex-col gap-4">
          <CTAButton href={content.nav.ctaHref} className="!py-3 !-ft-1 justify-center">
            {content.nav.cta}
          </CTAButton>
        </div>
      )}
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

const Hero = () => (
  <section
    className="pt-48 pb-20 px-6 relative overflow-hidden"
    style={{ backgroundColor: '#0c0c0e' }}
  >
    {/* Diagonal line grid */}
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(115deg, transparent 0 38px, rgba(243,239,230,0.5) 38px 39px)',
      }}
    />
    {/* Ember glow */}
    <div className="absolute top-0 right-0 w-[700px] h-[500px] opacity-20 blur-[130px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #ff3b1f, transparent 70%)' }} />

    <div className="container mx-auto relative z-10">
      {/* Badge */}
      <div className="mb-6">
        <Eyebrow>{content.hero.badge}</Eyebrow>
      </div>
      {/* Headline */}
      <h1
        className="ft-8 font-black text-white leading-[0.95] tracking-tight mb-6 max-w-[24ch] uppercase"
        style={{ fontFamily: 'Anton, sans-serif' }}
      >
        {content.hero.title.replace(content.hero.titleAccent, '')}{' '}
        <span className="text-[#ff3b1f]">{content.hero.titleAccent}</span>
      </h1>
      {/* Description */}
      <p className="ft-1 text-[#9a9aa3] mb-10 leading-relaxed max-w-[50ch]">
        Mándanos tu lista por WhatsApp y recibe tu equipo completo, con{' '}
        <strong className="text-[#f3efe6] font-semibold">
          {content.hero.descriptionHighlight}
        </strong>
      </p>
      {/* CTA row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
        <CTAButton href={content.hero.ctaHref}>{content.hero.cta.main}</CTAButton>
        <span className="-ft-3 text-[#9a9aa3]">{content.hero.cta.micro}</span>
      </div>
      {/* Trust strip */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {content.hero.strips.map((s) => (
          <span key={s.label} className="-ft-3 tracking-[0.04em] uppercase text-[#9a9aa3]">
            <span className="text-[#ff3b1f] mr-1.5 font-bold">✕</span>
            <strong className="text-[#f3efe6] font-bold">{s.label}</strong>
            {s.suffix ? ` ${s.suffix}` : ''}
          </span>
        ))}
      </div>
    </div>
  </section>
);

// ─── COMO FUNCIONA ────────────────────────────────────────────────────────────

const ComoFunciona = () => {
  const { ref, visible } = useReveal();
  return (
    <section
      className="py-24 px-6 border-t border-b border-white/5"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="container mx-auto">
        {/* Banner */}
        <div
          ref={ref}
          className={`items-baseline gap-4 mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Eyebrow>{content.como.banner.eyebrow}</Eyebrow>
          <h2
            className="ft-7 font-black text-white leading-tight max-w-[28ch] uppercase"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            {content.como.banner.title}
          </h2>
        </div>
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 border border-white/5">
          {content.como.items.map((item) => (
            <div key={item.number} className="p-8" style={{ backgroundColor: '#0c0c0e' }}>
              <div
                className="ft-5 font-black text-[#ff3b1f] leading-none mb-3"
                style={{ fontFamily: 'Anton, sans-serif' }}
              >
                {item.number}
              </div>
              <h3 className="ft-2 font-bold text-white mb-2 leading-snug">{item.title}</h3>
              <p className="ft-1 text-[#9a9aa3] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────

const Productos = () => {
  const { ref, visible } = useReveal();
  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto">
        {/* Banner */}
        <div
          ref={ref}
          className={`items-baseline gap-4 mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Eyebrow>{content.productos.banner.eyebrow}</Eyebrow>
          <h2
            className="ft-7 font-black text-neutral-900 leading-tight max-w-[28ch] uppercase"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            {content.productos.banner.title}
          </h2>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {content.productos.items.map((item, i) => (
            <div
              key={i}
              className="group border border-neutral-100 rounded-sm p-7 hover:border-[#ff3b1f]/50 hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{ background: 'linear-gradient(180deg, #f9f9f9, #ffffff)' }}
            >
              <div className="-ft-3 font-bold tracking-[0.22em] uppercase text-[#ff3b1f] mb-2">
                {item.tag}
              </div>
              <h3 className="ft-2 font-bold text-neutral-900 mb-3 leading-snug">{item.title}</h3>
              <p className="ft-1 text-neutral-500 leading-relaxed mb-5">{item.description}</p>
              <ul className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <li
                    key={t}
                    className="-ft-3 text-neutral-500 border border-neutral-200 px-3 py-1 rounded-full"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Trust row */}
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 mb-8">
          {content.productos.trust.map((t) => (
            <span key={t.label} className="-ft-3 tracking-[0.03em] uppercase text-neutral-400">
              <span className="text-[#ff3b1f] mr-1.5 font-bold">✕</span>
              <strong className="text-neutral-800 font-bold">{t.label + ' ' + t.suffix}</strong>
            </span>
          ))}
        </div>
        {/* Brands */}
        <div className="border-t border-neutral-100 pt-6 text-center items-center">
          <p className="-ft-3 tracking-[0.26em] uppercase text-neutral-400 mb-3">
            {content.productos.brands.label}
          </p>
          <div className="flex flex-wrap gap-2 justify-center items-center mx-auto">
            {content.productos.brands.names.map((brand, i) => (
              <span key={brand} className="flex items-center gap-2">
                <span
                  className="ft-3 font-black uppercase text-neutral-800 opacity-80 tracking-tight"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                >
                  {brand}
                </span>
                {i < content.productos.brands.names.length - 1 && (
                  <span className="text-[#ff3b1f] opacity-70 ft-2">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIOS ─────────────────────────────────────────────────────────────

const Testimonios = () => {
  const { ref, visible } = useReveal();
  return (
    <section
      className="py-24 px-6 border-t border-b border-white/5"
      style={{ backgroundColor: '#141418' }}
    >
      <div className="container mx-auto">
        {/* Banner */}
        <div
          ref={ref}
          className={`items-baseline gap-4 mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Eyebrow>{content.testimonios.banner.eyebrow}</Eyebrow>
          <h2
            className="ft-7 font-black text-white leading-tight max-w-[28ch] uppercase"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            {content.testimonios.banner.title}
          </h2>
        </div>
        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {content.testimonios.items.map((t, i) => (
            <div
              key={i}
              className={`relative border-l-2 border-[#ff3b1f] border border-white/5 rounded-sm p-7 flex flex-col ${i === 2 ? 'md:col-span-2' : ''}`}
              style={{ backgroundColor: '#0c0c0e' }}
            >
              {t.stars && (
                <div className="text-[#ff3b1f] -ft-2 mb-3 tracking-widest">{t.stars}</div>
              )}
              <p className="ft-1 text-[#9a9aa3] leading-relaxed flex-1 mb-5 italic">
                "{t.quote}"
              </p>
              <div className="border-t border-white/5 pt-4">
                <div className="font-bold text-white -ft-1 tracking-[0.06em] uppercase">
                  {t.author}
                </div>
                {t.company && (
                  <div className="text-[#9a9aa3] -ft-3">{t.company}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA FINAL ────────────────────────────────────────────────────────────────

const CTAFinal = () => {
  const { ref, visible } = useReveal();
  return (
    <section
      id="contact"
      className="py-24 px-6 relative overflow-hidden text-center"
      style={{ backgroundColor: '#ff3b1f' }}
    >
      {/* Diagonal overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(115deg, transparent 0 46px, rgba(12,12,14,0.05) 46px 47px)',
        }}
      />
      <div
        ref={ref}
        className={`max-w-3xl mx-auto relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <h2
          className="ft-7 font-black text-[#0c0c0e] leading-[0.95] mb-5 uppercase mx-auto max-w-[24ch]"
          style={{ fontFamily: 'Anton, sans-serif' }}
        >
          {content.cta.title}
        </h2>
        <p className="ft-1 text-[#0c0c0e]/80 mb-8 max-w-[44ch] mx-auto">
          {content.cta.description}
        </p>
        <a
          href={content.cta.ctaHref}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#0c0c0e] hover:bg-black text-[#f3efe6] font-semibold px-7 py-4 rounded-sm transition-all duration-200 shadow-lg shadow-black/40 ft-1"
        >
          {content.cta.cta}
          <Icon name="arrow" className="w-4 h-4" />
        </a>
        <p className="-ft-3 text-[#0c0c0e]/70 mt-4">{content.cta.micro}</p>
      </div>
    </section>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer
    className="py-10 px-6 border-t border-white/5"
    style={{ backgroundColor: '#0c0c0e' }}
  >
    <div className="container mx-auto">
      <div className="flex flex-wrap gap-x-12 gap-y-6 justify-between items-start mb-8">
        {/* Brand */}
        <div className="max-w-[240px]">
          <span
            className="ft-1 font-black text-white tracking-[0.06em] uppercase"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            {content.footer.brand.replace(content.footer.brandAccent, '')}
            <span className="text-[#ff3b1f]">{content.footer.brandAccent}</span>
          </span>
          <p className="-ft-3 text-[#9a9aa3] mt-2 leading-relaxed">
            {content.footer.tagline}
          </p>
        </div>
        {/* Contact */}
        <div className="flex flex-col gap-1.5">
          {content.footer.whatsapp && (
            <a
              href={`https://wa.me/${content.footer.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9a9aa3] -ft-2 hover:text-[#ff3b1f] transition-colors"
            >
              <Icon name="whatsapp" className="w-4 h-4 text-[#ff3b1f]" />
              {content.footer.whatsappLabel}
            </a>
          )}
          {content.footer.email && (
            <a
              href={`mailto:${content.footer.email}`}
              className="text-[#9a9aa3] -ft-2 hover:text-[#ff3b1f] transition-colors"
            >
              {content.footer.email}
            </a>
          )}
        </div>
        {/* Address */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[#9a9aa3] -ft-2">{content.footer.address}</p>
          <p className="text-[#9a9aa3] -ft-2">{content.footer.city}</p>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-white/5 pt-5">
        <p className="-ft-3 text-[#9a9aa3] tracking-[0.04em] opacity-70">
          {content.footer.copy}
        </p>
      </div>
    </div>
  </footer>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SGAIJELandingPage() {
  return (
    <main className="font-sans antialiased">
      <Nav />
      <Hero />
      <ComoFunciona />
      <Productos />
      <Testimonios />
      <CTAFinal />
      <Footer />
    </main>
  );
}