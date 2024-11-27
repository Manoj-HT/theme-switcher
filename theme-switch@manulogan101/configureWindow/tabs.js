const { Gtk, GLib, Gio } = imports.gi;
const dataModify = imports.data.dataModifiers

var tabs = {
    createThemesTab,
    userThemesTab,
};

let userSavedThemes = []

function userThemesTab({ currentFolder }) {
    const box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });
    const label = new Gtk.Label({ label: currentFolder });
    box.pack_start(label, true, true, 0);
    return box;
}

function createThemesTab({ currentFolder }) {
    const parentBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });
    
    userSavedThemes = dataModify.getUserSavedThemes(currentFolder)
    const id = userSavedThemes.length
    userSavedThemes.unshift({ id })

    parentBox.pack_start(uploadIconBox({ currentFolder, id }), false, false, 0);
    parentBox.pack_start(chooseApplicationThemeBox({ id }), false, false, 0);
    parentBox.pack_start(chooseShellThemeBox({ id }), false, false, 0);
    parentBox.pack_start(chooseCursorBox({ id }, false, false, 0));
    parentBox.pack_start(addDescriptionBox({ id }, false, false, 0));
    parentBox.pack_start(uploadWallPaperBox({ currentFolder, id }, false, false, 0));
    parentBox.pack_start(saveButton({ currentFolder, id }, false, false, 0));
    
    return parentBox;
}

function uploadIconBox({ currentFolder, id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: "Icon to display on panel",
        xalign: 0,
        hexpand: true,
    });
    const fileChooser = new Gtk.FileChooserButton({
        title: "Image files",
        action: Gtk.FileChooserAction.OPEN,
    });
    const fileFilter = new Gtk.FileFilter();
    fileFilter.add_mime_type("image/png");
    fileFilter.add_mime_type("image/jpeg");
    fileFilter.add_mime_type("image/svg+xml");
    fileFilter.set_name("Image Files");
    fileChooser.add_filter(fileFilter);
    fileChooser.connect("file-set", () => {
        const file = fileChooser.get_file();
        const usermediaFolder = `${currentFolder}/userMedia/icons`
        const userMediaDir = Gio.File.new_for_path(usermediaFolder);
        if (!userMediaDir.query_exists(null)) {
            try {
                userMediaDir.make_directory();
            } catch (error) {
                return;
            }
        }
        const filename = file.get_basename();
        theme = {
            ...theme,
            icon: filename,
        }
        userSavedThemes[id] = theme
        const destinationPath = GLib.build_filenamev([usermediaFolder, filename]);
        const destinationFile = Gio.File.new_for_path(destinationPath);
        try {
            file.copy(destinationFile, Gio.FileCopyFlags.OVERWRITE, null, null);
        } catch (error) {
            return;
        }
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(fileChooser, false, true, 0);
    return container;
}

function chooseApplicationThemeBox({ id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: "Application theme",
        xalign: 0,
        hexpand: true,
    });
    label.get_style_context().add_class("choose-app-theme-label");
    const comboBox = new Gtk.ComboBoxText();
    for (let i = 0; i <= 20; i++) {
        comboBox.append_text(`Theme ${i}`);
    }
    comboBox.set_active(0);
    comboBox.connect("changed", () => {
        const selectedText = comboBox.get_active_text();
        theme = {
            ...theme,
            applicationTheme: selectedText,
        }
        userSavedThemes[id] = theme
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(comboBox, false, true, 0);
    return container;
}

function chooseShellThemeBox({ id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: "Shell theme",
        xalign: 0,
        hexpand: true,
    });
    label.get_style_context().add_class("choose-app-theme-label");
    const comboBox = new Gtk.ComboBoxText();
    for (let i = 0; i <= 20; i++) {
        comboBox.append_text(`Theme ${i}`);
    }
    comboBox.set_active(0);
    comboBox.connect("changed", () => {
        const selectedText = comboBox.get_active_text();
        theme = {
            ...theme,
            shellTheme: selectedText,
        }
        userSavedThemes[id] = theme
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(comboBox, false, true, 0);
    return container;
}

function chooseCursorBox({ id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: "Cursor",
        xalign: 0,
        hexpand: true,
    });
    label.get_style_context().add_class("choose-app-theme-label");
    const comboBox = new Gtk.ComboBoxText();
    for (let i = 0; i <= 20; i++) {
        comboBox.append_text(`Theme ${i}`);
    }
    comboBox.set_active(0);
    comboBox.connect("changed", () => {
        const selectedText = comboBox.get_active_text();
        theme = {
            ...theme,
            cursor: selectedText,
        }
        userSavedThemes[id] = theme
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(comboBox, false, true, 0);
    return container;
}

function addDescriptionBox({ id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: "Description",
        xalign: 0,
        hexpand: true,
    });
    const entry = new Gtk.Entry({
        placeholder_text: "Enter description here...",
    });
    entry.connect("changed", () => {
        const description = entry.get_text();
        theme = {
            ...theme,
            description,
        }
        userSavedThemes[id] = theme
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(entry, false, true, 0);
    return container;
}

function uploadWallPaperBox({ currentFolder, id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: "Wallpaper",
        xalign: 0,
        hexpand: true,
    });
    const fileChooser = new Gtk.FileChooserButton({
        title: "Image files",
        action: Gtk.FileChooserAction.OPEN,
    });
    const fileFilter = new Gtk.FileFilter();
    fileFilter.add_mime_type("image/png");
    fileFilter.add_mime_type("image/jpeg");
    fileFilter.add_mime_type("image/svg+xml");
    fileFilter.set_name("Image Files");
    fileChooser.add_filter(fileFilter);
    fileChooser.connect("file-set", () => {
        const file = fileChooser.get_file();
        const usermediaFolder = `${currentFolder}/userMedia/wallpapers`
        const userMediaDir = Gio.File.new_for_path(usermediaFolder);
        if (!userMediaDir.query_exists(null)) {
            try {
                userMediaDir.make_directory();
            } catch (error) {
                return;
            }
        }
        const filename = file.get_basename();
        theme = {
            ...theme,
            icon: filename,
        }
        userSavedThemes[id] = theme
        const destinationPath = GLib.build_filenamev([usermediaFolder, filename]);
        const destinationFile = Gio.File.new_for_path(destinationPath);
        try {
            file.copy(destinationFile, Gio.FileCopyFlags.OVERWRITE, null, null);
        } catch (error) {
            return;
        }
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(fileChooser, false, true, 0);
    return container;
}

function saveButton({ currentFolder, id }) {
    let theme = userSavedThemes.find(theme => theme.id == id)
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const saveButton = new Gtk.Button({
        label: "Save",
        hexpand: false,
        vexpand: false,
    });
    saveButton.connect("clicked", () => {
        dataModify.setData(theme, currentFolder)
    });
    container.pack_end(saveButton, false, false, 0);
    return container;
}