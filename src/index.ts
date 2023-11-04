import "@logseq/libs" //https://plugins-doc.logseq.com/
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
import { settingsTemplate } from "./settings"
import { loadRepeatTask } from "./repeatTask"
import { loadCalculator } from "./calculator"
import { loadTaskWorkflowState } from "./moveTaskState"
import { mainCSS } from "./mainCSS"


const main = async () => {
  await l10nSetup({ builtinTranslations: { ja } })
  //設定画面の読み込み
  logseq.useSettingsSchema(settingsTemplate())

  //CSSを読み込む
  mainCSS(logseq.baseInfo.id)

  /* ContextMenuItem
  `repeat-task as LATER`  */
  if (logseq.settings!.loadRepeatTask === true) loadRepeatTask()

  //コマンドパレット
  //`select blocks to calculate`
  //選択したブロックの数値を合計して、最後のブロックに追記する
  //バレッドのコンテキストメニューではブロックの複数選択ができないため
  if (logseq.settings!.loadCalculator === true) loadCalculator()
  //コマンドパレット
  //`Rotate the task workflow state`
  //タスクのワークフロー状態を切り替える
  if (logseq.settings!.loadTaskWorkflowState === true) loadTaskWorkflowState()

} /* end_main */

logseq.ready(main).catch(console.error);

