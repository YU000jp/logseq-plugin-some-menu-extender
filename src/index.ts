import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { logseq as PL } from "../package.json";
const pluginId = PL.id; //set plugin id from package.json


/* main */
const main = () => {
  console.info(`#${pluginId}: MAIN`); //console

  /* user setting */
  // https://logseq.github.io/plugins/types/SettingSchemaDesc.html
  const settingsTemplate = [


  ];
  logseq.useSettingsSchema(settingsTemplate);





  console.info(`#${pluginId}: loaded`);//console
};/* end_main */





logseq.ready(main).catch(console.error);