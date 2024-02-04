import "@logseq/libs" //https://plugins-doc.logseq.com/
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
import { settingsTemplate } from "./settings"
import { loadRepeatTaskLATER } from "./repeatTaskLATER"
import { loadTaskWorkflowState } from "./moveTaskState"
import { mainCSS } from "./mainCSS"
import { loadAutoRemoveDeadline } from "./autoRemoveDeadline"
import { loadRepeatTaskDONE } from "./repeatTaskDONE"
import { loadDONEref } from "./DONEref"
let configPreferredDateFormat: string
export const getConfigPreferredDateFormat = (): string => configPreferredDateFormat

export const getUserConfig = async () => {
  const { preferredDateFormat } = await logseq.App.getUserConfigs() as { preferredDateFormat: string }
  configPreferredDateFormat = preferredDateFormat
}

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
  //`Rotate the task workflow state`
  //タスクのワークフロー状態を切り替える
  if (logseq.settings!.loadTaskWorkflowState === true) loadTaskWorkflowState()


  //タスクがDONEになったときに、DEADLINEやSCHEDULEを削除する機能
  if (logseq.settings!.loadAutoRemoveDeadline === true) loadAutoRemoveDeadline()

  //リピートタスクをDONEにしたときに、その子ブロックに、引用を持たせて完了ステータスを作成します
  if (logseq.settings!.loadRepeatTaskDONE === true) loadRepeatTaskDONE()

  ///DONEページの一行目ブロックの子ブロックに、ステータス(引用ref)を追加する
  if(logseq.settings!.loadDONEref === true) loadDONEref()

} /* end_main */

logseq.ready(main).catch(console.error);

