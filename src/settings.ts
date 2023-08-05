import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";


//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate: SettingSchemaDesc[] = [
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
  {
    key: "taskWorkflowState",
    title: "Task workflow state",
    type: "string",
    default: "TODO,DOING,WAITING,CANCELED,DONE",
    description: "Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)", //Logseqで許可されたタスク用の文字列のみ有効
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
