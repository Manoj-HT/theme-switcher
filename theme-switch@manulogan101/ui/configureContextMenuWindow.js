const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
// const Gio = imports.gi.Gio;
// const Gdk = imports.gi.Gdk;

const styles = {
  window: `
  background-color: yellow;
  padding: 20px;
  `,
  closeButton: `
  background-color: red;
  color: white;
  `,
  title: `
  color: green;
  `
}

class ConfigureContextMenuWindow {
  
  //Initializer
  constructor(metadata) {
    this.metadata = metadata
    this.path = metadata.path
    this.window = new St.Bin({
      style_class: "config-window",
      reactive: true,
      visible: false,
      x_align: Clutter.ActorAlign.CENTER,
      y_align: Clutter.ActorAlign.CENTER,
    });
    this.window.set_style(styles.window);
    this.layout = new St.BoxLayout({
      vertical: true,
      style_class: "config-window-content",
    });
    const titleLabel = new St.Label({ text: "Theme Configuration" });
    titleLabel.set_style(styles.title)
    this.layout.add_child(titleLabel);
    const closeButton = new St.Button({
      label: "Close",
      style_class: "config-window-button",
    });
    closeButton.set_style(styles.closeButton);
    closeButton.connect("clicked", () => this.hide());
    this.layout.add_child(closeButton);
    this.window.set_child(this.layout);
    Main.uiGroup.add_child(this.window);

    // this._loadCSS();
  }

  // _loadCSS() {
  //   const file = Gio.File.new_for_path(`${this.path}/ui/stylesheet.css`);
  //   const content = file.load_contents(null)[1].toString();
  //   const cssProvider = new Gtk.CssProvider();
  //   cssProvider.load_from_data(content, content.length, null);
  //   Gtk.StyleContext.add_provider_for_screen(
  //       Gdk.Screen.get_default(),
  //       cssProvider,
  //       Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
  //   );
// }


  // Show the window
  show() {
    this.window.visible = true;
  }

  // Hide the window
  hide() {
    this.window.visible = false;
  }
}

// Export the class
module.exports = ConfigureContextMenuWindow;
