import { t } from "logseq-l10n"

export const loadCopyPageTitle = () => {
  logseq.App.registerPageMenuItem(
    t("📋 Copy page title as a link"),
    ({ page }) => {
      //クリップボードにページタイトルをコピーする
      //Copy the page title to the clipboard
      window.focus();
      navigator.clipboard.writeText(`[[${page}]]`);
    }
  );
};
