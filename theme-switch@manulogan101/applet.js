// Default  imports
const Applet = imports.ui.applet;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;


class ThemeSwitcher extends Applet.IconApplet {

  // Initializer
  constructor(metadata, orientation, panelHeight, instanceId) {
    super(orientation, panelHeight, instanceId);
    this.currentTheme = 1;
    this.metadata = metadata;
    this.path = metadata.path;
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
    this.setIconAndTooltip(1);
    this.initAppletState();
    if (this._applet_context_menu) {
      this._initContextMenu();
    } else {
      Main.notify(
        "Theme Switcher",
        "Context menu initialization failed. Please check Cinnamon environment."
      );
    }
  }

  // initially check if the current theme is in light or dark mode and update accordingly
  initAppletState() {
    const currentCursorTheme = this.getCurrentTheme(
      "org.cinnamon.desktop.interface",
      "cursor-theme"
    );
    const currentDesktopTheme = this.getCurrentTheme(
      "org.cinnamon.theme",
      "name"
    );
    const currentGtkTheme = this.getCurrentTheme(
      "org.cinnamon.desktop.interface",
      "gtk-theme"
    );
    if (
      currentCursorTheme === this.themes.theme1.cursor &&
      currentDesktopTheme === this.themes.theme1.desktop &&
      currentGtkTheme === this.themes.theme1.applications
    ) {
      this.setIconAndTooltip(1);
    } else if (
      currentCursorTheme === this.themes.theme2.cursor &&
      currentDesktopTheme === this.themes.theme2.desktop &&
      currentGtkTheme === this.themes.theme2.applications
    ) {
      this.setIconAndTooltip(2);
    } else {
      this.setIconAndTooltip(1);
    }
  }

  // click action event recorded here
  on_applet_clicked() {
    this.switchThemes();
  }

  // function to add context menu items aka right click
  _initContextMenu() {
    const configureMenuItem = new Applet.MenuItem(
      "Configure...",
      "preferences-system",
      () => this._onConfigure()
    );
    this._applet_context_menu.addMenuItem(configureMenuItem);
  }

  // function to manage configure context menu
  _onConfigure() {
    // App should open here
    const file = Gio.File.new_for_path(`${this.path}/configureWindow/configureWindow.js`);
    if (!file.query_exists(null)) {
      Main.notify("Error", `Standalone App script not found at: ${this.path}/configureWindow/configureWindow.js`);
      return;
    }
    Util.spawnCommandLine(`gjs ${this.path}/configureWindow/configureWindow.js ${this.path}`);
  }

  // theme switch action
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
    this.setIconAndTooltip(this.currentTheme);
    Main.notify(
      "Theme Switcher",
      `Switched to ${this.currentTheme === 1 ? "Light" : "Dark"} Mode!`,
    );
  }

  // finding current theme
  getCurrentTheme(schema, key) {
    try {
      const gsettings = new Gio.Settings({ schema });
      return gsettings.get_string(key);
    } catch (error) {
      Main.notify("Theme Switcher", `Failed to get ${key}: ${error}`);
      return null;
    }
  }

  // logic for setting theme
  setTheme(schema, key, value) {
    try {
      const gsettings = new Gio.Settings({ schema });
      gsettings.set_string(key, value);
    } catch (error) {
      Main.notify("Theme Switcher", `Failed to set ${key}: ${error}`);
    }
  }

  // param: number
  setIconAndTooltip(themeNumber) {
    this.currentTheme = themeNumber;
    const theme = this.currentTheme === 1 ? this.themes.theme1 : this.themes.theme2;
    this.set_applet_icon_path(`${this.path}/media/${theme.icon}`);
    this.set_applet_tooltip(theme.toolTip);
  }
}

function main(metadata, orientation, panelHeight, instanceId) {
  return new ThemeSwitcher(metadata, orientation, panelHeight, instanceId);
}
