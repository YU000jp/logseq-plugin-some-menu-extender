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
