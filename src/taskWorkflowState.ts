import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export function DOINGchildrenSet(
  uuid: string,
  content: string,
  DOINGchildrenSet: string
): Boolean {
  if (DOINGchildrenSet !== "") {
    const blockSet: string[] = DOINGchildrenSet.split("\n");
    //blockSetの2つ目以降を使って処理する
    //Support date-nlp plugin
    if (content.includes(blockSet[0])) {
      processBlockSet(uuid, blockSet);
      return true;
    }
  }
  return false;
}

async function processBlockSet(
  uuid: string,
  blockSet: string[]
): Promise<void> {
  for (let index = 1; index < blockSet.length; index++) {
    const child = blockSet[index];
    await new Promise<void>((resolve) => {
      logseq.Editor.insertBlock(uuid, child, {
        before: false,
        sibling: false,
        focus: true,
      });
      setTimeout(() => {
        logseq.Editor.exitEditingMode();
        resolve();
      }, 200);
    });
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
  }
}

export function loadTaskWorkflowState() {
  let processing: Boolean = false;
  //コマンドパレット `Rotate the Task Workflow State`
  logseq.App.registerCommandPalette(
    {
      key: "toggleTaskWorkflowState",
      label: "Rotate the task workflow state",
      keybinding: {
        binding: "Ctrl+Shift+Enter",
      },
    },
    async ({ uuid }) => {
      if (processing) return;
      processing = true;
      const block = (await logseq.Editor.getBlock(uuid)) as BlockEntity;
      if (!block) return (processing = false);
      if (logseq.settings!.taskWorkflowState === "")
        return (processing = false);
      const states: string[] = logseq
        .settings!.taskWorkflowState.replace(/\s+/g, "")
        .split(",");
      const index: number = states.indexOf(block.marker);
      if (index === -1) {
        //ユーザー指定のタスクに一致しない場合
        if (!block.marker) {
          //タスクに一致しない場合
          //「# 」や「## 」「### 」「#### 」「##### 」「######」で始まっていた場合は、そのマッチした部分の後ろに追加する
          const match = block.content.match(/^(#+)\s/);
          if (match) {
            let content = block.content.replace(
              match[0],
              match[0] + states[0] + " "
            );
            content.replace(block.marker + " ", "");
            logseq.Editor.updateBlock(block.uuid, content);
          } else {
            logseq.Editor.updateBlock(
              block.uuid,
              states[0] + " " + block.content
            );
          }
        } else {
          logseq.Editor.updateBlock(
            block.uuid,
            block.content.replace(block.marker + " ", states[0] + " ")
          );
        }
      } else {
        let content = "";
        let DOING: boolean = false;
        switch (states[index + 1]) {
          case undefined:
            content = "";
            break;
          case "DOING":
            DOING = true;
          default:
            content = states[index + 1] + " ";
            break;
        }
        logseq.Editor.updateBlock(
          block.uuid,
          block.content.replace(block.marker + " ", content)
        );
        if (DOING === true) {
          if (
            (DOINGchildrenSet(
              block.uuid,
              block.content,
              logseq.settings!.DOINGchildrenSet01
            ) as boolean) === false
          ) {
            if (
              (DOINGchildrenSet(
                block.uuid,
                block.content,
                logseq.settings!.DOINGchildrenSet02
              ) as boolean) === false
            ) {
              if (
                (DOINGchildrenSet(
                  block.uuid,
                  block.content,
                  logseq.settings!.DOINGchildrenSet03
                ) as boolean) === false
              ) {
                if (
                  (DOINGchildrenSet(
                    block.uuid,
                    block.content,
                    logseq.settings!.DOINGchildrenSet04
                  ) as boolean) === false
                ) {
                  if (
                    (DOINGchildrenSet(
                      block.uuid,
                      block.content,
                      logseq.settings!.DOINGchildrenSet05
                    ) as boolean) === false
                  ) {
                    DOINGchildrenSet(
                      block.uuid,
                      block.content,
                      logseq.settings!.DOINGchildrenSet06
                    );
                  }
                }
              }
            }
          }
        }
      }
      processing = false;
    }
  );
}
