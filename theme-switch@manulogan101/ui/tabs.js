const { Gtk } = imports.gi;


var tabs = {
    createThemesTab,
    userThemesTab,
};

function userThemesTab() {
    const box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });
    const label = new Gtk.Label({ label: "User Themes Tab Content" });
    box.pack_start(label, true, true, 0);
    return box;
}

function createThemesTab() {
    const box = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
    });
    const label = new Gtk.Label({ label: "Create Themes Tab Content" });
    box.pack_start(label, true, true, 0);
    return box;
}
