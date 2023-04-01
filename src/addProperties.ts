import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { logseq as PL } from "../package.json";
const pluginId = PL.id; //set plugin id from package.json
import Swal from 'sweetalert2';//https://sweetalert2.github.io/
import { getDateForPage } from 'logseq-dateutils';


export async function addProperties(addProperty: string | undefined, addType: string) {

    //リスト選択モード
    if (addType === "Select") {
        let SettingSelectionList = logseq.settings?.SelectionList || "";
        if (SettingSelectionList === "") {
            return logseq.UI.showMsg(`Please set the selection list first`, "warning");//cancel
        }
        SettingSelectionList = SettingSelectionList.split(",");
        const SelectionListObj = {};
        for (let i = 0; i < SettingSelectionList.length; i++) {
            if (SettingSelectionList[i]) {
                SelectionListObj[`${SettingSelectionList[i]}`] = SettingSelectionList[i];
            }
        }
        //dialog
        logseq.showMainUI();
        await Swal.fire({
            text: 'Page-tags selection list',
            input: 'select',
            inputOptions: SelectionListObj,
            inputPlaceholder: 'Select a page-tag (Add to page-tags)',
            showCancelButton: true,
        }).then((answer) => {
            if (answer) {
                const { value: select } = answer;
                if (select) {
                    addProperty = select;//ページタグ確定
                }
            }
        }).finally(() => {
            logseq.hideMainUI();
        });
    }
    if (addProperty === "") {
        return logseq.UI.showMsg(`Cancel`, "warning");//cancel
    }
    const getCurrent = await logseq.Editor.getCurrentPage();
    if (getCurrent && addProperty) {
        if (getCurrent.name === addProperty || getCurrent.originalName === addProperty) {
            return logseq.UI.showMsg(`Need not add current page to page-tags.`, "warning");//cancel same page
        }
        const getCurrentTree = await logseq.Editor.getCurrentPageBlocksTree();
        const firstBlockUUID: string = getCurrentTree[0].uuid;
        const editBlockUUID: string | undefined = await updateProperties(addProperty, "tags", getCurrent.properties, addType, firstBlockUUID);
        if (editBlockUUID) {
            if ((addType === "Select" && logseq.settings?.switchPARArecodeDate === true) || (addType === "PARA" && logseq.settings?.switchRecodeDate === true)) {//指定されたPARAページに日付とリンクをつける
                const userConfigs = await logseq.App.getUserConfigs();
                await setTimeout(function () { RecodeDateToPage(userConfigs.preferredDateFormat, addProperty, " [[" + getCurrent.name + "]]") }, 300);
            }
            logseq.UI.showMsg(`add ${addProperty} to tags`, "info");
        }
    }
}


export async function RecodeDateToPage(userDateFormat, ToPageName, pushPageLink) {
    const blocks = await logseq.Editor.getPageBlocksTree(ToPageName);
    if (blocks) {
        //PARAページの先頭行の下に追記
        const content = getDateForPage(new Date(), userDateFormat) + pushPageLink;
        await logseq.Editor.insertBlock(blocks[0].uuid, content, { sibling: false });
    }
}


export async function updateProperties(addProperty: string, targetProperty: string, PageProperties, addType: string, firstBlockUUID: string) {
    let editBlockUUID;
    let deleteArray = ['Project', 'Resource', 'Area of responsibility', 'Archive'];
    if (typeof PageProperties === "object" && PageProperties !== null) {//ページプロパティが存在した場合
        for (const [key, value] of Object.entries(PageProperties)) {//オブジェクトのキーに値がない場合は削除
            if (!value) {
                delete PageProperties[key];
            }
        }
        if (addType === "PARA") {
            deleteArray = deleteArray.filter(element => element !== addProperty);//PARA: 一致するもの以外のリスト
        }
        let PropertiesArray = PageProperties[targetProperty] || [];
        if (PropertiesArray) {
            if (addType === "PARA") {
                PropertiesArray = PropertiesArray.filter(property => !deleteArray.includes(property));//PARA: タグの重複削除
            }
            PropertiesArray = [...PropertiesArray, addProperty];
        } else {
            PropertiesArray = [addProperty];
        }
        PropertiesArray = [...new Set(PropertiesArray)];//タグの重複削除
        await logseq.Editor.upsertBlockProperty(firstBlockUUID, targetProperty, PropertiesArray);
        editBlockUUID = firstBlockUUID;
    } else {//ページプロパティが存在しない
        const prependProperties = {};
        prependProperties[targetProperty] = addProperty;
        await logseq.Editor.insertBlock(firstBlockUUID, "", { properties: prependProperties, sibling: true, before: true, isPageBlock: true, focus: true }).then((prepend) => {
            if (prepend) {
                logseq.Editor.moveBlock(prepend.uuid, firstBlockUUID, { before: true, children: true });
                editBlockUUID = prepend.uuid;
            }
        });

    }
    await logseq.Editor.editBlock(editBlockUUID);
    await setTimeout(function () {
        logseq.Editor.insertAtEditingCursor(",");//ページプロパティを配列として読み込ませる処理
    }, 200);
    return editBlockUUID;
}
