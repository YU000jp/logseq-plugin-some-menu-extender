import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { logseq as PL } from "../package.json";
const pluginId = PL.id; //set plugin id from package.json
import { TurnOnFunction } from './function';
import { MarkdownLink } from './markdown-link';
/* main */
const main = () => {
  console.info(`#${pluginId}: MAIN`); //console
  const UserSettings: any = logseq.settings;

  TurnOnFunction(UserSettings);

  if (UserSettings.switchMarkdownLink === "enable") {
    MarkdownLink(UserSettings);
  }


  //https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  const settingsTemplate: SettingSchemaDesc[] = [
    {
      key: "switchCompletedDialog",
      title: "Turn on DONE task completed (date) property",
      type: "enum",
      enumChoices: ["enable", "disable"],
      enumPicker: "radio",
      default: "disable",
      description: "Confirm in dialog",
    },
    {
      key: "switchMarkdownLink",
      title: "Turn on automatic Markdown link",
      type: "enum",
      enumChoices: ["enable", "disable"],
      enumPicker: "radio",
      default: "disable",
      description: "Confirm in dialog / Anti-garbled for japanese website",
    },
  ];
  logseq.useSettingsSchema(settingsTemplate);

  logseq.provideStyle(String.raw`
  div#main-content-container input.form-checkbox{transform:scale(1.1)}
  div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
  div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
  div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
  div#main-content-container input.form-checkbox+div a{font-size:medium}
`);

  parent.document.body.classList.add('is-plugin-some-menu-extender-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-some-menu-extender-enabled');
  });

  console.info(`#${pluginId}: loaded`);//console
};/* end_main */





logseq.ready(main).catch(console.error);