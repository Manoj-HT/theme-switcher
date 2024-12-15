const { Gtk, GLib, Gio, GdkPixbuf } = imports.gi;
const dataModify = imports.data.dataModifiers
const { moduleExports } = imports.configureWindow.tabs.createThemesTab
function userThemesTab({ currentFolder, window }) {
    const parentBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
    });

    const content = new UserThemesTabContent(currentFolder, window)

    // parentBox.pack_start(content.refreshButtonBox(), false, true, 0);
    // parentBox.pack_start(content.themeListBox(), true, true, 0)
    parentBox.pack_start(content.mainView(), true, true, 0);

    return parentBox;
}

class UserThemesTabContent {
    constructor(currentFolder, window) {
        this.currentFolder = currentFolder;
        this.themeList = dataModify.getUserSavedThemes(currentFolder);
        this.window = window;
        this.initContainers();
        this.update();
        this.themeListView();
    }

    initContainers() {
        this.mainViewBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 10,
        });
        this.scrollableContainer = new Gtk.ScrolledWindow({
            vexpand: true,
            hexpand: true,
        });
        this.themeListContainer = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 10,
        });
        this.scrollableContainer.add(this.themeListContainer);
        this.scrollableContainer.get_style_context().add_class("theme-tab-theme-list")
    }

    mainView() {
        return this.mainViewBox;
    }

    refreshButtonBox() {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        })
        const label = new Gtk.Label({
            label: "",
            xalign: 0,
            hexpand: true,
        });
        const button = new Gtk.Button({
            hexpand: false,
            vexpand: false,
        });
        const icon = new Gtk.Image({
            icon_name: "view-refresh-symbolic",
            icon_size: Gtk.IconSize.BUTTON,
        });
        button.set_image(icon);
        button.connect("clicked", () => {
            this.update()
        });
        button.get_style_context().add_class("button-global");
        container.get_style_context().add_class("theme-tab-refresh-button");
        container.pack_start(label, false, true, 0);
        container.pack_start(button, false, true, 0);
        return container;
    }

    update() {
        this.themeList = dataModify.getUserSavedThemes(this.currentFolder);
        this.addThemes()
    }

    themeListView() {
        this.mainViewBox.foreach((child) => {
            this.mainViewBox.remove(child)
        })
        this.mainViewBox.pack_start(this.refreshButtonBox(), false, true, 0)
        this.mainViewBox.pack_start(this.scrollableContainer, false, true, 0)
        this.mainViewBox.show_all()
    }

    listItems = {
        icon: (iconName) => {
            let iconPath = ''
            if (iconName !== '') {
                iconPath = `${this.currentFolder}/userMedia/icons/${iconName}`;
            } else {
                iconPath = `${this.currentFolder}/media/no-image.svg`;
            }
            let icon = new Gtk.Image();
            try {
                const pixbufIcon = GdkPixbuf.Pixbuf.new_from_file_at_size(iconPath, 64, 64);
                icon.set_from_pixbuf(pixbufIcon);
            } catch (error) {
                console.error(`Error loading icon: ${error.message}`);
            }
            return icon
        },
        wallpaper: (wallpaperName) => {
            let wallpaperPath = ''
            if (wallpaperName !== '') {
                wallpaperPath = `${this.currentFolder}/userMedia/wallpapers/${wallpaperName}`;
            } else {
                wallpaperPath = `${this.currentFolder}/media/no-image.svg`;
            }
            let wallpaper = new Gtk.Image();
            try {
                const pixbufWallpaper = GdkPixbuf.Pixbuf.new_from_file_at_size(wallpaperPath, 64, 64)
                wallpaper.set_from_pixbuf(pixbufWallpaper)
            } catch (error) {
                console.error(`Error loading icon: ${error.message}`);
            }
            return wallpaper
        },
        themeName: (description) => {
            const label = new Gtk.Label({
                label: description,
                xalign: 0,
                hexpand: true,
            });
            return label
        },
        editButton: (theme) => {
            const button = new Gtk.Button({
                label: "",
            });
            const icon = new Gtk.Image({
                icon_name: "document-edit-symbolic",
                icon_size: Gtk.IconSize.BUTTON,
            });
            button.set_image(icon);
            button.set_always_show_image(true);
            button.get_style_context().add_class("button-global");
            button.connect("clicked", () => {
                this.editSavedThemes(theme);
            });
            return button;
        },
        deleteButton: (theme) => {
            const button = new Gtk.Button({
                label: "",
            });
            const icon = new Gtk.Image({
                icon_name: "user-trash-symbolic",
                icon_size: Gtk.IconSize.BUTTON,
            });
            button.set_image(icon);
            button.set_always_show_image(true);
            button.get_style_context().add_class("button-global");
            button.connect("clicked", () => {
                const dialog = new Gtk.MessageDialog({
                    transient_for: this.window,
                    modal: true,
                    buttons: Gtk.ButtonsType.NONE,
                    message_type: Gtk.MessageType.QUESTION,
                    text: "Delete theme",
                    secondary_text: `Are you sure you want to delete theme ${theme.description}`,
                });
                dialog.add_button("Cancel", Gtk.ResponseType.CANCEL);
                dialog.add_button("Delete", Gtk.ResponseType.OK);
                dialog.connect("response", (dialog, response) => {
                    if (response === Gtk.ResponseType.OK) {
                        this.deleteTheme(theme)
                    } else if (response === Gtk.ResponseType.CANCEL) {
                    }
                    dialog.destroy();
                });
                dialog.show();

            });
            return button;
        },
        applyButton: (theme) => {
            const button = new Gtk.Button({
                label: "Apply",
            });
            button.get_style_context().add_class("button-global");
            button.connect("clicked", () => {
                console.log(`Applying theme: ${theme.description}`);
            });
            return button;
        }
    }

    addThemes() {
        this.themeListContainer.foreach(child => child.destroy());
        for (const theme of this.themeList) {
            const container = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 10,
            });
            if (theme.selected) {
                container.get_style_context().add_class("theme-tab-theme-option-selected");
            } else if (theme.atStart) {
                container.get_style_context().add_class("theme-tab-theme-option-start");
            } else {
                container.get_style_context().add_class("theme-tab-theme-option");
            }
            container.pack_start(this.listItems.icon(theme.icon), false, false, 0);
            container.pack_start(this.listItems.wallpaper(theme.wallpaper), false, false, 0);
            container.pack_start(this.listItems.themeName(theme.description), false, false, 0);
            container.pack_end(this.listItems.applyButton(theme), false, false, 0);
            container.pack_end(this.listItems.editButton(theme), false, false, 0);
            container.pack_end(this.listItems.deleteButton(theme), false, false, 0);
            this.themeListContainer.pack_start(container, false, false, 0);
        }
        this.themeListContainer.show_all();
    }

    editSavedThemes(theme) {
        this.mainViewBox.foreach((child) => {
            this.mainViewBox.remove(child)
        })
        const editContent = new moduleExports.CreateThemesContent(this.currentFolder, this.window, theme);
        this.editView(editContent)
    }

    editButtonsBox(contentClass) {
        const container = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
        })
        const label = new Gtk.Label({
            label: "",
            xalign: 0,
            hexpand: true,
        });
        const updateButton = new Gtk.Button({
            hexpand: false,
            vexpand: false,
            label: "Update"
        });
        const cancelButton = new Gtk.Button({
            hexpand: false,
            vexpand: false,
            label: "Cancel"
        });
        updateButton.connect("clicked", () => {
            const updatedTheme = contentClass.getThemeObject();
            const index = this.themeList.findIndex(th => th.id == updatedTheme.id);
            const dialog = new Gtk.MessageDialog({
                transient_for: this.window,
                modal: true,
                buttons: Gtk.ButtonsType.OK,
                text: "Updated",
                secondary_text: `${updatedTheme.description} has been updated`
            });
            dialog.connect("response", () => {
                if(updatedTheme.atStart){
                    this.themeList = this.themeList.map((th) => ({...th, atStart: false}))
                }
                this.themeList[index] = updatedTheme;
                dataModify.setData(this.themeList, this.currentFolder);
                this.update();
                this.themeListView();
                dialog.destroy();
            });
            dialog.show();
        });
        cancelButton.connect("clicked", () => {
            this.update();
            this.themeListView();
        });
        cancelButton.get_style_context().add_class("button-global");
        updateButton.get_style_context().add_class("button-global");
        container.get_style_context().add_class("theme-tab-refresh-button");
        container.pack_start(label, false, true, 0);
        container.pack_start(cancelButton, false, true, 0);
        container.pack_start(updateButton, false, true, 0);
        return container;
    }

    editView(content) {
        this.mainViewBox.pack_start(content.uploadIconBox(), false, false, 0);
        this.mainViewBox.pack_start(content.chooseApplicationThemeBox(), false, false, 0);
        this.mainViewBox.pack_start(content.chooseShellThemeBox(), false, false, 0);
        this.mainViewBox.pack_start(content.chooseCursorBox(), false, false, 0);
        this.mainViewBox.pack_start(content.addDescriptionBox(), false, false, 0);
        this.mainViewBox.pack_start(content.runAtStartBox(), false, false, 0);
        this.mainViewBox.pack_start(content.uploadWallPaperBox(), false, false, 0);
        this.mainViewBox.pack_start(this.editButtonsBox(content), false, false, 0);
        this.mainViewBox.show_all()
    }

    deleteTheme(theme) {
        const index = this.themeList.findIndex((th) => th.id == theme.id)
        this.themeList.splice(index, 1)
        dataModify.setData(this.themeList, this.currentFolder);
        this.update()
    }
}