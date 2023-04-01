import '@logseq/libs';
import Swal from 'sweetalert2';//https://sweetalert2.github.io/
import Encoding from 'encoding-japanese';//https://github.com/polygonplanet/encoding.js


//https://github.com/0x7b1/logseq-plugin-automatic-url-title

const DEFAULT_REGEX = {
    wrappedInSharp: /\#+(.*?)\#+(?=[^#+]*?(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}))/gi,
    wrappedInApostrophe: /(`+)(.*?)\1(?=[^`]*?(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}))[^\`]*?\1/gi,
    wrappedInHTML: /@@html:\s*(.*?)\s*(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\s*(.*?)\s*@@/gi,
    wrappedInCommand: /(\{\{([a-zA-Z]+)\s*(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\s*\}\})/gi,
    htmlTitleTag: /<title(\s[^>]+)*>([^<]*)<\/title>/,
    line: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
    imageExtension: /\.(gif|jpe?g|tiff?|png|webp|bmp|tga|psd|ai)$/i,
};

const FORMAT_SETTINGS = {
    markdown: {
        formatBeginning: '](',
        applyFormat: (title, url) => `[${title}](${url})`,
    },
    org: {
        formatBeginning: '][',
        applyFormat: (title, url) => `[[${url}][${title}]]`,
    },
};

function decodeHTML(input) {
    if (!input) {
        return '';
    }

    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
}

async function getTitle(url) {
    try {
        const response = await fetch(url);
        const responseText = await response.text();
        //title convert UTF-8
        const matches = await Encoding.convert(responseText.match(DEFAULT_REGEX.htmlTitleTag), 'UTF8', 'AUTO');//エンコード処理(文字化け対策)

        if (matches !== null && matches.length > 1 && matches[2] !== null) {
            return decodeHTML(matches[2].trim());
        }
    } catch (e) {
        console.error(e);
    }

    return '';
}

async function convertUrlToMarkdownLink(title: string, url, text, urlStartIndex, offset, applyFormat) {
    if (title) {
        title = IncludeTitle(title);
    } else {
        return { text, offset };
    }

    const startSection = text.slice(0, urlStartIndex);
    const wrappedUrl = applyFormat(title, url);
    const endSection = text.slice(urlStartIndex + url.length);

    return {
        text: `${startSection}${wrappedUrl}${endSection}`,
        offset: urlStartIndex + url.length,
    };
}

function isImage(url) {
    const imageRegex = new RegExp(DEFAULT_REGEX.imageExtension);
    return imageRegex.test(url);
}

function isAlreadyFormatted(text, url, urlIndex, formatBeginning) {
    return text.slice(urlIndex - 2, urlIndex) === formatBeginning;
}

function isWrappedInCommand(text, url) {
    const wrappedLinks = text.match(DEFAULT_REGEX.wrappedInCommand);
    if (!wrappedLinks) {
        return false;
    }
    return wrappedLinks.some(command => command.includes(url));
}

function isWrappedInHTML(text, url) {//add
    // "@@html: "URLを含む何らかの文字"@@"にマッチする
    //https://github.com/YU000jp/logseq-plugin-some-menu-extender/issues/1
    const wrappedLinks = text.match(DEFAULT_REGEX.wrappedInHTML);
    if (!wrappedLinks) {
        return false;
    }
    return wrappedLinks.some(command => command.includes(url));
}

function isWrappedInApostrophe(text, url) {//add
    // `URLを含む何らかの文字`にマッチする ``も対応
    //https://github.com/YU000jp/logseq-plugin-some-menu-extender/issues/3
    const wrappedLinks = text.match(DEFAULT_REGEX.wrappedInApostrophe);
    if (!wrappedLinks) {
        return false;
    }
    return wrappedLinks.some(command => command.includes(url));
}

function isWrappedInSharp(text, url) {//add
    // #+URLを含む何らかの文字#+にマッチする
    //https://github.com/YU000jp/logseq-plugin-some-menu-extender/issues/4
    const wrappedLinks = text.match(DEFAULT_REGEX.wrappedInApostrophe);
    if (!wrappedLinks) {
        return false;
    }
    return wrappedLinks.some(command => command.includes(url));
}


async function getFormatSettings() {
    const { preferredFormat } = await logseq.App.getUserConfigs();
    if (!preferredFormat) {
        return null;
    }

    return FORMAT_SETTINGS[preferredFormat];
}

async function parseBlockForLink(uuid) {
    if (!uuid) {
        return;
    }

    const rawBlock = await logseq.Editor.getBlock(uuid);
    if (!rawBlock) {
        return;
    }

    let text = rawBlock.content;
    const urls = text.match(DEFAULT_REGEX.line);
    if (!urls) {
        return;
    }

    const formatSettings = await getFormatSettings();
    if (!formatSettings) {
        return;
    }

    let offset = 0;
    for (const url of urls) {
        const urlIndex = text.indexOf(url, offset);
        if (isAlreadyFormatted(text, url, urlIndex, formatSettings.formatBeginning) || isImage(url) || isWrappedInCommand(text, url) || isWrappedInHTML(text, url) || isWrappedInApostrophe(text, url) || isWrappedInSharp(text, url)) {
            continue;
        }
        //dialog
        await logseq.showMainUI();
        await Swal.fire({
            title: "Are you sure?",
            text: `Convert to markdown link\n(${url})`,
            icon: "info",
            showCancelButton: true,
        })
            .then(async (result) => {
                if (result) {//OK
                    if (result?.value) {
                        let title: string = await getTitle(url) || "";
                        title = await IncludeTitle(title);
                        await Swal.fire({
                            title: "Edit markdown link title",
                            input: "text",
                            inputValue: title,
                            showCancelButton: false,
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value) {
                                        resolve("");
                                    } else {
                                        resolve('Input cannot be empty!');
                                    }
                                });
                            },
                        }).then(async (resultEditTitle) => {
                            if (resultEditTitle?.value) {
                                const updatedTitle = await convertUrlToMarkdownLink(resultEditTitle.value, url, text, urlIndex, offset, formatSettings.applyFormat)
                                text = updatedTitle.text;
                                offset = updatedTitle.offset;
                                logseq.Editor.updateBlock(uuid, text);
                            }
                        });


                    } else {//Cancel
                        //user cancel in dialog
                        logseq.UI.showMsg("Cancel", "warning");
                        return uuid;
                    }
                }
            })
            .finally(() => {
                logseq.hideMainUI();
            });
        //dialog end
    }
}

function IncludeTitle(title: string) {
    title = title.replace(/[\n()\[\]]/g, '');
    title = title.replace("\n", '');
    title = title.replace("(", '');
    title = title.replace(")", '');
    title = title.replace("[", '');
    title = title.replace("]", '');
    title = title.replace("{{", '{');
    title = title.replace("}}", '}');
    title = title.replace("#+", ' ');
    return title;
}

export const MarkdownLink = () => {

    let blockSet = "";
    logseq.DB.onChanged(async (e) => {
        if (logseq.settings?.switchMarkdownLink === true) {
            const currentBlock = await logseq.Editor.getCurrentBlock();
            if (currentBlock) {
                if (blockSet !== currentBlock?.uuid) {//ほかのブロックを触ったら解除する
                    const uuidUserCancel: any = await parseBlockForLink(currentBlock.uuid);
                    if (uuidUserCancel) {//cancel
                        blockSet = uuidUserCancel;//キャンセルだったらブロックをロックする
                    }
                } else {
                    blockSet = currentBlock.uuid;
                }
            }
        }
    });
};