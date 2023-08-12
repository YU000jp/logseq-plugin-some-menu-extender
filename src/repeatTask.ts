export function loadRepeatTask() {
  //for repeat task
  logseq.provideStyle(String.raw`
    div#main-content-container input.form-checkbox{transform:scale(1.1)}
    div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
    div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
    div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
    div#main-content-container input.form-checkbox+div a{font-size:medium}
  `);

  logseq.Editor.registerBlockContextMenuItem(
    "repeat-task as LATER",
    async ({ uuid }) => {
      const block = await logseq.Editor.getBlock(uuid);
      if (block?.marker == "LATER") {
        logseq.UI.showMsg("This block is LATER", "error");
      } else {
        await logseq.Editor.insertBlock(uuid, `LATER 🔁 ((` + uuid + `))`).then(
          (block: any) => {
            logseq.App.openInRightSidebar(block.uuid);
            logseq.UI.showMsg(
              "Mouse drag a bullet of the block to move it to the journal.",
              "info"
            );
          }
        );
      }
    }
  );
}
