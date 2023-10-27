import { PageEntity } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"

export const loadPageDateNotifier = () => {
  //ページを開いたときに、ページの作成日時、更新日時を表示する
  logseq.App.registerUIItem("pagebar", {
    key: "pageInfoBarSpace",
    template: `
        <div id="pageBar--pageInfoBarSpace" title=""></div>
        `,
  })
  logseq.provideStyle(`
        div#root div#main-content-container{
        & div#pageBar--pageInfoBarSpace {
          width: fit-content;
          height: 80px;
          user-select: none;
          & table tr {
            & th {
              font-size:.83em;
            }
            & td {
              font-size:.9em;
            }
          }
        }
        & div.list-wrap:has(div#pageBar--pageInfoBarSpace) {
          padding-top:unset;
          overflow:hidden;
          height:100px;
        }
        & div[data-type="pagebar"] div.list-wrap:has(div#pageBar--pageInfoBarSpace) {
        overflow:hidden;
        }
      }
  `)

  logseq.App.onPageHeadActionsSlotted(async () => {
    setTimeout(() => insertPageBar(), 300)
  })
  logseq.App.onRouteChanged(async () => {
    setTimeout(() => insertPageBar(), 300)
  })
}

const insertPageBar = async () => {
  const elementPageBarSpace = parent.document.getElementById(
    "pageBar--pageInfoBarSpace"
  ) as HTMLDivElement | null
  if (!elementPageBarSpace) return
  if (elementPageBarSpace.dataset.pageInfoCheck) return
  const current = (await logseq.Editor.getCurrentPage()) as PageEntity | null
  if (!current) return
  if (!current.updatedAt && !current.createdAt) return
  const updated: Date = new Date(current.updatedAt as number)
  //updatedをフォーマットする(最後の3文字を削除する)
  const updatedString =
    dateFormatter.format(updated) + " " + timeFormatter.format(updated)
  const created: Date = new Date(current.createdAt as number)
  //createdをフォーマットする
  const createdString =
    dateFormatter.format(created) + " " + timeFormatter.format(created)
  elementPageBarSpace.innerHTML = `<table>${updatedString
    ? `<tr title="last updated"><th>${t("updated-at")}</th><td>` +
    updatedString +
    "</td></tr>"
    : ""
    }${logseq.settings!.pageDateNotifierCreatedAt === true && updated !== created && createdString
      ? `<tr title="${t("⚠️After running 're-index'")}"><th>${t("created-at")}</th><td>` +
      createdString +
      "</td></tr>"
      : ""
    }</table>`
  elementPageBarSpace.dataset.pageInfoCheck = "true"
}

// Intl.DateTimeFormatオブジェクトを作成（デフォルトロケールを使用）
export const dateFormatter = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const timeFormatter = new Intl.DateTimeFormat("default", {
  hour: "numeric",
  minute: "numeric",
})
