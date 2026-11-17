const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const index = Number(month) - 1;
  if (!year || !MONTHS[index] || !day) return iso;
  return `${Number(day)} ${MONTHS[index]} ${year}`;
}

export function languageLabel(language) {
  return language === "bash" ? "Bash" : "PowerShell";
}

export function languageExtension(language) {
  return language === "bash" ? ".sh" : ".ps1";
}