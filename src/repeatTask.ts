
export function repeatTask() {
  logseq.Editor.registerBlockContextMenuItem('repeat-task as LATER', async ({ uuid }) => {
    const block = await logseq.Editor.getBlock(uuid);
    if (block?.marker == "LATER") {
      logseq.UI.showMsg('This block is LATER', 'error');
    } else {
      await logseq.Editor.insertBlock(uuid, `LATER 🔁 ((` + uuid + `))`).then((block: any) => {
        logseq.App.openInRightSidebar(block.uuid);
        logseq.UI.showMsg("Mouse drag a bullet of the block to move it to the journal.", 'info');
      });
    }
  });
}
