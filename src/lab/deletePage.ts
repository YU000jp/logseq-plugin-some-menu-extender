import { PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"
import { LABEL } from ".."

//ダイアログのキー
const key = "deletePagesDialog"

//Delete unnecessary pages feature

export const loadDeleteUnnecessaryPages = () => {
    const test = false
    const timeout = test ? 3000 : 1000 * 60 * 5 // test
    setTimeout(() => {
        //チェックをおこなう
        runQuery()
        // インターバル 2時間ごと
        if (logseq.settings!.deleteUnnecessaryPagesInterval === true)
            setInterval(() => {
                runQuery()
            }, 1000 * 60 * 60 * 2)
        // 5分後
    }, timeout)

}


const runQuery = async () => {

    logseq.UI.showMsg(t("Checked for unnecessary pagesII Runs periodically.") + LABEL, "success", { timeout: 8000 })

    //同じ名前をもつページ名を取得するクエリー
    const query = `
    [:find (pull ?p [:block/original-name :block/name])
            :in $ ?pattern
            :where
            [?p :block/name ?c]
            [(re-pattern ?pattern) ?q]
            [(re-find ?q ?c)]
    ]
    `
    let result = (await logseq.DB.datascriptQuery(query, (/\[\[/ as RegExp)) as any | null)?.flat() as {
        "original-name": PageEntity["original-name"],
        "name": PageEntity["name"]
    }[] | null
    if (!result) return

    //resultの中に、nullが含まれている場合があるので、nullを除外する
    result = result.filter((item) =>
        item !== null
        && item["name"].includes("]]"))


    if (result.length === 0) {// ページが見つからなかった場合に、チェックをおこなったことを伝える通知
        logseq.UI.showMsg(t("No unnecessary pages found.") + LABEL, "info", { timeout: 6000 })
        return
    }


    if (logseq.settings!.deleteUnnecessaryPagesAuto === true) { // 自動で削除するのトグルオンの場合
        //ページを削除する
        result.forEach(async (item) => {
            await logseq.Editor.deletePage(item["name"])
            logseq.UI.showMsg(t("Deleted") + " " + item["original-name"] + LABEL, "success", { timeout: 12000 })
        })
    } else
        //ページを削除するかどうかを確認するダイアログを表示する
        await selectDeletePagesDialog(result)
}


function selectDeletePagesDialog(result: { "original-name": PageEntity["original-name"], name: PageEntity["name"] }[]): Promise<void> {
    let checkButton = ""

    //<li><label><input type="check" name="selectPages" value="uuid"/>{targetTemplate}</label></li>
    result.forEach((item) => checkButton += `<li><label><input type="checkbox" name="selectPages" value="${item["name"]}"/>${item["original-name"]}</label></li>\n`)

    return new Promise((resolve) => {
        logseq.provideUI({
            attrs: {
                title: "[🌱Innovation Lab plugin]",
            },
            key,
            reset: true,
            template: `
<p>${t("Choice pages you want to delete.")}</p>
<ul>
${checkButton}
</ul>
<button type="button" id="selectDeletePagesButton">OK</button>
            `,
            style: {
                width: "440px",
                maxWidth: "440px",
                minWidth: "440px",
                height: "320px",
                left: "35vw",
                bottom: "unset",
                right: "unset",
                top: "10vw",
                padding: "1em",
                backgroundColor: 'var(--ls-primary-background-color)',
                color: 'var(--ls-primary-text-color)',
                boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
            },
        })

        setTimeout(() => {
            const button = parent.document.getElementById("selectDeletePagesButton") as HTMLButtonElement
            if (button) {
                let processing: Boolean = false
                button.addEventListener("click", () => {
                    if (processing) return
                    processing = true
                    logseq.showMainUI() //画面ロック用

                    //選択されたページを削除する
                    const selectPages = parent.document.getElementsByName("selectPages") as NodeListOf<HTMLInputElement>
                    Array.from(selectPages).forEach(async (item) => {
                        if (item.checked) {
                            await logseq.Editor.deletePage(item.value)
                            logseq.UI.showMsg(t("Deleted") + "\n<" + item.value + ">" + LABEL, "success", { timeout: 12000 })
                        }
                    })

                    logseq.hideMainUI() // 画面ロック解除
                    //ダイアログを閉じる
                    const element = parent.document.getElementById(logseq.baseInfo.id + `--${key}`) as HTMLDivElement | null
                    if (element) element.remove()
                    processing = false
                    resolve()
                })
            }
        }, 100)
    })
}
