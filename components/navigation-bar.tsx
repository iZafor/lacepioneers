import Cart from "./cart";
import ThemeSwitcher from "./theme-switcher";

export default function NavigationBar() {
    return (
        <div className="flex justify-end items-center gap-4 px-4 py-2">
            <Cart />
            <ThemeSwitcher />
        </div>
    );
}
