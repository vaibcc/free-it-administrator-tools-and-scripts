import activeDirectory from "./fr-active-directory";
import microsoft365 from "./fr-microsoft-365";
import exchangeSharePoint from "./fr-exchange-sharepoint";
import intuneDefender from "./fr-intune-defender";
import linuxDocker from "./fr-linux-docker";
import networkingSecurity from "./fr-networking-security";
import { FR_INSTALL } from "./fr-install";

// French metadata keyed by script slug. Never contains executable source code.
export const FR_SCRIPTS = {
  ...activeDirectory,
  ...microsoft365,
  ...exchangeSharePoint,
  ...intuneDefender,
  ...linuxDocker,
  ...networkingSecurity,
};

// Only documentation fields are translatable. Code, commands and script output are not.
const TRANSLATABLE = ["title", "description", "subcategory", "permissions", "errorHandling"];

export function localizeScript(script, lang) {
  if (!script || lang !== "fr") return script;
  const translation = FR_SCRIPTS[script.slug];
  if (!translation) return script;

  const localized = { ...script };
  for (const field of TRANSLATABLE) {
    if (translation[field]) localized[field] = translation[field];
  }
  if (Array.isArray(translation.security)) localized.security = translation.security;
  if (Array.isArray(translation.keywords)) localized.keywords = [...script.keywords ?? [], ...translation.keywords];

  // Installation guidance is translatable; the command itself is rendered from the original field.
  localized.install = FR_INSTALL[script.slug] ?? script.install;

  // Executable content is taken from the original record, never from a translation.
  localized.source = script.source;
  localized.fileName = script.fileName;
  localized.usage = script.usage;
  localized.example = script.example;
  localized.exampleOutput = script.exampleOutput;
  localized.docs = script.docs;
  return localized;
}

export function localizeScripts(scripts, lang) {
  if (lang !== "fr") return scripts;
  return scripts.map((script) => localizeScript(script, lang));
}