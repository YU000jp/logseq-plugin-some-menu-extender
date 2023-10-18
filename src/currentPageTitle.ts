import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { t } from "logseq-l10n"

export function loadCurrentPageTitle() {
  logseq.Editor.registerSlashCommand(
    t("Current page title as a link"),
    async () => {
      const current =
        (await logseq.Editor.getCurrentPage()) as PageEntity | null;
      if (current) {
        logseq.Editor.insertAtEditingCursor(`[[${current.originalName}]]`);
      } else {
        logseq.UI.showMsg("Failed. Non-journal page only", "warning");
      }
    }
  );
}
