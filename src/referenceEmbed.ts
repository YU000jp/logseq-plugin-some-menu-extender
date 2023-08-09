
export function referenceEmbed() {
  logseq.Editor.registerBlockContextMenuItem('Copy block reference and embed', async ({ uuid }) => {
    const block = await logseq.Editor.getBlock(uuid);
    // necessary to have the window focused in order to copy the content of the code block to the clipboard
    //https://github.com/vyleung/logseq-copy-code-plugin/blob/main/src/index.js#L219
    window.focus();
    navigator.clipboard.writeText(`{{embed ((${uuid}))}}\nfrom ((${uuid}))`);
    logseq.UI.showMsg("Copied to clipboard\n(block reference and embed)", "info");
  });
}
