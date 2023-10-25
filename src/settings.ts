import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { t } from "logseq-l10n"

//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate = (): SettingSchemaDesc[] => [
  {//注意事項
    key: "headingHead",
    title: t("⚠️Attention"),
    type: "heading",
    default: "",
    description: t("Need to restart Logseq or turn this plugin off to take effect."),
  },
  {//ドキュメントへのリンク
    key: "headingDocumentLink",
    title: t("📖Document"),
    type: "heading",
    default: "",
    description: t("[Document here](https://github.com/YU000jp/logseq-plugin-some-menu-extender/wiki/Document)"),
  },

  {// ブロッククリアの箇条書きメニューと、コマンドパレットメニュー
    key: "headingClearBlocks",
    title: t("Clear block"),
    type: "heading",
    default: "",
    description: t("Clear block from the bullet menu item and command pallet menu item"),
  },
  {
    key: "loadClearBlocks",
    title: t("Enable"),
    type: "boolean",
    default: true,
    description:
    //どこかのブロックにカーソルがある状態でEscキーを押すと、そのブロックが選択される。ShiftキーやCtrl(Cmd)キーを押しながら、カーソルキーやマウスでその他のブロックを選択する。コマンドパレットを起動する(Ctrl + Shift + P)。"Block"を検索し、実行する。ブロックの内容が消去される。
    t("Any block is selected by pressing the Esc key while the cursor is on any block. Select other blocks with the cursor key or mouse while pressing the Shift or Ctrl (Cmd) key. Launch the command palette (Ctrl + Shift + P). Search for \"Block\" and run it. The contents of the block will be erased."),
  },

  {
    //loadTaskWorkflowState
    key: "headingLoadTaskWorkflowState",
    title: t("Move task state to next"),
    type: "heading",
    default: "",
    description: t("Shortcut key: `Ctrl+Shift+Enter`(Windows) or `Cmd+Shift+Enter`(Mac)"),
  },
  {
    //loadTaskWorkflowState
    key: "loadTaskWorkflowState",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },
  {
    key: "taskWorkflowState",
    title: t("Set state items (Strings used when moving a task to the next state)"),
    type: "string",
    default: "TODO,DOING,WAITING,CANCELED,DONE",
    description:
      t("Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)"), //Logseqで許可されたタスク用の文字列のみ有効
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
    title: t("Page Info Button feature"),
    type: "heading",
    default: "",
    //ページタイトルの横にある📋アイコンをクリックしたときに表示されるページ情報を表示する
    //日付はre-indexを実行すると更新される
    description: t("Show the page info when click 📋 icon on the right of page title. ⚠️After running 're-index' in Logseq, the date will be updated."),
  },
  {
    //loadPageInfo
    key: "loadPageInfoButton",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadPageDateNotifier
    key: "headingLoadPageDateNotifier",
    title: t("Page Date Notifier feature"),
    type: "heading",
    default: "",
    description: t("Show the date when a page opens"),
  },
  {
    //loadPageDateNotifier
    key: "loadPageDateNotifier",
    title: t("Enable"),
    type: "boolean",
    default: "false",
    description: "",
  },
  {
    //created-atを表示しない
    key: "pageDateNotifierCreatedAt",
    title: t("created-at"),
    type: "boolean",
    default: t("Enable"),
    description: t("⚠️Performing a `re-index` in Logseq updates the dates of `created-at` for all pages, causing them to be inadvertently changed."),
  },

  {
    //loadRepeatTask
    key: "headingLoadRepeatTask",
    title: t("`repeat-task as LATER` item"),
    type: "heading",
    default: "",
    description: t("Context menu item"),
  },
  {
    //loadRepeatTask
    key: "loadRepeatTask",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadReferenceEmbed
    key: "headingLoadRepeatTask",
    title: t("`Copy block reference and embed` item"),
    type: "heading",
    default: "",
    description: t("Context menu item"),
  },
  {
    //loadReferenceEmbed
    key: "loadReferenceEmbed",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadCurrentPageTitle
    key: "headingLoadCurrentPageTitle",
    title: t("`/Insert current page title as a link` item"),
    type: "heading",
    default: "",
    description: t("Slash command "),
  },
  {
    //loadCurrentPageTitle
    key: "loadCurrentPageTitle",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadCopyPageTitle
    //ページメニューに、「ページタイトルをリンクとしてコピーする」項目を追加
    key: "headingLoadCopyPageTitle",
    title: t("`📋 Copy page title as a link` item"),
    type: "heading",
    default: "",
    description: t("Page title menu"),
  },
  {
    //loadCopyPageTitle
    key: "loadCopyPageTitle",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadCalculator
    key: "headingLoadCalculator",
    title: t("`select blocks to calculate` item"),
    type: "heading",
    default: "",
    description: t("Command pallet menu item (shortcut key: `Ctrl+Shift+P`)"),
  },
  {
    //loadCalculator
    key: "loadCalculator",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

];
