export const mainCSS = (baseId: string) => {
  logseq.provideStyle(String.raw`
div#root main {
  & article>div[data-id="${baseId}"] {
      & div.heading-item {
          margin-top: 3em;
          border-top-width: 1px;
          padding-top: 1em;
      }
      & textarea.form-input {
          height: 12em;
          font-size: unset;
      }
  }
  & div#injected-ui-item-pageInfoBarSpace-${baseId}.injected-ui-item-pagebar {
    order:-1;
  }
}
  `);
};
