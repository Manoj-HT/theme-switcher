const { Gtk, GLib, Gio, GdkPixbuf } = imports.gi;
const dataModify = imports.data.dataModifiers

function createThemesTab({ currentFolder, window }) {
    const parentBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });

    const content = new CreateThemesContent(currentFolder, window)

    parentBox.pack_start(content.uploadIconBox(), false, false, 0);
    parentBox.pack_start(content.chooseApplicationThemeBox(), false, false, 0);
    parentBox.pack_start(content.chooseShellThemeBox(), false, false, 0);
    parentBox.pack_start(content.chooseCursorBox(), false, false, 0);
    parentBox.pack_start(content.addDescriptionBox(), false, false, 0);
    parentBox.pack_start(content.runAtStartBox(), false, false, 0);
    parentBox.pack_start(content.uploadWallPaperBox(), false, false, 0);
    parentBox.pack_start(content.buttonList(), false, false, 0);

    return parentBox;
}

class CreateThemesContent {
    constructor(currentFolder, window) {
        this.currentFolder = currentFolder;
        this.#setThemeList();
        this.#setNewTheme();
        this.wallpaper = null;
        this.icon = null;
        this.window = window;
        this.themeCreated = false;
    }

    #setThemeList() {
        this.themeList = dataModify.getUserSavedThemes(this.currentFolder)
        this.id = this.themeList.length
    }

    #setNewTheme() {
        this.themeList.unshift({
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
        this.theme = this.themeList[0]
    }

    #getContainer(labelText) {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        });
        const label = new Gtk.Label({
            label: labelText,
            xalign: 0,
            hexpand: true,
        });
        label.get_style_context().add_class("create-tab-option-box-label");
        container.get_style_context().add_class("create-tab-option-box");
        container.pack_start(label, false, true, 0);
        return container;
    }

    settingItems = {
        uploadIconContainer: this.#getContainer("Icon to display on panel"),
        applicationThemeContainer: this.#getContainer("Application theme"),
        shellThemeContainer: this.#getContainer("Shell theme"),
        cursorContainer: this.#getContainer("Cursor"),
        descriptionContainer: this.#getContainer("Description"),
        wallpaperContainer: this.#getContainer("Wallpaper"),
        atStartContainer: this.#getContainer("Apply at Startup"),
        buttonListContainer: this.#getContainer(""),
    }

    userInteractionItems = {
        iconChooser: null,
        applicationThemeComboBox: null,
        shellThemeComboBox: null,
        cursorComboBox: null,
        descriptionEntry: null,
        wallpaperChooser: null,
        atStartSwitch: null,
    }

    uploadIconBox() {
        this.userInteractionItems.iconChooser = new Gtk.FileChooserButton({
            title: "Image files",
            action: Gtk.FileChooserAction.OPEN,
        });
        const fileFilter = new Gtk.FileFilter();
        fileFilter.add_mime_type("image/png");
        fileFilter.add_mime_type("image/jpeg");
        fileFilter.add_mime_type("image/svg+xml");
        fileFilter.set_name("Image Files");
        this.userInteractionItems.iconChooser.add_filter(fileFilter);
        this.userInteractionItems.iconChooser.connect("file-set", () => {
            const selectedFile = this.userInteractionItems.iconChooser.get_file();
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
                    this.userInteractionItems.iconChooser.set_file(null);
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
        this.settingItems.uploadIconContainer.pack_start(this.userInteractionItems.iconChooser, false, true, 0);
        return this.settingItems.uploadIconContainer;
    }

    chooseApplicationThemeBox() {
        this.userInteractionItems.applicationThemeComboBox = new Gtk.ComboBoxText();
        for (let i = 0; i <= 20; i++) {
            this.userInteractionItems.applicationThemeComboBox.append_text(`Theme ${i}`);
        }
        this.userInteractionItems.applicationThemeComboBox.connect("changed", () => {
            const selectedText = this.userInteractionItems.applicationThemeComboBox.get_active_text();
            this.theme["applicationTheme"] = selectedText;
        });
        this.settingItems.applicationThemeContainer.pack_start(this.userInteractionItems.applicationThemeComboBox, false, true, 0);
        return this.settingItems.applicationThemeContainer;
    }

    chooseShellThemeBox() {
        this.userInteractionItems.shellThemeComboBox = new Gtk.ComboBoxText();
        for (let i = 0; i <= 20; i++) {
            this.userInteractionItems.shellThemeComboBox.append_text(`Theme ${i}`);
        }
        this.userInteractionItems.shellThemeComboBox.connect("changed", () => {
            const selectedText = this.userInteractionItems.shellThemeComboBox.get_active_text();
            this.theme["shellTheme"] = selectedText
        });
        this.settingItems.shellThemeContainer.pack_start(this.userInteractionItems.shellThemeComboBox, false, true, 0);
        return this.settingItems.shellThemeContainer;
    }

    chooseCursorBox() {
        this.userInteractionItems.cursorComboBox = new Gtk.ComboBoxText();
        for (let i = 0; i <= 20; i++) {
            this.userInteractionItems.cursorComboBox.append_text(`Theme ${i}`);
        }
        this.userInteractionItems.cursorComboBox.connect("changed", () => {
            const selectedText = this.userInteractionItems.cursorComboBox.get_active_text();
            this.theme["cursor"] = selectedText
        });
        this.settingItems.cursorContainer.pack_start(this.userInteractionItems.cursorComboBox, false, true, 0);
        return this.settingItems.cursorContainer;
    }

    addDescriptionBox() {
        this.userInteractionItems.descriptionEntry = new Gtk.Entry({
            placeholder_text: "Enter description here...",
        });
        this.userInteractionItems.descriptionEntry.connect("changed", () => {
            const description = this.userInteractionItems.descriptionEntry.get_text();
            this.theme["description"] = description
        });
        this.settingItems.descriptionContainer.pack_start(this.userInteractionItems.descriptionEntry, false, true, 0);
        return this.settingItems.descriptionContainer;
    }

    uploadWallPaperBox() {
        this.userInteractionItems.wallpaperChooser = new Gtk.FileChooserButton({
            title: "Image files",
            action: Gtk.FileChooserAction.OPEN,
        });
        const fileFilter = new Gtk.FileFilter();
        fileFilter.add_mime_type("image/png");
        fileFilter.add_mime_type("image/jpeg");
        fileFilter.add_mime_type("image/svg+xml");
        fileFilter.set_name("Image Files");
        this.userInteractionItems.wallpaperChooser.add_filter(fileFilter);
        this.userInteractionItems.wallpaperChooser.connect("file-set", () => {
            this.wallpaper = this.userInteractionItems.wallpaperChooser.get_file();
            const filename = this.wallpaper.get_basename();
            this.theme["wallpaper"] = filename
        });
        this.settingItems.wallpaperContainer.pack_start(this.userInteractionItems.wallpaperChooser, false, true, 0);
        return this.settingItems.wallpaperContainer;
    }

    runAtStartBox() {
        this.userInteractionItems.atStartSwitch = new Gtk.Switch({
            active: false,
        });
        this.userInteractionItems.atStartSwitch.connect("state-set", (button, state) => {
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
        this.settingItems.atStartContainer.pack_start(this.userInteractionItems.atStartSwitch, false, true, 0);
        return this.settingItems.atStartContainer;
    }

    #uploadMedia() {
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

    resetSettings() {
        this.#setThemeList();
        this.#setNewTheme();
        this.icon = null;
        this.wallpaper = null;
        this.themeCreated = false;
        this.userInteractionItems.iconChooser.unselect_all();
        this.userInteractionItems.applicationThemeComboBox.set_active(-1);
        this.userInteractionItems.shellThemeComboBox.set_active(-1);
        this.userInteractionItems.cursorComboBox.set_active(-1);
        this.userInteractionItems.descriptionEntry.set_text("");
        this.userInteractionItems.wallpaperChooser.unselect_all();
        this.userInteractionItems.atStartSwitch.set_active(false);
    }

    resetButton() {
        const resetButton = new Gtk.Button({
            label: "Reset",
            hexpand: false,
            vexpand: false,
        });
        resetButton.connect("clicked", () => {
            this.resetSettings();
        });
        resetButton.get_style_context().add_class("button-global");
        return resetButton;
    }

    saveButton() {
        const saveButton = new Gtk.Button({
            label: "Save",
            hexpand: false,
            vexpand: false,
        });
        saveButton.connect("clicked", () => {
            const dialog = new Gtk.MessageDialog({
                transient_for: this.window,
                modal: true,
                buttons: Gtk.ButtonsType.OK,
            });
            if (!this.themeCreated) {
                this.#uploadMedia()
                if (this.theme.atStart) {
                    this.themeList = this.themeList.map((theme) => {
                        if (theme.id == this.id) {
                            return this.theme
                        } else {
                            return {
                                ...theme,
                                atStart: false
                            }
                        }
                    })
                }
                dataModify.setData(this.themeList, this.currentFolder);
                dialog.message_type = Gtk.MessageType.INFO;
                dialog.text = "Created";
                dialog.secondary_text = "Theme has been created. Please refresh."
                this.themeCreated = true;
            } else {
                dialog.message_type = Gtk.MessageType.WARNING;
                dialog.text = "Already created";
                dialog.secondary_text = "Theme has been already been created. Please reopen to create new theme."
            }
            dialog.connect("response", () => {
                this.resetSettings();
                dialog.destroy();
            });
            dialog.show();
            this.themeCreated = true;
        });
        saveButton.get_style_context().add_class("button-global");
        return saveButton;
    }

    buttonList() {
        this.settingItems.buttonListContainer.pack_end(this.saveButton(), false, false, 0);
        this.settingItems.buttonListContainer.pack_end(this.resetButton(), false, false, 0);
        return this.settingItems.buttonListContainer;
    }

}