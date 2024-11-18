const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;


class CustomClassForThemeSwitcher{
    constructor(message) {
        this.message = message;
    }
    show() {
        // Simple notification display
        Main.notify("Theme Switcher", this.message);
    }
}

module.exports = CustomClassForThemeSwitcher;