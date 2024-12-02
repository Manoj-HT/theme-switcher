const { Gtk, GLib, Gio, GdkPixbuf } = imports.gi;
const dataModify = imports.data.dataModifiers

function createThemesTab({ currentFolder, window }) {
    const parentBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });

    const userSavedThemes = dataModify.getUserSavedThemes(currentFolder, window)
    const content = new CreateThemesContent(currentFolder, userSavedThemes, window)

    parentBox.pack_start(content.uploadIconBox(), false, false, 0);
    parentBox.pack_start(content.chooseApplicationThemeBox(), false, false, 0);
    parentBox.pack_start(content.chooseShellThemeBox(), false, false, 0);
    parentBox.pack_start(content.chooseCursorBox(), false, false, 0);
    parentBox.pack_start(content.addDescriptionBox(), false, false, 0);
    parentBox.pack_start(content.runAtStartBox(), false, false, 0);
    parentBox.pack_start(content.uploadWallPaperBox(), false, false, 0);
    parentBox.pack_start(content.saveButton(), false, false, 0);

    return parentBox;
}

class CreateThemesContent {
    constructor(currentFolder, userSavedThemes, window) {
        this.currentFolder = currentFolder;
        this.themeList = userSavedThemes;
        this.id = userSavedThemes.length;
        this.themeList.push({
            id: this.id,
            selected: false,
            atStart: false,
            icon: "",
            applicationTheme: "",
            shellTheme: "",
            cursor: "",
            description: "",
            wallpaper: "",
        })
        this.theme = this.themeList[this.id]
        this.wallpaper = null;
        this.icon = null;
        this.window = window
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
            const selectedFile = fileChooser.get_file();
            const filePath = selectedFile.get_path();
            try {
                const pixbuf = GdkPixbuf.Pixbuf.new_from_file(filePath);
                const width = pixbuf.get_width();
                const height = pixbuf.get_height();
                if (width > 128 || height > 128) {
                    const dialog = new Gtk.MessageDialog({
                        transient_for: this.window,
                        modal: true,
                        buttons: Gtk.ButtonsType.OK,
                        message_type: Gtk.MessageType.WARNING,
                        text: "Invalid Image Size",
                        secondary_text: "Please upload an image with dimensions lesser than 128x128 pixels.",
                    });
                    dialog.connect("response", () => {
                        dialog.destroy();
                    });
                    dialog.show();
                    fileChooser.set_file(null);
                    this.icon = null;
                    this.theme["icon"] = "";
                } else {
                    this.icon = selectedFile;
                    const filename = selectedFile.get_basename();
                    this.theme["icon"] = filename;
                }
            }
            catch (error) {
                console.error("Error loading image:", error.message);
            }

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

    runAtStartBox() {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        });
        const label = new Gtk.Label({
            label: "Apply at Startup",
            xalign: 0,
            hexpand: true,
        });
        const toggleButton = new Gtk.Switch({
            active: false,
        });
        toggleButton.connect("state-set", (button, state) => {
            if (state) {
                const dialog = new Gtk.MessageDialog({
                    transient_for: this.window,
                    modal: true,
                    buttons: Gtk.ButtonsType.OK,
                    message_type: Gtk.MessageType.WARNING,
                    text: "Apply at startup",
                    secondary_text: "The previously set theme will no longer apply at system startup.",
                });
                dialog.connect("response", () => {
                    dialog.destroy();
                });
                dialog.show();
            }
            this.theme["atStart"] = state;
        });
        container.pack_start(label, false, true, 0);
        container.pack_start(toggleButton, false, true, 0);
        container.get_style_context().add_class("create-tab-option-box");
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

        if (this.wallpaper == null) {
            return
        } else {
            const wallpaperpath = GLib.build_filenamev([wallpaperFolder, this.wallpaper.get_basename()]);
            const wallpaperfile = Gio.File.new_for_path(wallpaperpath);
            try {
                this.wallpaper.copy(wallpaperfile, Gio.FileCopyFlags.OVERWRITE, null, null);
            } catch (error) {
                return;
            }
        }
        if (this.icon == null) {
            return
        } else {
            const iconPath = GLib.build_filenamev([iconFolder, this.icon.get_basename()]);
            const iconFile = Gio.File.new_for_path(iconPath);
            try {
                this.icon.copy(iconFile, Gio.FileCopyFlags.OVERWRITE, null, null);
            } catch (error) {
                return;
            }
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
            const dialog = new Gtk.MessageDialog({
                transient_for: this.window,
                modal: true,
                buttons: Gtk.ButtonsType.OK,
                message_type: Gtk.MessageType.INFO,
                text: "Created",
                secondary_text: "Theme has been created. Please refresh.",
            });
            dialog.connect("response", () => {
                dialog.destroy();
            });
            dialog.show();
        });
        saveButton.get_style_context().add_class("button-global");

        container.get_style_context().add_class("button-global-box");
        container.pack_end(saveButton, false, false, 0);
        return container;
    }

}