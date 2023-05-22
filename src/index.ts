import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { MarkdownLink } from './markdown-link';
import Swal from 'sweetalert2'; //https://sweetalert2.github.io/
import { getDateForPage } from 'logseq-dateutils'; //https://github.com/hkgnp/logseq-dateutils
import { evalExpression } from '@hkh12/node-calc'; //https://github.com/heokhe/node-calc

const main = () => {

  //get theme color (For SweetAlert2)
  //checkboxなどはCSSで上書きする必要あり
  let sweetAlert2background;  //color: sweetAlert2color
  let sweetAlert2color; //background: sweetAlert2background
  const rootThemeColor = () => {
    const root = parent.document.querySelector(":root");
    if (root) {
      const rootStyles = getComputedStyle(root);
      sweetAlert2background = rootStyles.getPropertyValue("--ls-block-properties-background-color") || "#ffffff";
      sweetAlert2color = rootStyles.getPropertyValue("--ls-primary-text-color") || "#000000";
    }
  };
  rootThemeColor();
  logseq.App.onThemeModeChanged(() => { rootThemeColor(); });
  //end

  logseq.useSettingsSchema(settingsTemplate);


  logseq.provideStyle(String.raw`
  div#main-content-container input.form-checkbox{transform:scale(1.1)}
  div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
  div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
  div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
  div#main-content-container input.form-checkbox+div a{font-size:medium}
`);


  //add completed property to done task
  //https://github.com/DimitryDushkin/logseq-plugin-task-check-date
  let blockSet = "";
  logseq.DB.onChanged(async (e) => {
    //check current graph
    const graph = await logseq.App.getCurrentGraph();
    if (graph === null) {//デモグラフの場合は返り値がnull
      return;
    }
    if (logseq.settings?.switchCompletedDialog === true) {//if changed settings
      const TASK_MARKERS = new Set(["DONE", "NOW", "LATER", "DOING", "TODO", "WAITING"]);
      const taskBlock = e.blocks.find((block) => TASK_MARKERS.has(block.marker));
      if (!taskBlock) {
        return;
      }
      if (blockSet !== taskBlock.uuid) {
        blockSet = "";//ほかのブロックを触ったら解除する
        if (taskBlock.marker === "DONE") {
          if (taskBlock.properties?.completed) {
            return;
          }
          const userConfigs = await logseq.App.getUserConfigs();
          const today: Date = new Date();
          const year: number = today.getFullYear();
          const month: string = ("0" + (today.getMonth() + 1)).slice(-2);
          const day: string = ("0" + today.getDate()).slice(-2);
          const todayFormatted = `${year}-${month}-${day}`;
          let addTime = "";
          if (logseq.settings?.completedDialogAddTime === true) {
            addTime = `<input id="swal-input2" class="swal2-input" type="time" value="${today.getHours() as number}:${today.getMinutes() as number}"/>`;
          }
          //dialog
          await logseq.showMainUI();
          const { value: formValues } = await Swal.fire<{
            input1: string;
            input2: string;
          }>({
            title: "Turn on completed (date) property?",
            text: "",
            icon: "info",
            showCancelButton: true,
            html: `<input id="swal-input1" class="swal2-input" type="date" value="${todayFormatted}"/>${addTime}`,//type:dateが指定できないためhtmlとして作成
            focusConfirm: false,
            color: sweetAlert2color,
            background: sweetAlert2background,
            preConfirm: () => {
              const input1 = document.getElementById('swal-input1') as HTMLInputElement;
              const input2 = document.getElementById('swal-input2') as HTMLInputElement;
              return {
                input1: input1.value,
                input2: ` **${input2.value}**`,
              };
            }
          });
          if (formValues) {
            if (formValues?.input1) {//OK
              let userFormat = userConfigs.preferredDateFormat;
              userFormat = userFormat.replace(/E{1,3}/, "EEE");//handle same E, EE, or EEE bug
              const FormattedDateUser = await getDateForPage(new Date(formValues?.input1), userFormat);
              logseq.Editor.upsertBlockProperty(taskBlock.uuid, "completed", FormattedDateUser + formValues?.input2);
            } else {//Cancel
              //user cancel in dialog
              logseq.UI.showMsg("Cancel", "warning");
              blockSet = taskBlock.uuid;//キャンセルだったらブロックをロックする
            }
          }
          await logseq.hideMainUI();
          //dialog end
        }
      } else {
        blockSet = taskBlock.uuid;
      }
    }
  });
  //end


  /* ContextMenuItem `repeat-task as LATER`  */
  logseq.Editor.registerBlockContextMenuItem('repeat-task as LATER', async (e) => {
    const block = await logseq.Editor.getBlock(e.uuid);
    if (block?.marker == "LATER") {
      logseq.UI.showMsg('This block is LATER', 'error');
    } else {
      await logseq.Editor.insertBlock(e.uuid, `LATER 🔁 ((` + e.uuid + `))`).then((block: any) => {
        logseq.App.openInRightSidebar(block.uuid);
        logseq.UI.showMsg("Mouse drag a bullet of the block to move it to the journal.", 'info');
      });
    }
  });

  /* ContextMenuItem `Copy block reference and embed`  */
  logseq.Editor.registerBlockContextMenuItem('Copy block reference and embed', async (event) => {
    const block = await logseq.Editor.getBlock(event.uuid);
    //ブロックのtimestampsはオプション機能
    //let timestamps = "";
    //if(block?.meta?.timestamps){
    //    timestamps = block?.meta?.timestamps;
    //}
    // necessary to have the window focused in order to copy the content of the code block to the clipboard
    //https://github.com/vyleung/logseq-copy-code-plugin/blob/main/src/index.js#L219
    window.focus();
    navigator.clipboard.writeText(`{{embed ((${event.uuid}))}}\nfrom ((${event.uuid}))`);
    logseq.UI.showMsg("Copied to clipboard\n(block reference and embed)", "info");
  });

  /* ContextMenuItem `Make to next line blank`  */
  logseq.Editor.registerBlockContextMenuItem('Make to next line blank', async (event) => {
    const array = logseq.settings?.nextLineBlank || "1";
    for (let i = 0; i < parseInt(array); i++) {
      logseq.Editor.insertBlock(event.uuid, "", { focus: true, sibling: true });
    }
    logseq.UI.showMsg("Done! (Make to next line blank)", "info");
  });


  /* Slash Command `create pdf link (online)`  */
  logseq.Editor.registerSlashCommand('create pdf link (online)', async (event) => {
    //dialog
    await logseq.showMainUI();
    await Swal.fire({
      title: 'generate markdown',
      html:
        '<input id="title" class="swal2-input" placeholder="link title"/>' +
        '<input id="url" class="swal2-input" placeholder="URL (Online PDF)"/>',
      focusConfirm: false,
      showCancelButton: true,
      color: sweetAlert2color,
      background: sweetAlert2background,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve("");
          }
        });
      },
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const url = (document.getElementById('url') as HTMLInputElement).value;
        return { title: title, url: url };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let title = result.value?.title || "";
        title = IncludeTitle(title);
        const line = await logseq.Editor.insertBlock(event.uuid, `![${title}](${result.value?.url})`, { focus: true, sibling: true });
        logseq.UI.showMsg("Done! generate the link online pdf", "info");
      } else {//Cancel
        logseq.UI.showMsg("Cancel", "warning");
      }
    });
    await logseq.hideMainUI();
    //dialog end
  });

  // TODO:
  /* ContextMenuItem `PDF parse`  */
  // logseq.Editor.registerSlashCommand('pdf parse', async (event) => {
  //   logseq.showMainUI();
  //   await Swal.fire({
  //     title: "Input",
  //     input: "text",
  //     inputPlaceholder: "URL (Online PDF)",
  //     color: sweetAlert2color,
  //     background: sweetAlert2background,
  //   }).then(async (result) => {
  //     if (result) {

  //       const markdown = await convertPDFToMarkdown(result.value) as string;

  //       const next = await logseq.Editor.insertBlock(event.uuid, markdown, { sibling: false });
  //       logseq.UI.showMsg("Done! generate the parse date of online pdf", "info");
  //     } else {
  //       logseq.UI.showMsg("Cancel", "warning");
  //     }
  //   });
  //   logseq.hideMainUI();
  // });


  // remove TODO:
  // /* SlashCommand `Create Year List Calendar` */
  // logseq.Editor.registerSlashCommand('Create Year List Calendar', async (event) => {
  //   const userConfigs = await logseq.App.getUserConfigs();
  //   let userFormat = userConfigs.preferredDateFormat;
  //   userFormat = userFormat.replace(/E{1,3}/, "EEE");//handle same E, EE, or EEE bug
  //   const ThisDate: any = new Date();
  //   const ThisYear = ThisDate.getFullYear();
  //   const ThisMonth = ThisDate.getMonth() + 1;
  //   const displayThisMonth = String(ThisMonth).padStart(2, '0');
  //   logseq.Editor.insertBlock(event.uuid, `Year List Calendar`).then(async (b) => {
  //     if (b) {
  //       //年間タスクリスト作成
  //       await createCalendar(ThisYear, ThisYear, ThisMonth, b.uuid, userFormat);//this year
  //       await createCalendar(ThisYear as number + 1, ThisYear, ThisMonth, b.uuid, userConfigs.preferredDateFormat);//next year
  //     }
  //   }).finally(() => {
  //     logseq.UI.showMsg(`Year Calendar since ${ThisYear}/${displayThisMonth}`, 'info');
  //   });
  // });



  if (logseq.settings?.switchPARAfunction === true) {
    logseq.App.registerPageMenuItem("🎨 add Project", (e) => {
      addProperties("Project", "PARA", sweetAlert2background, sweetAlert2color);
    });
    logseq.App.registerPageMenuItem("🏠 add Area of responsibility", (e) => {
      addProperties("Area of responsibility", "PARA", sweetAlert2background, sweetAlert2color);
    });
    logseq.App.registerPageMenuItem("🌍 add Resource", (e) => {
      addProperties("Resource", "PARA", sweetAlert2background, sweetAlert2color);
    });
    logseq.App.registerPageMenuItem("🧹 add Archive", (e) => {
      addProperties("Archive", "PARA", sweetAlert2background, sweetAlert2color);
    });
  }
  logseq.App.registerPageMenuItem("🧺 add a page-tag by select list", (e) => {
    addProperties("", "Select", sweetAlert2background, sweetAlert2color);
  });

  //New Project Page
  logseq.App.registerPageMenuItem("🧑‍💻 create New Project", async (e) => {
    //dialog
    logseq.showMainUI();
    await Swal.fire({
      title: 'Create new project page',
      text: '',
      input: 'text',
      inputPlaceholder: 'Edit here',
      inputValue: ``,
      showCancelButton: true,
      color: sweetAlert2color,
      background: sweetAlert2background,
    }).then(async (answer) => {
      if (answer) {
        let { value: text } = answer;
        if (text) {
          const obj = await logseq.Editor.getPage(text) || [];//ページチェック
          if (Object.keys(obj).length === 0) {//ページが存在しない
            const createPage = await logseq.Editor.createPage(text, "", { createFirstBlock: false, redirect: true });
            if (createPage) {
              const userConfigs = await logseq.App.getUserConfigs();
              let userFormat = userConfigs.preferredDateFormat;
              userFormat = userFormat.replace(/E{1,3}/, "EEE");//handle same E, EE, or EEE bug
              await RecodeDateToPage(userFormat, "Project", " [[" + createPage.name + "]]");
              const prepend = await logseq.Editor.prependBlockInPage(createPage.uuid, "", { properties: { tags: "Project" } });
              if (prepend) {
                await logseq.Editor.editBlock(prepend.uuid).catch(async () => {
                  await setTimeout(async function () {
                    //ページプロパティを配列として読み込ませる処理
                    await logseq.Editor.insertAtEditingCursor(",");
                    await logseq.Editor.openInRightSidebar(createPage.uuid);
                    logseq.UI.showMsg("The page is created");
                  }, 200);
                });
              }
            }
          } else {//ページが存在していた場合
            logseq.Editor.openInRightSidebar(text);
            logseq.UI.showMsg("The Page already exists", "warning");
          }
        }

      } else {//cancel
        logseq.UI.showMsg("Cancel", "warning");
      }
    }).finally(() => {
      logseq.hideMainUI();
    });
  });

  //New child page
  logseq.App.registerPageMenuItem("🧒 create child page (for hierarchy)", async (e) => {
    const currentPage = await logseq.Editor.getCurrentPage();
    if (currentPage) {
      //dialog
      logseq.showMainUI();
      await Swal.fire({
        title: 'Create a child page',
        text: 'Edit following the current page name and slash.',
        input: 'text',
        inputPlaceholder: 'Edit here',
        inputValue: `${currentPage.name}/`,
        showCancelButton: true,
        color: sweetAlert2color,
        background: sweetAlert2background,
      }).then(async (answer) => {
        if (answer) {
          let { value: text } = answer;
          if (text) {
            if (text.endsWith("/")) {
              text = text.slice(0, -1);
            }
            if (text === `${currentPage.name}/`) {//ページ名が変更されていない
              logseq.UI.showMsg("Failed", "error");
            } else {
              const obj = await logseq.Editor.getPage(text) || [];//ページチェック
              if (Object.keys(obj).length === 0) {//ページが存在しない
                const createPage = await logseq.Editor.createPage(text, "", { createFirstBlock: false, redirect: false });
                if (createPage) {
                  const userConfigs = await logseq.App.getUserConfigs();
                  let userFormat = userConfigs.preferredDateFormat;
                  userFormat = userFormat.replace(/E{1,3}/, "EEE");//handle same E, EE, or EEE bug
                  //const ChildPageTitle = createPage.name.replace(`${currentPage.name}/`, "")
                  await RecodeDateToPage(userFormat, currentPage.name, " [[" + createPage.name + "]]");
                  logseq.Editor.openInRightSidebar(createPage.uuid);
                  logseq.UI.showMsg("The page is created");
                }
              } else {//ページが存在していた場合
                logseq.Editor.openInRightSidebar(text);
                logseq.UI.showMsg("The Page already exists", "warning");
              }
            }
          }
        } else {//cancel
          logseq.UI.showMsg("Cancel", "warning");
        }
      }).finally(() => {
        logseq.hideMainUI();
      });
    }
  });


  //TODO: Edit README.md
  //Prior art: https://github.com/hiway/logseq-calculator-plugin
  logseq.Editor.registerBlockContextMenuItem("Block Calculator", async (event) => {
    calculator(event);
  });
  logseq.Editor.registerSlashCommand("Block Calculator", async (event) => {
    calculator(event);
  });


  //TODO: Edit README.md
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


  //markdown link
  MarkdownLink(sweetAlert2background, sweetAlert2color);

  //main support
  parent.document.body.classList.add('is-plugin-some-menu-extender-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-some-menu-extender-enabled');
  });


};/* end_main */



