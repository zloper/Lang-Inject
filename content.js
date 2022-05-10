// get every word on page logic
const text = document.querySelectorAll('h1, h2, h3, h4, h5, em, span, p, em');


function formatAnyRegister(word) {
    result = "";
    for (var i = 0; i < word.length; i++) {
        result += `[${word[i].toUpperCase()}${word[i].toLowerCase()}]`;
    }
    return result
}

function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}

function processTextBlock(txt, dict) {
    for (page_word of txt.innerHTML.toLowerCase().split(/[., !?"'><)(»«\n\f\t\v]+/)) {
        // console.log(page_word);
        key = page_word.trim();
        value = get(dict, key, null);
        if (!!value){
            var values = value.split("::");
            var translate = "";
            if (values.length >= 2) {
                translate = `<abbr title="${values[1]}">${values[0]}</abbr>`;
            } else {
                translate = values[0]
            }
            rkey = formatAnyRegister(key);
            expression = new RegExp(`(?:^|[\S+\n\r\s "'«(>])${rkey}(?:$|[., !?"'<)»\n\f\t\v])`, "gi");
            allMatch = [...txt.innerHTML.matchAll(expression)];


            uniqMatchList = new Set([]);
            for (index in allMatch) {
                uniqMatchList.add(allMatch[index][0]);
            }

            for (let match of uniqMatchList) {
                starter = "";
                ender = "";
                if (match != null) {
                    if (key.slice(-1).toLowerCase() !== match.slice(-1).toLowerCase()) {
                        ender = match.slice(-1);


                    }
                    if (key.charAt(0).toLowerCase() !== match[0].charAt(0).toLowerCase()) {
                        starter = match.charAt(0)
                    }

                }
                txt.innerHTML = txt.innerHTML.replaceAll(match, starter + translate + ender)
            }
        }
    }

}


function webTelegramReplace(dict) {
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].getAttribute('class') == 'message') {
            processTextBlock(divs[i], dict);
        }
    }
}

function replaceText(dict) {
    for (let i = 0; i < text.length; i++) {
        processTextBlock(text[i], dict);
    }

}


async function updatePage() {
    chrome.storage.sync.get(['vocab'], await function (result) {
        replaceText(result.vocab);
        webTelegramReplace(result.vocab);
    });
}


async function updatePageTg() {
    chrome.storage.sync.get(['vocab'], function (result) {
        replaceDict = result.vocab;
        webTelegramReplace(replaceDict);
    });
}

updatePage();
setInterval(updatePageTg, 10000);

