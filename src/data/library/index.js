import activeDirectory from "./active-directory";
import microsoft365 from "./microsoft-365";
import exchangeSharePoint from "./exchange-sharepoint";
import intuneDefender from "./intune-defender";
import linuxDocker from "./linux-docker";
import networkingSecurity from "./networking-security";
import { SCRIPT_CATEGORIES } from "@/data/categories";

const ALL = [
  ...activeDirectory,
  ...microsoft365,
  ...exchangeSharePoint,
  ...intuneDefender,
  ...linuxDocker,
  ...networkingSecurity,
].map((script) => ({
  ...script,
  status: script.status ?? "available",
}));

export const SCRIPTS = ALL;

export const AVAILABLE_SCRIPTS = ALL.filter((s) => s.status === "available");

export function getScript(slug) {
  return ALL.find((s) => s.slug === slug);
}

function matchesCategory(script, slug) {
  if (slug === "powershell") return script.language === "powershell";
  return script.category === slug;
}

export function scriptsInCategory(slug) {
  return ALL.filter((s) => matchesCategory(s, slug));
}

export const CATEGORY_STATS = Object.fromEntries(
  SCRIPT_CATEGORIES.map((c) => {
    const items = scriptsInCategory(c.slug);
    return [
      c.slug,
      {
        total: items.length,
        available: items.filter((s) => s.status === "available").length,
      },
    ];
  }),
);

export const LIBRARY_STATS = {
  total: ALL.length,
  available: AVAILABLE_SCRIPTS.length,
  comingSoon: ALL.length - AVAILABLE_SCRIPTS.length,
  categories: SCRIPT_CATEGORIES.length,
};

export function searchScripts(query, scripts = ALL) {
  const term = query.trim().toLowerCase();
  if (!term) return scripts;
  const words = term.split(/\s+/);

  return scripts.filter((script) => {
    const haystack = [
      script.title,
      script.description,
      script.category,
      script.subcategory,
      script.language,
      script.platform,
      ...(script.keywords ?? []),
      ...(script.modules ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return words.every((word) => haystack.includes(word));
  });
}