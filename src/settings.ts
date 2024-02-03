import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user"
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

  //DONEになったときに、DEADLINEやSCHEDULEを削除する機能
  {
    key: "headingLoadAutoRemoveDeadline",
    title: t("Auto Remove DEADLINE or SCHEDULED when a task is DONE"),
    type: "heading",
    default: "",
    description: t(""),
  },
  {
    //トグル オンオフ
    key: "loadAutoRemoveDeadline",
    title: t("Enable"),
    type: "boolean",
    default: true,
    description: "",
  },
  {
    //DEADLINEを削除するかどうか
    key: "removeDeadline",
    title: t("Remove DEADLINE when a task is DONE"),
    type: "boolean",
    default: true,
    description: "",
  },
  {
    //SCHEDULEを削除するかどうか
    key: "removeScheduled",
    title: t("Remove SCHEDULED when a task is DONE"),
    type: "boolean",
    default: true,
    description: "",
  },
  {
    // 次の行にコピーを書きだす
    key: "timeCopyToTheLine",
    title: t("Copy to the line when remove DEADLINE or SCHEDULED"),
    type: "boolean",
    default: true,
    description: t("Finish the effectiveness of the task by removing the `:`. If you want to change it back, replace `✔️` with `:`."),
  },


  // リピートタスクをDONEにしたときに、その子ブロックに、引用を持たせて完了ステータスを作成し(DONEをつける場合とそうでない場合)、サイドバーで開く機能
  {
    key: "headingRepeatTaskDONE",
    title: t("Repeat Task Auto Status"),
    type: "heading",
    default: "",
    // リピートタスクにチェックを入れると、その次の行に、引用を持たせて完了ステータスを作成する
    description: t("When a repeat-task is checked, the next line is created with a quote and a DONE status. Move that reference to a journal or something."),
  },
  {
    //トグル オンオフ
    key: "loadRepeatTaskDONE",
    title: t("Enable"),
    type: "boolean",
    default: true,
    description: "",
  },
  {//DONEをつけるかどうか
    key: "repeatTaskDONEadd",
    title: t("Add DONE or Add today journal link, to the reference of the repeat task"),
    type: "enum",
    default: "Today journal link",
    enumChoices: ["Today journal link", "Add DONE", "None"],
    description: t(""),
  },
  {//サイドバーで開くかどうか
    key: "repeatTaskDONEopenSidebar",
    title: t("Open the sidebar when the repeat task is DONE"),
    type: "boolean",
    default: false,
    description: "",
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
    default: true,
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

]
