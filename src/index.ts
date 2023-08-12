import "@logseq/libs"; //https://plugins-doc.logseq.com/
import { settingsTemplate } from "./settings";
import { loadRepeatTask } from "./repeatTask";
import { loadReferenceEmbed } from "./referenceEmbed";
import { loadCalculator } from "./calculator";
import { loadNewChildPageButton } from "./newChildPageButton";
import { loadTaskWorkflowState } from "./taskWorkflowState";
import { loadCurrentPageTitle } from "./currentPageTitle";
import { loadPageInfo } from "./pageInfo";
import { loadCopyPageTitle } from "./CopyPageTitle";

const main = () => {
  logseq.useSettingsSchema(settingsTemplate);

  /* ContextMenuItem `repeat-task as LATER`  */
  loadRepeatTask();

  /* ContextMenuItem `Copy block reference and embed`  */
  loadReferenceEmbed();

  //コマンドパレット `select blocks to calculate`
  //選択したブロックの数値を合計して、最後のブロックに追記する
  //バレッドのコンテキストメニューではブロックの複数選択ができないため
  loadCalculator();

  //Rotate the task workflow state
  //タスクのワークフロー状態を切り替える
  loadTaskWorkflowState();

  //Slash command `Insert current page title as a link`
  //現在のページタイトルをリンクとして挿入する
  loadCurrentPageTitle();

  //ページ情報を表示する
  loadPageInfo();

  //新規作成ドロップダウンメニューにボタンを追加
  setTimeout(() => loadNewChildPageButton(), 600);

  //ページタイトルをリンクとしてコピーする
  loadCopyPageTitle();

  // logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

  // });
}; /* end_main */

logseq.ready(main).catch(console.error);
