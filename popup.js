window.onload = function () {
    document.getElementById('add_btn').onclick = updateDict;
    document.getElementById('clear_btn').onclick = clearStorage;
    document.getElementById('download_btn').onclick = download;

    async function loadJson() {
        const response = await fetch("./base.json");
        return response.json();
    }

    function setWord(data) {
        chrome.storage.local.set({vocab: data}, function () {
            console.log('Set data... ');
        });
        chrome.storage.local.get(['vocab'], function (result) {
            console.log('result is get to ' + JSON.stringify(result['vocab']));
        });
        document.getElementById('new_word').value = "";
        document.getElementById('new_translate').value = "";
        document.getElementById('new_info').value = "";
    }

    async function updateDict() {
        json = await loadJson();
        chrome.storage.local.get(['vocab'], function (result) {
            mergedDict = Object.assign(json, result.vocab);
            word = document.getElementById('new_word').value.trim();
            translate = document.getElementById('new_translate').value;
            info = document.getElementById('new_info').value;
            newTranslate = translate + "::" + info + " {" + word + "}";
            mergedDict[word] = newTranslate;
            setWord(mergedDict)
        });

    }

    async function clearStorage() {
        chrome.storage.local.clear();
        json = await loadJson();
        setWord(json)
    }

     async function loadDict() {
        json = await loadJson();
        chrome.storage.local.set({vocab: json}, function () {
            console.log('Set data... ');
        });
    }

    async function download() {
        json = await loadJson();
        chrome.storage.local.get(['vocab'], function (result) {
            mergedDict = Object.assign(json, result.vocab);
            result = JSON.stringify(mergedDict, null, 4);
            console.log(result);

            var vLink = document.createElement('a'),
                vBlob = new Blob([result], {type: "octet/stream"}),
                vName = 'base.json',
                vUrl = window.URL.createObjectURL(vBlob);
            vLink.setAttribute('href', vUrl);
            vLink.setAttribute('download', vName);
            vLink.click();

        });
    }


};