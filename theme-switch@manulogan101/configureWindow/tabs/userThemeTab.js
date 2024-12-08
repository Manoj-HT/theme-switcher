const { Gtk, GLib, Gio, GdkPixbuf } = imports.gi;
const dataModify = imports.data.dataModifiers

function userThemesTab({ currentFolder, window }) {
    const parentBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });
    const content = new UserThemesTabContent(currentFolder, window)
    parentBox.pack_start(content.themeListBox(), true, true, 0)
    parentBox.pack_start(content.saveButtonBox(), false, true, 0);
    return parentBox;
}

class UserThemesTabContent {
    constructor(currentFolder, window) {
        this.currentFolder = currentFolder;
        this.themeList = dataModify.getUserSavedThemes(currentFolder);
        this.scrollableContainer = null;
        this.themeListContainer = null;
        this.window = window
    }

    saveButtonBox() {
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
            label: "Refresh",
            hexpand: false,
            vexpand: false,
        });
        button.connect("clicked", () => {
            this.update()
        });
        button.get_style_context().add_class("button-global");
        container.get_style_context().add_class("theme-tab-theme-list");
        container.pack_start(label, false, true, 0);
        container.pack_start(button, false, true, 0);
        return container;
    }

    update() {
        this.themeList = dataModify.getUserSavedThemes(this.currentFolder);
        this.addThemes()
    }

    themeListBox() {
        this.scrollableContainer = new Gtk.ScrolledWindow({
            vexpand: true,
            hexpand: true,
        });
        this.themeListContainer = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 10,
        });
        this.scrollableContainer.add(this.themeListContainer);
        this.addThemes();
        this.scrollableContainer.get_style_context().add_class("theme-tab-theme-list")
        return this.scrollableContainer;
    }

    listItems = {
        icon: (iconName) => {
            const iconPath = `${this.currentFolder}/userMedia/icons/${iconName}`;
            let icon = new Gtk.Image();
            if (iconName != "") {
                try {
                    const pixbufIcon = GdkPixbuf.Pixbuf.new_from_file_at_size(iconPath, 64, 64);
                    icon.set_from_pixbuf(pixbufIcon);
                } catch (error) {
                    console.error(`Error loading icon: ${error.message}`);
                }
            }
            return icon
        },
        wallpaper: (wallpaperName) => {
            const wallpaperPath = `${this.currentFolder}/userMedia/wallpapers/${wallpaperName}`;
            let wallpaper = new Gtk.Image();
            if (wallpaperName != "") {
                try {
                    const pixbufWallpaper = GdkPixbuf.Pixbuf.new_from_file_at_size(wallpaperPath, 64, 64)
                    wallpaper.set_from_pixbuf(pixbufWallpaper)
                } catch (error) {
                    console.error(`Error loading icon: ${error.message}`);
                }
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
                console.log(`Deleting theme: ${theme.description}`);
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
        this.themeListContainer.foreach(child => this.themeListContainer.remove(child));
        for (const theme of this.themeList) {
            const container = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 10,
            });
            if (theme.atStart) {
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
        console.log(`Editing theme: ${theme.description}`);
    }
}