const { Gio, GLib } = imports.gi;

function setData(themeData, path) {
    const filePath = `${path}/data/userThemes.json`
    let currentSavedThemes = readJson(filePath)
    currentSavedThemes.unshift(themeData)
    writeJson(filePath, currentSavedThemes);
}

function getUserSavedThemes(path){
    const filePath = `${path}/data/userThemes.json`
    return readJson(filePath);
}

function getInstalledThemes(path){
    const filePath = `${path}/data/installedThemes.json`
    return readJson(filePath);
}

function readJson(filePath) {
    try {
        const file = Gio.File.new_for_path(filePath);
        const [success, content] = file.load_contents(null);
        if (!success) {
            throw new Error("Failed to load file contents");
        }
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(content);
        const data = JSON.parse(jsonString);
        return data;
    } catch (e) {
        console.error("Error reading the file:", e);
        return null;
    }
}

function writeJson(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 4);
        const file = Gio.File.new_for_path(filePath);
        const stream = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        stream.write_all(jsonString, null);
        stream.close(null);
    } catch (e) {
        console.error("Error writing to the file:", e);
    }
}


var dataModify = {
    setData,
    getUserSavedThemes,
    getInstalledThemes
}