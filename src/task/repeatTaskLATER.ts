import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"

export const loadRepeatTaskLATER = () => {
  //for repeat task
  logseq.provideStyle(String.raw`
    div#main-content-container input.form-checkbox{transform:scale(1.1)}
    div#main-content-container input.form-checkbox+div input.form-checkbox{transform:scale(0.6);pointer-events:none}
    div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox{transform:scale(0.9)}
    div#main-content-container input.form-checkbox+div input.form-checkbox+a,div#main-content-container div:not(.page-blocks-inner) input.form-checkbox+a+div input.form-checkbox+a{text-decoration:line-through;font-size:small;pointer-events:none}
    div#main-content-container input.form-checkbox+div a{font-size:medium}
  `)

  logseq.Editor.registerBlockContextMenuItem(t("Repeat-task as LATER"), async ({ uuid }) => {
    const block = await logseq.Editor.getBlock(uuid) as { marker: BlockEntity["marker"] } | null
    if (!block) return
    if (block?.marker === "LATER")
      logseq.UI.showMsg(t("This block is LATER task"), "error")
    else
      await logseq.Editor.insertBlock(uuid, `LATER 🔁 ((` + uuid + `))`).then((block: { uuid: BlockEntity["uuid"] } | null) => {
        if (!block) return
        logseq.Editor.openInRightSidebar(block.uuid)
        logseq.UI.showMsg(t("Mouse drag a bullet of the block to move it to the journal."), "info")
      })
  })
}
