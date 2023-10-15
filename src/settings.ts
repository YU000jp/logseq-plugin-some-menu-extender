import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate = (): SettingSchemaDesc[] => [
  {//注意事項
    key: "headingHead",
    title: "⚠️Attention",
    type: "heading",
    default: "",
    description: "Need to restart Logseq to take effect.",
  },
  {//ドキュメントへのリンク
    key: "headingDocumentLink",
    title: "📖Document",
    type: "heading",
    default: "",
    description: "[Document here](https://github.com/YU000jp/logseq-plugin-some-menu-extender/wiki/Document)",
  },

  {
    //loadTaskWorkflowState
    key: "headingLoadTaskWorkflowState",
    title: "Rotate task workflow state",
    type: "heading",
    default: "",
    description: "Shortcut key: `Ctrl+Shift+Enter`",
  },
  {
    //loadTaskWorkflowState
    key: "loadTaskWorkflowState",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },
  {
    key: "taskWorkflowState",
    title: "Set state items",
    type: "string",
    default: "TODO,DOING,WAITING,CANCELED,DONE",
    description:
      "Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)", //Logseqで許可されたタスク用の文字列のみ有効
  },
  // {
  //   key: "headingTaskWorkflowStateSetChildBlock",
  //   title: "Set child block on the DOING task",
  //   type: "heading",
  //   default: "",
  //   description: `If the DOING block contains like "#tag" in the first line, use the next lines in the DOING block to insert some child blocks by user plugin settings.

  //   Example*:
  //   #book
  //   TODO Reading %next week
  //   TODO Review %next 2weeks
  //   Read #Archive

  //   *Such as "%next week" require datenlp plugin.
  //   `,
  // },
  // {
  //   //https://github.com/sawhney17/logseq-custom-workflow-plugin/issues/4
  //   key: "DOINGchildrenSet01",
  //   title: "Set child block on the DOING task: 01",
  //   type: "string",
  //   default: "",
  //   inputAs: "textarea",
  //   description: "(default: blank) Separate with a newline.",
  // },
  // {
  //   key: "DOINGchildrenSet02",
  //   title: "Set child block on the DOING task: 02",
  //   type: "string",
  //   default: "",
  //   inputAs: "textarea",
  //   description: "(default: blank) Separate with a newline.",
  // },
  // {
  //   key: "DOINGchildrenSet03",
  //   title: "Set child block on the DOING task: 03",
  //   type: "string",
  //   default: "",
  //   inputAs: "textarea",
  //   description: "(default: blank) Separate with a newline.",
  // },
  // {
  //   key: "DOINGchildrenSet04",
  //   title: "Set child block on the DOING task: 04",
  //   type: "string",
  //   default: "",
  //   inputAs: "textarea",
  //   description: "(default: blank) Separate with a newline.",
  // },
  // {
  //   key: "DOINGchildrenSet05",
  //   title: "Set child block on the DOING task: 05",
  //   type: "string",
  //   default: "",
  //   inputAs: "textarea",
  //   description: "(default: blank) Separate with a newline.",
  // },
  // {
  //   key: "DOINGchildrenSet06",
  //   title: "Set child block on the DOING task: 06",
  //   type: "string",
  //   default: "",
  //   inputAs: "textarea",
  //   description: "(default: blank) Separate with a newline.",
  // },

  {
    //loadPageInfo
    key: "headingLoadPageInfoButton",
    title: "Page Info Button  ",
    type: "heading",
    default: "",
    //ページタイトルの横にある📋アイコンをクリックしたときに表示されるページ情報を表示する
    //日付はre-indexを実行すると更新される
    description: "Show the page info when click 📋 icon on the right of page title. ⚠️After running 're-index' in Logseq, the date will be updated.",
  },
  {
    //loadPageInfo
    key: "loadPageInfoButton",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadPageDateNotifier
    key: "headingLoadPageDateNotifier",
    title: "Page Date Notifier",
    type: "heading",
    default: "",
    description: "Show the date when a page opens",
  },
  {
    //loadPageDateNotifier
    key: "loadPageDateNotifier",
    title: "Enable",
    type: "boolean",
    default: "false",
    description: "",
  },
  {
    //created-atを表示しない
    key: "pageDateNotifierCreatedAt",
    title: "created-at",
    type: "boolean",
    default: "Enable",
    description: "⚠️Performing a `re-index` in Logseq updates the dates of `created-at` for all pages, causing them to be inadvertently changed.",
  },

  {
    //loadRepeatTask
    key: "headingLoadRepeatTask",
    title: "`repeat-task as LATER`",
    type: "heading",
    default: "",
    description: "Context menu item",
  },
  {
    //loadRepeatTask
    key: "loadRepeatTask",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadReferenceEmbed
    key: "headingLoadRepeatTask",
    title: "`Copy block reference and embed`",
    type: "heading",
    default: "",
    description: "Context menu item",
  },
  {
    //loadReferenceEmbed
    key: "loadReferenceEmbed",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadCurrentPageTitle
    key: "headingLoadCurrentPageTitle",
    title: "`/Insert current page title as a link`",
    type: "heading",
    default: "",
    description: "Slash command ",
  },
  {
    //loadCurrentPageTitle
    key: "loadCurrentPageTitle",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadCopyPageTitle
    //ページメニューに、「ページタイトルをリンクとしてコピーする」項目を追加
    key: "headingLoadCopyPageTitle",
    title: "`📋 Copy page title as a link`",
    type: "heading",
    default: "",
    description: "Page title menu",
  },
  {
    //loadCopyPageTitle
    key: "loadCopyPageTitle",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadCalculator
    key: "headingLoadCalculator",
    title: "`select blocks to calculate`",
    type: "heading",
    default: "",
    description: "Command pallet menu item (shortcut key: `Ctrl+Shift+P`)",
  },
  {
    //loadCalculator
    key: "loadCalculator",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "",
  },

];