async function addProperties(addProperty: string | undefined, addType: string, sweetAlert2background: string, sweetAlert2color: string) {

  //リスト選択モード
  if (addType === "Select") {
    let SettingSelectionList = logseq.settings?.SelectionList || "";
    if (SettingSelectionList === "") {
      return logseq.UI.showMsg(`Please set the selection list first`, "warning");//cancel
    }
    SettingSelectionList = SettingSelectionList.split(",");
    const SelectionListObj = {};
    for (let i = 0; i < SettingSelectionList.length; i++) {
      if (SettingSelectionList[i]) {
        SelectionListObj[`${SettingSelectionList[i]}`] = SettingSelectionList[i];
      }
    }
    //dialog
    logseq.showMainUI();
    await Swal.fire({
      text: 'Page-tags selection list',
      input: 'select',
      inputOptions: SelectionListObj,
      inputPlaceholder: 'Select a page-tag (Add to page-tags)',
      showCancelButton: true,
      color: sweetAlert2color,
      background: sweetAlert2background,
    }).then((answer) => {
      if (answer) {
        const { value: select } = answer;
        if (select) {
          addProperty = select;//ページタグ確定
        }
      }
    }).finally(() => {
      logseq.hideMainUI();
    });
  }
  if (addProperty === "") {
    return logseq.UI.showMsg(`Cancel`, "warning");//cancel
  }
  const getCurrent = await logseq.Editor.getCurrentPage();
  if (getCurrent && addProperty) {
    if (getCurrent.name === addProperty || getCurrent.originalName === addProperty) {
      return logseq.UI.showMsg(`Need not add current page to page-tags.`, "warning");//cancel same page
    }
    const getCurrentTree = await logseq.Editor.getCurrentPageBlocksTree();
    const firstBlockUUID: string = getCurrentTree[0].uuid;
    const editBlockUUID: string | undefined = await updateProperties(addProperty, "tags", getCurrent.properties, addType, firstBlockUUID);
    if (editBlockUUID) {
      if ((addType === "Select" && logseq.settings?.switchPARArecodeDate === true) || (addType === "PARA" && logseq.settings?.switchRecodeDate === true)) {//指定されたPARAページに日付とリンクをつける
        const userConfigs = await logseq.App.getUserConfigs();
        await setTimeout(function () { RecodeDateToPage(userConfigs.preferredDateFormat, addProperty, " [[" + getCurrent.name + "]]") }, 300);
      }
      logseq.UI.showMsg(`add ${addProperty} to tags`, "info");
    }
  }
}


