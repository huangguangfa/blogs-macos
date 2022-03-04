define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNavigationSection = exports.activatePlugin = exports.createTabForPlugin = exports.createPluginContainer = exports.createTabBar = exports.setupSidebarToggle = exports.createSidebar = exports.sidebarHidden = exports.createDragBar = void 0;
    const createDragBar = (side) => {
        const sidebar = document.createElement("div");
        sidebar.className = "playground-dragbar";
        if (side === "left")
            sidebar.classList.add("left");
        let leftSize = 0, rightSize = 0;
        let left, middle, right;
        const drag = (e) => {
            rightSize = right === null || right === void 0 ? void 0 : right.clientWidth;
            leftSize = left === null || left === void 0 ? void 0 : left.clientWidth;
            if (side === "right" && middle && right) {
                // Get how far right the mouse is from the right
                const rightX = right.getBoundingClientRect().right;
                const offset = rightX - e.pageX;
                const screenClampRight = window.innerWidth - 320;
                rightSize = Math.min(Math.max(offset, 280), screenClampRight);
                // console.log({ leftSize, rightSize })
                // Set the widths
                middle.style.width = `calc(100% - ${rightSize + leftSize}px)`;
                right.style.width = `${rightSize}px`;
                right.style.flexBasis = `${rightSize}px`;
                right.style.maxWidth = `${rightSize}px`;
            }
            if (side === "left" && left && middle) {
                // Get how far right the mouse is from the right
                const leftX = e.pageX; //left.getBoundingClientRect().left
                const screenClampLeft = window.innerWidth - 320;
                leftSize = Math.min(Math.max(leftX, 180), screenClampLeft);
                // Set the widths
                middle.style.width = `calc(100% - ${rightSize + leftSize}px)`;
                left.style.width = `${leftSize}px`;
                left.style.flexBasis = `${leftSize}px`;
                left.style.maxWidth = `${leftSize}px`;
            }
            // Save the x coordinate of the
            if (window.localStorage) {
                window.localStorage.setItem("dragbar-left", "" + leftSize);
                window.localStorage.setItem("dragbar-right", "" + rightSize);
                window.localStorage.setItem("dragbar-window-width", "" + window.innerWidth);
            }
            // @ts-ignore - I know what I'm doing
            window.sandbox.editor.layout();
            // Don't allow selection
            e.stopPropagation();
            e.cancelBubble = true;
        };
        sidebar.addEventListener("mousedown", e => {
            var _a;
            sidebar.classList.add("selected");
            left = document.getElementById("navigation-container");
            middle = document.getElementById("editor-container");
            right = (_a = sidebar.parentElement) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("playground-sidebar").item(0);
            // Handle dragging all over the screen
            document.addEventListener("mousemove", drag);
            // Remove it when you lt go anywhere
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", drag);
                document.body.style.userSelect = "auto";
                sidebar.classList.remove("selected");
            });
            // Don't allow the drag to select text accidentally
            document.body.style.userSelect = "none";
            e.stopPropagation();
            e.cancelBubble = true;
        });
        return sidebar;
    };
    exports.createDragBar = createDragBar;
    const sidebarHidden = () => !!window.localStorage.getItem("sidebar-hidden");
    exports.sidebarHidden = sidebarHidden;
    const createSidebar = () => {
        const sidebar = document.createElement("div");
        sidebar.className = "playground-sidebar";
        // Start with the sidebar hidden on small screens
        const isTinyScreen = window.innerWidth < 800;
        // This is independent of the sizing below so that you keep the same sized sidebar
        if (isTinyScreen || (0, exports.sidebarHidden)()) {
            sidebar.style.display = "none";
        }
        if (window.localStorage && window.localStorage.getItem("dragbar-x")) {
            // Don't restore the x pos if the window isn't the same size
            if (window.innerWidth === Number(window.localStorage.getItem("dragbar-window-width"))) {
                // Set the dragger to the previous x pos
                let width = window.localStorage.getItem("dragbar-x");
                if (isTinyScreen) {
                    width = String(Math.min(Number(width), 280));
                }
                sidebar.style.width = `${width}px`;
                sidebar.style.flexBasis = `${width}px`;
                sidebar.style.maxWidth = `${width}px`;
                const left = document.getElementById("editor-container");
                left.style.width = `calc(100% - ${width}px)`;
            }
        }
        return sidebar;
    };
    exports.createSidebar = createSidebar;
    const toggleIconWhenOpen = "&#x21E5;";
    const toggleIconWhenClosed = "&#x21E4;";
    const setupSidebarToggle = () => {
        const toggle = document.getElementById("sidebar-toggle");
        const updateToggle = () => {
            const sidebar = window.document.querySelector(".playground-sidebar");
            const sidebarShowing = sidebar.style.display !== "none";
            toggle.innerHTML = sidebarShowing ? toggleIconWhenOpen : toggleIconWhenClosed;
            toggle.setAttribute("aria-label", sidebarShowing ? "Hide Sidebar" : "Show Sidebar");
        };
        toggle.onclick = () => {
            const sidebar = window.document.querySelector(".playground-sidebar");
            const newState = sidebar.style.display !== "none";
            if (newState) {
                localStorage.setItem("sidebar-hidden", "true");
                sidebar.style.display = "none";
            }
            else {
                localStorage.removeItem("sidebar-hidden");
                sidebar.style.display = "block";
            }
            updateToggle();
            // @ts-ignore - I know what I'm doing
            window.sandbox.editor.layout();
            return false;
        };
        // Ensure its set up at the start
        updateToggle();
    };
    exports.setupSidebarToggle = setupSidebarToggle;
    const createTabBar = () => {
        const tabBar = document.createElement("div");
        tabBar.classList.add("playground-plugin-tabview");
        tabBar.id = "playground-plugin-tabbar";
        tabBar.setAttribute("aria-label", "Tabs for plugins");
        tabBar.setAttribute("role", "tablist");
        /** Support left/right in the tab bar for accessibility */
        let tabFocus = 0;
        tabBar.addEventListener("keydown", e => {
            const tabs = document.querySelectorAll('.playground-plugin-tabview [role="tab"]');
            // Move right
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                tabs[tabFocus].setAttribute("tabindex", "-1");
                if (e.key === "ArrowRight") {
                    tabFocus++;
                    // If we're at the end, go to the start
                    if (tabFocus >= tabs.length) {
                        tabFocus = 0;
                    }
                    // Move left
                }
                else if (e.key === "ArrowLeft") {
                    tabFocus--;
                    // If we're at the start, move to the end
                    if (tabFocus < 0) {
                        tabFocus = tabs.length - 1;
                    }
                }
                tabs[tabFocus].setAttribute("tabindex", "0");
                tabs[tabFocus].focus();
            }
        });
        return tabBar;
    };
    exports.createTabBar = createTabBar;
    const createPluginContainer = () => {
        const container = document.createElement("div");
        container.setAttribute("role", "tabpanel");
        container.classList.add("playground-plugin-container");
        return container;
    };
    exports.createPluginContainer = createPluginContainer;
    const createTabForPlugin = (plugin) => {
        const element = document.createElement("button");
        element.setAttribute("role", "tab");
        element.setAttribute("aria-selected", "false");
        element.id = "playground-plugin-tab-" + plugin.id;
        element.textContent = plugin.displayName;
        return element;
    };
    exports.createTabForPlugin = createTabForPlugin;
    const activatePlugin = (plugin, previousPlugin, sandbox, tabBar, container) => {
        let newPluginTab, oldPluginTab;
        // @ts-ignore - This works at runtime
        for (const tab of tabBar.children) {
            if (tab.id === `playground-plugin-tab-${plugin.id}`)
                newPluginTab = tab;
            if (previousPlugin && tab.id === `playground-plugin-tab-${previousPlugin.id}`)
                oldPluginTab = tab;
        }
        // @ts-ignore
        if (!newPluginTab)
            throw new Error("Could not get a tab for the plugin: " + plugin.displayName);
        // Tell the old plugin it's getting the boot
        // @ts-ignore
        if (previousPlugin && oldPluginTab) {
            if (previousPlugin.willUnmount)
                previousPlugin.willUnmount(sandbox, container);
            oldPluginTab.classList.remove("active");
            oldPluginTab.setAttribute("aria-selected", "false");
            oldPluginTab.removeAttribute("tabindex");
        }
        // Wipe the sidebar
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        // Start booting up the new plugin
        newPluginTab.classList.add("active");
        newPluginTab.setAttribute("aria-selected", "true");
        newPluginTab.setAttribute("tabindex", "0");
        // Tell the new plugin to start doing some work
        if (plugin.willMount)
            plugin.willMount(sandbox, container);
        if (plugin.modelChanged)
            plugin.modelChanged(sandbox, sandbox.getModel(), container);
        if (plugin.modelChangedDebounce)
            plugin.modelChangedDebounce(sandbox, sandbox.getModel(), container);
        if (plugin.didMount)
            plugin.didMount(sandbox, container);
        // Let the previous plugin do any slow work after it's all done
        if (previousPlugin && previousPlugin.didUnmount)
            previousPlugin.didUnmount(sandbox, container);
    };
    exports.activatePlugin = activatePlugin;
    const createNavigationSection = () => {
        const container = document.createElement("div");
        container.id = "navigation-container";
        return container;
    };
    exports.createNavigationSection = createNavigationSection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9jcmVhdGVFbGVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBS08sTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFzQixFQUFFLEVBQUU7UUFDdEQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QyxPQUFPLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFBO1FBQ3hDLElBQUksSUFBSSxLQUFLLE1BQU07WUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUVsRCxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQ2QsU0FBUyxHQUFHLENBQUMsQ0FBQTtRQUVmLElBQUksSUFBaUIsRUFBRSxNQUFtQixFQUFFLEtBQWtCLENBQUE7UUFDOUQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFhLEVBQUUsRUFBRTtZQUM3QixTQUFTLEdBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFdBQVcsQ0FBQTtZQUM5QixRQUFRLEdBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsQ0FBQTtZQUU1QixJQUFJLElBQUksS0FBSyxPQUFPLElBQUksTUFBTSxJQUFJLEtBQUssRUFBRTtnQkFDdkMsZ0RBQWdEO2dCQUNoRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUE7Z0JBQ2xELE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO2dCQUMvQixNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFBO2dCQUNoRCxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxH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QU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUNwRixJQUFJLE1BQU0sQ0FBQyxvQkFBb0I7WUFBRSxNQUFNLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUNwRyxJQUFJLE1BQU0sQ0FBQyxRQUFRO1lBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFFeEQsK0RBQStEO1FBQy9ELElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxVQUFVO1lBQUUsY0FBYyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDaEcsQ0FBQyxDQUFBO0lBNUNZLFFBQUEsY0FBYyxrQkE0QzFCO0lBRU0sTUFBTSx1QkFBdUIsR0FBRyxHQUFHLEVBQUU7UUFDMUMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMvQyxTQUFTLENBQUMsRUFBRSxHQUFHLHNCQUFzQixDQUFBO1FBQ3JDLE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUMsQ0FBQTtJQUpZLFFBQUEsdUJBQXVCLDJCQUluQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEVmZmVjdGl2ZUNvbnN0cmFpbnRPZlR5cGVQYXJhbWV0ZXIgfSBmcm9tIFwidHlwZXNjcmlwdFwiXG5pbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luIH0gZnJvbSBcIi5cIlxuXG50eXBlIFNhbmRib3ggPSBpbXBvcnQoXCJAdHlwZXNjcmlwdC9zYW5kYm94XCIpLlNhbmRib3hcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZURyYWdCYXIgPSAoc2lkZTogXCJsZWZ0XCIgfCBcInJpZ2h0XCIpID0+IHtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgc2lkZWJhci5jbGFzc05hbWUgPSBcInBsYXlncm91bmQtZHJhZ2JhclwiXG4gIGlmIChzaWRlID09PSBcImxlZnRcIikgc2lkZWJhci5jbGFzc0xpc3QuYWRkKFwibGVmdFwiKVxuXG4gIGxldCBsZWZ0U2l6ZSA9IDAsXG4gICAgcmlnaHRTaXplID0gMFxuXG4gIGxldCBsZWZ0OiBIVE1MRWxlbWVudCwgbWlkZGxlOiBIVE1MRWxlbWVudCwgcmlnaHQ6IEhUTUxFbGVtZW50XG4gIGNvbnN0IGRyYWcgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIHJpZ2h0U2l6ZSA9IHJpZ2h0Py5jbGllbnRXaWR0aFxuICAgIGxlZnRTaXplID0gbGVmdD8uY2xpZW50V2lkdGhcblxuICAgIGlmIChzaWRlID09PSBcInJpZ2h0XCIgJiYgbWlkZGxlICYmIHJpZ2h0KSB7XG4gICAgICAvLyBHZXQgaG93IGZhciByaWdodCB0aGUgbW91c2UgaXMgZnJvbSB0aGUgcmlnaHRcbiAgICAgIGNvbnN0IHJpZ2h0WCA9IHJpZ2h0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0XG4gICAgICBjb25zdCBvZmZzZXQgPSByaWdodFggLSBlLnBhZ2VYXG4gICAgICBjb25zdCBzY3JlZW5DbGFtcFJpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLSAzMjBcbiAgICAgIHJpZ2h0U2l6ZSA9IE1hdGgubWluKE1hdGgubWF4KG9mZnNldCwgMjgwKSwgc2NyZWVuQ2xhbXBSaWdodClcbiAgICAgIC8vIGNvbnNvbGUubG9nKHsgbGVmdFNpemUsIHJpZ2h0U2l6ZSB9KVxuXG4gICAgICAvLyBTZXQgdGhlIHdpZHRoc1xuICAgICAgbWlkZGxlLnN0eWxlLndpZHRoID0gYGNhbGMoMTAwJSAtICR7cmlnaHRTaXplICsgbGVmdFNpemV9cHgpYFxuICAgICAgcmlnaHQuc3R5bGUud2lkdGggPSBgJHtyaWdodFNpemV9cHhgXG4gICAgICByaWdodC5zdHlsZS5mbGV4QmFzaXMgPSBgJHtyaWdodFNpemV9cHhgXG4gICAgICByaWdodC5zdHlsZS5tYXhXaWR0aCA9IGAke3JpZ2h0U2l6ZX1weGBcbiAgICB9XG5cbiAgICBpZiAoc2lkZSA9PT0gXCJsZWZ0XCIgJiYgbGVmdCAmJiBtaWRkbGUpIHtcbiAgICAgIC8vIEdldCBob3cgZmFyIHJpZ2h0IHRoZSBtb3VzZSBpcyBmcm9tIHRoZSByaWdodFxuICAgICAgY29uc3QgbGVmdFggPSBlLnBhZ2VYIC8vbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG4gICAgICBjb25zdCBzY3JlZW5DbGFtcExlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDMyMFxuICAgICAgbGVmdFNpemUgPSBNYXRoLm1pbihNYXRoLm1heChsZWZ0WCwgMTgwKSwgc2NyZWVuQ2xhbXBMZWZ0KVxuXG4gICAgICAvLyBTZXQgdGhlIHdpZHRoc1xuICAgICAgbWlkZGxlLnN0eWxlLndpZHRoID0gYGNhbGMoMTAwJSAtICR7cmlnaHRTaXplICsgbGVmdFNpemV9cHgpYFxuICAgICAgbGVmdC5zdHlsZS53aWR0aCA9IGAke2xlZnRTaXplfXB4YFxuICAgICAgbGVmdC5zdHlsZS5mbGV4QmFzaXMgPSBgJHtsZWZ0U2l6ZX1weGBcbiAgICAgIGxlZnQuc3R5bGUubWF4V2lkdGggPSBgJHtsZWZ0U2l6ZX1weGBcbiAgICB9XG5cbiAgICAvLyBTYXZlIHRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlXG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRyYWdiYXItbGVmdFwiLCBcIlwiICsgbGVmdFNpemUpXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmFnYmFyLXJpZ2h0XCIsIFwiXCIgKyByaWdodFNpemUpXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmFnYmFyLXdpbmRvdy13aWR0aFwiLCBcIlwiICsgd2luZG93LmlubmVyV2lkdGgpXG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZSAtIEkga25vdyB3aGF0IEknbSBkb2luZ1xuICAgIHdpbmRvdy5zYW5kYm94LmVkaXRvci5sYXlvdXQoKVxuXG4gICAgLy8gRG9uJ3QgYWxsb3cgc2VsZWN0aW9uXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUuY2FuY2VsQnViYmxlID0gdHJ1ZVxuICB9XG5cbiAgc2lkZWJhci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xuICAgIHNpZGViYXIuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpXG4gICAgbGVmdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2aWdhdGlvbi1jb250YWluZXJcIikhXG4gICAgbWlkZGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3ItY29udGFpbmVyXCIpIVxuICAgIHJpZ2h0ID0gc2lkZWJhci5wYXJlbnRFbGVtZW50Py5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWdyb3VuZC1zaWRlYmFyXCIpLml0ZW0oMCkhIGFzIGFueVxuICAgIC8vIEhhbmRsZSBkcmFnZ2luZyBhbGwgb3ZlciB0aGUgc2NyZWVuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnKVxuXG4gICAgLy8gUmVtb3ZlIGl0IHdoZW4geW91IGx0IGdvIGFueXdoZXJlXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnKVxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS51c2VyU2VsZWN0ID0gXCJhdXRvXCJcbiAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpXG4gICAgfSlcblxuICAgIC8vIERvbid0IGFsbG93IHRoZSBkcmFnIHRvIHNlbGVjdCB0ZXh0IGFjY2lkZW50YWxseVxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwibm9uZVwiXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUuY2FuY2VsQnViYmxlID0gdHJ1ZVxuICB9KVxuXG4gIHJldHVybiBzaWRlYmFyXG59XG5cbmV4cG9ydCBjb25zdCBzaWRlYmFySGlkZGVuID0gKCkgPT4gISF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaWRlYmFyLWhpZGRlblwiKVxuXG5leHBvcnQgY29uc3QgY3JlYXRlU2lkZWJhciA9ICgpID0+IHtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgc2lkZWJhci5jbGFzc05hbWUgPSBcInBsYXlncm91bmQtc2lkZWJhclwiXG5cbiAgLy8gU3RhcnQgd2l0aCB0aGUgc2lkZWJhciBoaWRkZW4gb24gc21hbGwgc2NyZWVuc1xuICBjb25zdCBpc1RpbnlTY3JlZW4gPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMFxuXG4gIC8vIFRoaXMgaXMgaW5kZXBlbmRlbnQgb2YgdGhlIHNpemluZyBiZWxvdyBzbyB0aGF0IHlvdSBrZWVwIHRoZSBzYW1lIHNpemVkIHNpZGViYXJcbiAgaWYgKGlzVGlueVNjcmVlbiB8fCBzaWRlYmFySGlkZGVuKCkpIHtcbiAgICBzaWRlYmFyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICB9XG5cbiAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UgJiYgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJhZ2Jhci14XCIpKSB7XG4gICAgLy8gRG9uJ3QgcmVzdG9yZSB0aGUgeCBwb3MgaWYgdGhlIHdpbmRvdyBpc24ndCB0aGUgc2FtZSBzaXplXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID09PSBOdW1iZXIod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJhZ2Jhci13aW5kb3ctd2lkdGhcIikpKSB7XG4gICAgICAvLyBTZXQgdGhlIGRyYWdnZXIgdG8gdGhlIHByZXZpb3VzIHggcG9zXG4gICAgICBsZXQgd2lkdGggPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkcmFnYmFyLXhcIilcblxuICAgICAgaWYgKGlzVGlueVNjcmVlbikge1xuICAgICAgICB3aWR0aCA9IFN0cmluZyhNYXRoLm1pbihOdW1iZXIod2lkdGgpLCAyODApKVxuICAgICAgfVxuXG4gICAgICBzaWRlYmFyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgXG4gICAgICBzaWRlYmFyLnN0eWxlLmZsZXhCYXNpcyA9IGAke3dpZHRofXB4YFxuICAgICAgc2lkZWJhci5zdHlsZS5tYXhXaWR0aCA9IGAke3dpZHRofXB4YFxuXG4gICAgICBjb25zdCBsZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3ItY29udGFpbmVyXCIpIVxuICAgICAgbGVmdC5zdHlsZS53aWR0aCA9IGBjYWxjKDEwMCUgLSAke3dpZHRofXB4KWBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2lkZWJhclxufVxuXG5jb25zdCB0b2dnbGVJY29uV2hlbk9wZW4gPSBcIiYjeDIxRTU7XCJcbmNvbnN0IHRvZ2dsZUljb25XaGVuQ2xvc2VkID0gXCImI3gyMUU0O1wiXG5cbmV4cG9ydCBjb25zdCBzZXR1cFNpZGViYXJUb2dnbGUgPSAoKSA9PiB7XG4gIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhci10b2dnbGVcIikhXG5cbiAgY29uc3QgdXBkYXRlVG9nZ2xlID0gKCkgPT4ge1xuICAgIGNvbnN0IHNpZGViYXIgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXNpZGViYXJcIikgYXMgSFRNTERpdkVsZW1lbnRcbiAgICBjb25zdCBzaWRlYmFyU2hvd2luZyA9IHNpZGViYXIuc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCJcblxuICAgIHRvZ2dsZS5pbm5lckhUTUwgPSBzaWRlYmFyU2hvd2luZyA/IHRvZ2dsZUljb25XaGVuT3BlbiA6IHRvZ2dsZUljb25XaGVuQ2xvc2VkXG4gICAgdG9nZ2xlLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgc2lkZWJhclNob3dpbmcgPyBcIkhpZGUgU2lkZWJhclwiIDogXCJTaG93IFNpZGViYXJcIilcbiAgfVxuXG4gIHRvZ2dsZS5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHNpZGViYXIgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5Z3JvdW5kLXNpZGViYXJcIikgYXMgSFRNTERpdkVsZW1lbnRcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHNpZGViYXIuc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCJcblxuICAgIGlmIChuZXdTdGF0ZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaWRlYmFyLWhpZGRlblwiLCBcInRydWVcIilcbiAgICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwic2lkZWJhci1oaWRkZW5cIilcbiAgICAgIHNpZGViYXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgIH1cblxuICAgIHVwZGF0ZVRvZ2dsZSgpXG5cbiAgICAvLyBAdHMtaWdub3JlIC0gSSBrbm93IHdoYXQgSSdtIGRvaW5nXG4gICAgd2luZG93LnNhbmRib3guZWRpdG9yLmxheW91dCgpXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIEVuc3VyZSBpdHMgc2V0IHVwIGF0IHRoZSBzdGFydFxuICB1cGRhdGVUb2dnbGUoKVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlVGFiQmFyID0gKCkgPT4ge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gIHRhYkJhci5jbGFzc0xpc3QuYWRkKFwicGxheWdyb3VuZC1wbHVnaW4tdGFidmlld1wiKVxuICB0YWJCYXIuaWQgPSBcInBsYXlncm91bmQtcGx1Z2luLXRhYmJhclwiXG4gIHRhYkJhci5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiVGFicyBmb3IgcGx1Z2luc1wiKVxuICB0YWJCYXIuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYmxpc3RcIilcblxuICAvKiogU3VwcG9ydCBsZWZ0L3JpZ2h0IGluIHRoZSB0YWIgYmFyIGZvciBhY2Nlc3NpYmlsaXR5ICovXG4gIGxldCB0YWJGb2N1cyA9IDBcbiAgdGFiQmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xuICAgIGNvbnN0IHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWdyb3VuZC1wbHVnaW4tdGFidmlldyBbcm9sZT1cInRhYlwiXScpXG4gICAgLy8gTW92ZSByaWdodFxuICAgIGlmIChlLmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIgfHwgZS5rZXkgPT09IFwiQXJyb3dMZWZ0XCIpIHtcbiAgICAgIHRhYnNbdGFiRm9jdXNdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIilcbiAgICAgIGlmIChlLmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIpIHtcbiAgICAgICAgdGFiRm9jdXMrK1xuICAgICAgICAvLyBJZiB3ZSdyZSBhdCB0aGUgZW5kLCBnbyB0byB0aGUgc3RhcnRcbiAgICAgICAgaWYgKHRhYkZvY3VzID49IHRhYnMubGVuZ3RoKSB7XG4gICAgICAgICAgdGFiRm9jdXMgPSAwXG4gICAgICAgIH1cbiAgICAgICAgLy8gTW92ZSBsZWZ0XG4gICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkFycm93TGVmdFwiKSB7XG4gICAgICAgIHRhYkZvY3VzLS1cbiAgICAgICAgLy8gSWYgd2UncmUgYXQgdGhlIHN0YXJ0LCBtb3ZlIHRvIHRoZSBlbmRcbiAgICAgICAgaWYgKHRhYkZvY3VzIDwgMCkge1xuICAgICAgICAgIHRhYkZvY3VzID0gdGFicy5sZW5ndGggLSAxXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGFic1t0YWJGb2N1c10uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpXG4gICAgICA7KHRhYnNbdGFiRm9jdXNdIGFzIGFueSkuZm9jdXMoKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gdGFiQmFyXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVQbHVnaW5Db250YWluZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0YWJwYW5lbFwiKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBsYXlncm91bmQtcGx1Z2luLWNvbnRhaW5lclwiKVxuICByZXR1cm4gY29udGFpbmVyXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUYWJGb3JQbHVnaW4gPSAocGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKVxuICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJmYWxzZVwiKVxuICBlbGVtZW50LmlkID0gXCJwbGF5Z3JvdW5kLXBsdWdpbi10YWItXCIgKyBwbHVnaW4uaWRcbiAgZWxlbWVudC50ZXh0Q29udGVudCA9IHBsdWdpbi5kaXNwbGF5TmFtZVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgYWN0aXZhdGVQbHVnaW4gPSAoXG4gIHBsdWdpbjogUGxheWdyb3VuZFBsdWdpbixcbiAgcHJldmlvdXNQbHVnaW46IFBsYXlncm91bmRQbHVnaW4gfCB1bmRlZmluZWQsXG4gIHNhbmRib3g6IFNhbmRib3gsXG4gIHRhYkJhcjogSFRNTERpdkVsZW1lbnQsXG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbikgPT4ge1xuICBsZXQgbmV3UGx1Z2luVGFiOiBFbGVtZW50LCBvbGRQbHVnaW5UYWI6IEVsZW1lbnRcbiAgLy8gQHRzLWlnbm9yZSAtIFRoaXMgd29ya3MgYXQgcnVudGltZVxuICBmb3IgKGNvbnN0IHRhYiBvZiB0YWJCYXIuY2hpbGRyZW4pIHtcbiAgICBpZiAodGFiLmlkID09PSBgcGxheWdyb3VuZC1wbHVnaW4tdGFiLSR7cGx1Z2luLmlkfWApIG5ld1BsdWdpblRhYiA9IHRhYlxuICAgIGlmIChwcmV2aW91c1BsdWdpbiAmJiB0YWIuaWQgPT09IGBwbGF5Z3JvdW5kLXBsdWdpbi10YWItJHtwcmV2aW91c1BsdWdpbi5pZH1gKSBvbGRQbHVnaW5UYWIgPSB0YWJcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgaWYgKCFuZXdQbHVnaW5UYWIpIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBnZXQgYSB0YWIgZm9yIHRoZSBwbHVnaW46IFwiICsgcGx1Z2luLmRpc3BsYXlOYW1lKVxuXG4gIC8vIFRlbGwgdGhlIG9sZCBwbHVnaW4gaXQncyBnZXR0aW5nIHRoZSBib290XG4gIC8vIEB0cy1pZ25vcmVcbiAgaWYgKHByZXZpb3VzUGx1Z2luICYmIG9sZFBsdWdpblRhYikge1xuICAgIGlmIChwcmV2aW91c1BsdWdpbi53aWxsVW5tb3VudCkgcHJldmlvdXNQbHVnaW4ud2lsbFVubW91bnQoc2FuZGJveCwgY29udGFpbmVyKVxuICAgIG9sZFBsdWdpblRhYi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpXG4gICAgb2xkUGx1Z2luVGFiLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJmYWxzZVwiKVxuICAgIG9sZFBsdWdpblRhYi5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKVxuICB9XG5cbiAgLy8gV2lwZSB0aGUgc2lkZWJhclxuICB3aGlsZSAoY29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcbiAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gIH1cblxuICAvLyBTdGFydCBib290aW5nIHVwIHRoZSBuZXcgcGx1Z2luXG4gIG5ld1BsdWdpblRhYi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpXG4gIG5ld1BsdWdpblRhYi5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIFwidHJ1ZVwiKVxuICBuZXdQbHVnaW5UYWIuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpXG5cbiAgLy8gVGVsbCB0aGUgbmV3IHBsdWdpbiB0byBzdGFydCBkb2luZyBzb21lIHdvcmtcbiAgaWYgKHBsdWdpbi53aWxsTW91bnQpIHBsdWdpbi53aWxsTW91bnQoc2FuZGJveCwgY29udGFpbmVyKVxuICBpZiAocGx1Z2luLm1vZGVsQ2hhbmdlZCkgcGx1Z2luLm1vZGVsQ2hhbmdlZChzYW5kYm94LCBzYW5kYm94LmdldE1vZGVsKCksIGNvbnRhaW5lcilcbiAgaWYgKHBsdWdpbi5tb2RlbENoYW5nZWREZWJvdW5jZSkgcGx1Z2luLm1vZGVsQ2hhbmdlZERlYm91bmNlKHNhbmRib3gsIHNhbmRib3guZ2V0TW9kZWwoKSwgY29udGFpbmVyKVxuICBpZiAocGx1Z2luLmRpZE1vdW50KSBwbHVnaW4uZGlkTW91bnQoc2FuZGJveCwgY29udGFpbmVyKVxuXG4gIC8vIExldCB0aGUgcHJldmlvdXMgcGx1Z2luIGRvIGFueSBzbG93IHdvcmsgYWZ0ZXIgaXQncyBhbGwgZG9uZVxuICBpZiAocHJldmlvdXNQbHVnaW4gJiYgcHJldmlvdXNQbHVnaW4uZGlkVW5tb3VudCkgcHJldmlvdXNQbHVnaW4uZGlkVW5tb3VudChzYW5kYm94LCBjb250YWluZXIpXG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOYXZpZ2F0aW9uU2VjdGlvbiA9ICgpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICBjb250YWluZXIuaWQgPSBcIm5hdmlnYXRpb24tY29udGFpbmVyXCJcbiAgcmV0dXJuIGNvbnRhaW5lclxufVxuIl19