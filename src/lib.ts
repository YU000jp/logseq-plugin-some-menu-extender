import { BlockEntity, BlockUUIDTuple, PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { format, getISOWeek, getISOWeekYear, getWeek, getWeekYear } from "date-fns"
import { t } from "logseq-l10n"


export const stringLimitAndRemoveProperties = (content: string, limit: number): string => {
    if (content
        && content.length > limit)
        content = content.slice(0, limit) + "\n\n...\n"
    if (content.includes("\n")) {
        //contentに「background-color:: 何らかの文字列 \n」が含まれる場合は、その行を削除する
        content = content.replaceAll(/background-color:: .+?\n/g, "")
        //contentに。「id:: 何らかの文字列 \n」が含まれる場合は、その行を削除する
        content = content.replaceAll(/id:: .+?\n/g, "")
        //contentの最後の行に「id:: 」が含まれている場合は、その行を削除する
        content = content.replace(/id:: .+?$/, "")
        //contentに。「heading:: 何らかの文字列 \n」が含まれる場合は、その行を削除する
        content = content.replaceAll(/heading:: .+?\n/g, "")
    }
    return content
}


export const includeReference = async (content): Promise<string | null> => {
    if (content.match(/\(\(.+?\)\)/) === null) return null
    //contentに、{{embed ((何らかの英数値))}} であるか ((何らかの英数値)) が含まれている数だけ繰り返す
    while (content.match(/{{embed \(\((.+?)\)\)}}/) || content.match(/\(\((.+?)\)\)/)) {
        // {{embed ((何らかの英数値))}} であるか ((何らかの英数値)) だった場合はuuidとしてブロックを取得する
        const match = content.match(/{{embed \(\((.+?)\)\)}}/) || content.match(/\(\((.+?)\)\)/)
        if (!match) return null
        const thisBlock = await logseq.Editor.getBlock(match[1]) as BlockEntity | null
        if (!thisBlock) return null
        content = content.replace(match[0], thisBlock.content)
    }
    return content
}



//--------------------------------------------Credit: briansunter
//https://github.com/briansunter/logseq-plugin-gpt3-openai/blob/980b80dd7787457ffed2218c51fcf8007d4416d5/src/lib/logseq.ts#L47


const isBlockEntity = (b: BlockEntity | BlockUUIDTuple): b is BlockEntity => {
    return (b as BlockEntity).uuid !== undefined
}

const getTreeContent = async (b: BlockEntity) => {
    let content = ""
    const trimmedBlockContent = b.content.trim()
    if (trimmedBlockContent.length > 0)
        content += trimmedBlockContent + "\n"
    if (!b.children)
        return content

    for (const child of b.children) {
        if (isBlockEntity(child))
            content += await getTreeContent(child)
        else {
            const childBlock = await logseq.Editor.getBlock(child[1], { includeChildren: true, })
            if (childBlock)
                content += await getTreeContent(childBlock)
        }
    }
    return content
}


export const getPageContent = async (page: PageEntity): Promise<string> => {
    let blockContents: string[] = []

    const pageBlocks = await logseq.Editor.getPageBlocksTree(page.name) as BlockEntity[]
    for (const pageBlock of pageBlocks) {
        const blockContent = await getTreeContent(pageBlock)
        if (typeof blockContent === "string"
            && blockContent.length > 0)
            blockContents.push(blockContent)
    }
    return blockContents.join("\n")
}

//--------------------------------------------end of credit



/**
 * 先頭行が空のブロックを全て削除する。
 * @param block0 - 削除対象のブロックツリーの先頭ブロック
 */
export const removeEmptyBlockFirstLineAll = async (firstBlock: { children: BlockEntity["children"] }) => {
    const children = firstBlock.children as BlockEntity[]
    if (children
        && children.length > 0)
        for (let i = 0;
            i < children.length;
            i++) {
            const child = children[i]
            if (child.content === "")
                await logseq.Editor.removeBlock(child.uuid)
            // 子孫ブロックがある場合は探索する
            if (child.children
                && child.children.length > 0)
                await removeEmptyBlockFirstLineAll((child.children as { children: BlockEntity["children"] }[])[0])
        }
}


//月ごとにソートする場合
export const sortByMonth = async (blocks: BlockEntity[], insertContent: string, uuid: BlockEntity["uuid"], taskMarker: BlockEntity["marker"]) => {

    //同じ月のサブ行がある場合はそのブロックのサブ行に追記する
    const monthFormat: string = format(new Date(), "yyyy/MM")
    const firstBlock = blocks[0] as { uuid: BlockEntity["uuid"], children: BlockEntity["children"] }
    const children = firstBlock.children as BlockEntity[]
    //childrenのcontentが日付フォーマットと一致するか確認(先頭が 「### 」から始まる)
    const monthString = logseq.settings!.sortByMonthLink ?
        `### [[${monthFormat}]]`
        : `### ${monthFormat}`
    const child = children.find(child => child.content.startsWith(monthString))
    if (child
        && child.children as BlockEntity[]) {//マッチした場合
        //insertContentがすでにサブ行に記録されていないか調べる
        const checkDuplicate = getDuplicateBlock(uuid, child.children as BlockEntity[])

        if (taskMarker === "DOING") return // DOINGの場合は、そのままにする

        if (checkDuplicate
            && checkDuplicate.length > 0) {
            return
            //await removeDuplicateBlock(checkDuplicate)// 重複ブロックを削除
        }
        await logseq.Editor.insertBlock(child.uuid, insertContent, { sibling: false })//そのブロックのサブ行に追記する
    } else {
        //マッチしない場合
        //先頭行の下に、新しいブロックを作成して月分類のブロックを作成し、その中にサブ行を追記する
        const newBlock = await logseq.Editor.insertBlock(firstBlock.uuid, monthString, { sibling: false }) as { uuid: BlockEntity["uuid"] } | null // ブロックのサブ行に追記
        if (!newBlock)
            //年のためエラー処理
            logseq.UI.showMsg(t("Failed (Cannot create a new block in first block of the page)"), "error")
        else
            // ブロックのサブ行に追記
            await logseq.Editor.insertBlock(newBlock.uuid, insertContent, { sibling: false })
    }
}


export const getDuplicateBlock = (uuid: BlockEntity["uuid"], blocks: BlockEntity[]): { uuid: BlockEntity["uuid"] }[] => blocks.filter(({ content }) => content.includes(`((${uuid}))`))


export const removeDuplicateBlock = async (duplicateBlock: { uuid: BlockEntity["uuid"] }[]) => {
    if (duplicateBlock
        && duplicateBlock.length > 0)
        for (const block of duplicateBlock)
            await logseq.Editor.removeBlock(block.uuid)
}


//日付から週番号を求める
export const getWeekNumberFromDate = (targetDate: Date, config: string, flag?: { markdown?: boolean }): string => {
    let year: number
    let week: number
    if (config === "ISO8601") {
        week = getISOWeek(targetDate) // 月曜日始まり ISO8601
        year = getISOWeekYear(targetDate) // 週番号の年
    } else {
        //NOTE: getWeekYear関数は1月1日がその年の第1週の始まりとなる(デフォルト)
        week = getWeek(targetDate, { weekStartsOn: 0 }) //日曜日始まり US
        year = getWeekYear(targetDate, { weekStartsOn: 0 }) // 週番号の年
    }
    const weekString = (week < 10) ?
        String("0" + week)
        : String(week) // 週番号が1桁の場合は0埋めする

    return flag?.markdown ?
        `[${week === 53 ?
            `${year}-W${weekString}`
            : "W" + weekString}](${year}-W${weekString})`
        : "W" + weekString
}
