import { BlockEntity } from "@logseq/libs/dist/LSPlugin"
import { format } from "date-fns"
import { getConfigPreferredDateFormat, getUserConfig } from "../."
let processing: boolean = false

export const loadRepeatTaskDONE = () => {
  onBlockChanged() // フック起動
  getUserConfig() // ユーザー設定を取得
}


const onBlockChanged = () => logseq.DB.onChanged(async ({ blocks, txMeta }) => {
  if (processing === true //処理中の場合 
    || (txMeta
      && txMeta["transact?"] === false //ユーザー操作ではない場合 (transactは取引の意味)
      || txMeta?.outlinerOp !== "save-block") //ブロックの保存操作ではない場合
  ) return //処理しない
  processing = true


  //TODOタスクが見つかった場合の処理
  const taskBlock: { uuid: BlockEntity["uuid"], content: BlockEntity["content"], repeated?: boolean | undefined } | undefined = blocks.find(({ marker, properties }) => marker === "TODO" && properties!.id) //TODOタスクを取得する

  if (!taskBlock
    || taskBlock["repeated?"] !== true) { //リピートタスクが見つからない場合は処理しない
    setTimeout(() => processing = false, 100)
    return
  }

  insertBlock(taskBlock.uuid) //リピートタスクの延長処理

  setTimeout(() => processing = false, 100)
})


const insertBlock = async (uuid: BlockEntity["uuid"]) => {
  //リピートタスクの行に、ステータスを追加する
  logseq.Editor.insertBlock(
    uuid,
    (logseq.settings!.repeatTaskDONEadd === "Add DONE" ? "DONE " // Add DONE
      : logseq.settings!.repeatTaskDONEadd === "None" ? "" //None
        : ` ✔️ [[${format(new Date(), getConfigPreferredDateFormat())}]] 🔁 `) //Today journal link
    + `((${uuid}))`, // リピートタスクへの参照
    { sibling: false })

  if (logseq.settings!.repeatTaskDONEopenSidebar === true) {
    logseq.Editor.openInRightSidebar(uuid)
    logseq.UI.showMsg(`
    Repeat task has been extended.
    
    Move that reference to a journal or something.
    `, "info", { timeout: 6000 })
  } else
    logseq.UI.showMsg("Repeat task has been extended.", "success", { timeout: 4000 })
}