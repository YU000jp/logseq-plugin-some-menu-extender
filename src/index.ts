import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { evalExpression } from '@hkh12/node-calc'; //https://github.com/heokhe/node-calc

const main = () => {
  logseq.useSettingsSchema(settingsTemplate);

  //for repeat task
  logseq.provideStyle(String.raw`
  div#main-content-container input.form-checkbox{transform:scale(1.1)}
  div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
  div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
  div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
  div#main-content-container input.form-checkbox+div a{font-size:medium}
`);

  /* ContextMenuItem `repeat-task as LATER`  */
  logseq.Editor.registerBlockContextMenuItem('repeat-task as LATER', async ({ uuid }) => {
    const block = await logseq.Editor.getBlock(uuid);
    if (block?.marker == "LATER") {
      logseq.UI.showMsg('This block is LATER', 'error');
    } else {
      await logseq.Editor.insertBlock(uuid, `LATER 🔁 ((` + uuid + `))`).then((block: any) => {
        logseq.App.openInRightSidebar(block.uuid);
        logseq.UI.showMsg("Mouse drag a bullet of the block to move it to the journal.", 'info');
      });
    }
  });

  /* ContextMenuItem `Copy block reference and embed`  */
  logseq.Editor.registerBlockContextMenuItem('Copy block reference and embed', async ({ uuid }) => {
    const block = await logseq.Editor.getBlock(uuid);
    //ブロックのtimestampsはオプション機能
    //let timestamps = "";
    //if(block?.meta?.timestamps){
    //    timestamps = block?.meta?.timestamps;
    //}
    // necessary to have the window focused in order to copy the content of the code block to the clipboard
    //https://github.com/vyleung/logseq-copy-code-plugin/blob/main/src/index.js#L219
    window.focus();
    navigator.clipboard.writeText(`{{embed ((${uuid}))}}\nfrom ((${uuid}))`);
    logseq.UI.showMsg("Copied to clipboard\n(block reference and embed)", "info");
  });

  /* ContextMenuItem `Make to next line blank`  */
  logseq.Editor.registerBlockContextMenuItem('Make to next line blank', async ({ uuid }) => {
    const array = logseq.settings?.nextLineBlank || "1";
    for (let i = 0; i < parseInt(array); i++) {
      logseq.Editor.insertBlock(uuid, "", { focus: true, sibling: true });
    }
    logseq.UI.showMsg("Done! (Make to next line blank)", "info");
  });


  //TODO: Edit README.md
  //Prior art: https://github.com/hiway/logseq-calculator-plugin
  logseq.Editor.registerBlockContextMenuItem("Block Calculator", async ({ uuid }) => {
    calculator(uuid);
  });
  logseq.Editor.registerSlashCommand("Block Calculator", async ({ uuid }) => {
    calculator(uuid);
  });



  //コマンドパレット `select blocks to calculate`
  //選択したブロックの数値を合計して、最後のブロックに追記する
  //バレッドのコンテキストメニューではブロックの複数選択ができないため
  logseq.App.registerCommandPalette({
    key: 'some-menu-extender-select-blocks-for-calculate',
    label: 'Select blocks to SUM (calculate)',
  }, async (event) => {
    const blocks = await logseq.Editor.getSelectedBlocks() as BlockEntity[];
    if (blocks) {
      const amounts: { [key: string]: number } = {};
      await Promise.all(blocks.map(async (block) => {
        const match = block.content.match(/(\$|€)?([0-9,]+)(元|円|¥|\\￥)?/);
        if (match) {
          const amount = Number(match[2].replace(/,/g, ''));
          const currency = match[1] || match[3] || '';
          if (currency in amounts) {
            amounts[currency] += amount;
          } else {
            amounts[currency] = amount;
          }
        }
      }));
      let output = '';
      for (const currency in amounts) {
        const amount = amounts[currency];
        const formattedAmount = (currency === '$' || currency === '€') ? amount.toString() : amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
        if (output) {
          output += ', ';
        }
        if (currency === '$' || currency === '€') {
          output += currency + formattedAmount;
        } else {
          output += formattedAmount + currency;
        }
      }
      await logseq.Editor.insertBlock(blocks[blocks.length - 1].uuid, ` = ${output}`, { sibling: true, focus: true });
      logseq.UI.showMsg("Success", "success");
    } else {
      logseq.UI.showMsg("Failed", "error");
    }
  });
  //end コマンドパレット `select blocks to calculate`


};
/* end_main */


//calculator
async function calculator(uuid) {
  let Success: boolean = false;
  const text = await logseq.Editor.getBlock(uuid, { includeChildren: false });
  if (text) {
    const result = await evalExpression(text.content);
    if (result) {
      await logseq.Editor.insertBlock(uuid, ` = ${result}`, { sibling: false, focus: true });
      Success = true;
      logseq.UI.showMsg("Success", "success");
    }
  }
  if (Success === false) {
    logseq.UI.showMsg("Failed", "error");
  }
}


//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "nextLineBlank",
    title: "ContextMenuItem `Make to next line blank` option",
    type: "enum",
    default: "3",
    enumChoices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    description: "Number of blank lines after the selected block",
  }
];

logseq.ready(main).catch(console.error);