async function RecodeDateToPage(userDateFormat, ToPageName, pushPageLink) {
  const blocks = await logseq.Editor.getPageBlocksTree(ToPageName);
  if (blocks) {
    //PARAページの先頭行の下に追記
    const content = getDateForPage(new Date(), userDateFormat) + pushPageLink;
    await logseq.Editor.insertBlock(blocks[0].uuid, content, { sibling: false });
  }
}


async function updateProperties(addProperty: string, targetProperty: string, PageProperties, addType: string, firstBlockUUID: string) {
  let editBlockUUID;
  let deleteArray = ['Project', 'Resource', 'Area of responsibility', 'Archive'];
  if (typeof PageProperties === "object" && PageProperties !== null) {//ページプロパティが存在した場合
    for (const [key, value] of Object.entries(PageProperties)) {//オブジェクトのキーに値がない場合は削除
      if (!value) {
        delete PageProperties[key];
      }
    }
    if (addType === "PARA") {
      deleteArray = deleteArray.filter(element => element !== addProperty);//PARA: 一致するもの以外のリスト
    }
    let PropertiesArray = PageProperties[targetProperty] || [];
    if (PropertiesArray) {
      if (addType === "PARA") {
        PropertiesArray = PropertiesArray.filter(property => !deleteArray.includes(property));//PARA: タグの重複削除
      }
      PropertiesArray = [...PropertiesArray, addProperty];
    } else {
      PropertiesArray = [addProperty];
    }
    PropertiesArray = [...new Set(PropertiesArray)];//タグの重複削除
    await logseq.Editor.upsertBlockProperty(firstBlockUUID, targetProperty, PropertiesArray);
    editBlockUUID = firstBlockUUID;
  } else {//ページプロパティが存在しない
    const prependProperties = {};
    prependProperties[targetProperty] = addProperty;
    await logseq.Editor.insertBlock(firstBlockUUID, "", { properties: prependProperties, sibling: true, before: true, isPageBlock: true, focus: true }).then((prepend) => {
      if (prepend) {
        logseq.Editor.moveBlock(prepend.uuid, firstBlockUUID, { before: true, children: true });
        editBlockUUID = prepend.uuid;
      }
    });

  }
  await logseq.Editor.editBlock(editBlockUUID);
  await setTimeout(function () {
    logseq.Editor.insertAtEditingCursor(",");//ページプロパティを配列として読み込ませる処理
  }, 200);
  return editBlockUUID;
}


