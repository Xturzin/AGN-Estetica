import type { CSSProperties } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Clock,
  Dot,
  Download,
  Droplet,
  Eye,
  FileText,
  Filter,
  Folder,
  Heart,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  List,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  Send,
  Settings,
  Shield,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP = {
  dashboard: LayoutDashboard,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  check: Check,
  checkCircle: CheckCircle,
  users: Users,
  user: User,
  fileText: FileText,
  clipboard: Clipboard,
  image: ImageIcon,
  settings: Settings,
  plus: Plus,
  search: Search,
  bell: Bell,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  clock: Clock,
  phone: Phone,
  mail: Mail,
  mapPin: MapPin,
  paperclip: Paperclip,
  upload: Upload,
  download: Download,
  sliders: SlidersHorizontal,
  logout: LogOut,
  moreH: MoreHorizontal,
  edit: Pencil,
  camera: Camera,
  x: X,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  pulse: Activity,
  filter: Filter,
  shield: Shield,
  droplet: Droplet,
  alert: AlertTriangle,
  star: Star,
  home: Home,
  heart: Heart,
  list: List,
  grid: LayoutGrid,
  folder: Folder,
  filePdf: FileText,
  send: Send,
  dot: Dot,
  trendUp: TrendingUp,
  refresh: RefreshCw,
  lock: Lock,
  eye: Eye,
  message: MessageCircle,
  scissors: Scissors,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  size?: number;
  sw?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, sw = 1.6, color = "currentColor", style }: IconProps) {
  const LucideComponent = ICON_MAP[name];
  if (!LucideComponent) return null;
  return (
    <LucideComponent
      size={size}
      strokeWidth={sw}
      color={color}
      style={{ flex: "0 0 auto", display: "block", ...style }}
    />
  );
}