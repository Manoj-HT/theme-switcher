const {Gio, Gtk, GLib, Gdk} = imports.gi;
const currentFolder = ARGV[0]
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
        const cssFile = `${currentFolder}/configureWindow.css`;
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