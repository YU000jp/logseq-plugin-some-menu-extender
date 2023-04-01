import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { logseq as PL } from "../package.json";
const pluginId = PL.id; //set plugin id from package.json
import { MarkdownLink } from './markdown-link';
import { addProperties, RecodeDateToPage } from './addProperties';
import Swal from 'sweetalert2';//https://sweetalert2.github.io/
import { getDateForPage } from 'logseq-dateutils';//https://github.com/hkgnp/logseq-dateutils


/* main */
const main = () => {
  console.info(`#${pluginId}: MAIN`); //console

  //https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  const settingsTemplate: SettingSchemaDesc[] = [
    {
      key: "switchCompletedDialog",
      title: "Turn on DONE task completed (date) property",
      type: "boolean",
      default: true,
      description: "Confirm in dialog",
    },
    {
      key: "switchMarkdownLink",
      title: "Turn on automatic Markdown link (Paste URL)",
      type: "boolean",
      default: true,
      description: "Confirm in dialog and edit the title / Anti-garbled (for japanese website and others)",
    },
    {
      key: "switchPARAfunction",
      title: "[page title context menu] Shortcuts for PARA method pages. Add to page-tags",
      type: "boolean",
      default: true,
      description: "Possible to add it, but delete it manually. \n(It is slow to be removed from the list of page tags by Logseq specification.)",
    },
    {
      key: "switchPARArecodeDate",
      title: "Record today's date on the PARA page when adding",
      type: "boolean",
      default: true,
      description: "Possible to add it, but delete it manually.",
    },
    {
      key: "SelectionList",
      type: "string",
      default: `Index,`,
      title: "For selecting on page-tags selection list",
      description: `Entry page titles separated by commas(,).`,
    },
    {
      key: "switchRecodeDate",
      title: "Record today's date on the selection page when adding",
      type: "boolean",
      default: false,
      description: "Possible to add it, but delete it manually.",
    },
  ];
  logseq.useSettingsSchema(settingsTemplate);


  logseq.provideStyle(String.raw`
  div#main-content-container input.form-checkbox{transform:scale(1.1)}
  div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
  div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
  div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
  div#main-content-container input.form-checkbox+div a{font-size:medium}
`);


  //switch contextmenu
  if (logseq.settings?.switchCompletedDialog === true) {
    //add completed property to done task
    //https://github.com/DimitryDushkin/logseq-plugin-task-check-date
    let blockSet = "";
    logseq.DB.onChanged(async (e) => {
      if (logseq.settings?.switchCompletedDialog === true) {//if changed settings
        const currentBlock = await logseq.Editor.getCurrentBlock();
        if (currentBlock) {
          if (blockSet !== currentBlock.uuid) {
            blockSet = "";//ほかのブロックを触ったら解除する
            if (!currentBlock.properties?.completed && currentBlock.marker === "DONE") {
              const userConfigs = await logseq.App.getUserConfigs();
              const today = new Date();
              const year = today.getFullYear();
              const month = ("0" + (today.getMonth() + 1)).slice(-2);
              const day = ("0" + today.getDate()).slice(-2);
              const todayFormatted = `${year}-${month}-${day}`;
              //dialog
              await logseq.showMainUI();
              const { value: formValues } = await Swal.fire<{
                input1: any;
              }>({
                title: "Turn on completed (date) property?",
                text: "",
                icon: "info",
                showCancelButton: true,
                html: `<input id="swal-input1" class="swal2-input" type="date" value="${todayFormatted}"/>`,//type:dateが指定できないためhtmlとして作成
                focusConfirm: false,
                preConfirm: () => {
                  const input1 = document.getElementById('swal-input1') as HTMLInputElement;
                  return {
                    input1: input1.value
                  };
                }
              });
              if (formValues) {
                if (formValues?.input1) {//OK
                  const FormattedDateUser = await getDateForPage(new Date(formValues?.input1), userConfigs.preferredDateFormat);
                  logseq.Editor.upsertBlockProperty(currentBlock.uuid, "completed", FormattedDateUser);
                } else {//Cancel
                  //user cancel in dialog
                  logseq.UI.showMsg("Cancel", "warning");
                  blockSet = currentBlock.uuid;//キャンセルだったらブロックをロックする
                }
              }
              await logseq.hideMainUI();
              //dialog end
            }
          } else {
            blockSet = currentBlock.uuid;
          }
        }
      }
    });
    //end
  }

  /* ContextMenuItem LATER  */
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

  /* ContextMenuItem Copy block reference and embed  */
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
    navigator.clipboard.writeText(`{{embed ((${event.uuid}))}}\n(from ((${event.uuid})) )`);
    logseq.UI.showMsg("Copied to clipboard\n(block reference and embed)", "info");
  });

  /* ContextMenuItem Make to next line blank  */
  logseq.Editor.registerBlockContextMenuItem('Make to next line blank', async (event) => {
    const block = await logseq.Editor.insertBlock(event.uuid, "", { focus: true, sibling: true });
    logseq.UI.showMsg("Done! (Make to next line blank)", "info");
  });

  /* SlashCommand Year List Calendar */
  logseq.Editor.registerSlashCommand('Create Year List Calendar', async (e) => {
    const userConfigs = await logseq.App.getUserConfigs();
    const ThisDate: any = new Date();
    const ThisYear = ThisDate.getFullYear();
    const ThisMonth = ThisDate.getMonth() + 1;
    const displayThisMonth = String(ThisMonth).padStart(2, '0');
    logseq.Editor.insertBlock(e.uuid, `Year List Calendar`).then(async (b) => {
      if (b) {
        //年間タスクリスト作成
        await createCalendar(ThisYear, ThisYear, ThisMonth, b.uuid, userConfigs.preferredDateFormat);//this year
        await createCalendar(ThisYear as number + 1, ThisYear, ThisMonth, b.uuid, userConfigs.preferredDateFormat);//next year
      }
    }).finally(() => {
      logseq.UI.showMsg(`Year Calendar since ${ThisYear}/${displayThisMonth}`, 'info');
    });
  });



  if (logseq.settings?.switchPARAfunction === true) {
    logseq.App.registerPageMenuItem("🎨 add Project", (e) => {
      addProperties("Project", "PARA");
    });
    logseq.App.registerPageMenuItem("🏠 add Area of responsibility", (e) => {
      addProperties("Area of responsibility", "PARA");
    });
    logseq.App.registerPageMenuItem("🌍 add Resource", (e) => {
      addProperties("Resource", "PARA");
    });
    logseq.App.registerPageMenuItem("🧹 add Archive", (e) => {
      addProperties("Archive", "PARA");
    });
  }
  logseq.App.registerPageMenuItem("🧺 add a page-tag by select list", (e) => {
    addProperties("", "Select");
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
    }).then(async (answer) => {
      if (answer) {
        let { value: text } = answer;
        if (text) {
          const obj = await logseq.Editor.getPage(text) || [];//ページチェック
          if (Object.keys(obj).length === 0) {//ページが存在しない
            const createPage = await logseq.Editor.createPage(text, "", { createFirstBlock: false, redirect: false });
            if (createPage) {
              const userConfigs = await logseq.App.getUserConfigs();
              await RecodeDateToPage(userConfigs.preferredDateFormat, "Project", " [[" + createPage.name + "]]");
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
                  //const ChildPageTitle = createPage.name.replace(`${currentPage.name}/`, "")
                  await RecodeDateToPage(userConfigs.preferredDateFormat, currentPage.name, " [[" + createPage.name + "]]");
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


  if (logseq.settings?.switchMarkdownLink === true) {
    MarkdownLink();
  }


  parent.document.body.classList.add('is-plugin-some-menu-extender-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-some-menu-extender-enabled');
  });

  console.info(`#${pluginId}: loaded`);//console
};/* end_main */


async function createCalendar(year, ThisYear, ThisMonth, selectBlock, preferredDateFormat) {
  // 1月から12月までの各月の日数を配列に格納
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let yearBlock;
  await logseq.Editor.insertBlock(selectBlock, `${year}`, {}).then((y) => {
    if (y) {
      yearBlock = y.uuid;
    }
  });
  let forTryMonth;
  let forNextYear;
  if (year === ThisYear) {
    forTryMonth = 12;
    forNextYear = ThisMonth - 1;
  } else {
    forTryMonth = ThisMonth;
    forNextYear = 0;
  }
  for (let month: number = forNextYear; month < forTryMonth; month++) {
    // 月の日数を取得する
    let daysInMonth = monthDays[month];
    // 2月の場合は閏年かどうかを確認して日数を修正
    if (month === 1 && isLeapYear(year)) {
      daysInMonth = 29;
    }
    // 月のカレンダー
    const displayMonth = String(month + 1).padStart(2, '0');
    //if 日付リンク有効/無効(ユーザー形式の月表示は難しい)      #TODO
    await logseq.Editor.insertBlock(yearBlock, `${year}/${displayMonth}`, { properties: { collapsed: true } }).then(async (m) => {
      if (m) {
        for (let day = 1; day <= daysInMonth; day++) {
          // 曜日を取得
          const dayOfWeek = new Date(year, month, day).getDay();
          // 平日と休日の色分け
          let insertProperties = {};
          if (dayOfWeek === 0) {
            insertProperties["background-color"] = "red";
          } else if (dayOfWeek === 6) {
            insertProperties["background-color"] = "blue";
          } else {

          }
          logseq.Editor.insertBlock(m.uuid, await getDateForPage(new Date(`${year}/${displayMonth}/${day}`), preferredDateFormat), { properties: insertProperties });
        }
      }
    });
  }
  // うるう年かどうかを判定する関数
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
}

logseq.ready(main).catch(console.error);