//calculator
async function calculator(event) {
  let Success: boolean = false;
  const text = await logseq.Editor.getBlock(event.uuid, { includeChildren: false });
  if (text) {
    const result = await evalExpression(text.content);
    if (result) {
      await logseq.Editor.insertBlock(event.uuid, ` = ${result}`, { sibling: false, focus: true });
      Success = true;
      logseq.UI.showMsg("Success", "success");
    }
  }
  if (Success === false) {
    logseq.UI.showMsg("Failed", "error");
  }
}


// //CreateCalendar TODO:
// async function createCalendar(year, ThisYear, ThisMonth, selectBlock, preferredDateFormat) {
//   // 1月から12月までの各月の日数を配列に格納
//   const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//   let yearBlock;
//   await logseq.Editor.insertBlock(selectBlock, `${year}`, {}).then((y) => {
//     if (y) {
//       yearBlock = y.uuid;
//     }
//   });
//   let forTryMonth;
//   let forNextYear;
//   if (year === ThisYear) {
//     forTryMonth = 12;
//     forNextYear = ThisMonth - 1;
//   } else {
//     forTryMonth = ThisMonth;
//     forNextYear = 0;
//   }
//   for (let month: number = forNextYear; month < forTryMonth; month++) {
//     // 月の日数を取得する
//     let daysInMonth = monthDays[month];
//     // 2月の場合は閏年かどうかを確認して日数を修正
//     if (month === 1 && isLeapYear(year)) {
//       daysInMonth = 29;
//     }
//     // 月のカレンダー
//     const displayMonth = String(month + 1).padStart(2, '0');
//     //if 日付リンク有効/無効(ユーザー形式の月表示は難しい)      #TODO
//     await logseq.Editor.insertBlock(yearBlock, `${year}/${displayMonth}`, { properties: { collapsed: true } }).then(async (m) => {
//       if (m) {
//         for (let day = 1; day <= daysInMonth; day++) {
//           // 曜日を取得
//           const dayOfWeek = new Date(year, month, day).getDay();
//           // 平日と休日の色分け
//           let insertProperties = {};
//           if (dayOfWeek === 0) {
//             insertProperties["background-color"] = "red";
//           } else if (dayOfWeek === 6) {
//             insertProperties["background-color"] = "blue";
//           } else {

