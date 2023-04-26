# Logseq Plugin: SomeMenuExtender

A plugin that adds new functions to context menus and others, allowing for more efficient and convenient operations.

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-some-menu-extender)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-some-menu-extender?color=blue)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/blob/main/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-some-menu-extender/total.svg)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/releases)

> Migrated several features from Column Layout plugin and Page-tags and Hierarchy plugin. #2023/04/01

## Table of Features

- Confirm on dialog
    1. [Auto link title (Paste URL)](#auto-link-title-paste-url)
    1. [Add completed property to DONE task (Mark task as DONE)](#add-completed-property-to-done-task-mark-task-as-done)
- Block Context menu
    1. For repeat-task
        1. `repeat-task as LATER`
    1. For outliner
        1. `Copy block reference and embed`
        1. `Make to next line blank`
- Page Context menu
    1. [For PARA method pages. Quickly add to page-tags](#for-para-method-pages-quickly-add-to-page-tags)
        1. `add Project`
        1. `add Area of responsibility`
        1. `add Resource`
        1. `add Archive`
    1. [For Other pages. Quickly add to page-tags](#for-other-pages-quickly-add-to-page-tags)
        1. `add a page-tag by select list`
    1. [Quickly create a page](#quickly-create-a-page)
        1. `create New Project`
        1. `create child page (for hierarchy)`
- [Slash command](#slash-command)
    1. `create pdf link (online)`

## Confirm on dialog

### Auto link title (Paste URL)

![someautomaticmarkdownlink](https://user-images.githubusercontent.com/111847207/229340766-02df5320-a37a-4a34-8aa7-bc1b22d700d0.gif)

- [Problem] Existing auto plugins do unnecessary conversions. / Garbled characters occur.

- [Solution] Confirm to user in dialog / anti-garbled japanese website : 日本語ウェブサイトの文字化け対策済み

- [Usage] Paste URL, then to bring up a dialog. Possible to edit the title.

### Add completed property to DONE task (Mark task as DONE)

![someDone](https://user-images.githubusercontent.com/111847207/229385006-08d16d36-a8d9-4b24-87d9-ed0c2474da00.gif)

- [Problem] Logseq does not record the DONE date.

- [Solution] After the task DONE, add completed property to the block.

- [Usage] After DONE a task, a dialog will appear asking to add a completed property. Possible to edit the date.

- [Result] The date contained in the completed property acts as a link. View completed tasks in Journal Linked References.

## Block context menu (Right click on bullet)

### `repeat-task as LATER`

- [Problem] Repeat task is for a notification. Not for journaling.

- [Solution] To place in the journal as a LATER task and block reference. For marking "DONE".

- [Usage] A block open into right sidebar. Drag that bullet and place it in the journal. After executing the task, click the repeat-task checkbox first, then the LATER task checkbox.

- [Result] Keep repeat task as a recode in journals.

### `Copy block reference and embed`

- [Problem] no link in embed

- [Solution] insert block reference and embed together

- [Usage] Copy to clipboard

- [Result] Enables access to reference source

### `Make to next line blank`

- [Problem] For blocks with content, line breaks can be annoying.

- [Solution] Select in context menu and work

- [Usage] Open context menu at the bullet for above block

- [Result] Create a line break without breaking outlines

## Page context menu (Right click on page title)

### For PARA method pages. Quickly add to page-tags

#### `🎨 add Project`

<details><summary>Demo</summary>
  
![Animation6w22](https://user-images.githubusercontent.com/111847207/226155740-02c6bc12-2930-4409-9acd-d3dc7f899514.gif)

</details>

#### `🏠 add Area of responsibility`

#### `🌍 add Resource`

#### `🧹 add Archive`

### For Other pages. Quickly add to page-tags

#### `🧺 add a page-tag by select list`

### Quickly create a page

#### `🧑‍💻 create New Project`

#### `🧒 create child page (for hierarchy)`

## Slash command

### `create pdf link (online)`

- Create a markdown link for online PDF

### `create Year List Calendar` **Test Function (△Not reaching the workflow)

- Using Year List Calendar, all the dates for a full year are generated as date links. When written as child elements, they are displayed in the Linked References section.

<details><summary>Demo</summary>

![Animation6w21](https://user-images.githubusercontent.com/111847207/222945226-f8e031cf-9e49-4c98-a5e8-ee360c931050.gif)

</details>

## Install from Marketplace

- Press [---] on the top right toolbar to open [Plugins]

- Select marketplace

- Type 'some' in the search field, select it from the search results and install

![image](https://user-images.githubusercontent.com/111847207/229358935-9a6cfb57-4978-42fc-9197-a962c8ecca33.png)

## Other Logseq plugins (My products)

- [Column Layout](https://github.com/YU000jp/Logseq-column-Layout)
- [Panel Coloring](https://github.com/YU000jp/logseq-plugin-panel-coloring)
- [Page-tags and Hierarchy](https://github.com/YU000jp/logseq-page-tags-and-hierarchy)
- [Rakuten-books](https://github.com/YU000jp/logseq-plugin-rakuten-books) (Only for Japanese site)
- [booklog-jp-import](https://github.com/YU000jp/logseq-plugin-booklog-jp-import) (Only for Japanese site)

## Prior art & Credit

### Library

- [@logseq/libs](https://logseq.github.io/plugins/)
- [hkgnp/logseq-dateutils](https://github.com/hkgnp/logseq-dateutils)

### Logseq-plugin

- [DimitryDushkin/ task completion tracker](https://github.com/DimitryDushkin/logseq-plugin-task-check-date)
- [0x7b1/ automatic url title](https://github.com/0x7b1/logseq-plugin-automatic-url-title)
- [freder/ insert above](https://github.com/freder/logseq-plugin-insert-above)
- [georgeguimaraes/ add PARA properties](https://github.com/georgeguimaraes/logseq-plugin-add-PARA-properties)

### Icon

- [icooon-mono.com](https://icooon-mono.com/12611-%e3%83%a1%e3%83%8b%e3%83%a5%e3%83%bc%e3%81%ae%e3%83%95%e3%83%aa%e3%83%bc%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b316/)

---

<a href="https://www.buymeacoffee.com/yu000japan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="🍌Buy Me A Coffee" style="height: 42px;width: 152px" ></a>
