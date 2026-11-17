import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard, downloadTextFile } from "@/lib/download";
import { useI18n } from "@/i18n/LanguageContext";

const TOKEN_RE =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(#[^\n]*)|(\b[A-Z][a-zA-Z]+-[A-Z][a-zA-Z]+\b)|(\$\{?[A-Za-z_0-9][A-Za-z0-9_:]*\}?)|(\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|function|return|try|catch|finally|throw|switch|param|foreach|in|local|export|exit|echo|set|until|break|continue|true|false|null)\b)|(\b\d+\b)/g;

function classify(match) {
  if (match[1]) return "tok-string";
  if (match[2]) return "tok-comment";
  if (match[3]) return "tok-cmd";
  if (match[4]) return "tok-var";
  if (match[5]) return "tok-keyword";
  return "tok-number";
}

function highlightLine(line) {
  const parts = [];
  let index = 0;
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match[0].length === 0) {
      TOKEN_RE.lastIndex += 1;
      continue;
    }
    if (match.index > index) parts.push({ text: line.slice(index, match.index), cls: "" });
    parts.push({ text: match[0], cls: classify(match) });
    index = match.index + match[0].length;
  }
  if (index < line.length) parts.push({ text: line.slice(index), cls: "" });
  return parts;
}

export default function CodeBlock({
  code,
  filename = "script.ps1",
  downloadName,
  copyLabel = "Copy script",
  lineNumbers = false,
  maxHeight = "22rem",
  className = "",
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  async function handleCopy() {
    try {
      await copyToClipboard(code);
      setCopied(true);
      toast.success(t("actions.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("actions.copyError"));
    }
  }

  function handleDownload() {
    downloadTextFile(downloadName || filename, code);
    toast.success(`${t("actions.downloading")} ${downloadName || filename}`);
  }

  return (
    <div className={`overflow-hidden rounded-sm border border-hairline bg-[#050b18] ${className}`}>
      <div className="flex items-center gap-2 border-b border-hairline/80 bg-surface/60 px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warn/70" />
          <span className="h-2 w-2 rounded-full bg-prompt/60" />
          <span className="h-2 w-2 rounded-full bg-mint/60" />
        </span>
        <span className="ml-1 truncate font-mono text-[11px] text-muted-foreground">{filename}</span>
        <div className="ml-auto flex items-center gap-1">
          {downloadName && (
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xs border border-hairline px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-mint/50 hover:text-mint"
              aria-label={`Download ${downloadName}`}
            >
              <Download className="h-3 w-3" />
              {downloadName.endsWith(".sh") ? ".sh" : ".ps1"}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xs border border-hairline px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-mint/50 hover:text-mint"
            aria-label="Copy script source code"
          >
            {copied ? <Check className="h-3 w-3 text-mint" /> : <Copy className="h-3 w-3" />}
            {copied ? t("common.copied") : copyLabel}
          </button>
        </div>
      </div>
      <div className="overflow-auto" style={{ maxHeight }} aria-label="Script source code">
        <pre className="min-w-full p-4 font-mono text-[12.5px] leading-[1.75] text-foreground/90">
          <code>
            {lines.map((line, i) => (
              <span key={i} className="flex">
                {lineNumbers && (
                  <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-muted-foreground/40">
                    {i + 1}
                  </span>
                )}
                <span className="whitespace-pre-wrap break-words">
                  {highlightLine(line).map((part, j) => (
                    <span key={j} className={part.cls}>
                      {part.text}
                    </span>
                  ))}
                  {line.length === 0 ? " " : ""}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}