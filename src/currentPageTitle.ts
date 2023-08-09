import { PageEntity } from '@logseq/libs/dist/LSPlugin.user';

export function loadCurrentPageTitle() {
  logseq.Editor.registerSlashCommand('Current page title as a link', async () => {
    const current = await logseq.Editor.getCurrentPage() as PageEntity | null;
    if (current) {
      logseq.Editor.insertAtEditingCursor(`[[${current.originalName}]]`);
    } else {
      logseq.UI.showMsg("Failed. Non-journal page only", "warning");
    }
  });
}
