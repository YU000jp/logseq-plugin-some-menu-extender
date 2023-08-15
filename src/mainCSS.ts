export const mainCSS = (baseId: string) => {
  logseq.provideStyle(String.raw`
  div#root main div[data-id="${baseId}"] div.cp__plugins-settings-inner div.heading-item {
    margin-top: 1em;
    padding-top:1em;
    padding-bottom:.5em;
    outline:1px solid;
  }
  div#root main div[data-id="${logseq.baseInfo.id}"] textarea.form-input {
    height: 12em;
    font-size: unset;
  }
  div#root main div#injected-ui-item-pageInfoBarSpace-${logseq.baseInfo.id}.injected-ui-item-pagebar {
    order:-1;
  }
  `);
};
