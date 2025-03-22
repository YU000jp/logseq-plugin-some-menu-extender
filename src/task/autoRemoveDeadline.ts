import { BlockEntity } from "@logseq/libs/dist/LSPlugin"
let processing: boolean = false

export const loadAutoRemoveDeadline = () => {
  onBlockChanged() // フック起動
}

const onBlockChanged = () => logseq.DB.onChanged(async ({ blocks, txMeta }) => {
  if (processing === true //処理中の場合 
    || (txMeta
      && txMeta["transact?"] === false //ユーザー操作ではない場合 (transactは取引の意味)
      || txMeta?.outlinerOp === "delete-blocks") //ブロックが削除された場合
  ) return //処理しない
  processing = true

  //DONEタスクが見つかった場合の処理
  if (logseq.settings!.removeDeadline === true
    || logseq.settings!.removeScheduled === true) {

    const taskBlock: { uuid: BlockEntity["uuid"], content: BlockEntity["content"] } | undefined = blocks.find(({ marker, content }) =>
      marker === "DONE"//DONEタスクを取得する
      && (content.includes("SCHEDULED: ")
        || content.includes("DEADLINE: "))) // どちらかが含まれている場合

    if (!taskBlock) { //DONEタスクが見つからない場合は処理しない
      setTimeout(() => processing = false, 100)
      return
    }

    //taskBlock.contentからSCHEDULED: <...>やDEADLINE: <...>を削除する 
    replaceContent(taskBlock.uuid, removeSCHEDULEandDEADLINE(taskBlock.uuid, taskBlock.content)) //taskBlock.contentを更新する
  }

  setTimeout(() => processing = false, 1000)
})


const removeSCHEDULEandDEADLINE = (uuid: BlockEntity["uuid"], content: BlockEntity["content"]): string => {
  const contentSplit: string[] = content.split("\n") // \nで区切る

  if (logseq.settings!.timeCopyToTheLine === true)
    //区切ったものの中で、"SCHEDULED: <"や"DEADLINE: <"が先頭に含まれるものを探し、「: <」の部分を「✔️ <」に置換します
    return contentSplit.map((splitText) =>
      (logseq.settings!.removeScheduled === true
        && splitText.startsWith("SCHEDULED: <"))
        ? splitText.replace(": <", "✔️ <")
        : (logseq.settings!.removeDeadline === true
          && splitText.startsWith("DEADLINE: <"))
          ? splitText.replace(": <", "✔️ <")
          : splitText
    ).join("\n") //\nで結合する
  else
    //区切ったものの中で、"SCHEDULED: <"や"DEADLINE: <"が先頭に含まれるものを探し、contentSplitからそれらの行を取り除きます
    return contentSplit.filter((splitText) =>
      (logseq.settings!.removeScheduled === true
        && !splitText.startsWith("SCHEDULED: <"))
      && (logseq.settings!.removeDeadline === true
        && !splitText.startsWith("DEADLINE: <"))
    ).join("\n") //\nで結合する

}

const replaceContent = (uuid: BlockEntity["uuid"], content: string) => {
  logseq.Editor.updateBlock(uuid, content)
  logseq.UI.showMsg("DONE, remove SCHEDULED or DEADLINE", "success", { timeout: 4000 })
}


