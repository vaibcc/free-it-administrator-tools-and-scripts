import { SquareTerminal, Server, Cloud, KeyRound, Mail, FolderOpen, MonitorSmartphone, ShieldCheck, Terminal, Boxes, Network, Lock } from "lucide-react";

const ICONS = {
  SquareTerminal,
  Server,
  Cloud,
  KeyRound,
  Mail,
  FolderOpen,
  MonitorSmartphone,
  ShieldCheck,
  Terminal,
  Boxes,
  Network,
  Lock,
};

const ACCENTS = {
  mint: "text-mint",
  prompt: "text-prompt",
  warn: "text-warn",
};

export default function CategoryIcon({ name, accent = "prompt", className = "h-4 w-4" }) {
  const Icon = ICONS[name] ?? SquareTerminal;
  return <Icon className={`${className} ${ACCENTS[accent] ?? ACCENTS.prompt}`} aria-hidden="true" />;
}

export { ICONS as CATEGORY_ICONS };