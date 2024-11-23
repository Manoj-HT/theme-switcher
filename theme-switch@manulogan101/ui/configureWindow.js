const {Gio, Gtk, GLib, Gdk} = imports.gi;

class ConfigureWindow {
    constructor() {
        this.app = new Gtk.Application({
            application_id: "org.manulogan101.ConfigureWindow",
        });
        this.app.connect("activate", this.onActivate.bind(this));
        this.window = null;
        this.addCssStyle();
    }

    addCssStyle(){
        const cssProvider = new Gtk.CssProvider();
        const cssFile = GLib.build_filenamev([GLib.get_current_dir(), "configureWindow.css"]);
        try {
            cssProvider.load_from_path(cssFile);
            this.app.connect("startup", () => {
                const screen = Gdk.Screen.get_default();
                if (screen) {
                    Gtk.StyleContext.add_provider_for_screen(
                        screen,
                        cssProvider,
                        Gtk.STYLE_PROVIDER_PRIORITY_USER
                    );
                } else {
                    logError(new Error("Gdk.Screen is not available."));
                }
            });
        } catch (error) {
            // logError(error);
            console.log(error)
        }
    }

    run(argv){
        return this.app.run(argv);
    }

    onActivate(){
        this.show()
    }

    show(){
        if(!this.window){
            this.createWindow();
        }
        this.window.present();
    }

    isMaximized() {
        const state = this.window.get_window().get_state();
        return (state & Gdk.WindowState.MAXIMIZED) !== 0;
    }

    close(){
        this.window.close();
        this.window = null;
    }

    createWindow() {

        // window creation
        this.window = new Gtk.ApplicationWindow({
            application: this.app,
            title: "Theme Switcher Configuration",
            default_width: 400,
            default_height: 300,
        })
        this.window.set_decorated(true);
        this.window.get_style_context().add_class("main-window");
        this.window.connect("delete-event", (widget, event) => {
            this.close();
            return false;
        })

        // header bar
        const headerBar = new Gtk.HeaderBar({
            title: "Standalone App",
            show_close_button: false,
        });
        headerBar.set_hexpand(true);
        headerBar.set_valign(Gtk.Align.END);
        headerBar.get_style_context().add_class("header-bar");
        const minimizeButton = new Gtk.Button({ label: "m" });
        minimizeButton.connect("clicked", () => {
            this.window.iconify();
        });

        // header bar buttons
        const maximizeButton = new Gtk.Button({ label: "M" });
        maximizeButton.connect("clicked", () => {
            if (this.isMaximized()) {
                this.window.unmaximize();
            } else {
                this.window.maximize();
            }
        })
        const closeButton = new Gtk.Button({ label: "C" })
        closeButton.connect("clicked", () => {
            this.close();
        })
        closeButton.get_style_context().add_class("close-header");

        // header bar configuration
        headerBar.pack_end(closeButton);
        headerBar.pack_end(maximizeButton);
        headerBar.pack_end(minimizeButton);
       
        this.window.set_titlebar(headerBar);

        // content box
        const contentBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 10,
        });

        // content box items - close button
        const closeAppButton = new Gtk.Button({ label: "Close App" });
        closeAppButton.get_style_context().add_class("custom-button");
        closeAppButton.connect("clicked", () => {
            this.close();
        });

        // content box configuration
        // contentBox.pack_start(closeAppButton, true, true, 0);
        this.window.add(contentBox);

        // show
        this.window.show_all();
    }
}

const app = new ConfigureWindow();
app.run(ARGV)