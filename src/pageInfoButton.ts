import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import { dateFormatter, timeFormatter } from "./pageDateNotifier";
import { t } from "logseq-l10n"

//Page info button
export function loadPageInfoButton() {
  logseq.App.registerUIItem("pagebar", {
    key: "pageInfo",
    template: `
    <div id="pageBar--pageInfoButton" data-on-click="modelPageInfo" title="${t("Page info")}"><a class="button icon">📑</a></div>
    `,
  });
  logseq.provideModel({
    modelPageInfo: async () => {
      const currentPage =
        (await logseq.Editor.getCurrentPage()) as PageEntity | null;
      if (currentPage) {
        const updatedAt = new Date(currentPage.updatedAt as number);
        const updatedAtStr =
          dateFormatter.format(updatedAt) +
          " " +
          timeFormatter.format(updatedAt);
        const createdAt = new Date(currentPage.createdAt as number);
        const createdAtStr =
          dateFormatter.format(createdAt) +
          " " +
          timeFormatter.format(createdAt);
        logseq.UI.showMsg(
          `--- ${t("Page info")} ---

        ${t("format")}:
        ${currentPage.format=== undefined ? "Markdown" : currentPage.format}

        ${t("updated-at")} (${t("Last modified")}):
        ${updatedAtStr}

        ${t("created-at")}:
        ${createdAtStr}

        `,
          "info",
          { timeout: 1000 * 60 }
        );
      } else logseq.UI.showMsg("Not found", "error", { timeout: 1200 });
    },
  });
}
