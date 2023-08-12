import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export function loadCalculator() {
  logseq.App.registerCommandPalette(
    {
      key: "some-menu-extender-select-blocks-for-calculate",
      label: "Select blocks to SUM (calculate)",
    },
    async (event) => {
      const blocks = (await logseq.Editor.getSelectedBlocks()) as BlockEntity[];
      if (blocks) {
        const amounts: { [key: string]: number } = {};
        await Promise.all(
          blocks.map(async (block) => {
            const match = block.content.match(
              /(\$|€)?([0-9,]+)(元|円|¥|\\￥)?/
            );
            if (match) {
              const amount = Number(match[2].replace(/,/g, ""));
              const currency = match[1] || match[3] || "";
              if (currency in amounts) {
                amounts[currency] += amount;
              } else {
                amounts[currency] = amount;
              }
            }
          })
        );
        let output = "";
        for (const currency in amounts) {
          const amount = amounts[currency];
          const formattedAmount =
            currency === "$" || currency === "€"
              ? amount.toString()
              : amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
          if (output) {
            output += ", ";
          }
          if (currency === "$" || currency === "€") {
            output += currency + formattedAmount;
          } else {
            output += formattedAmount + currency;
          }
        }
        await logseq.Editor.insertBlock(
          blocks[blocks.length - 1].uuid,
          ` = ${output}`,
          { sibling: true, focus: true }
        );
        logseq.UI.showMsg("Success", "success");
      } else {
        logseq.UI.showMsg("Failed", "error");
      }
    }
  );
  //end コマンドパレット `select blocks to calculate`
}
