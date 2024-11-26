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
    parentBox.pack_start(uploadIconBox({ currentFolder }), false, false, 0);
    parentBox.pack_start(chooseApplicationThemeBox({ currentFolder }), false, false, 0);
    return parentBox;
}

function uploadIconBox({ currentFolder }) {
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 10,
    });
    const label = new Gtk.Label({
        label: GLib.get_current_dir(),
        xalign: 0,
        hexpand: true,
    });
    const fileChooser = new Gtk.FileChooserButton({
        title: "Select icon File",
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

function chooseApplicationThemeBox({ currentFolder }) {
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
        dataModify.setData({
            theme: "New theme",
            themeOption: selectedText,
            id: 2
        }, currentFolder);
    });
    container.get_style_context().add_class("option-box");
    container.pack_start(label, false, true, 0);
    container.pack_start(comboBox, false, true, 0);
    return container;
}