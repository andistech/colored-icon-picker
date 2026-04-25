import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Cloud,
  Code2,
  Flag,
  Folder,
  Globe2,
  Heart,
  Home,
  KeyRound,
  Lightbulb,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react';

export type IconOption = {
  key: string;
  label: string;
  Icon: LucideIcon;
};

export const iconOptions: IconOption[] = [
  { key: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { key: 'star', label: 'Star', Icon: Star },
  { key: 'heart', label: 'Heart', Icon: Heart },
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'folder', label: 'Folder', Icon: Folder },
  { key: 'briefcase', label: 'Briefcase', Icon: BriefcaseBusiness },
  { key: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { key: 'bell', label: 'Bell', Icon: Bell },
  { key: 'message', label: 'Message', Icon: MessageCircle },
  { key: 'shield', label: 'Shield', Icon: ShieldCheck },
  { key: 'key', label: 'Key', Icon: KeyRound },
  { key: 'rocket', label: 'Rocket', Icon: Rocket },
  { key: 'flag', label: 'Flag', Icon: Flag },
  { key: 'globe', label: 'Globe', Icon: Globe2 },
  { key: 'cloud', label: 'Cloud', Icon: Cloud },
  { key: 'code', label: 'Code', Icon: Code2 },
  { key: 'chart', label: 'Chart', Icon: ChartNoAxesCombined },
  { key: 'money', label: 'Money', Icon: CircleDollarSign },
  { key: 'bookmark', label: 'Bookmark', Icon: Bookmark },
  { key: 'idea', label: 'Idea', Icon: Lightbulb },
];

export function getIconOption(iconKey: string): IconOption {
  return iconOptions.find((option) => option.key === iconKey) ?? iconOptions[0];
}
