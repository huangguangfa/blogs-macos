define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createUI = void 0;
    const createUI = () => {
        const flashInfo = (message, timeout = 1000) => {
            var _a;
            let flashBG = document.getElementById("flash-bg");
            if (flashBG) {
                (_a = flashBG.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(flashBG);
            }
            flashBG = document.createElement("div");
            flashBG.id = "flash-bg";
            const p = document.createElement("p");
            p.textContent = message;
            flashBG.appendChild(p);
            document.body.appendChild(flashBG);
            setTimeout(() => {
                var _a;
                (_a = flashBG === null || flashBG === void 0 ? void 0 : flashBG.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(flashBG);
            }, timeout);
        };
        const createModalOverlay = (postFocalElement, classList) => {
            document.querySelectorAll(".navbar-sub li.open").forEach(i => i.classList.remove("open"));
            const existingPopover = document.getElementById("popover-modal");
            if (existingPopover)
                existingPopover.parentElement.removeChild(existingPopover);
            const modalBG = document.createElement("div");
            modalBG.id = "popover-background";
            document.body.appendChild(modalBG);
            const modal = document.createElement("div");
            modal.id = "popover-modal";
            if (classList)
                modal.className = classList;
            const closeButton = document.createElement("button");
            closeButton.innerText = "Close";
            closeButton.classList.add("close");
            closeButton.tabIndex = 1;
            modal.appendChild(closeButton);
            const oldOnkeyDown = document.onkeydown;
            const close = () => {
                modalBG.parentNode.removeChild(modalBG);
                modal.parentNode.removeChild(modal);
                // @ts-ignore
                document.onkeydown = oldOnkeyDown;
                postFocalElement.focus();
            };
            modalBG.onclick = close;
            closeButton.onclick = close;
            // Support hiding the modal via escape
            document.onkeydown = whenEscape(close);
            document.body.appendChild(modal);
            return modal;
        };
        /** For showing a lot of code */
        const showModal = (code, postFocalElement, subtitle, links, event) => {
            const modal = createModalOverlay(postFocalElement);
            // I've not been able to get this to work in a way which
            // works with every screenreader and browser combination, so
            // instead I'm dropping the feature.
            const isNotMouse = false; //  event && event.screenX === 0 && event.screenY === 0
            if (subtitle) {
                const titleElement = document.createElement("h3");
                titleElement.textContent = subtitle;
                setTimeout(() => {
                    titleElement.setAttribute("role", "alert");
                }, 100);
                modal.appendChild(titleElement);
            }
            const textarea = document.createElement("textarea");
            textarea.readOnly = true;
            textarea.wrap = "off";
            textarea.style.marginBottom = "20px";
            modal.appendChild(textarea);
            textarea.textContent = code;
            textarea.rows = 60;
            const buttonContainer = document.createElement("div");
            const copyButton = document.createElement("button");
            copyButton.innerText = "Copy";
            buttonContainer.appendChild(copyButton);
            const selectAllButton = document.createElement("button");
            selectAllButton.innerText = "Select All";
            buttonContainer.appendChild(selectAllButton);
            modal.appendChild(buttonContainer);
            const close = modal.querySelector(".close");
            close.addEventListener("keydown", e => {
                if (e.key === "Tab") {
                    ;
                    modal.querySelector("textarea").focus();
                    e.preventDefault();
                }
            });
            if (links) {
                Object.keys(links).forEach(name => {
                    const href = links[name];
                    const extraButton = document.createElement("button");
                    extraButton.innerText = name;
                    extraButton.onclick = () => (document.location = href);
                    buttonContainer.appendChild(extraButton);
                });
            }
            const selectAll = () => {
                textarea.select();
            };
            const shouldAutoSelect = !isNotMouse;
            if (shouldAutoSelect) {
                selectAll();
            }
            else {
                textarea.focus();
            }
            const buttons = modal.querySelectorAll("button");
            const lastButton = buttons.item(buttons.length - 1);
            lastButton.addEventListener("keydown", e => {
                if (e.key === "Tab") {
                    ;
                    document.querySelector(".close").focus();
                    e.preventDefault();
                }
            });
            selectAllButton.onclick = selectAll;
            copyButton.onclick = () => {
                navigator.clipboard.writeText(code);
            };
        };
        return {
            createModalOverlay,
            showModal,
            flashInfo,
        };
    };
    exports.createUI = createUI;
    /**
     * Runs the closure when escape is tapped
     * @param func closure to run on escape being pressed
     */
    const whenEscape = (func) => (event) => {
        const evt = event || window.event;
        let isEscape = false;
        if ("key" in evt) {
            isEscape = evt.key === "Escape" || evt.key === "Esc";
        }
        else {
            // @ts-ignore - this used to be the case
            isEscape = evt.keyCode === 27;
        }
        if (isEscape) {
            func();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVUkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9jcmVhdGVVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZU8sTUFBTSxRQUFRLEdBQUcsR0FBTyxFQUFFO1FBQy9CLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQU8sR0FBRyxJQUFJLEVBQUUsRUFBRTs7WUFDcEQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNqRCxJQUFJLE9BQU8sRUFBRTtnQkFDWCxNQUFBLE9BQU8sQ0FBQyxhQUFhLDBDQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUM1QztZQUVELE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3ZDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFBO1lBRXZCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDckMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUE7WUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVsQyxVQUFVLENBQUMsR0FBRyxFQUFFOztnQkFDZCxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxhQUFhLDBDQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM5QyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDYixDQUFDLENBQUE7UUFFRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsZ0JBQTZCLEVBQUUsU0FBa0IsRUFBRSxFQUFFO1lBQy9FLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENB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O1lBQ25DLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUN4QixTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNyQyxDQUFDLENBQUE7UUFDSCxDQUFDLENBQUE7UUFFRCxPQUFPO1lBQ0wsa0JBQWtCO1lBQ2xCLFNBQVM7WUFDVCxTQUFTO1NBQ1YsQ0FBQTtJQUNILENBQUMsQ0FBQTtJQXpKWSxRQUFBLFFBQVEsWUF5SnBCO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtRQUNoRSxNQUFNLEdBQUcsR0FBRyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUNqQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUE7UUFDcEIsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ2hCLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQTtTQUNyRDthQUFNO1lBQ0wsd0NBQXdDO1lBQ3hDLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQTtTQUM5QjtRQUNELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxFQUFFLENBQUE7U0FDUDtJQUNILENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgVUkge1xuICAvKiogU2hvdyBhIHRleHQgbW9kYWwsIHdpdGggc29tZSBidXR0b25zICovXG4gIHNob3dNb2RhbDogKFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBwb3N0Rm9jYWxFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBzdWJ0aXRsZT86IHN0cmluZyxcbiAgICBidXR0b25zPzogeyBbdGV4dDogc3RyaW5nXTogc3RyaW5nIH0sXG4gICAgZXZlbnQ/OiBSZWFjdC5Nb3VzZUV2ZW50XG4gICkgPT4gdm9pZFxuICAvKiogQSBxdWljayBmbGFzaCBvZiBzb21lIHRleHQgKi9cbiAgZmxhc2hJbmZvOiAobWVzc2FnZTogc3RyaW5nLCB0aW1lPzogbnVtYmVyKSA9PiB2b2lkXG4gIC8qKiBDcmVhdGVzIGEgbW9kYWwgY29udGFpbmVyIHdoaWNoIHlvdSBjYW4gcHV0IHlvdXIgb3duIERPTSBlbGVtZW50cyBpbnNpZGUgKi9cbiAgY3JlYXRlTW9kYWxPdmVybGF5OiAocG9zdEZvY2FsRWxlbWVudDogSFRNTEVsZW1lbnQsIGNsYXNzZXM/OiBzdHJpbmcpID0+IEhUTUxEaXZFbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVVSSA9ICgpOiBVSSA9PiB7XG4gIGNvbnN0IGZsYXNoSW5mbyA9IChtZXNzYWdlOiBzdHJpbmcsIHRpbWVvdXQgPSAxMDAwKSA9PiB7XG4gICAgbGV0IGZsYXNoQkcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsYXNoLWJnXCIpXG4gICAgaWYgKGZsYXNoQkcpIHtcbiAgICAgIGZsYXNoQkcucGFyZW50RWxlbWVudD8ucmVtb3ZlQ2hpbGQoZmxhc2hCRylcbiAgICB9XG5cbiAgICBmbGFzaEJHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIGZsYXNoQkcuaWQgPSBcImZsYXNoLWJnXCJcblxuICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxuICAgIHAudGV4dENvbnRlbnQgPSBtZXNzYWdlXG4gICAgZmxhc2hCRy5hcHBlbmRDaGlsZChwKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZmxhc2hCRylcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZmxhc2hCRz8ucGFyZW50RWxlbWVudD8ucmVtb3ZlQ2hpbGQoZmxhc2hCRylcbiAgICB9LCB0aW1lb3V0KVxuICB9XG5cbiAgY29uc3QgY3JlYXRlTW9kYWxPdmVybGF5ID0gKHBvc3RGb2NhbEVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjbGFzc0xpc3Q/OiBzdHJpbmcpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmJhci1zdWIgbGkub3BlblwiKS5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwib3BlblwiKSlcblxuICAgIGNvbnN0IGV4aXN0aW5nUG9wb3ZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3Zlci1tb2RhbFwiKVxuICAgIGlmIChleGlzdGluZ1BvcG92ZXIpIGV4aXN0aW5nUG9wb3Zlci5wYXJlbnRFbGVtZW50IS5yZW1vdmVDaGlsZChleGlzdGluZ1BvcG92ZXIpXG5cbiAgICBjb25zdCBtb2RhbEJHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIG1vZGFsQkcuaWQgPSBcInBvcG92ZXItYmFja2dyb3VuZFwiXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbEJHKVxuXG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgbW9kYWwuaWQgPSBcInBvcG92ZXItbW9kYWxcIlxuICAgIGlmIChjbGFzc0xpc3QpIG1vZGFsLmNsYXNzTmFtZSA9IGNsYXNzTGlzdFxuXG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXG4gICAgY2xvc2VCdXR0b24uaW5uZXJUZXh0ID0gXCJDbG9zZVwiXG4gICAgY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZChcImNsb3NlXCIpXG4gICAgY2xvc2VCdXR0b24udGFiSW5kZXggPSAxXG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pXG5cbiAgICBjb25zdCBvbGRPbmtleURvd24gPSBkb2N1bWVudC5vbmtleWRvd25cblxuICAgIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgICAgbW9kYWxCRy5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZChtb2RhbEJHKVxuICAgICAgbW9kYWwucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQobW9kYWwpXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBvbGRPbmtleURvd25cbiAgICAgIHBvc3RGb2NhbEVsZW1lbnQuZm9jdXMoKVxuICAgIH1cblxuICAgIG1vZGFsQkcub25jbGljayA9IGNsb3NlXG4gICAgY2xvc2VCdXR0b24ub25jbGljayA9IGNsb3NlXG5cbiAgICAvLyBTdXBwb3J0IGhpZGluZyB0aGUgbW9kYWwgdmlhIGVzY2FwZVxuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IHdoZW5Fc2NhcGUoY2xvc2UpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKVxuXG4gICAgcmV0dXJuIG1vZGFsXG4gIH1cblxuICAvKiogRm9yIHNob3dpbmcgYSBsb3Qgb2YgY29kZSAqL1xuICBjb25zdCBzaG93TW9kYWwgPSAoXG4gICAgY29kZTogc3RyaW5nLFxuICAgIHBvc3RGb2NhbEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHN1YnRpdGxlPzogc3RyaW5nLFxuICAgIGxpbmtzPzogeyBbdGV4dDogc3RyaW5nXTogc3RyaW5nIH0sXG4gICAgZXZlbnQ/OiBSZWFjdC5Nb3VzZUV2ZW50XG4gICkgPT4ge1xuICAgIGNvbnN0IG1vZGFsID0gY3JlYXRlTW9kYWxPdmVybGF5KHBvc3RGb2NhbEVsZW1lbnQpXG4gICAgLy8gSSd2ZSBub3QgYmVlbiBhYmxlIHRvIGdldCB0aGlzIHRvIHdvcmsgaW4gYSB3YXkgd2hpY2hcbiAgICAvLyB3b3JrcyB3aXRoIGV2ZXJ5IHNjcmVlbnJlYWRlciBhbmQgYnJvd3NlciBjb21iaW5hdGlvbiwgc29cbiAgICAvLyBpbnN0ZWFkIEknbSBkcm9wcGluZyB0aGUgZmVhdHVyZS5cblxuICAgIGNvbnN0IGlzTm90TW91c2UgPSBmYWxzZSAvLyAgZXZlbnQgJiYgZXZlbnQuc2NyZWVuWCA9PT0gMCAmJiBldmVudC5zY3JlZW5ZID09PSAwXG5cbiAgICBpZiAoc3VidGl0bGUpIHtcbiAgICAgIGNvbnN0IHRpdGxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKVxuICAgICAgdGl0bGVFbGVtZW50LnRleHRDb250ZW50ID0gc3VidGl0bGVcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aXRsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImFsZXJ0XCIpXG4gICAgICB9LCAxMDApXG4gICAgICBtb2RhbC5hcHBlbmRDaGlsZCh0aXRsZUVsZW1lbnQpXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcbiAgICB0ZXh0YXJlYS5yZWFkT25seSA9IHRydWVcbiAgICB0ZXh0YXJlYS53cmFwID0gXCJvZmZcIlxuICAgIHRleHRhcmVhLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiMjBweFwiXG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgdGV4dGFyZWEudGV4dENvbnRlbnQgPSBjb2RlXG4gICAgdGV4dGFyZWEucm93cyA9IDYwXG5cbiAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG5cbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICAgIGNvcHlCdXR0b24uaW5uZXJUZXh0ID0gXCJDb3B5XCJcbiAgICBidXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoY29weUJ1dHRvbilcblxuICAgIGNvbnN0IHNlbGVjdEFsbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgICBzZWxlY3RBbGxCdXR0b24uaW5uZXJUZXh0ID0gXCJTZWxlY3QgQWxsXCJcbiAgICBidXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoc2VsZWN0QWxsQnV0dG9uKVxuXG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKVxuICAgIGNvbnN0IGNsb3NlID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKSBhcyBIVE1MRWxlbWVudFxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSBcIlRhYlwiKSB7XG4gICAgICAgIDsgKG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVwiKSBhcyBhbnkpLmZvY3VzKClcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmIChsaW5rcykge1xuICAgICAgT2JqZWN0LmtleXMobGlua3MpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IGhyZWYgPSBsaW5rc1tuYW1lXVxuICAgICAgICBjb25zdCBleHRyYUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgICAgICAgZXh0cmFCdXR0b24uaW5uZXJUZXh0ID0gbmFtZVxuICAgICAgICBleHRyYUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gKGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiBhcyBhbnkpXG4gICAgICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChleHRyYUJ1dHRvbilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0QWxsID0gKCkgPT4ge1xuICAgICAgdGV4dGFyZWEuc2VsZWN0KClcbiAgICB9XG5cbiAgICBjb25zdCBzaG91bGRBdXRvU2VsZWN0ID0gIWlzTm90TW91c2VcbiAgICBpZiAoc2hvdWxkQXV0b1NlbGVjdCkge1xuICAgICAgc2VsZWN0QWxsKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dGFyZWEuZm9jdXMoKVxuICAgIH1cblxuICAgIGNvbnN0IGJ1dHRvbnMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpXG4gICAgY29uc3QgbGFzdEJ1dHRvbiA9IGJ1dHRvbnMuaXRlbShidXR0b25zLmxlbmd0aCAtIDEpIGFzIEhUTUxFbGVtZW50XG4gICAgbGFzdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJUYWJcIikge1xuICAgICAgICA7IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpIGFzIGFueSkuZm9jdXMoKVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgc2VsZWN0QWxsQnV0dG9uLm9uY2xpY2sgPSBzZWxlY3RBbGxcbiAgICBjb3B5QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlTW9kYWxPdmVybGF5LFxuICAgIHNob3dNb2RhbCxcbiAgICBmbGFzaEluZm8sXG4gIH1cbn1cblxuLyoqXG4gKiBSdW5zIHRoZSBjbG9zdXJlIHdoZW4gZXNjYXBlIGlzIHRhcHBlZFxuICogQHBhcmFtIGZ1bmMgY2xvc3VyZSB0byBydW4gb24gZXNjYXBlIGJlaW5nIHByZXNzZWRcbiAqL1xuY29uc3Qgd2hlbkVzY2FwZSA9IChmdW5jOiAoKSA9PiB2b2lkKSA9PiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgY29uc3QgZXZ0ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50XG4gIGxldCBpc0VzY2FwZSA9IGZhbHNlXG4gIGlmIChcImtleVwiIGluIGV2dCkge1xuICAgIGlzRXNjYXBlID0gZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiB8fCBldnQua2V5ID09PSBcIkVzY1wiXG4gIH0gZWxzZSB7XG4gICAgLy8gQHRzLWlnbm9yZSAtIHRoaXMgdXNlZCB0byBiZSB0aGUgY2FzZVxuICAgIGlzRXNjYXBlID0gZXZ0LmtleUNvZGUgPT09IDI3XG4gIH1cbiAgaWYgKGlzRXNjYXBlKSB7XG4gICAgZnVuYygpXG4gIH1cbn1cbiJdfQ==