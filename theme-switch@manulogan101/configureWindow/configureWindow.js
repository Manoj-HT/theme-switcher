// import addings should be before utilising
const appletFolder = ARGV[0]
imports.searchPath.push(appletFolder)

//imports
const { Gio, Gtk, GLib, Gdk } = imports.gi;
const { userThemesTab } = imports.configureWindow.tabs.userThemeTab
const { createThemesTab } = imports.configureWindow.tabs.createThemesTab

class ConfigureWindow {
    constructor() {
        this.app = new Gtk.Application({
            application_id: "org.manulogan101.ConfigureWindow",
        });
        this.app.connect("activate", this.onActivate.bind(this));
        this.window = null;
        this.addCssStyle();
    }

    addCssStyle() {
        const cssProvider = new Gtk.CssProvider();
        const cssFile = `${appletFolder}/configureWindow/configureWindow.css`;
        try {
            cssProvider.load_from_path(cssFile);
            this.app.connect("startup", () => {
                const screen = Gdk.Screen.get_default();
                if (screen) {
                    Gtk.StyleContext.add_provider_for_screen(
                        screen,
                        cssProvider,
                        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
                    );
                } else {
                    logError(new Error("Gdk.Screen is not available."));
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    run(argv) {
        return this.app.run(argv);
    }

    onActivate() {
        this.show()
    }

    show() {
        if (!this.window) {
            this.createWindow();
        }
        this.window.present();
    }

    isMaximized() {
        const state = this.window.get_window().get_state();
        return (state & Gdk.WindowState.MAXIMIZED) !== 0;
    }

    close() {
        this.window.close();
        this.window = null;
    }

    createWindow() {

        // window creation
        this.window = new Gtk.ApplicationWindow({
            application: this.app,
            title: "Theme Switcher Configuration",
            default_width: 900,
            default_height: 300,
        })

        // tabs
        const notebook = new Gtk.Notebook();
        const params = {
            currentFolder: appletFolder,
            window: this.window,
        }
        notebook.append_page(userThemesTab(params), new Gtk.Label({ label: "Themes" }));
        notebook.append_page(createThemesTab(params), new Gtk.Label({ label: "Create" }));
        notebook.connect("switch-page", (notebook, page, pageNumber) => {
            const currentTab = notebook.get_nth_page(pageNumber);
            currentTab.foreach((widget) => widget.destroy());
            if (pageNumber === 0) {
                const newContent = userThemesTab(params)
                currentTab.add(newContent);
            } else if (pageNumber === 1) {
                const newContent = createThemesTab(params)
                currentTab.add(newContent);
            }
            currentTab.show_all()
        });

        // window configuration
        this.window.set_decorated(true);
        this.window.get_style_context().add_class("main-window");
        this.window.connect("delete-event", (widget, event) => {
            this.close();
            return false;
        })
        let mediaPath = appletFolder + "/media"
        const iconPath = GLib.build_filenamev([mediaPath, "configure-theme.svg"]);
        this.window.set_icon_from_file(iconPath);
        this.window.add(notebook);

        // show
        this.window.show_all();
    }
}

const app = new ConfigureWindow();
app.run(ARGV)