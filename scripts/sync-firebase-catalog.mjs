import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// In Node.js, process.env gets the env variables
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error('ERROR: Falta FIREBASE_SERVICE_ACCOUNT_JSON en .env.local');
  process.exit(1);
}

const db = getFirestore(initializeApp({ credential: cert(JSON.parse(raw)) }));

async function sync() {
    console.log("Comenzando sincronización de catálogo...");
    
    // Obtener los productos actuales para intentar preservar precios si es posible
    const ref = db.doc('siteContent/main');
    const snap = await ref.get();
    const currentData = snap.data() || {};
    const oldProducts = currentData.products || [];
    
    // Generar nuevos productos basados en la carpeta CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM
    const imageDir = path.join(process.cwd(), 'public/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM');
    const files = fs.readdirSync(imageDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    // Mapear archivos a productos
    const newProducts = files.map((file, i) => {
        const id = `circuito-${i+1}`;
        // Buscar si ya existía un producto con precio, sino poner 0 por defecto (el usuario ajustará)
        const existing = oldProducts.find(p => p.id === id);
        return {
            id,
            title: `Circuito de Estimulación ${i+1}`,
            description: 'Circuito de estimulación para clientes.',
            price: existing ? existing.price : 99.99, // placeholder, since we might have lost it
            category: 'Circuitos',
            images: [`/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/${file}`],
            featured: true,
            features: ['Material Premium', 'Diseño Exclusivo']
        };
    });

    // Añadir promociones por defecto si no existen
    const ticker = [
        { id: 'referral', text: '🎉 5% de descuento en tus compras si alguien te recomendó la web', href: '/afiliados' },
        { id: 'cash', text: '💵 5% de descuento por pagos en efectivo', href: '/store' },
        { id: 'register', text: '✨ 5% de descuento inmediato al registrarte en nuestra plataforma', href: '/store' },
        { id: 'pros', text: '🤝 ¿Eres instalador o arquitecto? Visita Trabaja con nosotros', href: '/afiliados', highlight: true },
    ];

    console.log(`Subiendo ${newProducts.length} productos de circuitos y borrando antiguos...`);

    // Actualizar siteContent/main
    await ref.update({
        products: newProducts,
        tickerMessages: ticker,
        updatedAt: FieldValue.serverTimestamp()
    });

    // Limpiar colección de 'productos' si existe y reemplazar
    const productosRef = db.collection('productos');
    const allDocs = await productosRef.get();
    const batch = db.batch();
    
    allDocs.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    
    newProducts.forEach(prod => {
        batch.set(productosRef.doc(prod.id), prod);
    });

    await batch.commit();

    console.log("¡Todo listo! Catálogo actualizado.");
}

sync().catch(console.error);
