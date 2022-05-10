window.onload = function () {
    document.getElementById('add_btn').onclick = updateDict;
    document.getElementById('clear_btn').onclick = clearStorage;
    document.getElementById('download_btn').onclick = download;

    async function loadJson() {
        const response = await fetch("./base.json");
        return response.json();
    }

    function setStore(data) {
        chrome.storage.sync.set({vocab: data}, function () {
            console.log('Set data... ');
        });
        chrome.storage.sync.get(['vocab'], function (result) {
            console.log('result is get to ' + JSON.stringify(result['vocab']));
        });
        document.getElementById('new_word').value = "";
        document.getElementById('new_translate').value = "";
        document.getElementById('new_info').value = "";

    }

    async function updateDict() {
        json = await loadJson();
        chrome.storage.sync.get(['vocab'], function (result) {
            mergedDict = Object.assign(json, result.vocab);
            word = document.getElementById('new_word').value.trim();
            translate = document.getElementById('new_translate').value;
            info = document.getElementById('new_info').value;
            newTranslate = translate + "::" + info + " {" + word + "}";
            mergedDict[word] = newTranslate;
            setStore(mergedDict)

        });

    }

    async function clearStorage() {
        chrome.storage.sync.clear();
        json = await loadJson();
        setStore(json)
    }

    async function download() {
        json = await loadJson();
        chrome.storage.sync.get(['vocab'], function (result) {
            mergedDict = Object.assign(json, result.vocab);
            result = JSON.stringify(mergedDict, null, 4)
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