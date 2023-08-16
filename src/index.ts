import "@logseq/libs"; //https://plugins-doc.logseq.com/
import { settingsTemplate } from "./settings";
import { loadRepeatTask } from "./repeatTask";
import { loadReferenceEmbed } from "./referenceEmbed";
import { loadCalculator } from "./calculator";
import { loadNewChildPageButton } from "./newChildPageButton";
import { loadTaskWorkflowState } from "./taskWorkflowState";
import { loadCurrentPageTitle } from "./currentPageTitle";
import { loadPageInfoButton } from "./pageInfoButton";
import { loadCopyPageTitle } from "./CopyPageTitle";
import { mainCSS } from "./mainCSS";
import { loadPageDateNotifier } from "./pageDateNotifier";
import { loadLegacyDateFormat } from "./legacyDateFormat";

const main = () => {
  //設定画面の読み込み
  logseq.useSettingsSchema(settingsTemplate);

  //CSSを読み込む
  mainCSS(logseq.baseInfo.id);

  /* ContextMenuItem
  `repeat-task as LATER`  */
  if (logseq.settings!.loadRepeatTask === true) loadRepeatTask();

  /* ContextMenuItem
  `Copy block reference and embed`  */
  if (logseq.settings!.loadReferenceEmbed === true) loadReferenceEmbed();

  //Slash command
  //`Insert current page title as a link`
  //現在のページタイトルをリンクとして挿入する
  if (logseq.settings!.loadCurrentPageTitle === true) loadCurrentPageTitle();

  //Page bar item
  //ページ情報を表示する
  if (logseq.settings!.loadPageInfoButton === true) loadPageInfoButton();

  //In dropdown of 'create' item
  //新規作成ドロップダウンメニューにボタンを追加
  if (logseq.settings!.loadNewChildPageButton === true)
    loadNewChildPageButton();

  //Page title menu項目追加。ページタイトルをリンクとしてコピーする
  if (logseq.settings!.loadCopyPageTitle === true) loadCopyPageTitle();

  //コマンドパレット
  //`select blocks to calculate`
  //選択したブロックの数値を合計して、最後のブロックに追記する
  //バレッドのコンテキストメニューではブロックの複数選択ができないため
  if (logseq.settings!.loadCalculator === true) loadCalculator();
  //コマンドパレット
  //`Rotate the task workflow state`
  //タスクのワークフロー状態を切り替える
  if (logseq.settings!.loadTaskWorkflowState === true) loadTaskWorkflowState();

  //Page date notifier
  if (logseq.settings!.loadPageDateNotifier === true) loadPageDateNotifier();

  //Legacy date format
  //トリガー: 設定項目がオンになったとき
  if (logseq.settings!.loadLegacyDateFormat === true) loadLegacyDateFormat();
}; /* end_main */

logseq.ready(main).catch(console.error);
