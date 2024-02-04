import { BlockEntity } from "@logseq/libs/dist/LSPlugin"
import { format, getISOWeek } from "date-fns"
import { getConfigPreferredDateFormat, getUserConfig } from "."
import { getWeekNumberFromDate, removeDuplicateBlock, removeEmptyBlockFirstLineAll, sortByMonth } from "./lib"
let processing: boolean = false

export const loadDONEref = () => {
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

  //DONEタスクが見つかった場合の処理
  const taskBlock: { uuid: BlockEntity["uuid"], content: BlockEntity["content"], repeated?: boolean | undefined } | undefined = blocks.find(({ marker }) => marker === "DONE") //DONEタスクを取得する

  if (!taskBlock) { //DONEタスクが見つからない場合は処理しない
    setTimeout(() => processing = false, 100)
    return
  }

  insertBlock(taskBlock.uuid) //DONEタスクのrefをDONEページに挿入する

  setTimeout(() => processing = false, 5000)
})


const insertBlock = async (uuid: BlockEntity["uuid"]) => {
  //DONEページの一行目ブロックの子ブロックに、ステータス(引用ref)を追加する

  const insertContent = (logseq.settings!.DONErefWeekNumber !== "None" ? `${getWeekNumberFromDate(new Date(), logseq.settings!.DONErefWeekNumber as string,)}` : "") //週番号 //{ markdown: logseq.settings!.DONErefWeekNumberLink as boolean } 空ページができてしまう不具合がでてしまうので、週番号のリンクを作らない
    + (`${logseq.settings!.DONErefAddLink === true ? ` ✔️ [[${format(new Date(), getConfigPreferredDateFormat())}]] ` : ""}`) //Today journal link
    + (logseq.settings!.DONErefTime === true ? ` *${format(new Date(), "HH:mm")}* ` : "") // Today time
    + (logseq.settings!.DONErefEmbed === false ? // referenceにするかembedにするか
      `((${uuid}))` // reference of the DONE task
      : `{{embed ((${uuid}))}}`) //Embed the reference of the DONE task

  const blocks = await logseq.Editor.getPageBlocksTree("DONE") as BlockEntity[]

  if (logseq.settings!.sortByMonth === true) {//月ごとのソートをする場合

    await sortByMonth(blocks, insertContent, uuid)
    removeEmptyBlockFirstLineAll(blocks[0] as { children: BlockEntity["children"] })

  } else { //月ごとのソートをしない場合

    removeDuplicateBlock(uuid, blocks)
    const firstBlock = blocks[0] as { uuid: BlockEntity["uuid"], children: BlockEntity["children"] }
    if (!firstBlock || !firstBlock.uuid) return
    const duplicateBlock = (firstBlock.children as BlockEntity[] | undefined)?.find(({ content }) => content.includes(`((${uuid}))`)) as { uuid: BlockEntity["uuid"] } //重複チェック
    if (duplicateBlock) logseq.Editor.removeBlock(duplicateBlock.uuid)
    logseq.Editor.insertBlock(firstBlock.uuid, insertContent, { sibling: false }) //一行目の子ブロックに追加する

    logseq.UI.showMsg(`
    DONE.
    
    Added a status to "DONE" page.
    `, "success", { timeout: 4000 })
    removeEmptyBlockFirstLineAll(firstBlock as { children: BlockEntity["children"] })
  }
}
