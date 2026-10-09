import jsPDF from 'jspdf';

/**
 * Convierte una imagen a Base64 JPEG usando canvas en el navegador
 */
async function toBase64Jpeg(url: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

interface ImageBase64Info {
  data: string;
  width: number;
  height: number;
  aspect: number;
}

/**
 * Convierte una imagen a Base64 PNG preservando canal alfa y dimensiones naturales (para logotipos sin deformación)
 */
async function toBase64PngInfo(url: string): Promise<ImageBase64Info | null> {
  if (typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width || 311;
        const h = img.naturalHeight || img.height || 243;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve({
          data: canvas.toDataURL('image/png'),
          width: w,
          height: h,
          aspect: w / h,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export interface CatalogCategoryPdfData {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  desc: string;
  img: string;
  gallery?: string[];
  specs: string[];
}

export const ALL_CATALOG_CATEGORIES_PDF: CatalogCategoryPdfData[] = [
  {
    id: 'cocinas',
    title: 'Cocinas Integrales con Cuarzo',
    tag: 'LÍNEA DE AUTOR 01',
    subtitle: 'Islas de cuarzo Calacatta, acabados hidrófugos RH 18mm y herrajes Blum.',
    desc: 'Nuestras cocinas integrales están concebidas bajo estrictos principios de ergonomía y durabilidad arquitectónica. Cada módulo es fabricado con tableros Pelikano RH de 18mm resistentes a la humedad y al calor, con cantos rígidos aplicados con tecnología PUR libre de juntas visibles. Las encimeras en cuarzo antibacterial garantizan superficies higiénicas y de fácil mantenimiento con garantía directa.',
    img: '/images/catalog/extracted_DE_COCINAS/img-006.webp',
    gallery: [
      '/images/catalog/extracted_DE_COCINAS/img-004.webp',
      '/images/catalog/extracted_DE_COCINAS/img-005.webp',
      '/images/catalog/extracted_DE_COCINAS/img-007.webp',
    ],
    specs: [
      'Estructura: Melamina Pelikano RH 18mm hidrófuga',
      'Mesón: Cuarzo pulido antibacteriano a medida',
      'Herrajes: Bisagras y rieles Blum con cierre amortiguado',
      'Garantía: 3 a 5 años directa de fábrica',
    ],
  },
  {
    id: 'closets',
    title: 'Walk-in Closets & Vestidores',
    tag: 'LÍNEA DE AUTOR 02',
    subtitle: 'Diseños de piso a techo con iluminación LED oculta y puertas vitrina.',
    desc: 'Optimizamos cada centímetro cúbico para que la organización de prendas sea una experiencia placentera. Módulos configurables con zapateras extraíbles de gran capacidad, cajoneras de terciopelo con división para joyas y pantaloneros de extracción total. Iluminación lineal cálida de encendido automático por sensor de proximidad.',
    img: '/images/catalog/extracted_CLOSETS_1/img-017.webp',
    gallery: [
      '/images/catalog/extracted_CLOSETS_1/img-004.webp',
      '/images/catalog/extracted_CLOSETS_1/img-005.webp',
      '/images/catalog/extracted_CLOSETS_1/img-006.webp',
    ],
    specs: [
      'Sistemas: Puertas corredizas colgantes y perfiles de aluminio',
      'Interiores: Módulos personalizados con pantaloneros telescópicos',
      'Iluminación: Tiras LED 3000K con perfiles difusores empotrados',
      'Herrajes: Rieles de extracción total oculta',
    ],
  },
  {
    id: 'bano',
    title: 'Vanities & Muebles de Baño',
    tag: 'LÍNEA DE AUTOR 03',
    subtitle: 'Muebles flotantes antibacteriales con encimera de cuarzo y espejos LED.',
    desc: 'Diseñados para resistir ambientes de alta humedad continua sin deformaciones ni desprendimientos. La combinación de frentes con texturas sincronizadas y mesones de cuarzo macizo protege contra salpicaduras y químicos de aseo personal. Ensamblados con tornillería oculta y sellado perimetral antihongos.',
    img: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp',
    gallery: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.webp',
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.webp',
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-007.webp',
    ],
    specs: [
      'Resistencia: Protección total antihongos y vapor',
      'Fijación: Soportes invisibles de alta carga (hasta 120 kg)',
      'Lavamanos: Compatibilidad con pozos bajo tope o de sobreponer',
      'Grifería: Planimetría de desagüe y tomas de agua oculta',
    ],
  },
  {
    id: 'escritorios',
    title: 'Escritorios Estudiantiles & Home Office',
    tag: 'LÍNEA DE AUTOR 04',
    subtitle: 'Superficies amplias con pasacables ocultos, repisas flotantes y cajoneras.',
    desc: 'El mobiliario esencial para teletrabajo y estudio de alta productividad. Diseñados siguiendo los estándares internacionales de ergonomía para postura correcta en jornadas prolongadas. Incorporan bandejas pasacables bajo cubierta y cajoneras de seguridad con cerraduras de alta fidelidad.',
    img: '/images/catalog/extracted_estudiantiles/img-000.webp',
    gallery: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.webp',
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.webp',
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.webp',
    ],
    specs: [
      'Cubierta: Melamina 25mm de alta resistencia al rayado',
      'Gestión Eléctrica: Pasacables metálicos y bandejas de soporte',
      'Cajoneras: Rieles de cierre suave y tiradores embutidos',
      'Medidas: Opciones estándar y personalizadas a tu espacio',
    ],
  },
  {
    id: 'oficina',
    title: 'Mobiliario Corporativo & Oficinas',
    tag: 'LÍNEA DE AUTOR 05',
    subtitle: 'Reuniones ejecutivas, counter de recepción y estaciones multipuesto.',
    desc: 'Proyectamos la solidez de tu empresa mediante acabados limpios y arquitectura contemporánea. Mesas de directorio con cajas de conectividad integradas para HDMI, USB y red; counters de bienvenida con iluminación indirecta y perfiles metálicos termolacados con pintura electrostática.',
    img: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp',
    gallery: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-004.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-005.webp',
      '/images/catalog/extracted_MUEBLES_OFICINA/img-006.webp',
    ],
    specs: [
      'Tipologías: Recepciones, directorios y puestos modulares',
      'Conectividad: Cajas de conexiones rebatibles en aluminio',
      'Durabilidad: Tapas termoformadas de 25mm y cantos de 2mm',
      'Instalación: Logística nocturna disponible para corporativos',
    ],
  },
  {
    id: 'puertas',
    title: 'Puertas Pivotantes & Puertas de Paso',
    tag: 'LÍNEA DE AUTOR 06',
    subtitle: 'Acceso monumental de hasta 3 metros con pivotante de acero y núcleo aislante.',
    desc: 'Puertas de ingreso principal monumentales con sistema pivotante axial de alta capacidad de carga. Núcleo con aislante acústico y térmico, acabados en láminas de roble natural, melaminas sincronizadas o lacado mate. Marcos envolventes y cerraduras digitales biométricas opcionales.',
    img: '/images/catalog/extracted_DE_PUERTAS/img-004.webp',
    gallery: [
      '/images/catalog/extracted_DE_PUERTAS/img-005.webp',
      '/images/catalog/extracted_DE_PUERTAS/img-006.webp',
      '/images/catalog/extracted_DE_PUERTAS/img-007.webp',
    ],
    specs: [
      'Sistema: Pivote axial reforzado de acero inoxidable 304',
      'Dimensiones: Alturas monumentales de 2.40m hasta 3.00m',
      'Núcleo: Aislamiento termoacústico de alta densidad',
      'Seguridad: Compatibilidad con cerraduras biométricas',
    ],
  },
  {
    id: 'gamer',
    title: 'Setups Gamer & Streaming',
    tag: 'LÍNEA DE AUTOR 07',
    subtitle: 'Canalización oculta al 100%, soporte multipantalla y perfiles LED RGB.',
    desc: 'El equilibrio entre rendimiento térmico, estética inmersiva y resistencia estructural. Capaces de albergar torres de gran volumen con flujo de aire optimizado, brazos neumáticos de monitor y sistemas de control para tiras LED direccionables ARGB.',
    img: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp',
    gallery: [
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-005.webp',
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-006.webp',
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-007.webp',
    ],
    specs: [
      'Capacidad: Refuerzo inferior con travesaños de acero',
      'Cables: Ruteo 100% ciego de punta a punta',
      'Iluminación: Difusor negro para perfil LED integrado',
      'Acabado: Carbono texturizado y negro mate antihuella',
    ],
  },
  {
    id: 'estimulacion',
    title: 'Circuitos de Estimulación & Espacios Infantiles',
    tag: 'LÍNEA DE AUTOR 08',
    subtitle: 'Módulos sensoriales y psicomotrices con diseño Montessori y bordes seguros.',
    desc: 'Espacios didácticos para desarrollo motor y estimulación sensorial temprana. Fabricados con maderas seleccionadas y melaminas no tóxicas, con aristas boleadas para máxima seguridad de los niños. Módulos de trepada, rampas de equilibrio y estanterías Montessori de baja altura para autonomía infantil.',
    img: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp',
    gallery: [
      '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-004.webp',
      '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-008.webp',
      '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-012.webp',
    ],
    specs: [
      'Seguridad: Aristas y bordes totalmente boleados y sellados',
      'Materiales: Tableros antibacterianos certificados libres de emisiones',
      'Pedagogía: Diseños bajo metodología Montessori y motricidad libre',
      'Resistencia: Ensambles reforzados para uso intensivo en centros infantiles',
    ],
  },
];

/**
 * Genera el Catálogo PDF Editorial de Lujo estilo Revista de Arquitectura
 * Si categoryId está presente, genera el catálogo especializado de esa categoría.
 * Si categoryId no se proporciona o es 'todos', genera el catálogo completo oficial.
 */
export async function generateLuxuryCatalogPdf(
  categoryId?: string,
  onProgress?: (msg: string) => void
) {
  onProgress?.('Preparando maquetación de autor...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Cargar logotipo preservando relación de aspecto natural
  const logoInfo = await toBase64PngInfo('/logo.png');

  // Función para estampar la marca de agua translúcida proporcional en el centro
  const applyWatermark = () => {
    if (!logoInfo) return;
    try {
      const gStateClass = (doc as any).GState;
      if (typeof gStateClass === 'function' && typeof (doc as any).setGState === 'function') {
        (doc as any).setGState(new gStateClass({ opacity: 0.07 }));
      }
      const wmWidth = 110;
      const wmHeight = wmWidth / logoInfo.aspect; // Proporción exacta, cero distorsión vertical
      doc.addImage(
        logoInfo.data,
        'PNG',
        (pageWidth - wmWidth) / 2,
        (pageHeight - wmHeight) / 2,
        wmWidth,
        wmHeight,
        undefined,
        'FAST'
      );
      if (typeof gStateClass === 'function' && typeof (doc as any).setGState === 'function') {
        (doc as any).setGState(new gStateClass({ opacity: 1.0 }));
      }
    } catch {
      // Ignorar si falla el estado gráfico
    }
  };

  // Filtrar categorías a incluir
  const isSingle = Boolean(categoryId && categoryId !== 'todos');
  const targetCategories = isSingle
    ? ALL_CATALOG_CATEGORIES_PDF.filter((c) => c.id.toLowerCase() === categoryId!.toLowerCase())
    : ALL_CATALOG_CATEGORIES_PDF;

  const currentCategory = isSingle && targetCategories.length > 0 ? targetCategories[0] : null;

  // ─────────────────────────────────────────────────────────────
  // PÁGINA 1: PORTADA EDITORIAL (ESTILO REVISTA LUXURY)
  // ─────────────────────────────────────────────────────────────
  onProgress?.('Diseñando portada de autor...');

  // Fondo cálido arquitectónico (tono piedra / marfil)
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Marco perimetral fino editorial
  doc.setDrawColor(210, 205, 195);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Marca de agua central
  applyWatermark();

  // Logotipo en cabecera de portada CON PROPORCIÓN EXACTA (no estirado verticalmente)
  if (logoInfo) {
    const logoW = 38;
    const logoH = logoW / logoInfo.aspect; // Proporción natural perfecta
    doc.addImage(logoInfo.data, 'PNG', (pageWidth - logoW) / 2, 23, logoW, logoH);
  }

  // Textos de Portada
  doc.setTextColor(30, 25, 20);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text('MODULARES GM', pageWidth / 2, 63, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(140, 110, 60);
  doc.text('COCINAS DE AUTOR • MESONES DE CUARZO • MOBILIARIO MODULAR', pageWidth / 2, 70, { align: 'center' });

  // Línea divisoria elegante
  doc.setDrawColor(180, 150, 90);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 40, 75, pageWidth / 2 + 40, 75);

  // Título de la Edición
  doc.setFont('times', 'italic');
  doc.setFontSize(18);
  doc.setTextColor(40, 35, 30);
  const editionTitle = currentCategory
    ? `Catálogo Especializado: ${currentCategory.title} 2026`
    : 'Catálogo Oficial de Colecciones 2026';
  doc.text(editionTitle, pageWidth / 2, 88, { align: 'center' });

  // Fotografía de Portada de Alta Gama
  const coverImgUrl = currentCategory ? currentCategory.img : '/images/catalog/extracted_DE_COCINAS/img-004.webp';
  const coverImg = await toBase64Jpeg(coverImgUrl);
  if (coverImg) {
    doc.addImage(coverImg, 'JPEG', 24, 98, pageWidth - 48, 122);
  }

  // Cuadro de estándares al pie de portada
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 215, 205);
  doc.roundedRect(24, 228, pageWidth - 48, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 35, 30);
  doc.text('ESTÁNDAR DE FABRICACIÓN CERTIFICADO GM', pageWidth / 2, 236, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 85, 80);
  doc.text('• Tableros Pelikano RH Hidrófugo 18mm con protección antibacterial', 32, 244);
  doc.text('• Herrajes alemanes Blum y Häfele con amortiguación de cierre suave', 32, 250);
  doc.text('• Mesones en Cuarzo Calacatta antibacterial, Silestone y Granito San Gabriel', 32, 256);

  // Pie de página de portada
  doc.setFontSize(8);
  doc.setTextColor(130, 125, 120);
  doc.text('Quito, Ecuador • www.modularesgm.com • WhatsApp: +593 96 306 4374', pageWidth / 2, 278, { align: 'center' });

  // ─────────────────────────────────────────────────────────────
  // PÁGINAS DE CONTENIDO POR CATEGORÍA (EDITORIAL SPREADS)
  // ─────────────────────────────────────────────────────────────
  for (let i = 0; i < targetCategories.length; i++) {
    const item = targetCategories[i];
    onProgress?.(`Compilando página ${i + 2}: ${item.title}...`);

    doc.addPage();
    applyWatermark();

    // Encabezado de página
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 110, 60);
    doc.text(item.tag, 20, 18);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('MODULARES GM • CATÁLOGO ARQUITECTÓNICO 2026', pageWidth - 20, 18, { align: 'right' });

    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.line(20, 21, pageWidth - 20, 21);

    // Título de la categoría
    doc.setFont('times', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(30, 25, 20);
    doc.text(item.title, 20, 31);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 95, 90);
    doc.text(item.subtitle, 20, 37);

    // Fotografía principal del producto
    const catImg = await toBase64Jpeg(item.img);
    if (catImg) {
      doc.addImage(catImg, 'JPEG', 20, 42, pageWidth - 40, 95);
    }

    // Texto Justificado Editorial
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(45, 40, 35);
    const splitDesc = doc.splitTextToSize(item.desc, pageWidth - 40);
    doc.text(splitDesc, 20, 147, { align: 'justify', maxWidth: pageWidth - 40 });

    // Cuadro de Especificaciones Técnicas
    doc.setFillColor(248, 246, 242);
    doc.setDrawColor(215, 210, 200);
    doc.roundedRect(20, 184, pageWidth - 40, 64, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(35, 30, 25);
    doc.text('ESPECIFICACIONES TÉCNICAS Y GARANTÍA', 28, 195);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 65, 60);

    let specY = 205;
    for (const spec of item.specs) {
      doc.text(`✓  ${spec}`, 28, specY);
      specY += 9;
    }

    // Si es un catálogo individual y tiene fotos secundarias, agregar página de galería
    if (isSingle && item.gallery && item.gallery.length > 0) {
      doc.addPage();
      applyWatermark();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(140, 110, 60);
      doc.text(`${item.tag} • GALERÍA DE PROYECTOS`, 20, 18);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('MODULARES GM • FABRICACIÓN DE AUTOR', pageWidth - 20, 18, { align: 'right' });

      doc.setDrawColor(220, 215, 205);
      doc.setLineWidth(0.3);
      doc.line(20, 21, pageWidth - 20, 21);

      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(30, 25, 20);
      doc.text(`Modelos & Acabados en ${item.title}`, 20, 31);

      // Renderizar 2 o 3 fotos de galería
      let galY = 38;
      for (const galPhoto of item.gallery.slice(0, 2)) {
        const galImg = await toBase64Jpeg(galPhoto);
        if (galImg) {
          doc.addImage(galImg, 'JPEG', 20, galY, pageWidth - 40, 95);
          galY += 105;
        }
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Cotizaciones y Planimetría 3D: info@modularesgm.com | +593 96 306 4374', 20, 285);
    }

    // Pie de página de contenido
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${doc.getNumberOfPages()}`, pageWidth / 2, 285, { align: 'center' });
    doc.text('Cotizaciones y Planimetría 3D: info@modularesgm.com | +593 96 306 4374', 20, 285);
  }

  // ─────────────────────────────────────────────────────────────
  // PÁGINA FINAL: CONTRAPORTADA Y CONTACTO DIRECTO
  // ─────────────────────────────────────────────────────────────
  onProgress?.('Generando contraportada y sellos de garantía...');

  doc.addPage();
  doc.setFillColor(26, 22, 18);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Marca de agua central en blanco/translúcido
  applyWatermark();

  if (logoInfo) {
    const backLogoW = 38;
    const backLogoH = backLogoW / logoInfo.aspect; // Proporción natural
    doc.addImage(logoInfo.data, 'PNG', (pageWidth - backLogoW) / 2, 42, backLogoW, backLogoH);
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('MODULARES GM', pageWidth / 2, 86, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 170, 110);
  doc.text('EXCELENCIA PLANIMÉTRICA & FABRICACIÓN DE AUTOR', pageWidth / 2, 94, { align: 'center' });

  doc.setDrawColor(200, 170, 110);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 30, 101, pageWidth / 2 + 30, 101);

  // Información del Atelier
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(230, 230, 230);
  doc.text('Atelier & Showroom:', pageWidth / 2, 120, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Rosa Yeira 420 y Serpaio Japeravi', pageWidth / 2, 128, { align: 'center' });
  doc.text('Quito • Pichincha • Ecuador', pageWidth / 2, 135, { align: 'center' });

  // Canales de Atención Directa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(190, 190, 190);
  doc.text('WhatsApp Oficial: +593 96 306 4374', pageWidth / 2, 155, { align: 'center' });
  doc.text('Correo Electrónico: info@modularesgm.com', pageWidth / 2, 163, { align: 'center' });
  doc.text('Plataforma Web: https://www.modularesgm.com', pageWidth / 2, 171, { align: 'center' });

  // Cuadro de Cobertura Nacional
  doc.setFillColor(36, 32, 28);
  doc.setDrawColor(60, 55, 50);
  doc.roundedRect(30, 195, pageWidth - 60, 45, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(200, 170, 110);
  doc.text('COBERTURA DE ENTREGA E INSTALACIÓN', pageWidth / 2, 207, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(210, 210, 210);
  doc.text('Personal técnico especializado con cobertura en Quito, Guayaquil,', pageWidth / 2, 217, { align: 'center' });
  doc.text('Cuenca, Manta, Ambato y envíos asegurados a todo el territorio ecuatoriano.', pageWidth / 2, 224, { align: 'center' });
  doc.text('Diseño planimétrico 3D previo sin costo al contratar tu proyecto.', pageWidth / 2, 231, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text('© 2026 MODULARES GM. Todos los derechos reservados.', pageWidth / 2, 272, { align: 'center' });

  onProgress?.('¡Catálogo generado! Descargando archivo...');

  const fileName = isSingle && currentCategory
    ? `Catalogo_${currentCategory.id.toUpperCase()}_Modulares_GM_2026.pdf`
    : 'Catalogo_Oficial_Modulares_GM_2026.pdf';

  doc.save(fileName);
}
