import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck, Shield, Wrench, Truck, ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Fabricación y Servicios | Modulares GM',
  description: 'Condiciones de contratación, fabricación, visitas técnicas, plazos de entrega y garantías de Modulares GM en Ecuador.',
  alternates: {
    canonical: 'https://www.modularesgm.com/terminos',
  },
  openGraph: {
    title: 'Términos y Condiciones | Modulares GM',
    description: 'Políticas comerciales transparentes de fabricación a medida, instalación y garantías en Ecuador.',
    url: 'https://www.modularesgm.com/terminos',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function TerminosPage() {
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
            Condiciones de Fabricación y Venta
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-headline tracking-tight text-foreground">
            Términos y Condiciones de Servicio
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Vigente para proyectos residenciales, comerciales e institucionales en la República del Ecuador.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileCheck size={18} className="text-primary" />
              1. Alcance de los Servicios y Fabricación
            </h2>
            <p>
              Modulares GM se especializa en el diseño planimétrico, modulación computarizada, fabricación en taller propio e instalación de mobiliario a medida (cocinas integrales, clósets, vestidores, muebles de baño, puertas pivotantes, mobiliario corporativo, góndolas comerciales y mesones en cuarzo y granito).
            </p>
            <p>
              Toda cotización emitida a través del sitio web o WhatsApp constituye una propuesta preliminar hasta la verificación técnica de medidas en obra y la firma del contrato formal de fabricación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Wrench size={18} className="text-primary" />
              2. Levantamiento de Medidas y Visitas Técnicas
            </h2>
            <p>
              Para proyectos personalizados de gran envergadura (cocinas completas, remodelaciones o clósets a medida), se coordina una visita técnica con un profesional de diseño para comprobación de escuadras, tomas de agua, salidas eléctricas y estado de paredes.
            </p>
            <p>
              Las condiciones específicas de tarifas de visita (cuando apliquen fuera del perímetro urbano o en provincias) y su posterior acreditación como abono al contrato final son informadas de manera transparente antes de agendar la cita.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              3. Plazos de Fabricación y Entrega
            </h2>
            <p>
              Los tiempos habituales de fabricación oscilan entre <strong className="text-foreground">15 y 20 días hábiles</strong> contados a partir de la firma del contrato, aprobación final de planos y acreditación del anticipo pactado. Los plazos de grandes volúmenes para constructoras o proyectos B2B se rigen por cronograma de obra individual.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              4. Garantías y Calidad de Materiales
            </h2>
            <p>
              Utilizamos tableros hidrófugos de alta resistencia Pelikano RH de 18mm con cantos termofusionados y herrajes europeos con amortiguación de cierre suave. Nuestros muebles cuentan con garantías escritas de <strong className="text-foreground">3 a 10 años según el componente y producto</strong> contra defectos de manufactura y desajustes estructurales en condiciones normales de uso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              5. Pagos y Anticipos
            </h2>
            <p>
              El esquema estándar de contratación opera mediante un anticipo del 50% al inicio de la producción en taller y el saldo restante contra entrega o verificación de instalación. Aceptamos transferencias bancarias, tarjetas de crédito (con opción a diferidos según la entidad emisora) y pagos corporativos autorizados.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