//           }
//           logseq.Editor.insertBlock(m.uuid, await getDateForPage(new Date(`${year}/${displayMonth}/${day}`), preferredDateFormat), { properties: insertProperties });
//         }
//       }
//     });
//   }
//   // うるう年かどうかを判定する関数
//   function isLeapYear(year) {
//     return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
//   }
// }


//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "switchCompletedDialog",
    title: "Use DONE task completed (date) property",
    type: "boolean",
    default: false,
    description: "Confirm in dialog and edit the date",
  },
  {
    key: "completedDialogAddTime",
    title: "Use completed (date) property with time",
    type: "boolean",
    default: false,
    description: "Confirm in dialog and edit the date and time",
  },
  {
    key: "switchMarkdownLink",
    title: "Use automatic markdown link title feature (Paste URL)",
    type: "boolean",
    default: true,
    description: "Confirm in dialog and edit the title",
  },
  {
    key: "switchPARAfunction",
    title: "Use [page title context menu] Shortcuts for PARA method pages",
    type: "boolean",
    default: false,
    description: "",
  },
  {
    key: "switchPARArecodeDate",
    title: "Record today's date on the PARA page when adding",
    type: "boolean",
    default: true,
    description: "",
  },
  {
    key: "SelectionList",
    type: "string",
    default: `Index,`,
    title: "Use page-tags selection list",
    description: `Entry page titles separated by commas(,).`,
  },
  {
    key: "switchRecodeDate",
    title: "Record today's date on the selection page when adding",
    type: "boolean",
    default: false,
    description: "",
  },
  {
    key: "nextLineBlank",
    title: "ContextMenuItem `Make to next line blank` option",
    type: "enum",
    default: "3",
    enumChoices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    description: "Number of blank lines after the selected block",
  }
];


function IncludeTitle(title: string) {
  title = title.replace(/[\n()\[\]]/g, '');
  title = title.replace("\n", '');
  title = title.replace("(", '');
  title = title.replace(")", '');
  title = title.replace("[", '');
  title = title.replace("]", '');
  title = title.replace("{{", '{');
  title = title.replace("}}", '}');
  title = title.replace("#+", ' ');
  return title;
}


logseq.ready(main).catch(console.error);