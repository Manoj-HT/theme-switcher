const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;

class ConfigureContextMenuWindow {
  
  //Initializer
  constructor() {
    // Create the window
    this.window = new St.Bin({
      style_class: "config-window",
      reactive: true,
      visible: false, // Initially hidden
      x_align: Clutter.ActorAlign.CENTER,
      y_align: Clutter.ActorAlign.CENTER,
    });

    // Create a layout for the content
    const layout = new St.BoxLayout({
      vertical: true,
      style_class: "config-window-content",
    });

    // Add a title
    const titleLabel = new St.Label({ text: "Theme Configuration" });
    layout.add_child(titleLabel);

    // Add a close button
    const closeButton = new St.Button({
      label: "Close",
      style_class: "config-window-button",
    });
    closeButton.connect("clicked", () => this.hide());
    layout.add_child(closeButton);

    // Attach the layout to the window
    this.window.set_child(layout);

    // Add the window to the Cinnamon UI hierarchy
    Main.uiGroup.add_child(this.window);
  }

  // Show the window
  show() {
    this.window.visible = true;
  }

  // Hide the window
  hide() {
    this.window.visible = false;
  }
}

// Export the class so it can be used in other files
module.exports = ConfigureContextMenuWindow;
