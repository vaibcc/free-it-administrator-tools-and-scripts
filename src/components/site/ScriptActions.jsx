import { useState } from "react";
import { Check, Copy, Download, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard, downloadTextFile } from "@/lib/download";
import { useI18n } from "@/i18n/LanguageContext";

// Copies and downloads the original English source exactly as imported from the .ps1 / .sh file.
export default function ScriptActions({ source, fileName }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const ext = fileName.endsWith(".sh") ? ".sh" : ".ps1";

  async function copy() {
    try {
      await copyToClipboard(source);
      setCopied(true);
      toast.success(t("actions.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("actions.copyError"));
    }
  }

  function download() {
    downloadTextFile(fileName, source);
    toast.success(`${t("actions.downloading")} ${fileName}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-sm bg-mint px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? t("common.copied") : t("actions.copyScript")}
      </button>
      <button
        type="button"
        onClick={download}
        className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-surface/70 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-mint/50 hover:text-mint"
      >
        <Download className="h-3.5 w-3.5" />
        {t("actions.download")} {ext}
      </button>
      <a
        href="#source"
        className="inline-flex items-center gap-2 rounded-sm border border-hairline px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-prompt/50 hover:text-prompt"
      >
        <FileCode2 className="h-3.5 w-3.5" />
        {t("script.source")}
      </a>
    </div>
  );
}