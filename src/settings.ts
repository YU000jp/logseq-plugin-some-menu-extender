import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"

//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate = (): SettingSchemaDesc[] => [
  {//ドキュメントへのリンク
    key: "headingDocumentLink",
    title: t("📖Getting Started"),
    type: "heading",
    default: "",
    description: t("\"Enable\" toggles turns the feature on and off, but requires restarting Logseq or turning off this plugin once. Please refer to the documentation for feature details. [Document here](https://github.com/YU000jp/logseq-plugin-some-menu-extender/wiki/Document)"),
  },

  //DONEになったときに、DEADLINEやSCHEDULEを削除する機能
  {
    key: "headingLoadAutoRemoveDeadline",
    title: t("Auto remove DEADLINE or SCHEDULED"),
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
    description: t("When a task is set to DONE"),
  },
  {
    //DEADLINEを削除するかどうか
    key: "removeDeadline",
    title: t("Remove DEADLINE"),
    type: "boolean",
    default: true,
    description: "",
  },
  {
    //SCHEDULEを削除するかどうか
    key: "removeScheduled",
    title: t("Remove SCHEDULED"),
    type: "boolean",
    default: true,
    description: "",
  },
  {
    // 次の行にコピーを書きだす
    key: "timeCopyToTheLine",
    title: t("Leave a copy of DEADLINE or SCHEDULED without deleting it"),
    type: "boolean",
    default: true,
    description: t("Finish the effectiveness of the task by removing the `:`. If you want to change it back, replace `✔️` with `:`."),
  },

  // リピートタスクをDONEにしたときに、その子ブロックに、引用を持たせて完了ステータスを作成し(DONEをつける場合とそうでない場合)、サイドバーで開く機能
  {
    key: "headingRepeatTaskDONE",
    title: t("Repeat-task Auto Statistics"),
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
    description: t("When a repeat-task is checked"),
  },
  {//DONEをつけるかどうか
    key: "repeatTaskDONEadd",
    title: t("Add DONE marker or Add today journal link, to the reference of the repeat task"),
    type: "enum",
    default: "Today journal link",
    enumChoices: ["Today journal link", "Add DONE", "None"],
    description: t(""),
  },
  {//サイドバーで開くかどうか
    key: "repeatTaskDONEopenSidebar",
    title: t("Open the sidebar when the repeat task is checked"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    // Repeat-task as LATER
    key: "headingLoadRepeatTask",
    title: t("Repeat-task as LATER"),
    type: "heading",
    default: "",
    description: t("Provide workflow for recording repeat task as LATER in a journal. Select from the context menu of the repeating task bullet."),
  },
  {
    key: "loadRepeatTask",
    title: t("Enable"),
    type: "boolean",
    default: true,
    description: t("Bullet context menu item"),
  },

  // DONEタスクを作成したときに、DONEページの一行目の子ブロック行に、そのタスクの引用を挿入する機能
  {
    key: "headingLoadDONEref",
    title: t("DONE task Auto Statistics"),
    type: "heading",
    default: "",
    description: t("When a task is set to DONE, insert a reference of the task to the DONE page."),
  },
  {
    //トグル オンオフ
    key: "loadDONEref",
    title: t("DONE task: ") + t("Enable"),
    type: "boolean",
    default: true,
    description: t("When a task is set to DONE"),
  },
  {// リファレンスに日付リンクを挿入するかどうか
    key: "DONErefAddLink",
    title: t("DONE task: ") + t("Add the journal link to the reference of the task"),
    type: "boolean",
    default: true,
    description: "",
  },
  {// リファレンスに時間を挿入するかどうか
    key: "DONErefTime",
    title: t("DONE task: ") + t("Add time to the reference of the task"),
    type: "boolean",
    default: true,
    description: "",
  },
  {// リファレンスに週番号を挿入するかどうか
    key: "DONErefWeekNumber",
    title: t("DONE task: ") + t("Add the week number to the reference of the task"),
    type: "enum",
    default: "None",
    enumChoices: ["None", "ISO8601", "US"],
    description: t("If you want to use the ISO8601 format, select `ISO8601`. If you want to use the US format, select `US`."),
  },
  {//referenceにするかembedにするか
    key: "DONErefEmbed",
    title: t("DONE task: ") + t("Embed the reference of the task"),
    type: "boolean",
    default: false,
    description: "",
  },

  // DOING タスクを作成したときに、DOINGページの一行目の子ブロック行に、そのタスクの引用を挿入する機能
  {
    key: "headingLoadDOINGref",
    title: t("DOING task Auto Statistics"),
    type: "heading",
    default: "",
    description: t("When a task is set to DOING, insert a reference of the task to the DOING page."),
  },
  {
    // トグル オンオフ
    key: "loadDOINGref",
    title: t("DOING task: ") + t("Enable"),
    type: "boolean",
    default: true,
    description: t("When a task is set to DOING"),
  },
  {// リファレンスに日付リンクを挿入するかどうか
    key: "DOINGrefAddLink",
    title: t("DOING task: ") + t("Add the journal link to the reference of the task"),
    type: "boolean",
    default: true,
    description: "",
  },
  {// リファレンスに時間を挿入するかどうか
    key: "DOINGrefTime",
    title: t("DOING task: ") + t("Add time to the reference of the task"),
    type: "boolean",
    default: true,
    description: "",
  },
  {// リファレンスに週番号を挿入するかどうか
    key: "DOINGrefWeekNumber",
    title: t("DOING task: ") + t("Add the week number to the reference of the task"),
    type: "enum",
    default: "None",
    enumChoices: ["None", "ISO8601", "US"],
    description: t("If you want to use the ISO8601 format, select `ISO8601`. If you want to use the US format, select `US`."),
  },
  {//referenceにするかembedにするか
    key: "DOINGrefEmbed",
    title: t("DOING task: ") + t("Embed the reference of the task"),
    type: "boolean",
    default: false,
    description: "",
  },

  {//共通設定
    key: "headingCommonSettings",
    title: t("Common Settings"),
    type: "heading",
    default: "",
    description: "",
  },
  {// 月ごとのソートをするかどうか
    key: "sortByMonth",
    title: t("Common: ") + t("Sort by month"),
    type: "boolean",
    default: true,
    description: "",
  },
  {// 月ごとのソートをリンクにするかどうか
    key: "sortByMonthLink",
    title: t("Common: ") + t("Link to the month"),
    type: "boolean",
    default: true,
    description: "",
  },

  {
    //loadTaskWorkflowState
    key: "headingLoadTaskWorkflowState",
    title: t("Move Task State To Next (shortcut key)"),
    type: "heading",
    default: "",
    // ブロック上でショートカットキーを押すと、タスクのステータスを次に進める
    description: t("Move the task state to the next by pressing the shortcut key on the block. / A lite version of [Custom Workflow plugin](https://github.com/sawhney17/logseq-custom-workflow-plugin)"),
  },
  {
    //loadTaskWorkflowState
    key: "loadTaskWorkflowState",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: t("Default shortcut key: `Ctrl+Shift+Enter`(Windows) or `Cmd+Shift+Enter`(Mac)"),
  },
  {
    key: "taskWorkflowState",
    title: t("Set state items (Strings used when moving a task to the next state)"),
    type: "string",
    default: "TODO,DOING,WAITING,CANCELED,DONE",
    description:
      t("Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)"), //Logseqで許可されたタスク用の文字列のみ有効
  },

  {// "Delete unnecessary pages" feature settings (experimental)
    key: "headingDeleteUnnecessaryPages",
    title: t("Delete Unnecessary Pages"),
    type: "heading",
    default: "",
    description: "",
  },
  {
    key: "loadDeleteUnnecessaryPages",
    title: t("Enable"),
    type: "boolean",
    default: false,
    // プラグインが読み込まれてから5分後と、そのあと2時間ごとに、バックグラウンドで不要なページを削除する。ページ名に「[[」と「]]」を同時に含むページのすべてが対象。
    description: t("The plugin will delete unnecessary pages 5 minutes after it is loaded and every 2 hours thereafter. All pages with both `[[` and `]]` in the page name are targeted."),
  },
  {// 選択なしで自動で削除するか、ユーザーの選択を求めるか
    key: "deleteUnnecessaryPagesAuto",
    title: t("Automatic deletion or user selection"),
    type: "boolean",
    default: true,
    description: t("If `true`, delete unnecessary pages automatically. If `false`, ask the user for selection."),
  },
  { // インターバルを設定する
    key: "deleteUnnecessaryPagesInterval",
    title: t("Enable every 2 hour interval"),
    type: "boolean",
    default: true,
    description: t("It will not take effect until you restart or turn off the plugin."),
  }
]
