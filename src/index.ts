import "@logseq/libs" //https://plugins-doc.logseq.com/
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
import { settingsTemplate } from "./settings"
import { loadRepeatTaskLATER } from "./repeatTaskLATER"
import { loadCalculator } from "./calculator"
import { loadTaskWorkflowState } from "./moveTaskState"
import { mainCSS } from "./mainCSS"
import { loadAutoRemoveDeadline } from "./autoRemoveDeadline"
import { loadRepeatTaskDONE } from "./repeatTaskDONE"


const main = async () => {
  await l10nSetup({ builtinTranslations: { ja } })
  //設定画面の読み込み
  logseq.useSettingsSchema(settingsTemplate())

  //CSSを読み込む
  mainCSS(logseq.baseInfo.id)

  /* ContextMenuItem
  `repeat-task as LATER`  */
  if (logseq.settings!.loadRepeatTask === true) loadRepeatTaskLATER()

  //コマンドパレット
  //`select blocks to calculate`
  //選択したブロックの数値を合計して、最後のブロックに追記する
  //バレッドのコンテキストメニューではブロックの複数選択ができないため
  if (logseq.settings!.loadCalculator === true) loadCalculator()
  //コマンドパレット
  //`Rotate the task workflow state`
  //タスクのワークフロー状態を切り替える
  if (logseq.settings!.loadTaskWorkflowState === true) loadTaskWorkflowState()


  //タスクがDONEになったときに、DEADLINEやSCHEDULEを削除する機能
  if (logseq.settings!.loadAutoRemoveDeadline === true) loadAutoRemoveDeadline()

  //リピートタスクをDONEにしたときに、その子ブロックに、引用を持たせて完了ステータスを作成します
  if (logseq.settings!.loadRepeatTaskDONE === true) loadRepeatTaskDONE()

} /* end_main */

logseq.ready(main).catch(console.error);

