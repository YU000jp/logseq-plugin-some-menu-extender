import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"


export const loadTaskWorkflowState = () => {
  let processing: Boolean = false
  //コマンドパレット `Rotate the Task Workflow State`
  logseq.App.registerCommandPalette(
    {
      key: "toggleTaskWorkflowState",
      label: t("Move task state to next"),
      keybinding: {
        binding: "mod+shift+enter",
      },
    },
    async ({ uuid }) => {
      if (processing) return
      processing = true
      const block = (await logseq.Editor.getBlock(uuid)) as { uuid: BlockEntity["uuid"], content: BlockEntity["content"], marker: BlockEntity["marker"] }
      if (!block) return (processing = false)
      if (logseq.settings!.taskWorkflowState === "") return (processing = false)

      const states: string[] = (logseq.settings!.taskWorkflowState as string).replace(/\s+/g, "")
        .split(",")
      const index: number = block.marker ? states.indexOf(block.marker) : -1
      if (index === -1) {
        //ユーザー指定のタスクに一致しない場合
        if (!block.marker) {
          //タスクに一致しない場合
          //「# 」や「## 」「### 」「#### 」「##### 」「######」で始まっていた場合は、そのマッチした部分の後ろに追加する
          const match = block.content.match(/^(#+)\s/)
          if (match) {
            let content = block.content.replace(match[0], match[0] + states[0] + " ")
            content.replace(block.marker + " ", "")
            logseq.Editor.updateBlock(block.uuid, content)
          } else
            logseq.Editor.updateBlock(block.uuid, states[0] + " " + block.content)
        } else
          logseq.Editor.updateBlock(block.uuid, block.content.replace(block.marker + " ", states[0] + " "))

      } else {
        let content = ""
        switch (states[index + 1]) {
          case undefined:
            content = "" //最後の状態の場合はタスクマーカーを削除する
            break
          default:
            content = states[index + 1] + " "
            break
        }

        logseq.Editor.updateBlock(block.uuid, block.content.replace(block.marker + " ", content))
      }
      setTimeout(() => processing = false, 200)
    }
  )
}
