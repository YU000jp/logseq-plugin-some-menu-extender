import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { logseq as PL } from "../package.json";
const pluginId = PL.id; //set plugin id from package.json
import { TurnOnFunction } from './function';
import { MarkdownLink } from './markdown-link';
import { addProperties,RecodeDateToPage } from './addProperties';
import Swal from 'sweetalert2';//https://sweetalert2.github.io/



/* main */
const main = () => {
  console.info(`#${pluginId}: MAIN`); //console

  TurnOnFunction();

  if (logseq.settings?.switchMarkdownLink === true) {
    MarkdownLink();
  }


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

  parent.document.body.classList.add('is-plugin-some-menu-extender-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-some-menu-extender-enabled');
  });

  console.info(`#${pluginId}: loaded`);//console
};/* end_main */





logseq.ready(main).catch(console.error);