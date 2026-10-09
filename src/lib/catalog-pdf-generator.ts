import jsPDF from 'jspdf';
import { ALL_CATALOG_PRODUCTS } from './catalog-full';
import type { Product } from './types';

interface ImageBase64Info {
  data: string;
  width: number;
  height: number;
  aspect: number;
}

/**
 * Convierte una imagen a Base64 JPEG usando canvas en el navegador,
 * limitando el tamaño a maxDim para optimizar memoria y tiempo de generación.
 */
async function toBase64Jpeg(url: string, maxDim = 1200): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth || img.width || 800;
        let h = img.naturalHeight || img.height || 600;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round(h * (maxDim / w));
            w = maxDim;
          } else {
            w = Math.round(w * (maxDim / h));
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Convierte una imagen a Base64 PNG preservando canal alfa y relación de aspecto natural
 * (para logotipos y sellos sin deformación vertical).
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

export interface CategoryMetadata {
  key: string;
  title: string;
  tag: string;
  subtitle: string;
  coverHero: string;
  layoutType: 'kitchen' | 'doors_office' | 'bath_closet';
  itemsPerPage: number;
}

export const CATEGORY_CATALOG_CONFIG: Record<string, CategoryMetadata> = {
  Cocinas: {
    key: 'Cocinas',
    title: 'Cocinas Integrales & Cuarzo',
    tag: 'LÍNEA DE AUTOR 01 • COCINAS',
    subtitle: 'Islas de cuarzo Calacatta Gold, melamina RH 18mm hidrófuga y herrajes alemanes Blum.',
    coverHero: '/images/catalog/extracted_DE_COCINAS/img-004.webp',
    layoutType: 'kitchen',
    itemsPerPage: 1, // 1 cocina por hoja
  },
  Closets: {
    key: 'Closets',
    title: 'Walk-in Closets & Vestidores',
    tag: 'LÍNEA DE AUTOR 02 • CLÓSETS',
    subtitle: 'Diseños de piso a techo con iluminación LED integrada, pantaloneros y vitrinas templadas.',
    coverHero: '/images/catalog/extracted_CLOSETS_1/img-017.webp',
    layoutType: 'bath_closet',
    itemsPerPage: 2, // 2 closets por hoja
  },
  'Baño': {
    key: 'Baño',
    title: 'Vanities & Muebles de Baño Flotantes',
    tag: 'LÍNEA DE AUTOR 03 • BAÑOS',
    subtitle: 'Resistencia total al vapor y humedad, tableros marinos y encimeras de cuarzo macizo.',
    coverHero: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp',
    layoutType: 'bath_closet',
    itemsPerPage: 2, // 2 muebles de baño por hoja
  },
  Escritorios: {
    key: 'Escritorios',
    title: 'Escritorios & Estaciones Home Office',
    tag: 'LÍNEA DE AUTOR 04 • ESCRITORIOS',
    subtitle: 'Ergonomía superior, pasacables integrados, cajoneras con llave y superficies antirrayas.',
    coverHero: '/images/catalog/extracted_estudiantiles/img-000.webp',
    layoutType: 'doors_office',
    itemsPerPage: 3, // 3 escritorios por hoja alternando
  },
  Oficina: {
    key: 'Oficina',
    title: 'Mobiliario Corporativo & Oficinas',
    tag: 'LÍNEA DE AUTOR 05 • OFICINAS',
    subtitle: 'Counters de recepción monolíticos, mesas de directorio y estaciones modulares ejecutivas.',
    coverHero: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp',
    layoutType: 'doors_office',
    itemsPerPage: 3, // 3 de oficina por hoja alternando
  },
  Puertas: {
    key: 'Puertas',
    title: 'Puertas Pivotantes & de Paso',
    tag: 'LÍNEA DE AUTOR 06 • PUERTAS',
    subtitle: 'Ingresos de hasta 3 metros de altura con sistema pivotante de acero y cerradura digital.',
    coverHero: '/images/catalog/extracted_DE_PUERTAS/img-007.webp',
    layoutType: 'doors_office',
    itemsPerPage: 3, // 3 puertas por hoja alternando
  },
  Gamer: {
    key: 'Gamer',
    title: 'Setups Gamer & Centros de Streaming',
    tag: 'LÍNEA DE AUTOR 07 • GAMER',
    subtitle: 'Soporte multipantalla reforzado, ruteo ciego de cables e iluminación RGB oculta.',
    coverHero: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp',
    layoutType: 'bath_closet',
    itemsPerPage: 2, // 2 gamer por hoja
  },
  'Estimulación': {
    key: 'Estimulación',
    title: 'Circuitos de Estimulación Infantil',
    tag: 'LÍNEA DE AUTOR 08 • ESTIMULACIÓN',
    subtitle: 'Módulos psicomotrices Montessori con acabados boleados no tóxicos para máxima seguridad.',
    coverHero: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp',
    layoutType: 'bath_closet',
    itemsPerPage: 2, // 2 de estimulación por hoja
  },
};

/**
 * Resuelve el identificador de categoría ingresado hacia la clave normalizada
 */
export function resolveCategoryKey(catId?: string | null): string {
  if (!catId || catId === 'todos') return 'todos';
  const c = catId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (c.includes('cocina')) return 'Cocinas';
  if (c.includes('closet')) return 'Closets';
  if (c.includes('bano') || c.includes('vanit')) return 'Baño';
  if (c.includes('escritorio')) return 'Escritorios';
  if (c.includes('oficina') || c.includes('corporativ')) return 'Oficina';
  if (c.includes('puerta')) return 'Puertas';
  if (c.includes('gamer')) return 'Gamer';
  if (c.includes('estimula')) return 'Estimulación';
  return catId;
}

/**
 * Obtiene la fotografía del producto asegurando que NUNCA repita la portada en la primera página
 */
function getProductPhoto(product: Product, coverHeroUrl?: string): string {
  if (!coverHeroUrl || product.imgUrl !== coverHeroUrl) {
    return product.imgUrl;
  }
  // Si la foto principal coincide con la portada, usar el ángulo secundario
  if (product.images && product.images.length > 1) {
    const alternate = product.images.find((img: string) => img !== coverHeroUrl);
    if (alternate) return alternate;
  }
  return product.imgUrl;
}

/**
 * Genera el Catálogo PDF Editorial de Lujo estilo Revista de Arquitectura
 * Cumple estrictamente con las reglas:
 * - Cocinas: 1 por hoja, modelos únicos sin repetir fotos
 * - Puertas: 3 por hoja alternando derecha-izq-derecha / izq-der-izq
 * - Oficina: 3 por hoja alternando
 * - Escritorios: 3 por hoja alternando
 * - Muebles de Baño: 2 por hoja alternando
 * - Clósets: 2 por hoja alternando
 * - Gamer & Estimulación: 2 por hoja alternando
 * - Saludo/Portada al inicio y Despedida/Contraportada al final
 * - Cero duplicación de la foto de portada en la primera hoja interior
 */
export async function generateLuxuryCatalogPdf(
  categoryId?: string,
  onProgress?: (msg: string) => void
) {
  onProgress?.('Preparando maquetación arquitectónica...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Cargar logotipo preservando relación de aspecto natural
  const logoInfo = await toBase64PngInfo('/logo.png');

  // Marca de agua central sin deformación
  const applyWatermark = () => {
    if (!logoInfo) return;
    try {
      const gStateClass = (doc as any).GState;
      if (typeof gStateClass === 'function' && typeof (doc as any).setGState === 'function') {
        (doc as any).setGState(new gStateClass({ opacity: 0.06 }));
      }
      const wmW = 110;
      const wmH = wmW / logoInfo.aspect;
      doc.addImage(
        logoInfo.data,
        'PNG',
        (pageWidth - wmW) / 2,
        (pageHeight - wmH) / 2,
        wmW,
        wmH,
        undefined,
        'FAST'
      );
      if (typeof gStateClass === 'function' && typeof (doc as any).setGState === 'function') {
        (doc as any).setGState(new gStateClass({ opacity: 1.0 }));
      }
    } catch {
      // Ignorar fallback
    }
  };

  const drawHeader = (tag: string, categoryTitle: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 110, 60);
    doc.text(tag, 18, 14);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 145, 140);
    doc.text('MODULARES GM • CATÁLOGO ARQUITECTÓNICO 2026', pageWidth - 18, 14, { align: 'right' });

    doc.setDrawColor(215, 210, 200);
    doc.setLineWidth(0.3);
    doc.line(18, 17, pageWidth - 18, 17);
  };

  const drawFooter = (pageNum: number) => {
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.line(18, 282, pageWidth - 18, 282);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 135, 130);
    doc.text('Cotizaciones & Planimetría 3D: info@modularesgm.com | WhatsApp: +593 96 306 4374', 18, 287);
    doc.text(`Página ${pageNum}`, pageWidth - 18, 287, { align: 'right' });
  };

  // Determinar categorías a procesar
  const targetKey = resolveCategoryKey(categoryId);
  const isSingle = targetKey !== 'todos';

  const categoryEntries = isSingle && CATEGORY_CATALOG_CONFIG[targetKey]
    ? [CATEGORY_CATALOG_CONFIG[targetKey]]
    : Object.values(CATEGORY_CATALOG_CONFIG);

  const mainCategory = isSingle ? CATEGORY_CATALOG_CONFIG[targetKey] : null;

  // ─────────────────────────────────────────────────────────────
  // PÁGINA 1: SALUDO & PORTADA EDITORIAL (REVISTA DE ARQUITECTURA)
  // ─────────────────────────────────────────────────────────────
  onProgress?.('Diseñando portada de autor...');

  // Fondo cálido arquitectónico (marfil / piedra)
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Marco perimetral fino editorial doble
  doc.setDrawColor(215, 208, 198);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.25);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  applyWatermark();

  // Logotipo de cabecera con proporción natural
  if (logoInfo) {
    const logoW = 36;
    const logoH = logoW / logoInfo.aspect;
    doc.addImage(logoInfo.data, 'PNG', (pageWidth - logoW) / 2, 20, logoW, logoH);
  }

  // Título de la marca
  doc.setTextColor(30, 25, 20);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text('MODULARES GM', pageWidth / 2, 56, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(140, 110, 60);
  doc.text('COCINAS DE AUTOR • MESONES DE CUARZO • MOBILIARIO MODULAR A MEDIDA', pageWidth / 2, 63, { align: 'center' });

  doc.setDrawColor(180, 150, 90);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 35, 67, pageWidth / 2 + 35, 67);

  // Título de la Edición
  doc.setFont('times', 'italic');
  doc.setFontSize(17);
  doc.setTextColor(40, 35, 30);
  const editionTitle = mainCategory
    ? `Catálogo Editorial: ${mainCategory.title} 2026`
    : 'Catálogo Oficial de Colecciones GM 2026';
  doc.text(editionTitle, pageWidth / 2, 78, { align: 'center' });

  // Fotografía de Portada de Alta Gama (Dedidada)
  const coverHeroUrl = mainCategory
    ? mainCategory.coverHero
    : '/images/catalog/extracted_DE_COCINAS/img-006.webp';
  const coverImg = await toBase64Jpeg(coverHeroUrl, 1400);
  if (coverImg) {
    doc.addImage(coverImg, 'JPEG', 20, 86, pageWidth - 40, 134);
    doc.setDrawColor(210, 205, 195);
    doc.setLineWidth(0.3);
    doc.rect(20, 86, pageWidth - 40, 134);
  }

  // Cuadro de estándares y certificaciones al pie de portada
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 215, 205);
  doc.roundedRect(20, 226, pageWidth - 40, 42, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(35, 30, 25);
  doc.text('ESTÁNDAR DE FABRICACIÓN CERTIFICADO & COMPROMISO GM', pageWidth / 2, 234, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(80, 75, 70);
  doc.text('• Tableros Pelikano RH Hidrófugo 18mm con protección antibacterial certificada', 26, 242);
  doc.text('• Herrajes europeos Blum con bisagras clip-top y sistemas de elevación amortiguados', 26, 248);
  doc.text('• Mesones en Cuarzo Calacatta Gold antibacterial, Silestone y Granito San Gabriel', 26, 254);
  doc.text('• Garantía directa de 10 años en superficies de cuarzo y 5 años en estructura modular', 26, 260);

  // Pie de portada
  doc.setFontSize(8);
  doc.setTextColor(130, 125, 120);
  doc.text('Quito, Ecuador • www.modularesgm.com • WhatsApp: +593 96 306 4374', pageWidth / 2, 279, { align: 'center' });

  // ─────────────────────────────────────────────────────────────
  // PÁGINAS DE CONTENIDO: ITERACIÓN POR CATEGORÍA
  // ─────────────────────────────────────────────────────────────
  let totalProcessed = 0;

  for (const catConfig of categoryEntries) {
    const categoryProducts = ALL_CATALOG_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === catConfig.key.toLowerCase()
    );

    if (categoryProducts.length === 0) continue;

    onProgress?.(`Procesando colección ${catConfig.title}...`);

    // ─────────────────────────────────────────────────────────
    // CASO 1: COCINAS (1 cocina por hoja, modelos únicos)
    // ─────────────────────────────────────────────────────────
    if (catConfig.layoutType === 'kitchen') {
      for (let i = 0; i < categoryProducts.length; i++) {
        const prod = categoryProducts[i];
        totalProcessed++;
        onProgress?.(`Cocinas: Modelo ${i + 1} de ${categoryProducts.length}...`);

        doc.addPage();
        applyWatermark();
        const currentPageNum = doc.getNumberOfPages();
        drawHeader(catConfig.tag, catConfig.title);

        // Título del modelo
        doc.setFont('times', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(30, 25, 20);
        doc.text(prod.title, 18, 26);

        // Subtítulo editorial
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(140, 110, 60);
        doc.text(
          `Línea de Autor • Acabado Pelikano RH 18mm & Herrajes Blum • ${prod.dimensions || 'A medida'}`,
          18,
          31
        );

        // Fotografía principal del modelo (Evitando duplicar la foto de la portada)
        const photoUrl = getProductPhoto(prod, catConfig.coverHero);
        const mainImg = await toBase64Jpeg(photoUrl, 1400);

        if (mainImg) {
          doc.addImage(mainImg, 'JPEG', 18, 36, pageWidth - 36, 118);
          doc.setDrawColor(215, 210, 200);
          doc.setLineWidth(0.3);
          doc.rect(18, 36, pageWidth - 36, 118);
        }

        // Párrafo descriptivo justificado
        doc.setFont('times', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(45, 40, 35);
        const descText =
          prod.desc ||
          'Cocina integral diseñada bajo rigurosos criterios de ergonomía arquitectónica. Módulos altos y bajos estructurados en melamina RH de 18mm con herrajes alemanes de extracción total y mesón de cuarzo macizo pulido.';
        const splitDesc = doc.splitTextToSize(descText, pageWidth - 36);
        doc.text(splitDesc, 18, 162, { align: 'justify', maxWidth: pageWidth - 36 });

        // Ficha técnica y foto secundaria (si existe)
        const secondaryPhoto =
          prod.images && prod.images.length > 1 && prod.images[1] !== photoUrl
            ? prod.images[1]
            : null;

        const cardY = 176;
        const cardH = 98;
        doc.setFillColor(250, 248, 244);
        doc.setDrawColor(220, 215, 205);
        doc.roundedRect(18, cardY, pageWidth - 36, cardH, 2.5, 2.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(35, 30, 25);
        doc.text('ESPECIFICACIONES TÉCNICAS Y EQUIPAMIENTO', 25, cardY + 9);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(70, 65, 60);

        let specY = cardY + 18;
        const specs = [
          'Estructura: Melamina Pelikano RH 18mm hidrófuga antibacterial',
          'Herrajes: Bisagras y rieles Blum Clip-Top Blumotion con cierre suave',
          'Encimera: Cuarzo pulido antibacteriano de 20mm con zócalo y copete',
          'Almacenaje: Caceroleros de extracción total, especiero y torre de hornos',
          'Garantía: 10 años en superficies de cuarzo y 5 años en estructura',
          'Cotización referencial: $' + prod.price + ' USD (o según metraje exacto)',
        ];

        const textWidthLimit = secondaryPhoto ? 95 : pageWidth - 55;
        for (const spec of specs) {
          doc.text(`✓  ${spec}`, 25, specY, { maxWidth: textWidthLimit });
          specY += 9;
        }

        // Renderizar ángulo secundario / detalle de la misma cocina si existe
        if (secondaryPhoto) {
          const secImg = await toBase64Jpeg(secondaryPhoto, 800);
          if (secImg) {
            const secX = pageWidth - 18 - 65;
            const secY = cardY + 14;
            doc.addImage(secImg, 'JPEG', secX, secY, 58, 68);
            doc.setDrawColor(200, 195, 185);
            doc.setLineWidth(0.3);
            doc.rect(secX, secY, 58, 68);

            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7);
            doc.setTextColor(130, 125, 120);
            doc.text('Detalle interior / Ángulo de módulos', secX + 29, secY + 73, { align: 'center' });
          }
        }

        drawFooter(currentPageNum);
      }
    }

    // ─────────────────────────────────────────────────────────
    // CASO 2: PUERTAS, OFICINA, ESCRITORIOS (3 por hoja alternando)
    // "puertas 3 por hoja alternando derecha izq derecha, en la otra izq der iz"
    // ─────────────────────────────────────────────────────────
    else if (catConfig.layoutType === 'doors_office') {
      const itemsPerPage = 3;
      const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);

      for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        doc.addPage();
        applyWatermark();
        const currentPageNum = doc.getNumberOfPages();
        drawHeader(catConfig.tag, catConfig.title);

        const pageProducts = categoryProducts.slice(
          pageIdx * itemsPerPage,
          (pageIdx + 1) * itemsPerPage
        );

        // Coordenadas de los 3 slots verticales
        const slotHeights = [
          { y: 22, h: 82 },
          { y: 108, h: 82 },
          { y: 194, h: 82 },
        ];

        for (let slotIdx = 0; slotIdx < pageProducts.length; slotIdx++) {
          const prod = pageProducts[slotIdx];
          const slot = slotHeights[slotIdx];
          totalProcessed++;

          // Lógica de alternancia solicitada:
          // En página par (0, 2, ...): Slot 0 = Izq, Slot 1 = Der, Slot 2 = Izq
          // En página impar (1, 3, ...): Slot 0 = Der, Slot 1 = Izq, Slot 2 = Der
          const isEvenPage = pageIdx % 2 === 0;
          const imageOnLeft = isEvenPage ? slotIdx % 2 === 0 : slotIdx % 2 !== 0;

          const imgW = 70;
          const imgH = 74;
          const imgX = imageOnLeft ? 18 : pageWidth - 18 - imgW;
          const textX = imageOnLeft ? 94 : 18;
          const textW = pageWidth - 36 - imgW - 8;

          // Fotografía
          const photoUrl = getProductPhoto(prod, catConfig.coverHero);
          const itemImg = await toBase64Jpeg(photoUrl, 900);
          if (itemImg) {
            doc.addImage(itemImg, 'JPEG', imgX, slot.y + 4, imgW, imgH);
            doc.setDrawColor(215, 210, 200);
            doc.setLineWidth(0.3);
            doc.rect(imgX, slot.y + 4, imgW, imgH);
          }

          // Textos & Especificaciones
          doc.setFont('times', 'bold');
          doc.setFontSize(13);
          doc.setTextColor(30, 25, 20);
          doc.text(prod.title, textX, slot.y + 11);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(140, 110, 60);
          doc.text(`CATEGORÍA: ${prod.subcategory || catConfig.title.toUpperCase()}`, textX, slot.y + 17);

          doc.setFont('times', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(50, 45, 40);
          const splitDesc = doc.splitTextToSize(
            prod.desc || 'Fabricación a medida con melamina de alta resistencia RH y componentes de ensamble oculto.',
            textW
          );
          doc.text(splitDesc.slice(0, 2), textX, slot.y + 24);

          // Ficha técnica compacta
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(80, 75, 70);
          doc.text(`• Material: ${prod.material || 'Melamina Pelikano RH 18mm'}`, textX, slot.y + 41);
          doc.text(`• Medidas: ${prod.dimensions || 'Personalizables a su espacio'}`, textX, slot.y + 47);
          doc.text('• Herrajes: Cierre amortiguado y rodamientos reforzados', textX, slot.y + 53);

          // Precio
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 25, 20);
          doc.text(`Inversión referencial: $${prod.price} USD`, textX, slot.y + 63);

          // Línea divisoria entre slots
          if (slotIdx < 2 && slotIdx < pageProducts.length - 1) {
            doc.setDrawColor(230, 225, 218);
            doc.setLineWidth(0.2);
            doc.line(18, slot.y + slot.h + 2, pageWidth - 18, slot.y + slot.h + 2);
          }
        }

        drawFooter(currentPageNum);
      }
    }

    // ─────────────────────────────────────────────────────────
    // CASO 3: BAÑOS, CLÓSETS, GAMER, ESTIMULACIÓN (2 por hoja alternando)
    // "muebles de baño 2, closets dos"
    // ─────────────────────────────────────────────────────────
    else if (catConfig.layoutType === 'bath_closet') {
      const itemsPerPage = 2;
      const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);

      for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        doc.addPage();
        applyWatermark();
        const currentPageNum = doc.getNumberOfPages();
        drawHeader(catConfig.tag, catConfig.title);

        const pageProducts = categoryProducts.slice(
          pageIdx * itemsPerPage,
          (pageIdx + 1) * itemsPerPage
        );

        // 2 slots verticales generosos
        const slotHeights = [
          { y: 24, h: 124 },
          { y: 153, h: 124 },
        ];

        for (let slotIdx = 0; slotIdx < pageProducts.length; slotIdx++) {
          const prod = pageProducts[slotIdx];
          const slot = slotHeights[slotIdx];
          totalProcessed++;

          // Alternancia:
          // Pag par: Slot 0 = Izq, Slot 1 = Der
          // Pag impar: Slot 0 = Der, Slot 1 = Izq
          const isEvenPage = pageIdx % 2 === 0;
          const imageOnLeft = isEvenPage ? slotIdx === 0 : slotIdx !== 0;

          const imgW = 86;
          const imgH = 114;
          const imgX = imageOnLeft ? 18 : pageWidth - 18 - imgW;
          const textX = imageOnLeft ? 110 : 18;
          const textW = pageWidth - 36 - imgW - 8;

          // Fotografía
          const photoUrl = getProductPhoto(prod, catConfig.coverHero);
          const itemImg = await toBase64Jpeg(photoUrl, 1000);
          if (itemImg) {
            doc.addImage(itemImg, 'JPEG', imgX, slot.y + 4, imgW, imgH);
            doc.setDrawColor(215, 210, 200);
            doc.setLineWidth(0.3);
            doc.rect(imgX, slot.y + 4, imgW, imgH);
          }

          // Textos
          doc.setFont('times', 'bold');
          doc.setFontSize(15);
          doc.setTextColor(30, 25, 20);
          doc.text(prod.title, textX, slot.y + 14);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(140, 110, 60);
          doc.text(`COLECCIÓN: ${catConfig.title.toUpperCase()}`, textX, slot.y + 22);

          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(45, 40, 35);
          const splitDesc = doc.splitTextToSize(
            prod.desc || 'Mobiliario modular fabricado a medida bajo estándares de alta resistencia y durabilidad.',
            textW
          );
          doc.text(splitDesc, textX, slot.y + 31, { align: 'justify', maxWidth: textW });

          // Caja de especificaciones técnicas
          const specBoxY = slot.y + 54;
          doc.setFillColor(250, 248, 244);
          doc.setDrawColor(220, 215, 205);
          doc.roundedRect(textX, specBoxY, textW, 46, 2, 2, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(35, 30, 25);
          doc.text('FICHA TÉCNICA', textX + 6, specBoxY + 8);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(75, 70, 65);
          doc.text(`• Material: ${prod.material || 'Melamina Pelikano RH 18mm'}`, textX + 6, specBoxY + 16);
          doc.text(`• Medidas: ${prod.dimensions || 'Adaptables al plano de obra'}`, textX + 6, specBoxY + 23);
          doc.text('• Acabados: Cantos rígidos termo-adheridos sin juntas', textX + 6, specBoxY + 30);
          doc.text('• Resistencia: Protección antihumedad e impacto', textX + 6, specBoxY + 37);

          // Precio
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 25, 20);
          doc.text(`Inversión referencial: $${prod.price} USD`, textX, slot.y + 115);

          // Divisor entre slots
          if (slotIdx === 0 && pageProducts.length > 1) {
            doc.setDrawColor(225, 220, 210);
            doc.setLineWidth(0.3);
            doc.line(18, slot.y + slot.h + 2, pageWidth - 18, slot.y + slot.h + 2);
          }
        }

        drawFooter(currentPageNum);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PÁGINA FINAL: DESPEDIDA, ATELIER & GARANTÍA DIRECTA
  // ─────────────────────────────────────────────────────────────
  onProgress?.('Generando contraportada y sellos de garantía...');

  doc.addPage();
  doc.setFillColor(26, 22, 18); // Tono pizarra oscura de lujo
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  applyWatermark();

  // Marco perimetral fino dorado
  doc.setDrawColor(180, 150, 90);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  if (logoInfo) {
    const backLogoW = 38;
    const backLogoH = backLogoW / logoInfo.aspect;
    doc.addImage(logoInfo.data, 'PNG', (pageWidth - backLogoW) / 2, 38, backLogoW, backLogoH);
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(255, 255, 255);
  doc.text('MODULARES GM', pageWidth / 2, 80, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(200, 170, 110);
  doc.text('EXCELENCIA PLANIMÉTRICA & FABRICACIÓN DE AUTOR', pageWidth / 2, 88, { align: 'center' });

  doc.setDrawColor(200, 170, 110);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 35, 95, pageWidth / 2 + 35, 95);

  // Información del Atelier & Showroom
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(220, 215, 210);
  doc.text('Atelier Central & Planta de Fabricación:', pageWidth / 2, 114, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Rosa Yeira 420 y Serpaio Japeravi', pageWidth / 2, 122, { align: 'center' });
  doc.text('Quito • Pichincha • Ecuador', pageWidth / 2, 129, { align: 'center' });

  // Canales de Atención
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(190, 185, 180);
  doc.text('WhatsApp Oficial: +593 96 306 4374', pageWidth / 2, 148, { align: 'center' });
  doc.text('Correo Electrónico: info@modularesgm.com', pageWidth / 2, 156, { align: 'center' });
  doc.text('Sitio Web Oficial: https://www.modularesgm.com', pageWidth / 2, 164, { align: 'center' });

  // Cuadro de Cobertura y Garantías
  doc.setFillColor(36, 31, 26);
  doc.setDrawColor(65, 58, 50);
  doc.roundedRect(26, 188, pageWidth - 52, 50, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(200, 170, 110);
  doc.text('COBERTURA NACIONAL & SERVICIO LLAVE EN MANO', pageWidth / 2, 199, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(215, 210, 205);
  doc.text('• Personal técnico especializado con cobertura en Quito, Guayaquil, Cuenca, Manta y Ambato', 32, 209);
  doc.text('• Envíos asegurados y protegidos a todas las provincias del territorio ecuatoriano', 32, 216);
  doc.text('• Levantamiento planimétrico y renderizado 3D fotorrealista sin costo con tu contratación', 32, 223);
  doc.text('• Garantía total de fábrica respaldada por contrato y factura legal', 32, 230);

  // Copyright
  doc.setFontSize(8);
  doc.setTextColor(130, 125, 120);
  doc.text('© 2026 MODULARES GM. Todos los derechos reservados.', pageWidth / 2, 274, { align: 'center' });

  onProgress?.('¡Catálogo generado con éxito! Descargando archivo...');

  const fileName = isSingle && mainCategory
    ? `Catalogo_${mainCategory.key.toUpperCase()}_Modulares_GM_2026.pdf`
    : 'Catalogo_Oficial_Modulares_GM_2026.pdf';

  doc.save(fileName);
}
