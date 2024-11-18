const Applet = imports.ui.applet;
const Main = imports.ui.main;
const Settings = imports.ui.settings;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
class MyApplet extends Applet.IconApplet {
  constructor(metadata, orientation, panelHeight, instanceId) {
    super(orientation, panelHeight, instanceId);
    this.currentTheme = 1;
    this.metadata = metadata.path;
    this.themes = {
      theme1: {
        cursor: "Bibata-Original-Ice",
        desktop: "Adapta",
        applications: "Adapta",
        icon: "light.svg",
        toolTip: "Switch to dark mode",
      },
      theme2: {
        cursor: "Bibata-Original-Classic",
        desktop: "Adapta-Nokto",
        applications: "Adapta-Nokto",
        icon: "dark.svg",
        toolTip: "Switch to light mode",
      },
    };
    this.set_applet_icon_symbolic_name("preferences-desktop-theme");
    this.set_applet_icon_path(`${metadata.path}/${this.themes.theme1.icon}`);
    this.set_applet_tooltip("Click to switch themes");
    // Ensure the context menu exists before modifying
    if (this._applet_context_menu) {
      this._initContextMenu();
    } else {
      Main.notify(
        "Theme Switcher",
        "Context menu initialization failed. Please check Cinnamon environment."
      );
    }
  }

  on_applet_clicked() {
    this.switchThemes();
  }

  _initContextMenu() {
    const configureMenuItem = new Applet.MenuItem(
      "Configure...",
      "preferences-system",
      () => this._onConfigure()
    );
    this._applet_context_menu.addMenuItem(configureMenuItem);
  }

  _initContextMenu() {
    const configureMenuItem = new Applet.MenuItem(
      "Configure...",
      "preferences-system",
      () => this._onConfigure()
    );
    this._applet_context_menu.addMenuItem(configureMenuItem);
  }

  _onConfigure() {
    Main.notify("Theme Switcher", "Configuration option selected!");
    Util.spawnCommandLine("xdg-open https://gjs.guide");
  }

  switchThemes() {
    this.currentTheme = this.currentTheme === 1 ? 2 : 1;
    const theme =
      this.currentTheme === 1 ? this.themes.theme1 : this.themes.theme2;
    this.setTheme(
      "org.cinnamon.desktop.interface",
      "cursor-theme",
      theme.cursor,
    );
    this.setTheme("org.cinnamon.theme", "name", theme.desktop);
    this.setTheme(
      "org.cinnamon.desktop.interface",
      "gtk-theme",
      theme.applications,
    );
    this.set_applet_tooltip(theme.toolTip);
    this.set_applet_icon_path(`${this.metadata}/${theme.icon}`);
    Main.notify(
      "Theme Switcher",
      `Switched to ${this.currentTheme === 1 ? "Light" : "Dark"} Mode!`,
    );
  }

  setTheme(schema, key, value) {
    try {
      const gsettings = new Gio.Settings({ schema });
      gsettings.set_string(key, value);
    } catch (error) {
      Main.notify("Theme Switcher", `Failed to set ${key}: ${error}`);
    }
  }
}

function main(metadata, orientation, panelHeight, instanceId) {
  return new MyApplet(metadata, orientation, panelHeight, instanceId);
}
