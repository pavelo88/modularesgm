export interface Service {
  id: number;
  title: string;
  desc: string;
  imgUrl: string;
  icon: string;
  catalogUrl: string;
}

export interface Product {
  id: number;
  title: string;
  desc: string;
  price: number;
  discountPrice: number | null;
  imgUrl: string;
  images?: string[];           // galería de imágenes adicionales
  category: string;
  subcategory?: string;        // ej: "Closet Moderno", "Cocina en L"
  dimensions?: string;         // ej: "2.40m x 0.60m x 2.10m"
  priceUnit?: 'unidad' | 'metro_lineal' | 'metro_cuadrado';
  material?: string;           // ej: "MDF 18mm, melamina blanca"
  inStock?: boolean;
  featured?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  url: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  icon: string;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string;
}

export interface SocialURLs {
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroMediaUrl: string;
  ctaText: string;
  formTitle: string;
  formSubtitle: string;
  whatsappNumber: string;
  address: string;
  mapUrl: string;
  socialUrls: SocialURLs;
  seo: SEO;
  theme: ThemeColors;
  services: Service[];
  stats: Stat[];
  brands: Brand[];
  products: Product[];
  tickerMessages?: { id: string; text: string; href?: string; highlight?: boolean }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Nuevo' | 'Atendido' | 'Contactado' | 'Cerrado' | string;
  createdAt: number | string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'transferencia' | 'tarjeta' | 'efectivo';
  transferRef?: string;
  items: CartItem[];
  subtotal?: number;
  discountAmount?: number;
  total: number;
  affiliateCode?: string;
  affiliateUid?: string;
  commissionRate?: number;
  commissionAmount?: number;
  commissionStatus?: 'pendiente' | 'pagada';
  status: 'Pendiente' | 'Pago Verificado' | 'Cliente Contactado' | 'En proceso' | 'Enviado' | 'Completado' | 'Cancelado';
  createdAt: number;
}

export type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  catalogUrl?: string;
  serviceTitle?: string;
};

export interface AffiliateSettings {
  commissionRate: number;
  customerDiscount: number;
  cookieDays: number;
}

export interface Affiliate {
  uid: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  createdAt: number;
}
