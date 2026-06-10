'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie, getCookie } from 'cookies-next';
import { useForm, FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import StepRenderer from '@/components/form/stepRenderer';
import fbEvent, { gtagSendEvent } from '@/services/fbEvents';
import { normalizeWhatsapp } from '@/utils/formValidators';
import { info } from '@info';
import { content } from '@content';

const Eyebrow = ({ children }) => (
  <span className="-ft-3 inline-block font-bold tracking-[0.2em] uppercase text-[#ff3b1f] mb-3">
    {children}
  </span>
);
// ─── Loading intro shown before the survey steps ──────────────────────────────
const SurveyIntro = ({onButtonClick}) => (
  <motion.div
    key="intro"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-[#0c0c0e] flex-grow flex flex-col items-center justify-center px-6 py-16"
  >
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
        {/*<button href={content.hero.ctaHref}>{content.hero.cta.main}</button>*/}
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
      {/*<div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mt-12 mb-4">*/}
      {/*  <motion.div*/}
      {/*    initial={{ width: '0%' }}*/}
      {/*    animate={{ width: '100%' }}*/}
      {/*    transition={{ duration: 4, ease: 'easeInOut' }}*/}
      {/*    className="h-full bg-brand-2 rounded-full"*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<p className="-ft-1 text-white/60">Cargando...</p>*/}
      <button
        onClick={() => onButtonClick(false)}
        className="ft-1 mt-12 animate-bounce inline-block cursor-pointer bg-brand-5 hover:bg-[#ff3b1f] text-white font-extrabold uppercase px-9 py-4 rounded w-[30rem]"
      >
        Siguiente →
      </button>
    </div>
  </motion.div>
);

// ─── Define survey steps here ─────────────────────────────────────────────────
// Each step has a `type` and relevant config.
// Types: 'radio' | 'checkbox' | 'select' | 'text' | 'tel' | 'textarea' | 'checkpoint' | 'opt-in'
const buildFormSteps = ({ fullName, phone, email }) => [
  // ── Example question ──────────────────────────────────────────────────────
  {
    type: 'radio',
    name: 'negocio',
    title: '¿Qué tipo de negocio quieres surtir?',
    inputOptions: { required: 'Selecciona una opción' },
    options: [
      { value: 'gimnasio', label: 'Gimnasio' },
      { value: 'box-artes-marciales', label: 'Box (boxeo) / artes marciales' },
      { value: 'crossfit-funcional', label: 'CrossFit / funcional' },
      { value: 'escuela-club-futbol', label: 'Escuela o club de fútbol' },
      { value: 'tienda-deportiva-revendedor', label: 'Tienda deportiva / revendedor' },
      { value: 'entrenador-independiente', label: 'Entrenador independiente' },
    ],
    cols: 1,
  },
  {
    type: 'checkbox',
    name: 'surtir',
    title: '¿Qué necesitas surtir?',
    description: 'Selecciona una o varias',
    inputOptions: { required: 'Selecciona una opción' },
    options: [
      { value: 'gym-fitness', label: 'Equipo de gym / fitness' },
      { value: 'crossfit', label: 'Equipo de CrossFit' },
      { value: 'box-artes-marciales', label: 'Box / artes marciales' },
      { value: 'entrenamiento-futbol', label: 'Entrenamiento de fútbol' },
      { value: 'surtido-mixto', label: 'Un poco de todo' },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'tamano',
    title: '¿A cuánta gente atiende o surte tu negocio?',
    inputOptions: { required: 'Selecciona una opción' },
    options: [
      { value: 'menos-50', label: 'Menos de 50' },
      { value: '50-150', label: '50 – 150' },
      { value: '150-500', label: '150 – 500' },
      { value: 'mas-500', label: 'Más de 500' },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'frecuencia',
    title: '¿Cada cuánto resurtes?',
    inputOptions: { required: 'Selecciona una opción' },
    options: [
      { value: 'pedido-puntual', label: 'Es un pedido puntual' },
      { value: 'por-temporada', label: 'Cada temporada o torneo' },
      { value: 'mensual', label: 'Cada mes, es recurrente' },
      { value: 'nuevo-negocio', label: 'Apenas voy a arrancar' },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'urgencia',
    title: '¿Para cuándo lo necesitas?',
    inputOptions: { required: 'Selecciona una opción' },
    options: [
      { value: 'esta-semana', label: 'Esta semana, urge' },
      { value: 'este-mes', label: 'Este mes' },
      { value: 'proximo-trimestre', label: 'En el próximo trimestre' },
      { value: 'explorando', label: 'Solo estoy explorando opciones' },
    ],
    cols: 1,
  },
  // ── Opt-in (always last) ──────────────────────────────────────────────────
  {
    type: 'opt-in',
    name: 'optin',
    title: '¿A dónde te contactamos?',
    description: 'Déjanos tus datos y un asesor te arma la lista y te pasa precios. Sin compromiso.',
    fields: [
      {
        type: 'text',
        name: 'fullName',
        title: 'Tu nombre completo',
        inputOptions: { value: fullName, required: '¿Cómo te llamas?' },
      },
      {
        type: 'text',
        name: 'email',
        title: 'Tu correo electronico',
        inputOptions: { value: email, required: '¿Cuál es tu correo?' },
      },
      {
        type: 'tel',
        name: 'phone',
        title: 'Tu WhatsApp (10 dígitos)',
        inputOptions: {
          value: phone,
          required: '¿Cuál es tu WhatsApp?',
          maxLength: { value: 10, message: 'Ingresa 10 dígitos' },
          minLength: { value: 10, message: 'Ingresa 10 dígitos' },
        },
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Survey({ lead, utm }) {
  const [showIntro, setShowIntro] = useState(true);
  const [formStep, setFormStep] = useState(0);
  const [inputError, setInputError] = useState(null);
  const [sending, setSending] = useState(false);

  const methods = useForm({ mode: 'all' });
  const { handleSubmit, formState: { errors }, watch } = methods;
  const router = useRouter();

  const formSteps = buildFormSteps({ fullName: lead.fullName, phone: lead.phone });

  const lastInputIndex = formSteps.reduce((last, step, i) =>
    step.type !== 'checkpoint' ? i : last, 0);

  // Hide intro after 4s
  // useEffect(() => {
  //   if (!showIntro) return;
  //   const t = setTimeout(() => setShowIntro(false), 4000);
  //   return () => clearTimeout(t);
  // }, [showIntro]);

  // Auto-advance checkpoint steps
  useEffect(() => {
    const current = formSteps[formStep];
    if (current?.autoAdvance) {
      const t = setTimeout(() => {
        setFormStep((p) => Math.min(p + 1, formSteps.length - 1));
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [formStep]);

  // Fire FB/gtag events on checkpoint steps
  useEffect(() => {
    const step = formSteps[formStep];
    if (step?.type === 'checkpoint') {
      fbEvent(step.name);
      if (typeof gtag !== 'undefined') gtag('event', step.name.replace(/-/g, '_'));
    }
  }, [formStep]);

  const handleNext = async () => {
    const current = formSteps[formStep];

    if (current.type === 'checkpoint') {
      return setFormStep((p) => Math.min(p + 1, formSteps.length - 1));
    }

    const valid = await methods.trigger(current.name);
    if (!valid) {
      setInputError(formStep);
      return;
    }

    setInputError(null);
    window.scrollTo(0, 0);
    setFormStep((p) => Math.min(p + 1, formSteps.length - 1));
  };

  const onSubmit = async (data) => {
    setSending(true);
    try {
      data.whatsapp = normalizeWhatsapp(data.phone);

      const payload = { ...lead, ...data, ...utm };

      const res = await fetch(info.optInWebhook, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json().catch(() => ({}));

      fbEvent('Lead', { phone: data.phone, externalID: result.id });
      // gtagSendEvent('CONVERSION_LABEL', { fullName: data.fullName, phone: data.whatsapp });

      setCookie('lead', { ...data, id: result.id });

      const redirect = info.surveyRedirect || '/thankyou';
      await router.push(redirect);

    } catch (err) {
      console.error('Survey submit error:', err);
    } finally {
      setSending(false);
    }
  };

  const isLastStep = formStep === lastInputIndex;

  return (
    <div className="relative flex flex-col flex-grow bg-gradient-to-b from-brand-6 to-white">
      <AnimatePresence mode="wait">

        {showIntro && <SurveyIntro onButtonClick={setShowIntro}/>}

        {!showIntro && (
          <motion.div
            key="survey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col flex-grow pb-[8rem]"
          >
            {/* Progress bar */}
            <div className="sticky top-0 bg-white w-full max-w-[56rem] mx-auto px-8 py-4 z-10 shadow-sm">
              <div className="relative bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-brand-1 rounded-full transition-all duration-500"
                  style={{ width: `${((formStep + 1) / formSteps.length) * 100}%` }}
                />
              </div>
              <p className="-ft-3 text-center text-neutral-400 mt-2">
                Paso {formStep + 1} de {formSteps.length}
              </p>
            </div>

            {/* Form */}
            <div className="container !px-0 flex flex-col flex-grow items-center">
              <div className="survey-card">
                <FormProvider {...methods}>
                  <form className="flex flex-col flex-grow" onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={formStep}
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <StepRenderer
                          step={formSteps[formStep]}
                          index={formStep}
                          currentStep={formStep}
                          errors={errors}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Bottom nav */}
                    <div className={`fixed bottom-0 inset-x-0 p-6 grid ${formSteps[formStep].type === 'checkpoint' ? 'grid-cols-1' : 'grid-cols-2'} gap-4 bg-white border-t border-gray-200 z-50`}>
                      {formSteps[formStep].type !== 'checkpoint' && (
                        <button
                          type="button"
                          onClick={() => setFormStep((p) => Math.max(p - 1, 0))}
                          disabled={formStep === 0}
                          className="!bg-transparent !text-brand-1 !border-2 !border-brand-1 disabled:!opacity-30"
                        >
                          ← Atrás
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={sending}
                        onClick={() => {
                          if (isLastStep) {
                            handleSubmit(onSubmit)();
                          } else {
                            handleNext();
                          }
                        }}
                        className="w-full"
                      >
                        {sending && <span className="animate-spin mr-2 inline-block">⟳</span>}
                        {isLastStep ? 'Enviar →' : 'Siguiente →'}
                      </button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { req, query } = ctx;
  const cookiesHeader = req.headers.cookie || '';

  const keys = ['utm', 'lead'];
  const cookies = {};

  for (const key of keys) {
    const raw = cookiesHeader
      .split('; ')
      .find(c => c.startsWith(`${key}=`))
      ?.split('=')[1];
    if (!raw) continue;
    try {
      const clean = raw.startsWith('j%3A') ? raw.slice(4) : raw;
      cookies[key] = JSON.parse(decodeURIComponent(clean));
    } catch {
      cookies[key] = decodeURIComponent(raw);
    }
  }

  const utmFromQuery = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    if (query[param]) utmFromQuery[param] = query[param];
  });

  const utm =
    Object.keys(utmFromQuery).length > 0 ? utmFromQuery : cookies.utm ?? null;

  const { lead } = cookies;

  return {
    props: {
      lead: {
        fullName: lead?.fullName ?? '',
        phone: lead?.phone ?? '',
        whatsapp: lead?.whatsapp ?? '',
      },
      utm: utm ?? {},
    },
  };
}
