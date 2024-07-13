import { BlockEntity } from "@logseq/libs/dist/LSPlugin"
import { format } from "date-fns"
import { getConfigPreferredDateFormat, getUserConfig } from "../."
import { getDuplicateBlock, getWeekNumberFromDate, removeDuplicateBlock, removeEmptyBlockFirstLineAll, sortByMonth } from ".././lib"
let DONEprocessing: boolean = false
let DOINGprocessing: boolean = false

export const loadDONEref = () => {
  onBlockChanged("DONE") // フック起動
  getUserConfig() // ユーザー設定を取得
}
export const loadDOINGref = () => {
  onBlockChanged("DOING") // フック起動
  getUserConfig() // ユーザー設定を取得
}


const onBlockChanged = (taskMarker: string) => logseq.DB.onChanged(async ({ blocks, txMeta }) => {
  if ((taskMarker === "DONE"
    && DONEprocessing === true) //処理中の場合
    || (taskMarker === "DOING"
      && DOINGprocessing === true) //処理中の場合
    || (txMeta
      && (txMeta["transact?"] === false //ユーザー操作ではない場合 (transactは取引の意味)
        || txMeta?.outlinerOp !== "save-block" //ブロックの保存操作ではない場合
      ))
  ) return //処理しない

  if (taskMarker === "DOING")
    DOINGprocessing = true
  else
    if (taskMarker === "DONE")
      DONEprocessing = true

  //タスクが見つかった場合の処理
  const taskBlock: { uuid: BlockEntity["uuid"], content: BlockEntity["content"], repeated?: boolean | undefined } | undefined = blocks.find(({ marker }) => marker === taskMarker) //マーカーに一致するタスクを取得する

  if (!taskBlock) { //タスクが見つからない場合は処理しない
    setTimeout(() => {
      if (taskMarker === "DOING")
        DOINGprocessing = false
      else
        if (taskMarker === "DONE")
          DONEprocessing = false
    }, 100)
    return
  }

  insertBlock(taskBlock.uuid, taskMarker) //そのタスクのrefをページに挿入する

  setTimeout(() => {
    if (taskMarker === "DOING")
      DOINGprocessing = false
    else
      if (taskMarker === "DONE")
        DONEprocessing = false
  }, 5000)
})


const insertBlock = async (uuid: BlockEntity["uuid"], taskMarker: string) => {
  //Eページの一行目ブロックの子ブロックに、ステータス(引用ref)を追加する

  const insertContent = (logseq.settings![taskMarker + "refWeekNumber"] !== "None" ? `${getWeekNumberFromDate(new Date(), logseq.settings![taskMarker + "refWeekNumber"] as string,)}` : "") //週番号 ※リンクNG (空ページができてしまう不具合がでるため)
    + (`${logseq.settings![taskMarker + "refAddLink"] === true ?
      ` ✔️ [[${format(new Date(), getConfigPreferredDateFormat())}]] `
      : ""}`) //Today journal link
    + (logseq.settings![taskMarker + "refTime"] === true ?
      ` *${format(new Date(), "HH:mm")}* `
      : "") // Today time
    + (logseq.settings![taskMarker + "refEmbed"] === false ? // referenceにするかembedにするか
      `((${uuid}))` // reference of the task
      : `{{embed ((${uuid}))}}`) //Embed the reference of the task

  const blocks = await logseq.Editor.getPageBlocksTree(taskMarker) as BlockEntity[]

  if (logseq.settings!.sortByMonth === true) {//月ごとのソートをする場合

    await sortByMonth(blocks, insertContent, uuid, taskMarker)
    removeEmptyBlockFirstLineAll(blocks[0] as { children: BlockEntity["children"] })

  } else { //月ごとのソートをしない場合
    const checkDuplicate = getDuplicateBlock(uuid, blocks)
    if (taskMarker === "DOING") return // DOINGの場合は、そのままにする
    if (checkDuplicate
      && checkDuplicate.length > 0) {
      return
      //removeDuplicateBlock(checkDuplicate)
    }
    const firstBlock = blocks[0] as { uuid: BlockEntity["uuid"], children: BlockEntity["children"] }
    if (!firstBlock
      || !firstBlock.uuid) return
    const duplicateBlock = (firstBlock.children as BlockEntity[] | undefined)?.find(({ content }) => content.includes(`((${uuid}))`)) as { uuid: BlockEntity["uuid"] } //重複チェック
    if (duplicateBlock)
      logseq.Editor.removeBlock(duplicateBlock.uuid)
    logseq.Editor.insertBlock(firstBlock.uuid, insertContent, { sibling: false }) //一行目の子ブロックに追加する

    logseq.UI.showMsg(`
    A ${taskMarker === "DONE" ? "The task is set DONE" : taskMarker + " task created."} 
    
    Added a reference of the task to "${taskMarker}" page.
    `, "success", { timeout: 4000 })
    removeEmptyBlockFirstLineAll(firstBlock as { children: BlockEntity["children"] })
  }
}
