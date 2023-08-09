import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { settingsTemplate } from './settings';
import { repeatTask as loadRepeatTask } from './repeatTask';
import { referenceEmbed as loadReferenceEmbed } from './referenceEmbed';
import { loadCalculator } from './calculator';
import { newChildPageButton } from './newChildPageButton';
import { loadTaskWorkflowState } from './taskWorkflowState';

const main = () => {
  logseq.useSettingsSchema(settingsTemplate);

  //for repeat task
  logseq.provideStyle(String.raw`
  div#main-content-container input.form-checkbox{transform:scale(1.1)}
  div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
  div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
  div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
  div#main-content-container input.form-checkbox+div a{font-size:medium}
  div#root main div[data-id="${logseq.baseInfo.id}"] textarea.form-input {
    height: 12em;
    font-size: unset;
  }
`);

  /* ContextMenuItem `repeat-task as LATER`  */
  loadRepeatTask();

  /* ContextMenuItem `Copy block reference and embed`  */
  loadReferenceEmbed();

  loadCalculator();

  // logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {

  // });


  //Rotate the task workflow state
  //タスクのワークフロー状態を切り替える
  loadTaskWorkflowState();


  //新規作成ドロップダウンメニューにボタンを追加
  setTimeout(() => newChildPageButton(), 600);


};/* end_main */



logseq.ready(main).catch(console.error);