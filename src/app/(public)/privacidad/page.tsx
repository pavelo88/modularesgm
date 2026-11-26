import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Políticas de Privacidad y Tratamiento de Datos | Modulares GM',
  description: 'Política de privacidad y protección de datos personales de Modulares GM en cumplimiento con la Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador.',
  alternates: {
    canonical: 'https://www.modularesgm.com/privacidad',
  },
  openGraph: {
    title: 'Políticas de Privacidad | Modulares GM',
    description: 'Tratamiento responsable y seguro de datos personales para cotizaciones, visitas técnicas y proyectos de mobiliario en Ecuador.',
    url: 'https://www.modularesgm.com/privacidad',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          <span>Volver al Inicio</span>
        </Link>

        <header className="mb-10 pb-8 border-b border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary block mb-2">
            Marco Legal y Cumplimiento LOPDP Ecuador
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-headline tracking-tight text-foreground">
            Políticas de Privacidad & Protección de Datos
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Última actualización: Noviembre 2026. Documento de conformidad con la Ley Orgánica de Protección de Datos Personales de la República del Ecuador.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              1. Responsable del Tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos personales recabados a través del sitio web{' '}
              <strong className="text-foreground">https://www.modularesgm.com</strong> es{' '}
              <strong className="text-foreground">MODULARES GM</strong>, con operaciones principales en la ciudad de Quito, Ecuador, taller matriz en La Ofelia y Barrio Nuevo, y atención a nivel nacional.
            </p>
            <p>
              Para cualquier consulta o ejercicio de derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), puede contactarse al correo{' '}
              <span className="text-foreground font-mono">info@modularesgm.com</span> o a la línea de atención oficial{' '}
              <span className="text-foreground font-mono">{SITE.phone}</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              2. Datos Recopilados y Finalidad
            </h2>
            <p>
              Recopilamos únicamente los datos necesarios y pertinentes para atender sus requerimientos comerciales de diseño, fabricación e instalación de mobiliario:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-foreground">Formularios de Cotización y Contacto:</strong> Nombre completo, correo electrónico, número telefónico o WhatsApp, ciudad y detalles del requerimiento de mobiliario. Finalidad: elaboración de cotizaciones, planimetría preliminar y coordinación de visitas técnicas.
              </li>
              <li>
                <strong className="text-foreground">Formularios Corporativos B2B:</strong> Razón social, RUC (opcional), datos de contacto del representante o profesional, volumen proyectado y planos de obra. Finalidad: propuesta económica corporativa y contratos de obra.
              </li>
              <li>
                <strong className="text-foreground">Programa de Afiliados:</strong> Datos de registro, información bancaria para transferencias de comisiones verificadas y reportes de facturación legal.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              3. Seguridad y Confidencialidad
            </h2>
            <p>
              Implementamos medidas técnicas y organizativas rigurosas (cifrado SSL/TLS, autenticación segura, control de acceso por roles y rate limiting) para proteger sus datos personales contra acceso no autorizado, pérdida o alteración. No vendemos, alquilamos ni compartimos sus datos personales con terceros para fines ajenos a la relación comercial con Modulares GM.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              4. Cookies y Tecnologías de Seguimiento
            </h2>
            <p>
              Este sitio web utiliza cookies técnicas y analíticas (Google Analytics 4) para medir de manera agregada la interacción de los usuarios, mejorar la velocidad de carga y medir conversiones publicitarias legítimas. El usuario puede configurar su navegador para rechazar cookies sin que ello impida navegar por el catálogo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              5. Derechos del Titular y Retención
            </h2>
            <p>
              De acuerdo con la legislación ecuatoriana, usted tiene derecho a solicitar la actualización, supresión o revocación del consentimiento para el tratamiento de sus datos. Las solicitudes se atenderán en los términos previstos por la LOPDP mediante comunicación escrita a <span className="text-foreground font-mono">info@modularesgm.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
