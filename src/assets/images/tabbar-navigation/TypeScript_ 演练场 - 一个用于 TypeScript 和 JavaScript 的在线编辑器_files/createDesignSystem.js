define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDesignSystem = void 0;
    const el = (str, elementType, container) => {
        const el = document.createElement(elementType);
        el.innerHTML = str;
        container.appendChild(el);
        return el;
    };
    // The Playground Plugin design system
    const createDesignSystem = (sandbox) => {
        const ts = sandbox.ts;
        return (container) => {
            const clear = () => {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            };
            let decorations = [];
            let decorationLock = false;
            const clearDeltaDecorators = (force) => {
                // console.log(`clearing, ${decorations.length}}`)
                // console.log(sandbox.editor.getModel()?.getAllDecorations())
                if (force) {
                    sandbox.editor.deltaDecorations(decorations, []);
                    decorations = [];
                    decorationLock = false;
                }
                else if (!decorationLock) {
                    sandbox.editor.deltaDecorations(decorations, []);
                    decorations = [];
                }
            };
            /** Lets a HTML Element hover to highlight code in the editor  */
            const addEditorHoverToElement = (element, pos, config) => {
                element.onmouseenter = () => {
                    if (!decorationLock) {
                        const model = sandbox.getModel();
                        const start = model.getPositionAt(pos.start);
                        const end = model.getPositionAt(pos.end);
                        decorations = sandbox.editor.deltaDecorations(decorations, [
                            {
                                range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                                options: { inlineClassName: "highlight-" + config.type },
                            },
                        ]);
                    }
                };
                element.onmouseleave = () => {
                    clearDeltaDecorators();
                };
            };
            const declareRestartRequired = (i) => {
                if (document.getElementById("restart-required"))
                    return;
                const localize = i || window.i;
                const li = document.createElement("li");
                li.id = "restart-required";
                const a = document.createElement("a");
                a.style.color = "#c63131";
                a.textContent = localize("play_sidebar_options_restart_required");
                a.href = "#";
                a.onclick = () => document.location.reload();
                const nav = document.getElementsByClassName("navbar-right")[0];
                li.appendChild(a);
                nav.insertBefore(li, nav.firstChild);
            };
            const localStorageOption = (setting) => {
                // Think about this as being something which you want enabled by default and can suppress whether
                // it should do something.
                const invertedLogic = setting.emptyImpliesEnabled;
                const li = document.createElement("li");
                const label = document.createElement("label");
                const split = setting.oneline ? "" : "<br/>";
                label.innerHTML = `<span>${setting.display}</span>${split}${setting.blurb}`;
                const key = setting.flag;
                const input = document.createElement("input");
                input.type = "checkbox";
                input.id = key;
                input.checked = invertedLogic ? !localStorage.getItem(key) : !!localStorage.getItem(key);
                input.onchange = () => {
                    if (input.checked) {
                        if (!invertedLogic)
                            localStorage.setItem(key, "true");
                        else
                            localStorage.removeItem(key);
                    }
                    else {
                        if (invertedLogic)
                            localStorage.setItem(key, "true");
                        else
                            localStorage.removeItem(key);
                    }
                    if (setting.onchange) {
                        setting.onchange(!!localStorage.getItem(key));
                    }
                    if (setting.requireRestart) {
                        declareRestartRequired();
                    }
                };
                label.htmlFor = input.id;
                li.appendChild(input);
                li.appendChild(label);
                container.appendChild(li);
                return li;
            };
            const button = (settings) => {
                const join = document.createElement("input");
                join.type = "button";
                join.value = settings.label;
                if (settings.onclick) {
                    join.onclick = settings.onclick;
                }
                container.appendChild(join);
                return join;
            };
            const code = (code) => {
                const createCodePre = document.createElement("pre");
                createCodePre.setAttribute("tabindex", "0");
                const codeElement = document.createElement("code");
                codeElement.innerHTML = code;
                createCodePre.appendChild(codeElement);
                container.appendChild(createCodePre);
                return codeElement;
            };
            const showEmptyScreen = (message) => {
                clear();
                const noErrorsMessage = document.createElement("div");
                noErrorsMessage.id = "empty-message-container";
                const messageDiv = document.createElement("div");
                messageDiv.textContent = message;
                messageDiv.classList.add("empty-plugin-message");
                noErrorsMessage.appendChild(messageDiv);
                container.appendChild(noErrorsMessage);
                return noErrorsMessage;
            };
            const createTabBar = () => {
                const tabBar = document.createElement("div");
                tabBar.classList.add("playground-plugin-tabview");
                /** Support left/right in the tab bar for accessibility */
                let tabFocus = 0;
                tabBar.addEventListener("keydown", e => {
                    const tabs = tabBar.querySelectorAll('[role="tab"]');
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
                container.appendChild(tabBar);
                return tabBar;
            };
            const createTabButton = (text) => {
                const element = document.createElement("button");
                element.setAttribute("role", "tab");
                element.textContent = text;
                return element;
            };
            const listDiags = (model, diags) => {
                const errorUL = document.createElement("ul");
                errorUL.className = "compiler-diagnostics";
                errorUL.onmouseleave = ev => {
                    clearDeltaDecorators();
                };
                container.appendChild(errorUL);
                diags.forEach(diag => {
                    const li = document.createElement("li");
                    li.classList.add("diagnostic");
                    switch (diag.category) {
                        case 0:
                            li.classList.add("warning");
                            break;
                        case 1:
                            li.classList.add("error");
                            break;
                        case 2:
                            li.classList.add("suggestion");
                            break;
                        case 3:
                            li.classList.add("message");
                            break;
                    }
                    if (typeof diag === "string") {
                        li.textContent = diag;
                    }
                    else {
                        li.textContent = sandbox.ts.flattenDiagnosticMessageText(diag.messageText, "\n", 4);
                    }
                    errorUL.appendChild(li);
                    if (diag.start && diag.length) {
                        addEditorHoverToElement(li, { start: diag.start, end: diag.start + diag.length }, { type: "error" });
                    }
                    li.onclick = () => {
                        if (diag.start && diag.length) {
                            const start = model.getPositionAt(diag.start);
                            sandbox.editor.revealLine(start.lineNumber);
                            const end = model.getPositionAt(diag.start + diag.length);
                            decorations = sandbox.editor.deltaDecorations(decorations, [
                                {
                                    range: new sandbox.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                                    options: { inlineClassName: "error-highlight", isWholeLine: true },
                                },
                            ]);
                            decorationLock = true;
                            setTimeout(() => {
                                decorationLock = false;
                                sandbox.editor.deltaDecorations(decorations, []);
                            }, 300);
                        }
                    };
                });
                return errorUL;
            };
            const showOptionList = (options, style) => {
                const ol = document.createElement("ol");
                ol.className = style.style === "separated" ? "playground-options" : "playground-options tight";
                options.forEach(option => {
                    if (style.style === "rows")
                        option.oneline = true;
                    if (style.requireRestart)
                        option.requireRestart = true;
                    const settingButton = localStorageOption(option);
                    ol.appendChild(settingButton);
                });
                container.appendChild(ol);
            };
            const createASTTree = (node, settings) => {
                const autoOpen = !settings || !settings.closedByDefault;
                const div = document.createElement("div");
                div.className = "ast";
                const infoForNode = (node) => {
                    const name = ts.SyntaxKind[node.kind];
                    return {
                        name,
                    };
                };
                const renderLiteralField = (key, value, info) => {
                    const li = document.createElement("li");
                    const typeofSpan = `ast-node-${typeof value}`;
                    let suffix = "";
                    if (key === "kind") {
                        suffix = ` (SyntaxKind.${info.name})`;
                    }
                    li.innerHTML = `${key}: <span class='${typeofSpan}'>${value}</span>${suffix}`;
                    return li;
                };
                const renderSingleChild = (key, value, depth) => {
                    const li = document.createElement("li");
                    li.innerHTML = `${key}: `;
                    renderItem(li, value, depth + 1);
                    return li;
                };
                const renderManyChildren = (key, nodes, depth) => {
                    const childers = document.createElement("div");
                    childers.classList.add("ast-children");
                    const li = document.createElement("li");
                    li.innerHTML = `${key}: [<br/>`;
                    childers.appendChild(li);
                    nodes.forEach(node => {
                        renderItem(childers, node, depth + 1);
                    });
                    const liEnd = document.createElement("li");
                    liEnd.innerHTML += "]";
                    childers.appendChild(liEnd);
                    return childers;
                };
                const renderItem = (parentElement, node, depth) => {
                    const itemDiv = document.createElement("div");
                    parentElement.appendChild(itemDiv);
                    itemDiv.className = "ast-tree-start";
                    itemDiv.attributes.setNamedItem;
                    // @ts-expect-error
                    itemDiv.dataset.pos = node.pos;
                    // @ts-expect-error
                    itemDiv.dataset.end = node.end;
                    // @ts-expect-error
                    itemDiv.dataset.depth = depth;
                    if (depth === 0 && autoOpen)
                        itemDiv.classList.add("open");
                    const info = infoForNode(node);
                    const a = document.createElement("a");
                    a.classList.add("node-name");
                    a.textContent = info.name;
                    itemDiv.appendChild(a);
                    a.onclick = _ => a.parentElement.classList.toggle("open");
                    addEditorHoverToElement(a, { start: node.pos, end: node.end }, { type: "info" });
                    const properties = document.createElement("ul");
                    properties.className = "ast-tree";
                    itemDiv.appendChild(properties);
                    Object.keys(node).forEach(field => {
                        if (typeof field === "function")
                            return;
                        if (field === "parent" || field === "flowNode")
                            return;
                        const value = node[field];
                        if (typeof value === "object" && Array.isArray(value) && value[0] && "pos" in value[0] && "end" in value[0]) {
                            //  Is an array of Nodes
                            properties.appendChild(renderManyChildren(field, value, depth));
                        }
                        else if (typeof value === "object" && "pos" in value && "end" in value) {
                            // Is a single child property
                            properties.appendChild(renderSingleChild(field, value, depth));
                        }
                        else {
                            properties.appendChild(renderLiteralField(field, value, info));
                        }
                    });
                };
                renderItem(div, node, 0);
                container.append(div);
                return div;
            };
            const createTextInput = (config) => {
                const form = document.createElement("form");
                const textbox = document.createElement("input");
                textbox.id = config.id;
                textbox.placeholder = config.placeholder;
                textbox.autocomplete = "off";
                textbox.autocapitalize = "off";
                textbox.spellcheck = false;
                // @ts-ignore
                textbox.autocorrect = "off";
                const localStorageKey = "playground-input-" + config.id;
                if (config.value) {
                    textbox.value = config.value;
                }
                else if (config.keepValueAcrossReloads) {
                    const storedQuery = localStorage.getItem(localStorageKey);
                    if (storedQuery)
                        textbox.value = storedQuery;
                }
                if (config.isEnabled) {
                    const enabled = config.isEnabled(textbox);
                    textbox.classList.add(enabled ? "good" : "bad");
                }
                else {
                    textbox.classList.add("good");
                }
                const textUpdate = (e) => {
                    const href = e.target.value.trim();
                    if (config.keepValueAcrossReloads) {
                        localStorage.setItem(localStorageKey, href);
                    }
                    if (config.onChanged)
                        config.onChanged(e.target.value, textbox);
                };
                textbox.style.width = "90%";
                textbox.style.height = "2rem";
                textbox.addEventListener("input", textUpdate);
                // Suppress the enter key
                textbox.onkeydown = (evt) => {
                    if (evt.key === "Enter" || evt.code === "Enter") {
                        config.onEnter(textbox.value, textbox);
                        return false;
                    }
                };
                form.appendChild(textbox);
                container.appendChild(form);
                return form;
            };
            const createSubDesignSystem = () => {
                const div = document.createElement("div");
                container.appendChild(div);
                const ds = (0, exports.createDesignSystem)(sandbox)(div);
                return ds;
            };
            return {
                /** The element of the design system */
                container,
                /** Clear the sidebar */
                clear,
                /** Present code in a pre > code  */
                code,
                /** Ideally only use this once, and maybe even prefer using subtitles everywhere */
                title: (title) => el(title, "h3", container),
                /** Used to denote sections, give info etc */
                subtitle: (subtitle) => el(subtitle, "h4", container),
                /** Used to show a paragraph */
                p: (subtitle) => el(subtitle, "p", container),
                /** When you can't do something, or have nothing to show */
                showEmptyScreen,
                /**
                 * Shows a list of hoverable, and selectable items (errors, highlights etc) which have code representation.
                 * The type is quite small, so it should be very feasible for you to massage other data to fit into this function
                 */
                listDiags,
                /** Lets you remove the hovers from listDiags etc */
                clearDeltaDecorators,
                /** Shows a single option in local storage (adds an li to the container BTW) */
                localStorageOption,
                /** Uses localStorageOption to create a list of options */
                showOptionList,
                /** Shows a full-width text input */
                createTextInput,
                /** Renders an AST tree */
                createASTTree,
                /** Creates an input button */
                button,
                /** Used to re-create a UI like the tab bar at the top of the plugins section */
                createTabBar,
                /** Used with createTabBar to add buttons */
                createTabButton,
                /** A general "restart your browser" message  */
                declareRestartRequired,
                /** Create a new Design System instance and add it to the container. You'll need to cast
                 * this after usage, because otherwise the type-system circularly references itself
                 */
                createSubDesignSystem,
            };
        };
    };
    exports.createDesignSystem = createDesignSystem;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGVzaWduU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvZHMvY3JlYXRlRGVzaWduU3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFtQkEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFXLEVBQUUsV0FBbUIsRUFBRSxTQUFrQixFQUFFLEVBQUU7UUFDbEUsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM5QyxFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQTtRQUNsQixTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3pCLE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQyxDQUFBO0lBSUQsc0NBQXNDO0lBQy9CLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDckQsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQTtRQUVyQixPQUFPLENBQUMsU0FBa0IsRUFBRSxFQUFFO1lBQzVCLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRTtnQkFDakIsT0FBTyxTQUFTLENBQUMsVUFBVSxFQUFFO29CQUMzQixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtpQkFDNUM7WUFDSCxDQUFDLENBQUE7WUFDRCxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUE7WUFDOUIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFBO1lBRTFCLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtnQkFDNUMsa0RBQWtEO2dCQUNsRCw4REFBOEQ7Z0JBQzlELElBQUksS0FBSyxFQUFFO29CQUNULE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO29CQUNoRCxXQUFXLEdBQUcsRUFBRSxDQUFBO29C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aEQsc0JBQXNCO2dCQUN0Qjs7bUJBRUc7Z0JBQ0gscUJBQXFCO2FBQ3RCLENBQUE7UUFDSCxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUE7SUF0ZVksUUFBQSxrQkFBa0Isc0JBc2U5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2FuZGJveCB9IGZyb20gXCJ0eXBlc2NyaXB0bGFuZy1vcmcvc3RhdGljL2pzL3NhbmRib3hcIlxuaW1wb3J0IHR5cGUgeyBEaWFnbm9zdGljUmVsYXRlZEluZm9ybWF0aW9uLCBOb2RlIH0gZnJvbSBcInR5cGVzY3JpcHRcIlxuXG5leHBvcnQgdHlwZSBMb2NhbFN0b3JhZ2VPcHRpb24gPSB7XG4gIGJsdXJiOiBzdHJpbmdcbiAgZmxhZzogc3RyaW5nXG4gIGRpc3BsYXk6IHN0cmluZ1xuXG4gIGVtcHR5SW1wbGllc0VuYWJsZWQ/OiB0cnVlXG4gIG9uZWxpbmU/OiB0cnVlXG4gIHJlcXVpcmVSZXN0YXJ0PzogdHJ1ZVxuICBvbmNoYW5nZT86IChuZXdWYWx1ZTogYm9vbGVhbikgPT4gdm9pZFxufVxuXG5leHBvcnQgdHlwZSBPcHRpb25zTGlzdENvbmZpZyA9IHtcbiAgc3R5bGU6IFwic2VwYXJhdGVkXCIgfCBcInJvd3NcIlxuICByZXF1aXJlUmVzdGFydD86IHRydWVcbn1cblxuY29uc3QgZWwgPSAoc3RyOiBzdHJpbmcsIGVsZW1lbnRUeXBlOiBzdHJpbmcsIGNvbnRhaW5lcjogRWxlbWVudCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGUpXG4gIGVsLmlubmVySFRNTCA9IHN0clxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpXG4gIHJldHVybiBlbFxufVxuXG5leHBvcnQgdHlwZSBEZXNpZ25TeXN0ZW0gPSBSZXR1cm5UeXBlPFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZURlc2lnblN5c3RlbT4+XG5cbi8vIFRoZSBQbGF5Z3JvdW5kIFBsdWdpbiBkZXNpZ24gc3lzdGVtXG5leHBvcnQgY29uc3QgY3JlYXRlRGVzaWduU3lzdGVtID0gKHNhbmRib3g6IFNhbmRib3gpID0+IHtcbiAgY29uc3QgdHMgPSBzYW5kYm94LnRzXG5cbiAgcmV0dXJuIChjb250YWluZXI6IEVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBjbGVhciA9ICgpID0+IHtcbiAgICAgIHdoaWxlIChjb250YWluZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICB9XG4gICAgfVxuICAgIGxldCBkZWNvcmF0aW9uczogc3RyaW5nW10gPSBbXVxuICAgIGxldCBkZWNvcmF0aW9uTG9jayA9IGZhbHNlXG5cbiAgICBjb25zdCBjbGVhckRlbHRhRGVjb3JhdG9ycyA9IChmb3JjZT86IHRydWUpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBjbGVhcmluZywgJHtkZWNvcmF0aW9ucy5sZW5ndGh9fWApXG4gICAgICAvLyBjb25zb2xlLmxvZyhzYW5kYm94LmVkaXRvci5nZXRNb2RlbCgpPy5nZXRBbGxEZWNvcmF0aW9ucygpKVxuICAgICAgaWYgKGZvcmNlKSB7XG4gICAgICAgIHNhbmRib3guZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoZGVjb3JhdGlvbnMsIFtdKVxuICAgICAgICBkZWNvcmF0aW9ucyA9IFtdXG4gICAgICAgIGRlY29yYXRpb25Mb2NrID0gZmFsc2VcbiAgICAgIH0gZWxzZSBpZiAoIWRlY29yYXRpb25Mb2NrKSB7XG4gICAgICAgIHNhbmRib3guZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoZGVjb3JhdGlvbnMsIFtdKVxuICAgICAgICBkZWNvcmF0aW9ucyA9IFtdXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIExldHMgYSBIVE1MIEVsZW1lbnQgaG92ZXIgdG8gaGlnaGxpZ2h0IGNvZGUgaW4gdGhlIGVkaXRvciAgKi9cbiAgICBjb25zdCBhZGRFZGl0b3JIb3ZlclRvRWxlbWVudCA9IChcbiAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgcG9zOiB7IHN0YXJ0OiBudW1iZXI7IGVuZDogbnVtYmVyIH0sXG4gICAgICBjb25maWc6IHsgdHlwZTogXCJlcnJvclwiIHwgXCJpbmZvXCIgfVxuICAgICkgPT4ge1xuICAgICAgZWxlbWVudC5vbm1vdXNlZW50ZXIgPSAoKSA9PiB7XG4gICAgICAgIGlmICghZGVjb3JhdGlvbkxvY2spIHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHNhbmRib3guZ2V0TW9kZWwoKVxuICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbW9kZWwuZ2V0UG9zaXRpb25BdChwb3Muc3RhcnQpXG4gICAgICAgICAgY29uc3QgZW5kID0gbW9kZWwuZ2V0UG9zaXRpb25BdChwb3MuZW5kKVxuXG4gICAgICAgICAgZGVjb3JhdGlvbnMgPSBzYW5kYm94LmVkaXRvci5kZWx0YURlY29yYXRpb25zKGRlY29yYXRpb25zLCBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbmdlOiBuZXcgc2FuZGJveC5tb25hY28uUmFuZ2Uoc3RhcnQubGluZU51bWJlciwgc3RhcnQuY29sdW1uLCBlbmQubGluZU51bWJlciwgZW5kLmNvbHVtbiksXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsgaW5saW5lQ2xhc3NOYW1lOiBcImhpZ2hsaWdodC1cIiArIGNvbmZpZy50eXBlIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5vbm1vdXNlbGVhdmUgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyRGVsdGFEZWNvcmF0b3JzKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkZWNsYXJlUmVzdGFydFJlcXVpcmVkID0gKGk/OiAoa2V5OiBzdHJpbmcpID0+IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdGFydC1yZXF1aXJlZFwiKSkgcmV0dXJuXG4gICAgICBjb25zdCBsb2NhbGl6ZSA9IGkgfHwgKHdpbmRvdyBhcyBhbnkpLmlcbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICBsaS5pZCA9IFwicmVzdGFydC1yZXF1aXJlZFwiXG5cbiAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgICAgYS5zdHlsZS5jb2xvciA9IFwiI2M2MzEzMVwiXG4gICAgICBhLnRleHRDb250ZW50ID0gbG9jYWxpemUoXCJwbGF5X3NpZGViYXJfb3B0aW9uc19yZXN0YXJ0X3JlcXVpcmVkXCIpXG4gICAgICBhLmhyZWYgPSBcIiNcIlxuICAgICAgYS5vbmNsaWNrID0gKCkgPT4gZG9jdW1lbnQubG9jYXRpb24ucmVsb2FkKClcblxuICAgICAgY29uc3QgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5hdmJhci1yaWdodFwiKVswXVxuICAgICAgbGkuYXBwZW5kQ2hpbGQoYSlcbiAgICAgIG5hdi5pbnNlcnRCZWZvcmUobGksIG5hdi5maXJzdENoaWxkKVxuICAgIH1cblxuICAgIGNvbnN0IGxvY2FsU3RvcmFnZU9wdGlvbiA9IChzZXR0aW5nOiBMb2NhbFN0b3JhZ2VPcHRpb24pID0+IHtcbiAgICAgIC8vIFRoaW5rIGFib3V0IHRoaXMgYXMgYmVpbmcgc29tZXRoaW5nIHdoaWNoIHlvdSB3YW50IGVuYWJsZWQgYnkgZGVmYXVsdCBhbmQgY2FuIHN1cHByZXNzIHdoZXRoZXJcbiAgICAgIC8vIGl0IHNob3VsZCBkbyBzb21ldGhpbmcuXG4gICAgICBjb25zdCBpbnZlcnRlZExvZ2ljID0gc2V0dGluZy5lbXB0eUltcGxpZXNFbmFibGVkXG5cbiAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKVxuICAgICAgY29uc3Qgc3BsaXQgPSBzZXR0aW5nLm9uZWxpbmUgPyBcIlwiIDogXCI8YnIvPlwiXG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSBgPHNwYW4+JHtzZXR0aW5nLmRpc3BsYXl9PC9zcGFuPiR7c3BsaXR9JHtzZXR0aW5nLmJsdXJifWBcblxuICAgICAgY29uc3Qga2V5ID0gc2V0dGluZy5mbGFnXG4gICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgICAgaW5wdXQudHlwZSA9IFwiY2hlY2tib3hcIlxuICAgICAgaW5wdXQuaWQgPSBrZXlcblxuICAgICAgaW5wdXQuY2hlY2tlZCA9IGludmVydGVkTG9naWMgPyAhbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSA6ICEhbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuXG4gICAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICBpZiAoIWludmVydGVkTG9naWMpIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgXCJ0cnVlXCIpXG4gICAgICAgICAgZWxzZSBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGludmVydGVkTG9naWMpIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgXCJ0cnVlXCIpXG4gICAgICAgICAgZWxzZSBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2V0dGluZy5vbmNoYW5nZSkge1xuICAgICAgICAgIHNldHRpbmcub25jaGFuZ2UoISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5nLnJlcXVpcmVSZXN0YXJ0KSB7XG4gICAgICAgICAgZGVjbGFyZVJlc3RhcnRSZXF1aXJlZCgpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGFiZWwuaHRtbEZvciA9IGlucHV0LmlkXG5cbiAgICAgIGxpLmFwcGVuZENoaWxkKGlucHV0KVxuICAgICAgbGkuYXBwZW5kQ2hpbGQobGFiZWwpXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGkpXG4gICAgICByZXR1cm4gbGlcbiAgICB9XG5cbiAgICBjb25zdCBidXR0b24gPSAoc2V0dGluZ3M6IHsgbGFiZWw6IHN0cmluZzsgb25jbGljaz86IChldjogTW91c2VFdmVudCkgPT4gdm9pZCB9KSA9PiB7XG4gICAgICBjb25zdCBqb2luID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgICBqb2luLnR5cGUgPSBcImJ1dHRvblwiXG4gICAgICBqb2luLnZhbHVlID0gc2V0dGluZ3MubGFiZWxcbiAgICAgIGlmIChzZXR0aW5ncy5vbmNsaWNrKSB7XG4gICAgICAgIGpvaW4ub25jbGljayA9IHNldHRpbmdzLm9uY2xpY2tcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGpvaW4pXG4gICAgICByZXR1cm4gam9pblxuICAgIH1cblxuICAgIGNvbnN0IGNvZGUgPSAoY29kZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBjcmVhdGVDb2RlUHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKVxuICAgICAgY3JlYXRlQ29kZVByZS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIilcbiAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNvZGVcIilcblxuICAgICAgY29kZUVsZW1lbnQuaW5uZXJIVE1MID0gY29kZVxuXG4gICAgICBjcmVhdGVDb2RlUHJlLmFwcGVuZENoaWxkKGNvZGVFbGVtZW50KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUNvZGVQcmUpXG5cbiAgICAgIHJldHVybiBjb2RlRWxlbWVudFxuICAgIH1cblxuICAgIGNvbnN0IHNob3dFbXB0eVNjcmVlbiA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNsZWFyKClcblxuICAgICAgY29uc3Qgbm9FcnJvcnNNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgbm9FcnJvcnNNZXNzYWdlLmlkID0gXCJlbXB0eS1tZXNzYWdlLWNvbnRhaW5lclwiXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICBtZXNzYWdlRGl2LnRleHRDb250ZW50ID0gbWVzc2FnZVxuICAgICAgbWVzc2FnZURpdi5jbGFzc0xpc3QuYWRkKFwiZW1wdHktcGx1Z2luLW1lc3NhZ2VcIilcbiAgICAgIG5vRXJyb3JzTWVzc2FnZS5hcHBlbmRDaGlsZChtZXNzYWdlRGl2KVxuXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9FcnJvcnNNZXNzYWdlKVxuICAgICAgcmV0dXJuIG5vRXJyb3JzTWVzc2FnZVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVRhYkJhciA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHRhYkJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgIHRhYkJhci5jbGFzc0xpc3QuYWRkKFwicGxheWdyb3VuZC1wbHVnaW4tdGFidmlld1wiKVxuXG4gICAgICAvKiogU3VwcG9ydCBsZWZ0L3JpZ2h0IGluIHRoZSB0YWIgYmFyIGZvciBhY2Nlc3NpYmlsaXR5ICovXG4gICAgICBsZXQgdGFiRm9jdXMgPSAwXG4gICAgICB0YWJCYXIuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSB0YWJCYXIucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJcIl0nKVxuICAgICAgICAvLyBNb3ZlIHJpZ2h0XG4gICAgICAgIGlmIChlLmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIgfHwgZS5rZXkgPT09IFwiQXJyb3dMZWZ0XCIpIHtcbiAgICAgICAgICB0YWJzW3RhYkZvY3VzXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpXG4gICAgICAgICAgaWYgKGUua2V5ID09PSBcIkFycm93UmlnaHRcIikge1xuICAgICAgICAgICAgdGFiRm9jdXMrK1xuICAgICAgICAgICAgLy8gSWYgd2UncmUgYXQgdGhlIGVuZCwgZ28gdG8gdGhlIHN0YXJ0XG4gICAgICAgICAgICBpZiAodGFiRm9jdXMgPj0gdGFicy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGFiRm9jdXMgPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNb3ZlIGxlZnRcbiAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkFycm93TGVmdFwiKSB7XG4gICAgICAgICAgICB0YWJGb2N1cy0tXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBhdCB0aGUgc3RhcnQsIG1vdmUgdG8gdGhlIGVuZFxuICAgICAgICAgICAgaWYgKHRhYkZvY3VzIDwgMCkge1xuICAgICAgICAgICAgICB0YWJGb2N1cyA9IHRhYnMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhYnNbdGFiRm9jdXNdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKVxuICAgICAgICAgIDsodGFic1t0YWJGb2N1c10gYXMgYW55KS5mb2N1cygpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWJCYXIpXG4gICAgICByZXR1cm4gdGFiQmFyXG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlVGFiQnV0dG9uID0gKHRleHQ6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYlwiKVxuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHRcbiAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdERpYWdzID0gKG1vZGVsOiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpLmVkaXRvci5JVGV4dE1vZGVsLCBkaWFnczogRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbltdKSA9PiB7XG4gICAgICBjb25zdCBlcnJvclVMID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpXG4gICAgICBlcnJvclVMLmNsYXNzTmFtZSA9IFwiY29tcGlsZXItZGlhZ25vc3RpY3NcIlxuICAgICAgZXJyb3JVTC5vbm1vdXNlbGVhdmUgPSBldiA9PiB7XG4gICAgICAgIGNsZWFyRGVsdGFEZWNvcmF0b3JzKClcbiAgICAgIH1cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvclVMKVxuXG4gICAgICBkaWFncy5mb3JFYWNoKGRpYWcgPT4ge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKFwiZGlhZ25vc3RpY1wiKVxuICAgICAgICBzd2l0Y2ggKGRpYWcuY2F0ZWdvcnkpIHtcbiAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKFwid2FybmluZ1wiKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcInN1Z2dlc3Rpb25cIilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcIm1lc3NhZ2VcIilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGRpYWcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBsaS50ZXh0Q29udGVudCA9IGRpYWdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaS50ZXh0Q29udGVudCA9IHNhbmRib3gudHMuZmxhdHRlbkRpYWdub3N0aWNNZXNzYWdlVGV4dChkaWFnLm1lc3NhZ2VUZXh0LCBcIlxcblwiLCA0KVxuICAgICAgICB9XG4gICAgICAgIGVycm9yVUwuYXBwZW5kQ2hpbGQobGkpXG5cbiAgICAgICAgaWYgKGRpYWcuc3RhcnQgJiYgZGlhZy5sZW5ndGgpIHtcbiAgICAgICAgICBhZGRFZGl0b3JIb3ZlclRvRWxlbWVudChsaSwgeyBzdGFydDogZGlhZy5zdGFydCwgZW5kOiBkaWFnLnN0YXJ0ICsgZGlhZy5sZW5ndGggfSwgeyB0eXBlOiBcImVycm9yXCIgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKGRpYWcuc3RhcnQgJiYgZGlhZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbW9kZWwuZ2V0UG9zaXRpb25BdChkaWFnLnN0YXJ0KVxuICAgICAgICAgICAgc2FuZGJveC5lZGl0b3IucmV2ZWFsTGluZShzdGFydC5saW5lTnVtYmVyKVxuXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBtb2RlbC5nZXRQb3NpdGlvbkF0KGRpYWcuc3RhcnQgKyBkaWFnLmxlbmd0aClcbiAgICAgICAgICAgIGRlY29yYXRpb25zID0gc2FuZGJveC5lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhkZWNvcmF0aW9ucywgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IG5ldyBzYW5kYm94Lm1vbmFjby5SYW5nZShzdGFydC5saW5lTnVtYmVyLCBzdGFydC5jb2x1bW4sIGVuZC5saW5lTnVtYmVyLCBlbmQuY29sdW1uKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7IGlubGluZUNsYXNzTmFtZTogXCJlcnJvci1oaWdobGlnaHRcIiwgaXNXaG9sZUxpbmU6IHRydWUgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICAgIGRlY29yYXRpb25Mb2NrID0gdHJ1ZVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGRlY29yYXRpb25Mb2NrID0gZmFsc2VcbiAgICAgICAgICAgICAgc2FuZGJveC5lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhkZWNvcmF0aW9ucywgW10pXG4gICAgICAgICAgICB9LCAzMDApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGVycm9yVUxcbiAgICB9XG5cbiAgICBjb25zdCBzaG93T3B0aW9uTGlzdCA9IChvcHRpb25zOiBMb2NhbFN0b3JhZ2VPcHRpb25bXSwgc3R5bGU6IE9wdGlvbnNMaXN0Q29uZmlnKSA9PiB7XG4gICAgICBjb25zdCBvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvbFwiKVxuICAgICAgb2wuY2xhc3NOYW1lID0gc3R5bGUuc3R5bGUgPT09IFwic2VwYXJhdGVkXCIgPyBcInBsYXlncm91bmQtb3B0aW9uc1wiIDogXCJwbGF5Z3JvdW5kLW9wdGlvbnMgdGlnaHRcIlxuXG4gICAgICBvcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgaWYgKHN0eWxlLnN0eWxlID09PSBcInJvd3NcIikgb3B0aW9uLm9uZWxpbmUgPSB0cnVlXG4gICAgICAgIGlmIChzdHlsZS5yZXF1aXJlUmVzdGFydCkgb3B0aW9uLnJlcXVpcmVSZXN0YXJ0ID0gdHJ1ZVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdCdXR0b24gPSBsb2NhbFN0b3JhZ2VPcHRpb24ob3B0aW9uKVxuICAgICAgICBvbC5hcHBlbmRDaGlsZChzZXR0aW5nQnV0dG9uKVxuICAgICAgfSlcblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG9sKVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZUFTVFRyZWUgPSAobm9kZTogTm9kZSwgc2V0dGluZ3M/OiB7IGNsb3NlZEJ5RGVmYXVsdD86IHRydWUgfSkgPT4ge1xuICAgICAgY29uc3QgYXV0b09wZW4gPSAhc2V0dGluZ3MgfHwgIXNldHRpbmdzLmNsb3NlZEJ5RGVmYXVsdFxuXG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICBkaXYuY2xhc3NOYW1lID0gXCJhc3RcIlxuXG4gICAgICBjb25zdCBpbmZvRm9yTm9kZSA9IChub2RlOiBOb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0cy5TeW50YXhLaW5kW25vZGUua2luZF1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWUsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdHlwZSBOb2RlSW5mbyA9IFJldHVyblR5cGU8dHlwZW9mIGluZm9Gb3JOb2RlPlxuXG4gICAgICBjb25zdCByZW5kZXJMaXRlcmFsRmllbGQgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGluZm86IE5vZGVJbmZvKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgIGNvbnN0IHR5cGVvZlNwYW4gPSBgYXN0LW5vZGUtJHt0eXBlb2YgdmFsdWV9YFxuICAgICAgICBsZXQgc3VmZml4ID0gXCJcIlxuICAgICAgICBpZiAoa2V5ID09PSBcImtpbmRcIikge1xuICAgICAgICAgIHN1ZmZpeCA9IGAgKFN5bnRheEtpbmQuJHtpbmZvLm5hbWV9KWBcbiAgICAgICAgfVxuICAgICAgICBsaS5pbm5lckhUTUwgPSBgJHtrZXl9OiA8c3BhbiBjbGFzcz0nJHt0eXBlb2ZTcGFufSc+JHt2YWx1ZX08L3NwYW4+JHtzdWZmaXh9YFxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVuZGVyU2luZ2xlQ2hpbGQgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBOb2RlLCBkZXB0aDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgIGxpLmlubmVySFRNTCA9IGAke2tleX06IGBcblxuICAgICAgICByZW5kZXJJdGVtKGxpLCB2YWx1ZSwgZGVwdGggKyAxKVxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVuZGVyTWFueUNoaWxkcmVuID0gKGtleTogc3RyaW5nLCBub2RlczogTm9kZVtdLCBkZXB0aDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBjaGlsZGVycy5jbGFzc0xpc3QuYWRkKFwiYXN0LWNoaWxkcmVuXCIpXG5cbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gYCR7a2V5fTogWzxici8+YFxuICAgICAgICBjaGlsZGVycy5hcHBlbmRDaGlsZChsaSlcblxuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgIHJlbmRlckl0ZW0oY2hpbGRlcnMsIG5vZGUsIGRlcHRoICsgMSlcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCBsaUVuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICBsaUVuZC5pbm5lckhUTUwgKz0gXCJdXCJcbiAgICAgICAgY2hpbGRlcnMuYXBwZW5kQ2hpbGQobGlFbmQpXG4gICAgICAgIHJldHVybiBjaGlsZGVyc1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZW5kZXJJdGVtID0gKHBhcmVudEVsZW1lbnQ6IEVsZW1lbnQsIG5vZGU6IE5vZGUsIGRlcHRoOiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3QgaXRlbURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChpdGVtRGl2KVxuICAgICAgICBpdGVtRGl2LmNsYXNzTmFtZSA9IFwiYXN0LXRyZWUtc3RhcnRcIlxuICAgICAgICBpdGVtRGl2LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgaXRlbURpdi5kYXRhc2V0LnBvcyA9IG5vZGUucG9zXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgaXRlbURpdi5kYXRhc2V0LmVuZCA9IG5vZGUuZW5kXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgaXRlbURpdi5kYXRhc2V0LmRlcHRoID0gZGVwdGhcblxuICAgICAgICBpZiAoZGVwdGggPT09IDAgJiYgYXV0b09wZW4pIGl0ZW1EaXYuY2xhc3NMaXN0LmFkZChcIm9wZW5cIilcblxuICAgICAgICBjb25zdCBpbmZvID0gaW5mb0Zvck5vZGUobm9kZSlcblxuICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgICAgICAgYS5jbGFzc0xpc3QuYWRkKFwibm9kZS1uYW1lXCIpXG4gICAgICAgIGEudGV4dENvbnRlbnQgPSBpbmZvLm5hbWVcbiAgICAgICAgaXRlbURpdi5hcHBlbmRDaGlsZChhKVxuICAgICAgICBhLm9uY2xpY2sgPSBfID0+IGEucGFyZW50RWxlbWVudCEuY2xhc3NMaXN0LnRvZ2dsZShcIm9wZW5cIilcbiAgICAgICAgYWRkRWRpdG9ySG92ZXJUb0VsZW1lbnQoYSwgeyBzdGFydDogbm9kZS5wb3MsIGVuZDogbm9kZS5lbmQgfSwgeyB0eXBlOiBcImluZm9cIiB9KVxuXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIilcbiAgICAgICAgcHJvcGVydGllcy5jbGFzc05hbWUgPSBcImFzdC10cmVlXCJcbiAgICAgICAgaXRlbURpdi5hcHBlbmRDaGlsZChwcm9wZXJ0aWVzKVxuXG4gICAgICAgIE9iamVjdC5rZXlzKG5vZGUpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuXG4gICAgICAgICAgaWYgKGZpZWxkID09PSBcInBhcmVudFwiIHx8IGZpZWxkID09PSBcImZsb3dOb2RlXCIpIHJldHVyblxuXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSAobm9kZSBhcyBhbnkpW2ZpZWxkXVxuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWVbMF0gJiYgXCJwb3NcIiBpbiB2YWx1ZVswXSAmJiBcImVuZFwiIGluIHZhbHVlWzBdKSB7XG4gICAgICAgICAgICAvLyAgSXMgYW4gYXJyYXkgb2YgTm9kZXNcbiAgICAgICAgICAgIHByb3BlcnRpZXMuYXBwZW5kQ2hpbGQocmVuZGVyTWFueUNoaWxkcmVuKGZpZWxkLCB2YWx1ZSwgZGVwdGgpKVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIFwicG9zXCIgaW4gdmFsdWUgJiYgXCJlbmRcIiBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgLy8gSXMgYSBzaW5nbGUgY2hpbGQgcHJvcGVydHlcbiAgICAgICAgICAgIHByb3BlcnRpZXMuYXBwZW5kQ2hpbGQocmVuZGVyU2luZ2xlQ2hpbGQoZmllbGQsIHZhbHVlLCBkZXB0aCkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuYXBwZW5kQ2hpbGQocmVuZGVyTGl0ZXJhbEZpZWxkKGZpZWxkLCB2YWx1ZSwgaW5mbykpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZW5kZXJJdGVtKGRpdiwgbm9kZSwgMClcbiAgICAgIGNvbnRhaW5lci5hcHBlbmQoZGl2KVxuICAgICAgcmV0dXJuIGRpdlxuICAgIH1cblxuICAgIHR5cGUgVGV4dElucHV0Q29uZmlnID0ge1xuICAgICAgaWQ6IHN0cmluZ1xuICAgICAgcGxhY2Vob2xkZXI6IHN0cmluZ1xuXG4gICAgICBvbkNoYW5nZWQ/OiAodGV4dDogc3RyaW5nLCBpbnB1dDogSFRNTElucHV0RWxlbWVudCkgPT4gdm9pZFxuICAgICAgb25FbnRlcjogKHRleHQ6IHN0cmluZywgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQpID0+IHZvaWRcblxuICAgICAgdmFsdWU/OiBzdHJpbmdcbiAgICAgIGtlZXBWYWx1ZUFjcm9zc1JlbG9hZHM/OiB0cnVlXG4gICAgICBpc0VuYWJsZWQ/OiAoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQpID0+IGJvb2xlYW5cbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVUZXh0SW5wdXQgPSAoY29uZmlnOiBUZXh0SW5wdXRDb25maWcpID0+IHtcbiAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKVxuXG4gICAgICBjb25zdCB0ZXh0Ym94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgICB0ZXh0Ym94LmlkID0gY29uZmlnLmlkXG4gICAgICB0ZXh0Ym94LnBsYWNlaG9sZGVyID0gY29uZmlnLnBsYWNlaG9sZGVyXG4gICAgICB0ZXh0Ym94LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCJcbiAgICAgIHRleHRib3guYXV0b2NhcGl0YWxpemUgPSBcIm9mZlwiXG4gICAgICB0ZXh0Ym94LnNwZWxsY2hlY2sgPSBmYWxzZVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGV4dGJveC5hdXRvY29ycmVjdCA9IFwib2ZmXCJcblxuICAgICAgY29uc3QgbG9jYWxTdG9yYWdlS2V5ID0gXCJwbGF5Z3JvdW5kLWlucHV0LVwiICsgY29uZmlnLmlkXG5cbiAgICAgIGlmIChjb25maWcudmFsdWUpIHtcbiAgICAgICAgdGV4dGJveC52YWx1ZSA9IGNvbmZpZy52YWx1ZVxuICAgICAgfSBlbHNlIGlmIChjb25maWcua2VlcFZhbHVlQWNyb3NzUmVsb2Fkcykge1xuICAgICAgICBjb25zdCBzdG9yZWRRdWVyeSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUtleSlcbiAgICAgICAgaWYgKHN0b3JlZFF1ZXJ5KSB0ZXh0Ym94LnZhbHVlID0gc3RvcmVkUXVlcnlcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmZpZy5pc0VuYWJsZWQpIHtcbiAgICAgICAgY29uc3QgZW5hYmxlZCA9IGNvbmZpZy5pc0VuYWJsZWQodGV4dGJveClcbiAgICAgICAgdGV4dGJveC5jbGFzc0xpc3QuYWRkKGVuYWJsZWQgPyBcImdvb2RcIiA6IFwiYmFkXCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0Ym94LmNsYXNzTGlzdC5hZGQoXCJnb29kXCIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHRVcGRhdGUgPSAoZTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGhyZWYgPSBlLnRhcmdldC52YWx1ZS50cmltKClcbiAgICAgICAgaWYgKGNvbmZpZy5rZWVwVmFsdWVBY3Jvc3NSZWxvYWRzKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlS2V5LCBocmVmKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWcub25DaGFuZ2VkKSBjb25maWcub25DaGFuZ2VkKGUudGFyZ2V0LnZhbHVlLCB0ZXh0Ym94KVxuICAgICAgfVxuXG4gICAgICB0ZXh0Ym94LnN0eWxlLndpZHRoID0gXCI5MCVcIlxuICAgICAgdGV4dGJveC5zdHlsZS5oZWlnaHQgPSBcIjJyZW1cIlxuICAgICAgdGV4dGJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgdGV4dFVwZGF0ZSlcblxuICAgICAgLy8gU3VwcHJlc3MgdGhlIGVudGVyIGtleVxuICAgICAgdGV4dGJveC5vbmtleWRvd24gPSAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldnQua2V5ID09PSBcIkVudGVyXCIgfHwgZXZ0LmNvZGUgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgIGNvbmZpZy5vbkVudGVyKHRleHRib3gudmFsdWUsIHRleHRib3gpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9ybS5hcHBlbmRDaGlsZCh0ZXh0Ym94KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm0pXG4gICAgICByZXR1cm4gZm9ybVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVN1YkRlc2lnblN5c3RlbSA9ICgpOiBhbnkgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdilcbiAgICAgIGNvbnN0IGRzID0gY3JlYXRlRGVzaWduU3lzdGVtKHNhbmRib3gpKGRpdilcbiAgICAgIHJldHVybiBkc1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAvKiogVGhlIGVsZW1lbnQgb2YgdGhlIGRlc2lnbiBzeXN0ZW0gKi9cbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIC8qKiBDbGVhciB0aGUgc2lkZWJhciAqL1xuICAgICAgY2xlYXIsXG4gICAgICAvKiogUHJlc2VudCBjb2RlIGluIGEgcHJlID4gY29kZSAgKi9cbiAgICAgIGNvZGUsXG4gICAgICAvKiogSWRlYWxseSBvbmx5IHVzZSB0aGlzIG9uY2UsIGFuZCBtYXliZSBldmVuIHByZWZlciB1c2luZyBzdWJ0aXRsZXMgZXZlcnl3aGVyZSAqL1xuICAgICAgdGl0bGU6ICh0aXRsZTogc3RyaW5nKSA9PiBlbCh0aXRsZSwgXCJoM1wiLCBjb250YWluZXIpLFxuICAgICAgLyoqIFVzZWQgdG8gZGVub3RlIHNlY3Rpb25zLCBnaXZlIGluZm8gZXRjICovXG4gICAgICBzdWJ0aXRsZTogKHN1YnRpdGxlOiBzdHJpbmcpID0+IGVsKHN1YnRpdGxlLCBcImg0XCIsIGNvbnRhaW5lciksXG4gICAgICAvKiogVXNlZCB0byBzaG93IGEgcGFyYWdyYXBoICovXG4gICAgICBwOiAoc3VidGl0bGU6IHN0cmluZykgPT4gZWwoc3VidGl0bGUsIFwicFwiLCBjb250YWluZXIpLFxuICAgICAgLyoqIFdoZW4geW91IGNhbid0IGRvIHNvbWV0aGluZywgb3IgaGF2ZSBub3RoaW5nIHRvIHNob3cgKi9cbiAgICAgIHNob3dFbXB0eVNjcmVlbixcbiAgICAgIC8qKlxuICAgICAgICogU2hvd3MgYSBsaXN0IG9mIGhvdmVyYWJsZSwgYW5kIHNlbGVjdGFibGUgaXRlbXMgKGVycm9ycywgaGlnaGxpZ2h0cyBldGMpIHdoaWNoIGhhdmUgY29kZSByZXByZXNlbnRhdGlvbi5cbiAgICAgICAqIFRoZSB0eXBlIGlzIHF1aXRlIHNtYWxsLCBzbyBpdCBzaG91bGQgYmUgdmVyeSBmZWFzaWJsZSBmb3IgeW91IHRvIG1hc3NhZ2Ugb3RoZXIgZGF0YSB0byBmaXQgaW50byB0aGlzIGZ1bmN0aW9uXG4gICAgICAgKi9cbiAgICAgIGxpc3REaWFncyxcbiAgICAgIC8qKiBMZXRzIHlvdSByZW1vdmUgdGhlIGhvdmVycyBmcm9tIGxpc3REaWFncyBldGMgKi9cbiAgICAgIGNsZWFyRGVsdGFEZWNvcmF0b3JzLFxuICAgICAgLyoqIFNob3dzIGEgc2luZ2xlIG9wdGlvbiBpbiBsb2NhbCBzdG9yYWdlIChhZGRzIGFuIGxpIHRvIHRoZSBjb250YWluZXIgQlRXKSAqL1xuICAgICAgbG9jYWxTdG9yYWdlT3B0aW9uLFxuICAgICAgLyoqIFVzZXMgbG9jYWxTdG9yYWdlT3B0aW9uIHRvIGNyZWF0ZSBhIGxpc3Qgb2Ygb3B0aW9ucyAqL1xuICAgICAgc2hvd09wdGlvbkxpc3QsXG4gICAgICAvKiogU2hvd3MgYSBmdWxsLXdpZHRoIHRleHQgaW5wdXQgKi9cbiAgICAgIGNyZWF0ZVRleHRJbnB1dCxcbiAgICAgIC8qKiBSZW5kZXJzIGFuIEFTVCB0cmVlICovXG4gICAgICBjcmVhdGVBU1RUcmVlLFxuICAgICAgLyoqIENyZWF0ZXMgYW4gaW5wdXQgYnV0dG9uICovXG4gICAgICBidXR0b24sXG4gICAgICAvKiogVXNlZCB0byByZS1jcmVhdGUgYSBVSSBsaWtlIHRoZSB0YWIgYmFyIGF0IHRoZSB0b3Agb2YgdGhlIHBsdWdpbnMgc2VjdGlvbiAqL1xuICAgICAgY3JlYXRlVGFiQmFyLFxuICAgICAgLyoqIFVzZWQgd2l0aCBjcmVhdGVUYWJCYXIgdG8gYWRkIGJ1dHRvbnMgKi9cbiAgICAgIGNyZWF0ZVRhYkJ1dHRvbixcbiAgICAgIC8qKiBBIGdlbmVyYWwgXCJyZXN0YXJ0IHlvdXIgYnJvd3NlclwiIG1lc3NhZ2UgICovXG4gICAgICBkZWNsYXJlUmVzdGFydFJlcXVpcmVkLFxuICAgICAgLyoqIENyZWF0ZSBhIG5ldyBEZXNpZ24gU3lzdGVtIGluc3RhbmNlIGFuZCBhZGQgaXQgdG8gdGhlIGNvbnRhaW5lci4gWW91J2xsIG5lZWQgdG8gY2FzdFxuICAgICAgICogdGhpcyBhZnRlciB1c2FnZSwgYmVjYXVzZSBvdGhlcndpc2UgdGhlIHR5cGUtc3lzdGVtIGNpcmN1bGFybHkgcmVmZXJlbmNlcyBpdHNlbGZcbiAgICAgICAqL1xuICAgICAgY3JlYXRlU3ViRGVzaWduU3lzdGVtLFxuICAgIH1cbiAgfVxufVxuIl19