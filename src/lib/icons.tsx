import {
  Home,
  Grid,
  Activity,
  Briefcase,
  MonitorPlay,
  Sofa,
  Palette,
  Hammer,
  Ruler,
  Globe,
  MapPin,
  Zap,
  Store,
  ShoppingCart,
  Package,
  LucideProps,
  MessageCircle,
  Settings,
  Users,
  Save,
  CheckCircle2,
  XCircle,
  Network,
  Lock,
  BellRing,
  Server,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Fingerprint,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Map as MapIcon,
  UploadCloud,
  Send,
  Bot,
  Copy,
  FileText,
  Search,
  Info,
  Sun,
  Moon,
  Download,
  Minus,
  CreditCard,
  Wallet,
  Banknote,
  Mail,
  ChevronDown,
  LayoutGrid,
  List,
  MessageSquare,
  ShoppingBag,
  FileCode,
} from 'lucide-react';

export type IconName =
  | 'Home'
  | 'Grid'
  | 'Briefcase'
  | 'MonitorPlay'
  | 'Sofa'
  | 'Palette'
  | 'Hammer'
  | 'Ruler'
  | 'Globe'
  | 'MapPin'
  | 'Zap'
  | 'Store'
  | 'ShoppingCart'
  | 'Package'
  | 'Activity'
  | 'MessageCircle'
  | 'Settings'
  | 'Users'
  | 'Save'
  | 'CheckCircle2'
  | 'XCircle'
  | 'Network'
  | 'Lock'
  | 'BellRing'
  | 'Server'
  | 'Link'
  | 'Image'
  | 'Video'
  | 'ExternalLink'
  | 'LogOut'
  | 'Menu'
  | 'X'
  | 'ChevronRight'
  | 'Fingerprint'
  | 'Facebook'
  | 'Instagram'
  | 'Linkedin'
  | 'Twitter'
  | 'Sparkles'
  | 'Loader2'
  | 'Plus'
  | 'Trash2'
  | 'Map'
  | 'UploadCloud'
  | 'Send'
  | 'Bot'
  | 'Copy'
  | 'FileText'
  | 'Search'
  | 'Info'
  | 'Sun'
  | 'Moon'
  | 'Download'
  | 'Minus'
  | 'CreditCard'
  | 'Wallet'
  | 'Banknote'
  | 'Mail'
  | 'ChevronDown'
  | 'LayoutGrid'
  | 'List'
  | 'MessageSquare'
  | 'ShoppingBag'
  | 'FileCode'
  ;

const iconComponents: { [key in IconName]: React.ComponentType<LucideProps> } = {
  Home,
  Grid,
  Briefcase,
  MonitorPlay,
  Sofa,
  Palette,
  Hammer,
  Ruler,
  Globe,
  MapPin,
  Zap,
  Store,
  ShoppingCart,
  Package,
  Activity,
  MessageCircle,
  Settings,
  Users,
  Save,
  CheckCircle2,
  XCircle,
  Network,
  Lock,
  BellRing,
  Server,
  Link: LinkIcon,
  Image: ImageIcon,
  Video,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Fingerprint,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Map: MapIcon,
  UploadCloud,
  Send,
  Bot,
  Copy,
  FileText,
  Search,
  Info,
  Sun,
  Moon,
  Download,
  Minus,
  CreditCard,
  Wallet,
  Banknote,
  Mail,
  ChevronDown,
  LayoutGrid,
  List,
  MessageSquare,
  ShoppingBag,
  FileCode,
};

export const getIconComponent = (iconName: IconName, props?: LucideProps) => {
  const Icon = iconComponents[iconName];
  return Icon ? <Icon {...props} /> : null;
};
