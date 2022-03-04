define(["require", "exports", "./ds/createDesignSystem"], function (require, exports, createDesignSystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createUtils = void 0;
    /** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
    const createUtils = (sb, react) => {
        const sandbox = sb;
        const requireURL = (path) => {
            // https://unpkg.com/browse/typescript-playground-presentation-mode@0.0.1/dist/x.js => unpkg/browse/typescript-playground-presentation-mode@0.0.1/dist/x
            const isDev = document.location.host.includes("localhost");
            const prefix = isDev ? "local/" : "unpkg/typescript-playground-presentation-mode/dist/";
            return prefix + path;
        };
        const el = (str, elementType, container) => {
            const el = document.createElement(elementType);
            el.innerHTML = str;
            container.appendChild(el);
            return el;
        };
        const flashHTMLElement = (element) => {
            element.classList.add("briefly-highlight");
            setTimeout(() => element.classList.remove("briefly-highlight"), 1000);
        };
        const setNotifications = (pluginID, amount) => {
            const tab = document.getElementById("playground-plugin-tab-" + pluginID);
            if (!tab)
                return;
            const notification = tab.querySelector("div.plugin-tab-notification");
            if (!amount && notification)
                tab.removeChild(notification);
            if (amount) {
                if (!notification) {
                    const label = document.createElement("div");
                    label.textContent = String(amount);
                    label.classList.add("plugin-tab-notification");
                    tab.appendChild(label);
                }
                else {
                    if (notification.textContent !== String(amount)) {
                        notification.textContent = String(amount);
                    }
                }
            }
        };
        return {
            /** Use this to make a few dumb element generation funcs */
            el,
            /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
            requireURL,
            /** The Gatsby copy of React */
            react,
            /**
             * The playground plugin design system. Calling any of the functions will append the
             * element to the container you pass into the first param, and return the HTMLElement
             */
            createDesignSystem: (0, createDesignSystem_1.createDesignSystem)(sandbox),
            /** Flashes a HTML Element */
            flashHTMLElement,
            /** Add a little red button in the top corner of a plugin tab with a number */
            setNotifications,
        };
    };
    exports.createUtils = createUtils;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9wbHVnaW5VdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBSUEsNEdBQTRHO0lBQ3JHLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBTyxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUMxRCxNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUE7UUFFM0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUNsQyx3SkFBd0o7WUFDeEosTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzFELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxxREFBcUQsQ0FBQTtZQUN2RixPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFDdEIsQ0FBQyxDQUFBO1FBRUQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFXLEVBQUUsV0FBbUIsRUFBRSxTQUFrQixFQUFFLEVBQUU7WUFDbEUsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUM5QyxFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQTtZQUNsQixTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3pCLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQyxDQUFBO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQW9CLEVBQUUsRUFBRTtZQUNoRCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQzFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3ZFLENBQUMsQ0FBQTtRQUVELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLE1BQWMsRUFBRSxFQUFFO1lBQzVELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLENBQUE7WUFDeEUsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTTtZQUVoQixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDckUsSUFBSSxDQUFDLE1BQU0sSUFBSSxZQUFZO2dCQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7WUFFMUQsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDakIsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDM0MsS0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQ2xDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7b0JBQzlDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7aUJBQ3ZCO3FCQUFNO29CQUNMLElBQUksWUFBWSxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQy9DLFlBQVksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3FCQUMxQztpQkFDRjthQUNGO1FBQ0gsQ0FBQyxDQUFBO1FBRUQsT0FBTztZQUNMLDJEQUEyRDtZQUMzRCxFQUFFO1lBQ0YscUdBQXFHO1lBQ3JHLFVBQVU7WUFDViwrQkFBK0I7WUFDL0IsS0FBSztZQUNMOzs7ZUFHRztZQUNILGtCQUFrQixFQUFFLElBQUEsdUNBQWtCLEVBQUMsT0FBTyxDQUFDO1lBQy9DLDZCQUE2QjtZQUM3QixnQkFBZ0I7WUFDaEIsOEVBQThFO1lBQzlFLGdCQUFnQjtTQUNqQixDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBNURZLFFBQUEsV0FBVyxlQTREdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNhbmRib3ggfSBmcm9tIFwiQHR5cGVzY3JpcHQvc2FuZGJveFwiXG5pbXBvcnQgdHlwZSBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgY3JlYXRlRGVzaWduU3lzdGVtIH0gZnJvbSBcIi4vZHMvY3JlYXRlRGVzaWduU3lzdGVtXCJcblxuLyoqIENyZWF0ZXMgYSBzZXQgb2YgdXRpbCBmdW5jdGlvbnMgd2hpY2ggaXMgZXhwb3NlZCB0byBQbHVnaW5zIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGJ1aWxkIGNvbnNpc3RlbnQgVUlzICovXG5leHBvcnQgY29uc3QgY3JlYXRlVXRpbHMgPSAoc2I6IGFueSwgcmVhY3Q6IHR5cGVvZiBSZWFjdCkgPT4ge1xuICBjb25zdCBzYW5kYm94OiBTYW5kYm94ID0gc2JcblxuICBjb25zdCByZXF1aXJlVVJMID0gKHBhdGg6IHN0cmluZykgPT4ge1xuICAgIC8vIGh0dHBzOi8vdW5wa2cuY29tL2Jyb3dzZS90eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGVAMC4wLjEvZGlzdC94LmpzID0+IHVucGtnL2Jyb3dzZS90eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGVAMC4wLjEvZGlzdC94XG4gICAgY29uc3QgaXNEZXYgPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0LmluY2x1ZGVzKFwibG9jYWxob3N0XCIpXG4gICAgY29uc3QgcHJlZml4ID0gaXNEZXYgPyBcImxvY2FsL1wiIDogXCJ1bnBrZy90eXBlc2NyaXB0LXBsYXlncm91bmQtcHJlc2VudGF0aW9uLW1vZGUvZGlzdC9cIlxuICAgIHJldHVybiBwcmVmaXggKyBwYXRoXG4gIH1cblxuICBjb25zdCBlbCA9IChzdHI6IHN0cmluZywgZWxlbWVudFR5cGU6IHN0cmluZywgY29udGFpbmVyOiBFbGVtZW50KSA9PiB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnRUeXBlKVxuICAgIGVsLmlubmVySFRNTCA9IHN0clxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbClcbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIGNvbnN0IGZsYXNoSFRNTEVsZW1lbnQgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJicmllZmx5LWhpZ2hsaWdodFwiKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYnJpZWZseS1oaWdobGlnaHRcIiksIDEwMDApXG4gIH1cblxuICBjb25zdCBzZXROb3RpZmljYXRpb25zID0gKHBsdWdpbklEOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdGFiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5Z3JvdW5kLXBsdWdpbi10YWItXCIgKyBwbHVnaW5JRClcbiAgICBpZiAoIXRhYikgcmV0dXJuXG5cbiAgICBjb25zdCBub3RpZmljYXRpb24gPSB0YWIucXVlcnlTZWxlY3RvcihcImRpdi5wbHVnaW4tdGFiLW5vdGlmaWNhdGlvblwiKVxuICAgIGlmICghYW1vdW50ICYmIG5vdGlmaWNhdGlvbikgdGFiLnJlbW92ZUNoaWxkKG5vdGlmaWNhdGlvbilcblxuICAgIGlmIChhbW91bnQpIHtcbiAgICAgIGlmICghbm90aWZpY2F0aW9uKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IFN0cmluZyhhbW91bnQpXG4gICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoXCJwbHVnaW4tdGFiLW5vdGlmaWNhdGlvblwiKVxuICAgICAgICB0YWIuYXBwZW5kQ2hpbGQobGFiZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobm90aWZpY2F0aW9uLnRleHRDb250ZW50ICE9PSBTdHJpbmcoYW1vdW50KSkge1xuICAgICAgICAgIG5vdGlmaWNhdGlvbi50ZXh0Q29udGVudCA9IFN0cmluZyhhbW91bnQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKiBVc2UgdGhpcyB0byBtYWtlIGEgZmV3IGR1bWIgZWxlbWVudCBnZW5lcmF0aW9uIGZ1bmNzICovXG4gICAgZWwsXG4gICAgLyoqIEdldCBhIHJlbGF0aXZlIFVSTCBmb3Igc29tZXRoaW5nIGluIHlvdXIgZGlzdCBmb2xkZXIgZGVwZW5kaW5nIG9uIGlmIHlvdSdyZSBpbiBkZXYgbW9kZSBvciBub3QgKi9cbiAgICByZXF1aXJlVVJMLFxuICAgIC8qKiBUaGUgR2F0c2J5IGNvcHkgb2YgUmVhY3QgKi9cbiAgICByZWFjdCxcbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWdyb3VuZCBwbHVnaW4gZGVzaWduIHN5c3RlbS4gQ2FsbGluZyBhbnkgb2YgdGhlIGZ1bmN0aW9ucyB3aWxsIGFwcGVuZCB0aGVcbiAgICAgKiBlbGVtZW50IHRvIHRoZSBjb250YWluZXIgeW91IHBhc3MgaW50byB0aGUgZmlyc3QgcGFyYW0sIGFuZCByZXR1cm4gdGhlIEhUTUxFbGVtZW50XG4gICAgICovXG4gICAgY3JlYXRlRGVzaWduU3lzdGVtOiBjcmVhdGVEZXNpZ25TeXN0ZW0oc2FuZGJveCksXG4gICAgLyoqIEZsYXNoZXMgYSBIVE1MIEVsZW1lbnQgKi9cbiAgICBmbGFzaEhUTUxFbGVtZW50LFxuICAgIC8qKiBBZGQgYSBsaXR0bGUgcmVkIGJ1dHRvbiBpbiB0aGUgdG9wIGNvcm5lciBvZiBhIHBsdWdpbiB0YWIgd2l0aCBhIG51bWJlciAqL1xuICAgIHNldE5vdGlmaWNhdGlvbnMsXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgUGx1Z2luVXRpbHMgPSBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVVdGlscz5cbiJdfQ==