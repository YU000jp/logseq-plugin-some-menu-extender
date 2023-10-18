import "@logseq/libs" //https://plugins-doc.logseq.com/
import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json";
import { settingsTemplate } from "./settings";
import { loadRepeatTask } from "./repeatTask";
import { loadReferenceEmbed } from "./referenceEmbed";
import { loadCalculator } from "./calculator";
import { loadTaskWorkflowState } from "./taskWorkflowState";
import { loadCurrentPageTitle } from "./currentPageTitle";
import { loadPageInfoButton } from "./pageInfoButton";
import { loadCopyPageTitle } from "./CopyPageTitle";
import { mainCSS } from "./mainCSS";
import { loadPageDateNotifier } from "./pageDateNotifier";

const main = async() => {
  await l10nSetup({ builtinTranslations: { ja } });
  //設定画面の読み込み
  logseq.useSettingsSchema(settingsTemplate());

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

}; /* end_main */

logseq.ready(main).catch(console.error);
