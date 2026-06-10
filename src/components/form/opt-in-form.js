import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';
import { emailRegExp, normalizeWhatsapp, restrictNumber } from '@/utils/formValidators';
import fbEvent from '@/services/fbEvents';
import { info } from '@info';
import { Select } from '@/components/form/formAtoms';

// ─── Basic opt-in form (name + phone).
// For a richer form add more fields — see doble-acento's opt-in-form for reference.

export default function OptInForm({ lastClick = '', utm = {} }) {
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const methods = useForm({ mode: 'all' });
  const { register, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    setSending(true);
    data.whatsapp = normalizeWhatsapp(data.phone);
    data.origin = info.companyName + ' Landing';
    data.lastClick = lastClick;
    data.dateAdded = Date.now();

    const _fbc = getCookie('_fbc');
    const _fbp = getCookie('_fbp');
    const payload = { ...data, _fbc, _fbp, ...utm };

    try {
      const result = await fetch(info.optInWebhook, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const { id } = await result.json();
      fbEvent('Lead', { phone: data.phone, email: data.email, externalID: id });
      // gtagSendEvent('CONVERSION_ID', { fullName: data.fullName, phone: data.whatsapp });
      setCookie('lead', { ...data, id });
    } catch {
      // fbEvent('Lead', { phone: data.phone, email: data.email, externalID: '' });
      setCookie('lead', { ...data });
    } finally {
      router.push('/thankyou');
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full gap-4 z-50"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register('fullName', { required: 'Escribe tu nombre' })}
          className={errors.fullName ? '!border-brand-3 !bg-red-200' : ''}
          placeholder="Nombre completo"
        />

        <input
          {...register('phone', {
            required: 'Escribe tu WhatsApp',
            maxLength: { value: 10, message: 'Ingresa 10 dígitos' },
            minLength: { value: 10, message: 'Ingresa 10 dígitos' },
          })}
          className={errors.phone ? '!border-brand-3 !bg-red-200' : ''}
          onKeyDown={restrictNumber}
          placeholder="WhatsApp (10 dígitos)"
        />

        <input
          {...register('email', {
            required: 'Escribe tu correo',
            pattern: { value: emailRegExp, message: 'Revisa tu correo' },
          })}
          className={errors.email ? '!border-brand-3 !bg-red-200' : ''}
          placeholder="Correo electrónico"
        />

        <input
          {...register('company', {
            required: 'Cómo se llama tu empresa?',
          })}
          className={errors.company ? '!border-brand-3 !bg-red-200' : ''}
          placeholder="Cómo se llama tu empresa?"
        />

        <input
          {...register('jobTitle', {
            required: 'Cuál es tu puesto?',
          })}
          className={errors.jobTitle ? '!border-brand-3 !bg-red-200' : ''}
          placeholder="Tu puesto"
        />

        <Select
          options={[
            {value: '1-10', name: '1 a 10'},
            {value: '11-30', name: '11 a 30'},
            {value: '30-50', name: '30 a 50'},
            {value: '50+', name: 'Más de 50'},
          ]}
          name="companySize"
          inputOptions={{required: true}}
          placeholder="¿Cuántos colaboradores tiene tu empresa?"
          className={`rounded-md px-6 py-4 bg-white ${errors.companySize && '!bg-red-200'}`}
        />

        <Select
          options={[
            {value: 'departamento-completo', name: 'Sí, todo un departamento'},
            {value: '1-2-personas', name: 'Sí, 1 a 2 personas'},
            {value: 'externo', name: 'Técnicos externos por evento'},
            {value: 'nada', name: 'No tenemos nada'},
          ]}
          name="itTeam"
          inputOptions={{required: true}}
          placeholder="¿Tienen equipo de IT?"
          className={`rounded-md px-6 py-4 bg-white ${errors.itTeam && '!bg-red-200'}`}
        />

        <Select
          options={[
            {value: 'red-conectividad', name: 'Red y conectividad'},
            {value: 'servidores', name: 'Servidores'},
            {value: 'seguridad-respaldos', name: 'Seguridad y respaldos'},
            {value: 'equipos-computo', name: 'Equipos de cómputo'},
            {value: 'acceso-remoto', name: 'Acceso remoto'},
            {value: 'no-sabe', name: 'No sé por donde empezar'},
          ]}
          name="preocupacion"
          inputOptions={{required: true}}
          placeholder="¿Qué te preocupa más de tu infraestructura?"
          className={`rounded-md px-6 py-4 bg-white ${errors.preocupacion && '!bg-red-200'}`}
        />

        <button
          type="submit"
          disabled={sending}
          className="w-full mt-2"
        >
          {sending
            ? <span className="animate-spin inline-block mr-2">⟳</span>
            : null
          }
          {sending ? 'Enviando...' : info.whatsapp.value ? 'Enviar →' : 'Solicitar información →'}
        </button>

        <p className="-ft-3 text-center text-neutral-500 mt-2">
          No compartiremos tus datos. Al dar clic aceptas nuestra&nbsp;
          <Link href={info.privacyNotice}>
            <a className="underline hover:text-brand-1">política de privacidad</a>
          </Link>.
        </p>
      </form>
    </FormProvider>
  );
}
