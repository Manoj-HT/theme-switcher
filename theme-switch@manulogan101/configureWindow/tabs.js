const { Gtk, GLib, Gio } = imports.gi;
const dataModify = imports.data.dataModifiers

var tabs = {
    createThemesTab,
    userThemesTab,
};

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

    const userSavedThemes = dataModify.getUserSavedThemes(currentFolder)
    const content = new CreateThemesContent(currentFolder, userSavedThemes)

    parentBox.pack_start(content.uploadIconBox(), false, false, 0);
    parentBox.pack_start(content.chooseApplicationThemeBox(), false, false, 0);
    parentBox.pack_start(content.chooseShellThemeBox(), false, false, 0);
    parentBox.pack_start(content.chooseCursorBox(), false, false, 0);
    parentBox.pack_start(content.addDescriptionBox(), false, false, 0);
    parentBox.pack_start(content.uploadWallPaperBox(), false, false, 0);
    parentBox.pack_start(content.saveButton(), false, false, 0);

    return parentBox;
}

class CreateThemesContent {
    constructor(currentFolder, userSavedThemes) {
        this.currentFolder = currentFolder;
        this.themeList = userSavedThemes;
        this.id = userSavedThemes.length;
        this.themeList.push({ id: this.id })
        this.theme = this.themeList[this.id]
        this.wallpaper = null;
        this.icon = null;
    }

    uploadIconBox() {
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
            this.icon = fileChooser.get_file();
            const filename = this.icon.get_basename();
            this.theme["icon"] = filename;
            
            
        });
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        container.pack_start(fileChooser, false, true, 0);
        return container;
    }

    chooseApplicationThemeBox() {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        });
        const label = new Gtk.Label({
            label: "Application theme",
            xalign: 0,
            hexpand: true,
        });
        label.get_style_context().add_class("create-tab-option-box-label");
        const comboBox = new Gtk.ComboBoxText();
        for (let i = 0; i <= 20; i++) {
            comboBox.append_text(`Theme ${i}`);
        }
        comboBox.set_active(0);
        comboBox.connect("changed", () => {
            const selectedText = comboBox.get_active_text();
            this.theme["applicationTheme"] = selectedText;
        });
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        container.pack_start(comboBox, false, true, 0);
        return container;
    }

    chooseShellThemeBox() {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        });
        const label = new Gtk.Label({
            label: "Shell theme",
            xalign: 0,
            hexpand: true,
        });
        label.get_style_context().add_class("create-tab-option-box-label");
        const comboBox = new Gtk.ComboBoxText();
        for (let i = 0; i <= 20; i++) {
            comboBox.append_text(`Theme ${i}`);
        }
        comboBox.set_active(0);
        comboBox.connect("changed", () => {
            const selectedText = comboBox.get_active_text();
            this.theme["shellTheme"] = selectedText
        });
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        container.pack_start(comboBox, false, true, 0);
        return container;
    }

    chooseCursorBox() {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        });
        const label = new Gtk.Label({
            label: "Cursor",
            xalign: 0,
            hexpand: true,
        });
        label.get_style_context().add_class("create-tab-option-box-label");
        const comboBox = new Gtk.ComboBoxText();
        for (let i = 0; i <= 20; i++) {
            comboBox.append_text(`Theme ${i}`);
        }
        comboBox.set_active(0);
        comboBox.connect("changed", () => {
            const selectedText = comboBox.get_active_text();
            this.theme["cursor"] = selectedText
        });
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        container.pack_start(comboBox, false, true, 0);
        return container;
    }

    addDescriptionBox() {
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
            this.theme["description"] = description
        });
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        container.pack_start(entry, false, true, 0);
        return container;
    }

    uploadWallPaperBox() {
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
            this.wallpaper = fileChooser.get_file();
            const filename = this.wallpaper.get_basename();
            this.theme["wallpaper"] = filename
        });
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        container.pack_start(fileChooser, false, true, 0);
        return container;
    }

    uploadMedia() {
        const wallpaperFolder = `${this.currentFolder}/userMedia/wallpapers`
        const iconFolder = `${this.currentFolder}/userMedia/icons`

        const wallpaperDirectory = Gio.File.new_for_path(wallpaperFolder);
        const iconDirectory = Gio.File.new_for_path(iconFolder);

        if (!wallpaperDirectory.query_exists(null)) {
            try {
                wallpaperDirectory.make_directory();
            } catch (error) {
                return;
            }
        }
        if (!iconDirectory.query_exists(null)) {
            try {
                iconDirectory.make_directory();
            } catch (error) {
                return;
            }
        }

        const wallpaperpath = GLib.build_filenamev([wallpaperFolder, this.wallpaper.get_basename()]);
        const iconPath = GLib.build_filenamev([iconFolder, this.icon.get_basename()]);

        const wallpaperfile = Gio.File.new_for_path(wallpaperpath);
        const iconFile = Gio.File.new_for_path(iconPath);

        try {
            this.wallpaper.copy(wallpaperfile, Gio.FileCopyFlags.OVERWRITE, null, null);
        } catch (error) {
            return;
        }
        try {
            this.icon.copy(iconFile, Gio.FileCopyFlags.OVERWRITE, null, null);
        } catch (error) {
            return;
        }
    }

    saveButton() {
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
            this.uploadMedia()
            dataModify.setData(this.theme, this.currentFolder)
        });
        saveButton.get_style_context().add_class("create-tab-save-button");

        container.get_style_context().add_class("create-tab-save-button-box");
        container.pack_end(saveButton, false, false, 0);
        return container;
    }

}
