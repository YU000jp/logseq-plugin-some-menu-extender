import { PageEntity } from '@logseq/libs/dist/LSPlugin';

export function loadPageInfo() {
  logseq.App.registerUIItem("pagebar", {
    key: "pageInfo",
    template: `
    <div id="pageBar--pageInfo" data-on-click="modelPageInfo" title="Page info"><a class="button icon">📑</a></div>
    `,
  });
  logseq.provideModel({
    modelPageInfo: async () => {
      const currentPage = await logseq.Editor.getCurrentPage() as PageEntity | null;
      if (currentPage != null) {
        const updatedAt = new Date(currentPage.updatedAt as number);
        const updatedAtStr = updatedAt.toLocaleString();
        const createdAt = new Date(currentPage.createdAt as number);
        const createdAtStr = createdAt.toLocaleString();
        logseq.UI.showMsg(`--- Page info ---

        format:
        ${currentPage.format}

        updatedAt:
        ${updatedAt}
        ${updatedAtStr}

        createdAt:
        ${createdAt}
        ${createdAtStr}

        `, "info", { timeout: 1000 * 60 });
      }else logseq.UI.showMsg("Not found", "error", { timeout: 1200 });
    },
  });
}
