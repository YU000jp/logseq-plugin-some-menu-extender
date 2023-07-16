import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { BlockEntity, LSPluginBaseInfo, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { evalExpression } from '@hkh12/node-calc'; //https://github.com/heokhe/node-calc
const keyRemoveMenuGraphView = "removeMenuGraphView";

const main = () => {
  logseq.useSettingsSchema(settingsTemplate);

  //for repeat task
  logseq.provideStyle(String.raw`
  div#main-content-container input.form-checkbox{transform:scale(1.1)}
  div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
  div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
  div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
  div#main-content-container input.form-checkbox+div a{font-size:medium}
  div#root main div[data-id="${logseq.baseInfo.id}"] textarea.form-input {
    height: 12em;
    font-size: unset;
  }
`);

  if (logseq.settings!.removeMenuGraphView === true) removeMenuGraphView();

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


  logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

    if (oldSet.removeMenuGraphView !== true && newSet.removeMenuGraphView === true) {
      removeMenuGraphView();
    } else
      if (oldSet.removeMenuGraphView === true && newSet.removeMenuGraphView !== true) {
        removeProvideStyle(keyRemoveMenuGraphView);
      }
  });


  //Rotate the task workflow state
  //タスクのワークフロー状態を切り替える
  let processing: Boolean = false;
  //コマンドパレット `Rotate the Task Workflow State`
  logseq.App.registerCommandPalette({
    key: 'toggleTaskWorkflowState',
    label: 'Rotate the task workflow state',
    keybinding: {
      binding: logseq.settings?.shortcutKey || 'Ctrl+Shift+Enter',
    }
  }, async ({ uuid }) => {
    if (processing) return;
    processing = true;
    const block = await logseq.Editor.getBlock(uuid) as BlockEntity;
    if (!block) return processing = false;
    if (logseq.settings!.taskWorkflowState === "") return processing = false;
    const states: string[] = (logseq.settings!.taskWorkflowState.replace(/\s+/g, "")).split(",");
    const index: number = states.indexOf(block.marker);
    if (index === -1) {//ユーザー指定のタスクに一致しない場合
      if (!block.marker) {//タスクに一致しない場合
        //「# 」や「## 」「### 」「#### 」「##### 」「######」で始まっていた場合は、そのマッチした部分の後ろに追加する
        const match = block.content.match(/^(#+)\s/);
        if (match) {
          let content = block.content.replace(match[0], match[0] + states[0] + " ");
          content.replace(block.marker + " ", "");
          logseq.Editor.updateBlock(block.uuid, content);
        } else {
          logseq.Editor.updateBlock(block.uuid, states[0] + " " + block.content);
        }
      } else {
        logseq.Editor.updateBlock(block.uuid,
          block.content.replace(block.marker + " ", states[0] + " "));
      }

    } else {
      let content = "";
      let DOING: boolean = false;
      switch (states[index + 1]) {
        case undefined:
          content = "";
          break;
        case "DOING":
          DOING = true;
        default:
          content = states[index + 1] + " ";
          break;
      }
      logseq.Editor.updateBlock(block.uuid,
        block.content.replace(block.marker + " ", content));
      if (DOING === true) {
        if (DOINGchildrenSet(block.uuid, block.content, logseq.settings!.DOINGchildrenSet01) as boolean === false) {
          if (DOINGchildrenSet(block.uuid, block.content, logseq.settings!.DOINGchildrenSet02) as boolean === false) {
            if (DOINGchildrenSet(block.uuid, block.content, logseq.settings!.DOINGchildrenSet03) as boolean === false) {
              if (DOINGchildrenSet(block.uuid, block.content, logseq.settings!.DOINGchildrenSet04) as boolean === false) {
                if (DOINGchildrenSet(block.uuid, block.content, logseq.settings!.DOINGchildrenSet05) as boolean === false) {
                  DOINGchildrenSet(block.uuid, block.content, logseq.settings!.DOINGchildrenSet06);
                }
              }
            }
          }
        }
      }
    }
    processing = false;
  });


};/* end_main */


function DOINGchildrenSet(uuid: string, content: string, DOINGchildrenSet: string): Boolean {
  if (DOINGchildrenSet !== "") {
    const blockSet: string[] = DOINGchildrenSet.split("\n");
    //blockSetの2つ目以降を使って処理する
    //Support date-nlp plugin
    if (content.includes(blockSet[0])) {
      processBlockSet(uuid, blockSet);
      return true;
    }
  }
  return false;
}

async function processBlockSet(uuid: string, blockSet: string[]): Promise<void> {
  for (let index = 1; index < blockSet.length; index++) {
    const child = blockSet[index];
    await new Promise<void>((resolve) => {
      logseq.Editor.insertBlock(uuid, child, { before: false, sibling: false, focus: true });
      setTimeout(() => {
        logseq.Editor.exitEditingMode();
        resolve();
      }, 200);
    });
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
  }
}

const removeMenuGraphView = () => logseq.provideStyle({
  key: keyRemoveMenuGraphView,
  style: String.raw`
div#left-sidebar div.graph-view-nav{
  display:none;
}
`  });

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


const removeProvideStyle = (className: string) => {
  const doc = parent.document.head.querySelector(`style[data-injected-style^="${className}"]`) as HTMLStyleElement;
  if (doc) doc.remove();
};

// const removeCSSclass = (className: string) => {
//   if (parent.document.body.classList?.contains(className)) parent.document.body.classList.remove(className);
// }


//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "nextLineBlank",
    title: "ContextMenuItem `Make to next line blank` option",
    type: "enum",
    default: "3",
    enumChoices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    description: "Number of blank lines after the selected block",
  },
  {
    key: "removeMenuGraphView",
    title: "Remove `Graph View` from the menu",
    type: "boolean",
    default: false,
    description: "",
  },
  {
    key: "heading",
    title: "",
    type: "heading",
    default: "",
    description: "",
  },
  {
    key: "heading",
    title: "Set child block on the DOING task",
    type: "heading",
    default: "",
    description: "If the DOING block contains like `#tag` in the first line, use the next lines in the DOING block to insert some child blocks by user plugin settings.",
  },
  {
    key: "shortcutKey",
    title: "Rotate the task workflow state: Shortcut key",
    type: "string",
    default: "Ctrl+Shift+Enter",
    description: "default: `Ctrl+Shift+Enter`",
  },
  {//task workflow state
    key: "taskWorkflowState",
    title: "Task workflow state",
    type: "string",
    default: "TODO,DOING,WAITING,CANCELED,DONE",
    description: "Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)",//Logseqで許可されたタスク用の文字列のみ有効
  },
  {
    key: "heading",
    title: "",
    type: "heading",
    default: "",
    description: `
    Example*:
    #book
    TODO Reading %next week
    TODO Review %next 2weeks
    Read #Archive

    *Such as \`%next week\` require datenlp plugin.
    `,
  },
  {//Set child block on the DOING task 「,」区切りで指定する
    //https://github.com/sawhney17/logseq-custom-workflow-plugin/issues/4
    key: "DOINGchildrenSet01",
    title: "Set child block on the DOING task: 01",
    type: "string",
    default: "",
    inputAs: "textarea",
    description: "(default: blank) Separate with a newline.",
  },
  {
    key: "DOINGchildrenSet02",
    title: "Set child block on the DOING task: 02",
    type: "string",
    default: "",
    inputAs: "textarea",
    description: "(default: blank) Separate with a newline.",
  },
  {
    key: "DOINGchildrenSet03",
    title: "Set child block on the DOING task: 03",
    type: "string",
    default: "",
    inputAs: "textarea",
    description: "(default: blank) Separate with a newline.",
  },
  {
    key: "DOINGchildrenSet04",
    title: "Set child block on the DOING task: 04",
    type: "string",
    default: "",
    inputAs: "textarea",
    description: "(default: blank) Separate with a newline.",
  },
  {
    key: "DOINGchildrenSet05",
    title: "Set child block on the DOING task: 05",
    type: "string",
    default: "",
    inputAs: "textarea",
    description: "(default: blank) Separate with a newline.",
  },
  {
    key: "DOINGchildrenSet06",
    title: "Set child block on the DOING task: 06",
    type: "string",
    default: "",
    inputAs: "textarea",
    description: "(default: blank) Separate with a newline.",
  },
];

logseq.ready(main).catch(console.error);