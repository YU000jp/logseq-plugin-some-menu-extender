# Logseq Plugin: *Innovation Lab* 🌱

> Rename from `SomeMenuExtender` at 2023/06/10

- Provides several features that are currently in the development stage.

> This plugin still has room for improvement. Please let me know if you encounter any issues or have any ideas for enhancement.

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-some-menu-extender)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-some-menu-extender?color=blue)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/blob/main/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-some-menu-extender/total.svg)](https://github.com/YU000jp/logseq-plugin-some-menu-extender/releases)
 Published 2023/04/01

---

> ⚠️Split to some plugin at 2023/06/10

- 🔗[Confirmation Hyperlink (Pastes URL)](https://github.com/YU000jp/logseq-plugin-confirmation-hyperlink)
- 💪[Confirmation DONE task](https://github.com/YU000jp/logseq-plugin-confirmation-done-task)
- ⚓[Quickly PARA method](https://github.com/YU000jp/logseq-plugin-quickly-para-method)
- 🔘[Blank line plugin](https://github.com/YU000jp/logseq-plugin-blank-line)

## Table of Features

- Slash command item
  - Slash command Current page title as a link

- Block (bullet) context menu item
  1. For repeat-task
    - `repeat-task as LATER`
  1. For Outlines
        1. `Copy block reference and embed`
        1. ~~`Make to next line blank`~~ split to [Blank line plugin](https://github.com/YU000jp/logseq-plugin-blank-line)

- Command Pallet option
    1. `select blocks to calculate` > [#39](https://github.com/YU000jp/logseq-plugin-some-menu-extender/issues/39#issuecomment-1606044710)

       ![SUM](https://github.com/YU000jp/logseq-plugin-some-menu-extender/assets/111847207/ee09c4a9-933d-4fea-9f5b-a655669ef67d)
       > This is a program that performs addition between blocks containing only numbers. First, select the first block and press the Esc key, then use the Ctrl key to select each subsequent block. Please move the block with the total value to any desired location by dragging it with the mouse.
    1. `Rotate the task workflow state` > [41](https://github.com/YU000jp/logseq-plugin-some-menu-extender/issues/41)
  　　　![rotateTask](https://github.com/YU000jp/logseq-plugin-some-menu-extender/assets/111847207/628e8f51-01a2-4f98-8d11-84a1b73333ad)

### *Create new child page shortcut* (in dropdown menu of 'create') [#16](https://github.com/YU000jp/logseq-plugin-quickly-para-method/issues/16)

  ![newChildPage](https://github.com/YU000jp/logseq-plugin-quickly-para-method/assets/111847207/6c31e0be-cae1-45c1-85c5-93e61b118735)

## Document

> Check out [Document](https://github.com/YU000jp/logseq-plugin-some-menu-extender/wiki/Document)

---

## Getting Started

### Install from Logseq Marketplace

- Press `---` on the top right toolbar to open `Plugins`

- Select `Marketplace`

- Type `Lab` in the search field, select it from the search results and install

   ![image](https://github.com/YU000jp/logseq-plugin-some-menu-extender/assets/111847207/32afec53-20ad-41d0-ad54-44cd07a50c67)

### Plugin Settings

- Number of blank lines after the selected block: select
  - `1`, `2`, `3` default, `4`, `5`, `6`, `7`, `8`, `9`, `10`
- Rotate the task workflow state: Shortcut key: string
  - `Ctrl+Shift+Enter` default
- Task workflow state: string
  - `TODO,DOING,WAITING,CANCELED,DONE` default
   > Separate with `,`. Only strings for Logseq built in task markers are valid. (`NOW`|`LATER`|`TODO`|`DOING`|`DONE`|`WAITING`|`WAIT`|`CANCELED`|`CANCELLED`|`IN-PROGRESS`)
- Set child block on the DOING task: 01 - 06
  - (default: blank)

> Example:

```txt
#book
TODO Reading %next week
TODO Review %next 2weeks
Read #Archive
```
> *Such as `%next week` require [datenlp plugin](https://github.com/hkgnp/logseq-datenlp-plugin).



---

## Author

- GitHub: [YU000jp](https://github.com/YU000jp)

## Prior art & Credit

[sawhney17/ logseq-custom-workflow-plugin](https://github.com/sawhney17/logseq-custom-workflow-plugin)

### Icon

- [icooon-mono.com](https://icooon-mono.com/12611-%e3%83%a1%e3%83%8b%e3%83%a5%e3%83%bc%e3%81%ae%e3%83%95%e3%83%aa%e3%83%bc%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b316/)

---

<a href="https://www.buymeacoffee.com/yu000japan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="🍌Buy Me A Coffee" style="height: 42px;width: 152px" ></a>
