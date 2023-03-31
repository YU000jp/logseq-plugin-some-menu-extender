# Logseq Plugin: SomeMenuExtender

A Logseq plugin that adds new functions to context menus and others, allowing for more efficient and convenient operations.

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-some-menu-extender)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-some-menu-extender?color=blue)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/blob/main/LICENSE)

## Features

- "Feature 1": Description
- "Feature 2": Description
- "Feature 3": Description
- "Feature 4": Description
- "Feature 5": Description

### Bullet context menu 🔁`repeat-task as LATER`

- [Problem] Repeat task is for a notification. Not for journaling.

- [Solution] To place in the journal as a LATER task and block reference. For marking "DONE".

- [Usage] A block open into right sidebar. Drag that bullet and place it in the journal. After executing the task, click the repeat-task checkbox first, then the LATER task checkbox.

- [Result] Keep repeat task as a recode in journals.

### Bullet context menu `Copy block reference and embed`

- [Problem] no link in embed

- [Solution] insert block reference and embed together

- [Usage] Copy to clipboard

- [Result] Enables access to reference source

### Bullet Context menu `Make to next line blank`

- [Problem] For blocks with content, line breaks can be annoying.

- [Solution] Select in context menu and work

- [Usage] Open context menu at the bullet for above block

- [Result] Create a line break without breaking outlines

## Test Function

### Dialog for automatic markdown link (Paste URL)

- [Problem] URL is converted inadvertently / Garbled characters occur.

- [Solution] Confirm in dialog / anti-garbled japanese website : 日本語ウェブサイトの文字化け対策済み

- [Usage] Paste URL, then press Enter to bring up a dialog.

### DONE dialog for add a completed property

- [Problem] Logseq does not record the DONE date.

- [Solution] After the task DONE, add completed property to the block.

- [Usage] After DONE a task, a dialog will appear asking if you want to add a completed property.

- [Result] The date contained in the completed property acts as a link. View completed tasks in Journal Linked References.

### Year List Calendar <slash command : `create Year List Calendar`>

- Using Year List Calendar, all the dates for a full year are generated as date links. When written as child elements, they are displayed in the Linked References section.

![Animation6w21](https://user-images.githubusercontent.com/111847207/222945226-f8e031cf-9e49-4c98-a5e8-ee360c931050.gif)

## Credit

- [@logseq/libs](https://logseq.github.io/plugins/)
- [hkgnp/logseq-dateutils](https://github.com/hkgnp/logseq-dateutils)
- [icooon-mono.com](https://icooon-mono.com/12611-%e3%83%a1%e3%83%8b%e3%83%a5%e3%83%bc%e3%81%ae%e3%83%95%e3%83%aa%e3%83%bc%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b316/)
