export interface CorporateSector {
  slug: string;
  href: string;
  badge: string;
  title: string;
  concept: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  ctaText: string;
  tags?: string[];
  solutions: {
    title: string;
    description: string;
  }[];
  process: {
    step: string;
    title: string;
    desc: string;
  }[];
  faq: {
    q: string;
    a: string;
  }[];
}

export const CORPORATE_SECTORS: CorporateSector[] = [
  {
    slug: 'constructoras',
    href: '/empresas/constructoras',
    badge: 'Proyectos Inmobiliarios & Obra Civil',
    title: 'Edificios y Constructoras',
    concept: 'Equipamiento en serie y obra civil',
    description: 'Equipamiento integral en serie de cocinas, clósets y vanities para torres residenciales y urbanizaciones con entregas escalonadas y cumplimiento estricto de cronograma.',
    heroImage: '/images/catalog/extracted_DE_COCINAS/img-004.webp',
    galleryImages: [
      '/images/catalog/extracted_DE_COCINAS/img-004.webp',
      '/images/catalog/extracted_CLOSETS_1/img-017.webp',
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp',
      '/images/catalog/extracted_DE_PUERTAS/img-007.webp',
    ],
    ctaText: 'Solicitar propuesta',
    tags: ['Plantilla técnica en Quito', 'Cortes CNC computarizados', 'Instalación a nivel nacional'],
    solutions: [
      { title: 'Cocinas modulares para departamentos', description: 'Mobiliario en melamina Pelikano RH con encimeras de cuarzo o granito calibradas para repetición volumétrica.' },
      { title: 'Clósets y vestidores por tipología', description: 'Armarios empotrados y walk-in closets optimizados según los planos arquitectónicos de cada unidad.' },
      { title: 'Vanities y muebles de baño suspendidos', description: 'Módulos resistentes a la humedad con tableros marinos y lavamanos integrados.' },
      { title: 'Puertas de paso y principales', description: 'Puertas monumentales pivotantes e interiores uniformadas con cerraduras de alta seguridad.' },
      { title: 'Mobiliario para áreas comunes y lobby', description: 'Counters de recepción, salas de espera y revestimientos de pared decorativos.' },
      { title: 'Cronograma escalonado por pisos', description: 'Entregas por fases coordinadas con el avance de obra civil para evitar acopio innecesario.' },
    ],
    process: [
      { step: '01', title: 'Revisión planimétrica', desc: 'Analizamos planos CAD y memorias técnicas de acabados.' },
      { step: '02', title: 'Presupuesto volumétrico', desc: 'Estructuración de costos por tipología con escala de descuentos.' },
      { step: '03', title: 'Departamento modelo', desc: 'Fabricación e instalación de unidad muestra para validación.' },
      { step: '04', title: 'Producción industrial CNC', desc: 'Mecanizado con corte automatizado y canteado de precisión.' },
      { step: '05', title: 'Montaje en obra por etapas', desc: 'Cuadrillas especializadas con supervisión de residencia.' },
      { step: '06', title: 'Recepción y garantía legal', desc: 'Acta de entrega-recepción con respaldo técnico por contrato.' },
    ],
    faq: [
      { q: '¿Tienen capacidad de producción para proyectos de gran volumen?', a: 'Sí, disponemos de taller propio con maquinaria CNC automatizada en Quito y capacidad para equipar decenas de unidades mensuales de forma simultánea.' },
      { q: '¿Pueden fabricar un departamento modelo antes de la producción en serie?', a: 'Absolutamente. Es nuestro procedimiento habitual para que la gerencia de proyecto y ventas puedan validar calidades y acabados en obra.' },
      { q: '¿Cómo coordinan los cronogramas con el avance de la obra?', a: 'Asignamos un director de proyecto que coordina las fechas de instalación directamente con el residente de obra, entregando por pisos o etapas concluidas.' },
    ],
  },
  {
    slug: 'arquitectos-disenadores',
    href: '/empresas/arquitectos-disenadores',
    badge: 'Alianza Profesional & Especificación',
    title: 'Arquitectos y Diseñadores',
    concept: 'Mobiliario de autor bajo plano',
    description: 'Transformamos tus planos y renders en mobiliario de autor con tolerancias milimétricas, asesoría en selección de materiales y confidencialidad comercial absoluta.',
    heroImage: '/images/catalog/extracted_DE_COCINAS/img-006.webp',
    galleryImages: [
      '/images/catalog/extracted_DE_COCINAS/img-006.webp',
      '/images/catalog/extracted_CLOSETS_1/img-017.webp',
      '/images/catalog/extracted_DE_PUERTAS/img-007.webp',
      '/images/catalog/extracted_DE_COCINAS/img-004.webp',
    ],
    ctaText: 'Solicitar propuesta',
    tags: ['Fabricación bajo plano', 'Tolerancias milimétricas', 'Confidencialidad absoluta'],
    solutions: [
      { title: 'Fabricación fiel bajo planos', description: 'Interpretación técnica rigurosa de detalles constructivos, despieces y memorias de diseño.' },
      { title: 'Desarrollo de mobiliario exclusivo', description: 'Piezas singulares con geometrías complejas, curvas, ranurados acústicos y ensambles especiales.' },
      { title: 'Asesoría en materiales y herrajes', description: 'Muestrarios de tableros, texturas sincronizadas, cuarzos, Dekton y sistemas Blum/Häfele.' },
      { title: 'Confidencialidad comercial', description: 'Respaldo técnico detrás de tu firma para proyectos residenciales y corporativos.' },
      { title: 'Modelado 3D y renderizado de soporte', description: 'Apoyo en visualizaciones y especificaciones técnicas para tus presentaciones a clientes.' },
      { title: 'Montaje con estándares de alta gama', description: 'Instalación impecable cuidando el resto de acabados arquitectónicos de la obra.' },
    ],
    process: [
      { step: '01', title: 'Recepción de diseño', desc: 'Evaluamos tus planos, bocetos o modelos 3D.' },
      { step: '02', title: 'Viabilidad y materiales', desc: 'Optimizamos cortes y sugerimos las mejores opciones de herrajes.' },
      { step: '03', title: 'Despiece computarizado', desc: 'Generamos la planimetría de corte CNC sin alterar tu diseño.' },
      { step: '04', title: 'Fabricación artesanal-industrial', desc: 'Producción con acabados prolijos y control de calidad.' },
      { step: '05', title: 'Instalación pulcra', desc: 'Montaje profesional en el espacio del cliente final.' },
      { step: '06', title: 'Entrega compartida', desc: 'Garantizamos que el resultado final supere las expectativas del render.' },
    ],
    faq: [
      { q: '¿Pueden fabricar bajo mi propia marca o estudio?', a: 'Sí, colaboramos como brazo de fabricación técnica manteniendo total confidencialidad frente a tu cliente particular o corporativo.' },
      { q: '¿Cómo gestionan detalles complejos no estandarizados?', a: 'Nuestro equipo técnico revisa previamente los ensambles y genera prototipos o muestras de unión antes del mecanizado final.' },
      { q: '¿Tienen muestras de materiales disponibles?', a: 'Contamos con catálogos físicos de melaminas Pelikano, Novopan, cuarzos, granitos y herrajes para revisar conjuntamente en taller o en tu estudio.' },
    ],
  },
  {
    slug: 'oficinas-corporativas',
    href: '/empresas/oficinas-corporativas',
    badge: 'Ambientes Corporativos & Coworking',
    title: 'Oficinas y Espacios Corporativos',
    concept: 'Espacios de trabajo ergonómicos',
    description: 'Estaciones de trabajo modulares, salas de reuniones ejecutivas, counters de recepción y mobiliario de almacenamiento ergonómico con ruteo de cableado 100% oculto.',
    heroImage: '/images/catalog/extracted_MUEBLES_OFICINA/img-020.webp',
    galleryImages: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-020.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-036.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-048.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-060.webp',
    ],
    ctaText: 'Solicitar propuesta',
    tags: ['Estaciones de trabajo modulares', 'Cableado 100% oculto', 'Montaje en horario especial'],
    solutions: [
      { title: 'Estaciones modulares de trabajo', description: 'Islas de escritorios con mamparas divisorias, pasacables y soportes ergonómicos.' },
      { title: 'Counters de recepción monolíticos', description: 'Puntos de bienvenida de alto impacto con iluminación indirecta y materiales nobles.' },
      { title: 'Mesas de conferencias ejecutivas', description: 'Grandes superficies con conectividad integrada de datos, energía y HDMI.' },
      { title: 'Credenzas y almacenamiento corporativo', description: 'Archivadores y muebles bajos con cerraduras unificadas o digitales.' },
      { title: 'Adecuación de áreas de descanso / cafetería', description: 'Cocinetas funcionales para colaboradores con encimeras resistentes al uso continuo.' },
      { title: 'Divisiones acústicas y celosías', description: 'Paneles ranurados en melamina para confort acústico y delimitación de ambientes.' },
    ],
    process: [
      { step: '01', title: 'Levantamiento planimétrico', desc: 'Medición in situ de oficinas y análisis de densidad de puestos.' },
      { step: '02', title: 'Distribución y ergonomía', desc: 'Planteamiento de circulación y confort del equipo de trabajo.' },
      { step: '03', title: 'Presupuesto llave en mano', desc: 'Cotización desglosada por estaciones, salas y áreas comunes.' },
      { step: '04', title: 'Fabricación modular', desc: 'Estructuras reforzadas aptas para ensamblaje y reubicación futura.' },
      { step: '05', title: 'Instalación fuera de horario', desc: 'Opciones de montaje nocturno o fines de semana para no frenar la operación.' },
      { step: '06', title: 'Entrega lista para operar', desc: 'Puestos limpios y cableados verificados.' },
    ],
    faq: [
      { q: '¿Pueden realizar la instalación en fines de semana para no interrumpir labores?', a: 'Sí, coordinamos cuadrillas de instalación en horarios especiales para minimizar el impacto en las operaciones de tu empresa.' },
      { q: '¿El mobiliario permite reconfiguraciones futuras?', a: 'Nuestras estaciones de trabajo son modulares y utilizan uniones mecánicas sólidas que permiten desarmar y reconfigurar la oficina ante crecimientos de equipo.' },
      { q: '¿Cómo resuelven la conectividad eléctrica y de red?', a: 'Incorporamos canales pasacables pasantes, cajas empotradas de conectividad y accesos ordenados para que no quede cableado expuesto.' },
    ],
  },
  {
    slug: 'mobiliario-retail',
    href: '/empresas/mobiliario-retail',
    badge: 'Comercial · Retail & Supermercados',
    title: 'Retail, Supermercados y Fruterías',
    concept: 'Módulos comerciales y vitrinas',
    description: 'Mobiliario comercial de alta resistencia para exhibición organizada, góndolas modulares, perchas reforzadas, fruteros y counters de caja diseñados para alto tráfico.',
    heroImage: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.webp',
    galleryImages: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-004.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-012.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-024.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-054.webp',
    ],
    ctaText: 'Solicitar propuesta',
    tags: ['Góndolas de alto tráfico', 'Fruteros en melamina RH', 'Counters de cobro blindados'],
    solutions: [
      { title: 'Góndolas y perchas comerciales', description: 'Sistemas reforzados regulables en altura para exhibición de productos en seco y abarrotes.' },
      { title: 'Fruteros y verduleros modulares', description: 'Muebles con inclinación ergonómica y ventilación natural para exhibición de perecibles.' },
      { title: 'Counters de cobro y cajas rápidas', description: 'Mesones con soporte para equipos POS, pasacables y protección frontal contra golpes de carritos.' },
      { title: 'Vitrinas con iluminación LED integrada', description: 'Exhibidores de seguridad con vidrio templado para artículos de valor o cosmética.' },
      { title: 'Estanterías para trastienda y bodega', description: 'Almacenamiento vertical optimizado para agilizar la reposición de mercadería.' },
      { title: 'Equipamiento estandarizado por franquicias', description: 'Fabricación serializada para cadenas comerciales que abren múltiples locales.' },
    ],
    process: [
      { step: '01', title: 'Análisis de circulación', desc: 'Estudiamos el recorrido del comprador dentro de la tienda.' },
      { step: '02', title: 'Zonificación de categorías', desc: 'Diseñamos la altura y capacidad de carga de cada módulo.' },
      { step: '03', title: 'Fabricación robusta', desc: 'Bases metálicas y tableros melamínicos de alta durabilidad.' },
      { step: '04', title: 'Pruebas de carga', desc: 'Garantizamos estabilidad bajo peso de mercadería continua.' },
      { step: '05', title: 'Montaje acelerado', desc: 'Instalación rápida para cumplir la fecha límite de apertura.' },
      { step: '06', title: 'Respaldo y reposición', desc: 'Disponibilidad de módulos adicionales para ampliaciones.' },
    ],
    faq: [
      { q: '¿Qué resistencia tienen los fruteros frente a humedad?', a: 'Fabricamos con tableros Pelikano RH con recubrimiento hidrófugo y sellado de cantos gruesos para resistir condensación y limpieza diaria.' },
      { q: '¿Pueden equipar sucursales fuera de Quito?', a: 'Sí, disponemos de logística de transporte y cuadrillas de montaje para locales comerciales a nivel nacional.' },
      { q: '¿Fabrican muebles a medida para locales con dimensiones complejas?', a: 'Adaptamos las dimensiones de las góndolas y counters milimétricamente al espacio disponible para maximizar los metros cuadrados de venta.' },
    ],
  },
  {
    slug: 'espacios-de-atencion',
    href: '/empresas/espacios-de-atencion',
    badge: 'Recepción · Salas de Espera & Bienestar',
    title: 'Espacios de Atención y Bienestar',
    concept: 'Recepciones y ambientes de bienestar',
    description: 'Mobiliario para recepciones, salas de espera, counters de atención al público, oficinas administrativas y áreas de almacenamiento en centros de bienestar y servicios.',
    heroImage: '/images/catalog/extracted_MUEBLES_OFICINA/img-010.webp',
    galleryImages: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-010.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-016.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-030.webp',
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp',
    ],
    ctaText: 'Solicitar propuesta',
    tags: ['Counters de bienvenida de autor', 'Salas de espera confortables', 'Acabados higiénicos duraderos'],
    solutions: [
      { title: 'Counters de atención al público', description: 'Mesones amplios con doble altura para privacidad administrativa y atención accesible.' },
      { title: 'Mobiliario para salas de espera', description: 'Bancos corridos, mesas auxiliares y paneles decorativos cálidos y confortables.' },
      { title: 'Estaciones de trabajo administrativas', description: 'Puestos para personal de coordinación, archivo documental y atención telefónica.' },
      { title: 'Armarios y almacenamiento general', description: 'Módulos cerrados para suministros, toallas, insumos y uniformes.' },
      { title: 'Muebles de baño y tocadores higiénicos', description: 'Vanities con encimeras de cuarzo lisas de fácil limpieza y griferías empotradas.' },
      { title: 'Salas de consulta y entrevistas', description: 'Escritorios sobrios y mobiliario auxiliar que generan un ambiente de calma.' },
    ],
    process: [
      { step: '01', title: 'Definición de experiencia', desc: 'Identificamos las sensaciones de bienvenida que tu espacio debe proyectar.' },
      { step: '02', title: 'Selección de paleta y textura', desc: 'Maderas cálidas, tonos neutros y superficies duraderas.' },
      { step: '03', title: 'Diseño ergonómico funcional', desc: 'Equilibrio entre confort del usuario y agilidad del recepcionista.' },
      { step: '04', title: 'Fabricación detallada', desc: 'Ensamble de alta calidad sin tornillería expuesta.' },
      { step: '05', title: 'Instalación limpia', desc: 'Procedimiento ordenado respetando la estética del local.' },
      { step: '06', title: 'Certificación de acabados', desc: 'Revisión final de bisagras, tiraderas y superficies.' },
    ],
    faq: [
      { q: '¿Qué tipo de proyectos abarca esta división?', a: 'Equipamos recepciones de edificios, salas de espera de oficinas, centros estéticos, spas, notarías, estudios jurídicos y áreas administrativas en general.' },
      { q: '¿Ofrecen equipamiento médico o instrumental clínico?', a: 'No, nos enfocamos exclusivamente en mobiliario arquitectónico, recepciones, almacenamiento y adecuación de ambientes.' },
      { q: '¿Los materiales son de fácil desinfección y mantenimiento?', a: 'Utilizamos melaminas termoencoladas y superficies de cuarzo compactas no porosas que facilitan la limpieza periódica sin deteriorarse.' },
    ],
  },
  {
    slug: 'mobiliario-institucional',
    href: '/empresas/mobiliario-institucional',
    badge: 'Educación · Bibliotecas & Auditorios',
    title: 'Mobiliario Institucional y Educativo',
    concept: 'Equipamiento robusto para educación',
    description: 'Equipamiento robusto para colegios, universidades, academias e instituciones: aulas interactivas, bibliotecas, lockers de alta seguridad y áreas administrativas.',
    heroImage: '/images/catalog/extracted_estudiantiles/img-000.webp',
    galleryImages: [
      '/images/catalog/extracted_estudiantiles/img-000.webp',
      '/images/catalog/extracted_estudiantiles/img-004.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-014.webp',
      '/images/catalog/extracted_estudiantiles/img-012.webp',
    ],
    ctaText: 'Solicitar propuesta',
    tags: ['Lockers de alta resistencia', 'Mobiliario escolar ergonómico', 'Instalación en receso vacacional'],
    solutions: [
      { title: 'Lockers modulares resistentes', description: 'Casilleros individuales con cerraduras mecánicas o para candado con ventilación ranurada.' },
      { title: 'Escritorios y mesas de estudio', description: 'Superficies amplias con cantos gruesos boleados para seguridad y uso rudo diario.' },
      { title: 'Estanterías para bibliotecas y archivos', description: 'Sistemas verticales con capacidad de carga certificada para libros y expedientes.' },
      { title: 'Aulas colaborativas y laboratorios', description: 'Mesas trapezoidales o modulares para dinámicas de grupo y clases interactivas.' },
      { title: 'Salas de profesores y directivas', description: 'Mobiliario ejecutivo con áreas de archivo personal y mesas de juntas docentes.' },
      { title: 'Fabricación por volumen programada', description: 'Entregas planificadas durante períodos vacacionales para que el ciclo lectivo inicie listo.' },
    ],
    process: [
      { step: '01', title: 'Cálculo de aforo', desc: 'Determinamos la cantidad de puestos y módulos según dimensiones del aula.' },
      { step: '02', title: 'Selección de resistencia', desc: 'Materiales con cantos de 2mm reforzados y estructuras de alta resistencia.' },
      { step: '03', title: 'Cotización institucional', desc: 'Presupuestos formales para comités de compras y juntas directivas.' },
      { step: '04', title: 'Fabricación serializada', desc: 'Corte homogéneo CNC asegurando que cada pupitre y casillero sea idéntico.' },
      { step: '05', title: 'Montaje en período vacacional', desc: 'Instalación intensiva en fechas acordadas sin interferir con clases.' },
      { step: '06', title: 'Garantía institucional', desc: 'Compromiso de durabilidad respaldado por contrato escrito.' },
    ],
    faq: [
      { q: '¿Pueden fabricar durante las vacaciones escolares?', a: 'Sí, programamos las órdenes institucionales para fabricar e instalar durante los recesos académicos de régimen Sierra y Costa.' },
      { q: '¿Los cantos y esquinas son seguros para estudiantes?', a: 'Aplicamos cantos gruesos termoencolados con terminaciones boleadas para evitar filos cortantes y proteger a los usuarios.' },
      { q: '¿Emiten facturas y garantías formales para comités de compras?', a: 'Totalmente. Cumplimos con todas las obligaciones tributarias y entregamos pólizas de garantía por escrito en cada contrato institucional.' },
    ],
  },
];
