import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate: SettingSchemaDesc[] = [
  {
    //loadTwoHopLInk
    key: "headingLoadTwoHopLink",
    title: "2 hop link",
    type: "heading",
    default: "",
    description: "",
  },
  {
    key: "loadTwoHopLink",
    title: "Enable",
    type: "boolean",
    default: true,
    description: "(⚠️need to restart Logseq to take effect)",
  },

  {//outgoingLinks
    key: "outgoingLinks",
    type: "boolean",
    title: "outgoing links enable",
    default: true,
    description: "default: true",
  },
  {
    key: "hopLinkType",
    type: "enum",
    title: "2 hop link: Select BackLinks or page-tags, blocks, hierarchy",
    default: "backLinks",
    enumChoices: ["unset", "backLinks", "page-tags", "blocks", "hierarchy"],
    description: "default: backLinks",
  },
  {//除外するページ
    key: "excludePages",
    type: "string",
    title: "exclude page title Keywords",
    default: "",
    inputAs: "textarea",//改行で区切る
    description: "split by newline",
  },
  {//outgoingLinksからジャーナルを除外する
    key: "excludeJournalFromOutgoingLinks",
    type: "boolean",
    title: "exclude journal from outgoing links",
    default: true,
    description: "default: true",
  },
  {//outgoingLinksからyyyyやyyyy/MMのような形式を除外する
    key: "excludeDateFromOutgoingLinks",
    type: "boolean",
    title: "exclude date from outgoing links",
    default: true,
    description: "default: true",
  },
  {//Resultからジャーナルを除外する
    key: "excludeJournalFromResult",
    type: "boolean",
    title: "exclude journal from result",
    default: true,
    description: "default: true",
  },
  {//Resultからyyyyやyyyy/MMのような形式を除外する
    key: "excludeDateFromResult",
    type: "boolean",
    title: "exclude date from result",
    default: true,
    description: "default: true",
  },
  {
    //loadPageDateNotifier
    key: "headingLoadPageDateNotifier",
    title: "Page Date Notifier",
    type: "heading",
    default: "",
    description: "",
  },
  {
    //loadPageDateNotifier
    key: "loadPageDateNotifier",
    title: "Enable",
    type: "boolean",
    default: "false",
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //created-atを表示しない
    key: "pageDateNotifierCreatedAt",
    title: "created-at",
    type: "boolean",
    default: "Enable",
    description: `Enable
      ⚠️Performing a "re-index" in Logseq updates the dates of "created-at" for all pages, causing them to be inadvertently changed.
      `,
  },
  {
    //loadPageInfo
    key: "headingLoadPageInfoButton",
    title: "Show the page info when click 📋 icon on the right of page title",
    type: "heading",
    default: "",
    //ページタイトルの横にある📋アイコンをクリックしたときに表示されるページ情報を表示する
    description: "⚠️After running 're-index",
  },
  {
    //loadPageInfo
    key: "loadPageInfoButton",
    title: "Enable *Duplicate with the item above",
    type: "boolean",
    default: false,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadRepeatTask
    key: "headingLoadRepeatTask",
    title: "Context menu item `repeat-task as LATER`",
    type: "heading",
    default: "",
    description: "",
  },
  {
    //loadRepeatTask
    key: "loadRepeatTask",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadReferenceEmbed
    key: "headingLoadRepeatTask",
    title: "Context menu item `Copy block reference and embed`",
    type: "heading",
    default: "",
    description: "",
  },
  {
    //loadReferenceEmbed
    key: "loadReferenceEmbed",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadCurrentPageTitle
    key: "headingLoadCurrentPageTitle",
    title: "/Slash command `Insert current page title as a link`",
    type: "heading",
    default: "",
    description: "",
  },
  {
    //loadCurrentPageTitle
    key: "loadCurrentPageTitle",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadNewChildPageButton
    //新規作成ドロップダウンメニューにサブページ(子)を作るボタンを追加
    key: "headingLoadNewChildPageButton",
    title: "Add a button to create a child page in the dropdown menu",
    type: "heading",
    default: "",
    description: "",
  },
  {
    //loadNewChildPageButton
    key: "loadNewChildPageButton",
    title: "Enable",
    type: "boolean",
    default: true,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadCopyPageTitle
    //ページメニューに、「ページタイトルをリンクとしてコピーする」項目を追加
    key: "headingLoadCopyPageTitle",
    title: "Add `📋 Copy page title as a link` to the page title menu",
    type: "heading",
    default: "",

    description: "",
  },
  {
    //loadCopyPageTitle
    key: "loadCopyPageTitle",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadCalculator
    key: "headingLoadCalculator",
    title: "Command pallet menu item `select blocks to calculate`",
    type: "heading",
    default: "",
    description: "",
  },
  {
    //loadCalculator
    key: "loadCalculator",
    title: "Enable",
    type: "boolean",
    default: false,
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    //loadTaskWorkflowState
    key: "headingLoadTaskWorkflowState",
    title: "Command pallet menu item `Rotate task workflow state`",
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
    description: "(⚠️need to restart Logseq to take effect)",
  },
  {
    key: "taskWorkflowState",
    title: "Set state items",
    type: "string",
    default: "TODO,DOING,WAITING,CANCELED,DONE",
    description:
      "Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)", //Logseqで許可されたタスク用の文字列のみ有効
  },
  {
    key: "headingTaskWorkflowStateSetChildBlock",
    title: "Set child block on the DOING task",
    type: "heading",
    default: "",
    description: `If the DOING block contains like "#tag" in the first line, use the next lines in the DOING block to insert some child blocks by user plugin settings.

    Example*:
    #book
    TODO Reading %next week
    TODO Review %next 2weeks
    Read #Archive

    *Such as "%next week" require datenlp plugin.
    `,
  },
  {
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
