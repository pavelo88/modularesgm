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
  category: string;
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
  services: Service[];
  stats: Stat[];
  brands: Brand[];
  products: Product[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Nuevo' | 'Contactado' | 'Cerrado';
  createdAt: number;
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
  total: number;
  status: 'Pendiente' | 'En proceso' | 'Enviado' | 'Completado' | 'Cancelado';
  createdAt: number;
}

export type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  catalogUrl?: string;
  serviceTitle?: string;
};
