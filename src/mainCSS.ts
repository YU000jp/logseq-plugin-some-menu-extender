
export const mainCSS = (baseId: string) => {
  logseq.provideStyle(String.raw`
  body>div#root>div>main {
    & article>div[data-id="${baseId}"] {
        & div.heading-item {
          margin-top: 3em;
          border-top-width: 1px;
          border-bottom-width: 0;
          padding-top: 1em;
          &>h2 {
            margin-bottom: 0.5em;
          }
        }
        & textarea.form-input {
          height: 12em;
          font-size: unset;
        }
        & div.desc-item {
          & p {
              margin-top: 0.5em;
              margin-bottom: 0.5em;
          }
        }
    }
    & div#injected-ui-item-pageInfoBarSpace-${baseId}.injected-ui-item-pagebar {
      order:-1;
    }
  }
  `);
};
