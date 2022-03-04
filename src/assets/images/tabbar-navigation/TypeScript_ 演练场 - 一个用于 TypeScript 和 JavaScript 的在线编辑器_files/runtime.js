define(["require", "exports", "../createUI", "../localizeWithFallback"], function (require, exports, createUI_1, localizeWithFallback_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runWithCustomLogs = exports.clearLogs = exports.runPlugin = void 0;
    let allLogs = [];
    let addedClearAction = false;
    const cancelButtonSVG = `
<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="6" cy="7" r="5" stroke-width="2"/>
<line x1="0.707107" y1="1.29289" x2="11.7071" y2="12.2929" stroke-width="2"/>
</svg>
`;
    const runPlugin = (i, utils) => {
        const plugin = {
            id: "logs",
            displayName: i("play_sidebar_logs"),
            willMount: (sandbox, container) => {
                const ui = (0, createUI_1.createUI)();
                const clearLogsAction = {
                    id: "clear-logs-play",
                    label: "Clear Playground Logs",
                    keybindings: [sandbox.monaco.KeyMod.CtrlCmd | sandbox.monaco.KeyCode.KEY_K],
                    contextMenuGroupId: "run",
                    contextMenuOrder: 1.5,
                    run: function () {
                        (0, exports.clearLogs)();
                        ui.flashInfo(i("play_clear_logs"));
                    },
                };
                if (!addedClearAction) {
                    sandbox.editor.addAction(clearLogsAction);
                    addedClearAction = true;
                }
                const errorUL = document.createElement("div");
                errorUL.id = "log-container";
                container.appendChild(errorUL);
                const logs = document.createElement("div");
                logs.id = "log";
                logs.innerHTML = allLogs.join("<hr />");
                errorUL.appendChild(logs);
                const logToolsContainer = document.createElement("div");
                logToolsContainer.id = "log-tools";
                container.appendChild(logToolsContainer);
                const clearLogsButton = document.createElement("div");
                clearLogsButton.id = "clear-logs-button";
                clearLogsButton.innerHTML = cancelButtonSVG;
                clearLogsButton.onclick = e => {
                    e.preventDefault();
                    clearLogsAction.run();
                    const filterTextBox = document.getElementById("filter-logs");
                    filterTextBox.value = "";
                };
                logToolsContainer.appendChild(clearLogsButton);
                const filterTextBox = document.createElement("input");
                filterTextBox.id = "filter-logs";
                filterTextBox.placeholder = i("play_sidebar_tools_filter_placeholder");
                filterTextBox.addEventListener("input", (e) => {
                    const inputText = e.target.value;
                    const eleLog = document.getElementById("log");
                    eleLog.innerHTML = allLogs
                        .filter(log => {
                        const userLoggedText = log.substring(log.indexOf(":") + 1, log.indexOf("&nbsp;<br>"));
                        return userLoggedText.includes(inputText);
                    })
                        .join("<hr />");
                    if (inputText === "") {
                        const logContainer = document.getElementById("log-container");
                        logContainer.scrollTop = logContainer.scrollHeight;
                    }
                });
                logToolsContainer.appendChild(filterTextBox);
                if (allLogs.length === 0) {
                    const noErrorsMessage = document.createElement("div");
                    noErrorsMessage.id = "empty-message-container";
                    container.appendChild(noErrorsMessage);
                    const message = document.createElement("div");
                    message.textContent = (0, localizeWithFallback_1.localize)("play_sidebar_logs_no_logs", "No logs");
                    message.classList.add("empty-plugin-message");
                    noErrorsMessage.appendChild(message);
                    errorUL.style.display = "none";
                    logToolsContainer.style.display = "none";
                }
            },
        };
        return plugin;
    };
    exports.runPlugin = runPlugin;
    const clearLogs = () => {
        allLogs = [];
        const logs = document.getElementById("log");
        if (logs) {
            logs.textContent = "";
        }
    };
    exports.clearLogs = clearLogs;
    const runWithCustomLogs = (closure, i) => {
        const noLogs = document.getElementById("empty-message-container");
        const logContainer = document.getElementById("log-container");
        const logToolsContainer = document.getElementById("log-tools");
        if (noLogs) {
            noLogs.style.display = "none";
            logContainer.style.display = "block";
            logToolsContainer.style.display = "flex";
        }
        rewireLoggingToElement(() => document.getElementById("log"), () => document.getElementById("log-container"), closure, true, i);
    };
    exports.runWithCustomLogs = runWithCustomLogs;
    // Thanks SO: https://stackoverflow.com/questions/20256760/javascript-console-log-to-html/35449256#35449256
    function rewireLoggingToElement(eleLocator, eleOverflowLocator, closure, autoScroll, i) {
        const rawConsole = console;
        closure.then(js => {
            const replace = {};
            bindLoggingFunc(replace, rawConsole, "log", "LOG");
            bindLoggingFunc(replace, rawConsole, "debug", "DBG");
            bindLoggingFunc(replace, rawConsole, "warn", "WRN");
            bindLoggingFunc(replace, rawConsole, "error", "ERR");
            replace["clear"] = exports.clearLogs;
            const console = Object.assign({}, rawConsole, replace);
            try {
                const safeJS = sanitizeJS(js);
                eval(safeJS);
            }
            catch (error) {
                console.error(i("play_run_js_fail"));
                console.error(error);
                if (error instanceof SyntaxError && /\bexport\b/u.test(error.message)) {
                    console.warn('Tip: Change the Module setting to "CommonJS" in TS Config settings to allow top-level exports to work in the Playground');
                }
            }
        });
        function bindLoggingFunc(obj, raw, name, id) {
            obj[name] = function (...objs) {
                const output = produceOutput(objs);
                const eleLog = eleLocator();
                const prefix = `[<span class="log-${name}">${id}</span>]: `;
                const eleContainerLog = eleOverflowLocator();
                allLogs.push(`${prefix}${output}<br>`);
                eleLog.innerHTML = allLogs.join("<hr />");
                if (autoScroll && eleContainerLog) {
                    eleContainerLog.scrollTop = eleContainerLog.scrollHeight;
                }
                raw[name](...objs);
            };
        }
        // Inline constants which are switched out at the end of processing
        const replacers = {
            "<span class='literal'>null</span>": "1231232131231231423434534534",
            "<span class='literal'>undefined</span>": "4534534534563567567567",
            "<span class='comma'>, </span>": "785y8345873485763874568734y535438"
        };
        const objectToText = (arg) => {
            const isObj = typeof arg === "object";
            let textRep = "";
            if (arg && arg.stack && arg.message) {
                // special case for err
                textRep = htmlEscape(arg.message);
            }
            else if (arg === null) {
                textRep = replacers["<span class='literal'>null</span>"];
            }
            else if (arg === undefined) {
                textRep = replacers["<span class='literal'>undefined</span>"];
            }
            else if (typeof arg === "symbol") {
                textRep = `<span class='literal'>${htmlEscape(String(arg))}</span>`;
            }
            else if (Array.isArray(arg)) {
                textRep = "[" + arg.map(objectToText).join(replacers["<span class='comma'>, </span>"]) + "]";
            }
            else if (arg instanceof Set) {
                const setIter = [...arg];
                textRep = `Set (${arg.size}) {` + setIter.map(objectToText).join(replacers["<span class='comma'>, </span>"]) + "}";
            }
            else if (arg instanceof Map) {
                const mapIter = [...arg.entries()];
                textRep =
                    `Map (${arg.size}) {` +
                        mapIter.map(([k, v]) => `${objectToText(k)} => ${objectToText(v)}`).join(replacers["<span class='comma'>, </span>"]) +
                        "}";
            }
            else if (typeof arg === "string") {
                textRep = '"' + htmlEscape(arg) + '"';
            }
            else if (isObj) {
                const name = arg.constructor && arg.constructor.name;
                // No one needs to know an obj is an obj
                const nameWithoutObject = name && name === "Object" ? "" : htmlEscape(name);
                const prefix = nameWithoutObject ? `${nameWithoutObject}: ` : "";
                // JSON.stringify omits any keys with a value of undefined. To get around this, we replace undefined with the text __undefined__ and then do a global replace using regex back to keyword undefined
                textRep =
                    prefix +
                        JSON.stringify(arg, (_, value) => (value === undefined ? "__undefined__" : value), 2).replace(/"__undefined__"/g, "undefined");
                textRep = htmlEscape(textRep);
            }
            else {
                textRep = htmlEscape(String(arg));
            }
            return textRep;
        };
        function produceOutput(args) {
            let result = args.reduce((output, arg, index) => {
                const textRep = objectToText(arg);
                const showComma = index !== args.length - 1;
                const comma = showComma ? "<span class='comma'>, </span>" : "";
                return output + textRep + comma + " ";
            }, "");
            Object.keys(replacers).forEach(k => {
                result = result.replace(new RegExp(replacers[k], "g"), k);
            });
            return result;
        }
    }
    // The reflect-metadata runtime is available, so allow that to go through
    function sanitizeJS(code) {
        return code.replace(`import "reflect-metadata"`, "").replace(`require("reflect-metadata")`, "");
    }
    function htmlEscape(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvcnVudGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBS0EsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFBO0lBQzFCLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0lBQzVCLE1BQU0sZUFBZSxHQUFHOzs7OztDQUt2QixDQUFBO0lBRU0sTUFBTSxTQUFTLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25ELE1BQU0sTUFBTSxHQUFxQjtZQUMvQixFQUFFLEVBQUUsTUFBTTtZQUNWLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUM7WUFDbkMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFO2dCQUNoQyxNQUFNLEVBQUUsR0FBRyxJQUFBLG1CQUFRLEdBQUUsQ0FBQTtnQkFFckIsTUFBTSxlQUFlLEdBQUc7b0JBQ3RCLEVBQUUsRUFBRSxpQkFBaUI7b0JBQ3JCLEtBQUssRUFBRSx1QkFBdUI7b0JBQzlCLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBRTNFLGtCQUFrQixFQUFFLEtBQUs7b0JBQ3pCLGdCQUFnQixFQUFFLEdBQUc7b0JBRXJCLEdBQUcsRUFBRTt3QkFDSCxJQUFBLGlCQUFTLEdBQUUsQ0FBQTt3QkFDWCxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7b0JBQ3BDLENBQUM7aUJBQ0YsQ0FBQTtnQkFFRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO29CQUN6QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7aUJBQ3hCO2dCQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQzdDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFBO2dCQUM1QixTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUU5QixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUMxQyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQTtnQkFDZixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQ3ZDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXpCLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDdkQsaUJBQWlCLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQTtnQkFDbEMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO2dCQUV4QyxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNyRCxlQUFlLENBQUMsRUFBRSxHQUFHLG1CQUFtQixDQUFBO2dCQUN4QyxlQUFlLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQTtnQkFDM0MsZUFBZSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDNUIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO29CQUNsQixlQUFlLENBQUMsR0FBRyxFQUFFLENBQUE7b0JBRXJCLE1BQU0sYUFBYSxHQUFRLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUE7b0JBQ2pFLGFBQWMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO2dCQUMzQixDQUFDLENBQUE7Z0JBQ0QsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFBO2dCQUU5QyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNyRCxhQUFhLENBQUMsRUFBRSxHQUFHLGFBQWEsQ0FBQTtnQkFDaEMsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtnQkFDdEUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFO29CQUNqRCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtvQkFFaEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUUsQ0FBQTtvQkFDOUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPO3lCQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ1osTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7d0JBQ3JGLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFDM0MsQ0FBQyxDQUFDO3lCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFFakIsSUFBSSxTQUFTLEtBQUssRUFBRSxFQUFFO3dCQUNwQixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBRSxDQUFBO3dCQUM5RCxZQUFZLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUE7cUJBQ25EO2dCQUNILENBQUMsQ0FBQyxDQUFBO2dCQUNGLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtnQkFFNUMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDeEIsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDckQsZUFBZSxDQUFDLEVBQUUsR0FBRyx5QkFBeUIsQ0FBQTtvQkFDOUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtvQkFFdEMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDN0MsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFBLCtCQUFRLEVBQUMsMkJBQTJCLEVBQUUsU0FBUyxDQUFDLENBQUE7b0JBQ3RFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7b0JBQzdDLGVBQWUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBRXBDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQTtvQkFDOUIsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7aUJBQ3pDO1lBQ0gsQ0FBQztTQUNGLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQTtJQXpGWSxRQUFBLFNBQVMsYUF5RnJCO0lBRU0sTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO1FBQzVCLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDWixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNDLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7U0FDdEI7SUFDSCxDQUFDLENBQUE7SUFOWSxRQUFBLFNBQVMsYUFNckI7SUFFTSxNQUFNLGlCQUFpQixHQUFHLENBQUMsT0FBd0IsRUFBRSxDQUFXLEVBQUUsRUFBRTtRQUN6RSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDakUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUUsQ0FBQTtRQUM5RCxNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFFLENBQUE7UUFDL0QsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7WUFDN0IsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1lBQ3BDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO1NBQ3pDO1FBRUQsc0JBQXNCLENBQ3BCLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFFLEVBQ3JDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFFLEVBQy9DLE9BQU8sRUFDUCxJQUFJLEVBQ0osQ0FBQyxDQUNGLENBQUE7SUFDSCxDQUFDLENBQUE7SUFqQlksUUFBQSxpQkFBaUIscUJBaUI3QjtJQUVELDJHQUEyRztJQUUzRyxTQUFTLHNCQUFzQixDQUM3QixVQUF5QixFQUN6QixrQkFBaUMsRUFDakMsT0FBd0IsRUFDeEIsVUFBbUIsRUFDbkIsQ0FBVztRQUVYLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQTtRQUUxQixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2hCLE1BQU0sT0FBTyxHQUFHLEVBQVMsQ0FBQTtZQUN6QixlQUFlLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDbEQsZUFBZSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ3BELGVBQWUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUNuRCxlQUFlLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGlCQUFTLENBQUE7WUFDNUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3RELElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDYjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtnQkFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFFcEIsSUFBSSxLQUFLLFlBQVksV0FBVyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNyRSxPQUFPLENBQUMsSUFBSSxDQUNWLHlIQUF5SCxDQUMxSCxDQUFBO2lCQUNGO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLFNBQVMsZUFBZSxDQUFDLEdBQVEsRUFBRSxHQUFRLEVBQUUsSUFBWSxFQUFFLEVBQVU7WUFDbkUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsR0FBRyxJQUFXO2dCQUNsQyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2xDLE1BQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFBO2dCQUMzQixNQUFNLE1BQU0sR0FBRyxxQkFBcUIsSUFBSSxLQUFLLEVBQUUsWUFBWSxDQUFBO2dCQUMzRCxNQUFNLGVBQWUsR0FBRyxrQkFBa0IsRUFBRSxDQUFBO2dCQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLENBQUE7Z0JBQ3RDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDekMsSUFBSSxVQUFVLElBQUksZUFBZSxFQUFFO29CQUNqQyxlQUFlLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUE7aUJBQ3pEO2dCQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO1lBQ3BCLENBQUMsQ0FBQTtRQUNILENBQUM7UUFFRCxtRUFBbUU7UUFDbkUsTUFBTSxTQUFTLEdBQUc7WUFDaEIsbUNBQW1DLEVBQUUsOEJBQThCO1lBQ25FLHdDQUF3QyxFQUFFLHdCQUF3QjtZQUNsRSwrQkFBK0IsRUFBRSxtQ0FBbUM7U0FDckUsQ0FBQTtRQUVELE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBUSxFQUFVLEVBQUU7WUFDeEMsTUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFBO1lBQ3JDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtZQUNoQixJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ25DLHVCQUF1QjtnQkFDdkIsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDbEM7aUJBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUN2QixPQUFPLEdBQUcsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7YUFDekQ7aUJBQU0sSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO2dCQUM1QixPQUFPLEdBQUcsU0FBUyxDQUFDLHdDQUF3QyxDQUFDLENBQUE7YUFDOUQ7aUJBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLE9BQU8sR0FBRyx5QkFBeUIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUE7YUFDcEU7aUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO2FBQzdGO2lCQUFNLElBQUksR0FBRyxZQUFZLEdBQUcsRUFBRTtnQkFDN0IsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO2dCQUN4QixPQUFPLEdBQUcsUUFBUSxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLCtCQUErQixDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7YUFDbkg7aUJBQU0sSUFBSSxHQUFHLFlBQVksR0FBRyxFQUFFO2dCQUM3QixNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBQ2xDLE9BQU87b0JBQ0wsUUFBUSxHQUFHLENBQUMsSUFBSSxLQUFLO3dCQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO3dCQUNwSCxHQUFHLENBQUE7YUFDTjtpQkFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtnQkFDbEMsT0FBTyxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO2FBQ3RDO2lCQUFNLElBQUksS0FBSyxFQUFFO2dCQUNoQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO2dCQUNwRCx3Q0FBd0M7Z0JBQ3hDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUMzRSxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7Z0JBRWhFLG1NQUFtTTtnQkFDbk0sT0FBTztvQkFDTCxNQUFNO3dCQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDM0Ysa0JBQWtCLEVBQ2xCLFdBQVcsQ0FDWixDQUFBO2dCQUVILE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDOUI7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUNsQztZQUNELE9BQU8sT0FBTyxDQUFBO1FBQ2hCLENBQUMsQ0FBQTtRQUVELFNBQVMsYUFBYSxDQUFDLElBQVc7WUFDaEMsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQVcsRUFBRSxHQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ2hFLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDakMsTUFBTSxTQUFTLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO2dCQUMzQyxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7Z0JBQzlELE9BQU8sTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFBO1lBQ3ZDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVOLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBRSxTQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3BFLENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxTQUFTLFVBQVUsQ0FBQyxJQUFZO1FBQzlCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDakcsQ0FBQztJQUVELFNBQVMsVUFBVSxDQUFDLEdBQVc7UUFDN0IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2FuZGJveCB9IGZyb20gXCJ0eXBlc2NyaXB0bGFuZy1vcmcvc3RhdGljL2pzL3NhbmRib3hcIlxuaW1wb3J0IHsgUGxheWdyb3VuZFBsdWdpbiwgUGx1Z2luRmFjdG9yeSB9IGZyb20gXCIuLlwiXG5pbXBvcnQgeyBjcmVhdGVVSSwgVUkgfSBmcm9tIFwiLi4vY3JlYXRlVUlcIlxuaW1wb3J0IHsgbG9jYWxpemUgfSBmcm9tIFwiLi4vbG9jYWxpemVXaXRoRmFsbGJhY2tcIlxuXG5sZXQgYWxsTG9nczogc3RyaW5nW10gPSBbXVxubGV0IGFkZGVkQ2xlYXJBY3Rpb24gPSBmYWxzZVxuY29uc3QgY2FuY2VsQnV0dG9uU1ZHID0gYFxuPHN2ZyB3aWR0aD1cIjEzXCIgaGVpZ2h0PVwiMTNcIiB2aWV3Qm94PVwiMCAwIDEzIDEzXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG48Y2lyY2xlIGN4PVwiNlwiIGN5PVwiN1wiIHI9XCI1XCIgc3Ryb2tlLXdpZHRoPVwiMlwiLz5cbjxsaW5lIHgxPVwiMC43MDcxMDdcIiB5MT1cIjEuMjkyODlcIiB4Mj1cIjExLjcwNzFcIiB5Mj1cIjEyLjI5MjlcIiBzdHJva2Utd2lkdGg9XCIyXCIvPlxuPC9zdmc+XG5gXG5cbmV4cG9ydCBjb25zdCBydW5QbHVnaW46IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcImxvZ3NcIixcbiAgICBkaXNwbGF5TmFtZTogaShcInBsYXlfc2lkZWJhcl9sb2dzXCIpLFxuICAgIHdpbGxNb3VudDogKHNhbmRib3gsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgY29uc3QgdWkgPSBjcmVhdGVVSSgpXG5cbiAgICAgIGNvbnN0IGNsZWFyTG9nc0FjdGlvbiA9IHtcbiAgICAgICAgaWQ6IFwiY2xlYXItbG9ncy1wbGF5XCIsXG4gICAgICAgIGxhYmVsOiBcIkNsZWFyIFBsYXlncm91bmQgTG9nc1wiLFxuICAgICAgICBrZXliaW5kaW5nczogW3NhbmRib3gubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgc2FuZGJveC5tb25hY28uS2V5Q29kZS5LRVlfS10sXG5cbiAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiBcInJ1blwiLFxuICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAxLjUsXG5cbiAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2xlYXJMb2dzKClcbiAgICAgICAgICB1aS5mbGFzaEluZm8oaShcInBsYXlfY2xlYXJfbG9nc1wiKSlcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgaWYgKCFhZGRlZENsZWFyQWN0aW9uKSB7XG4gICAgICAgIHNhbmRib3guZWRpdG9yLmFkZEFjdGlvbihjbGVhckxvZ3NBY3Rpb24pXG4gICAgICAgIGFkZGVkQ2xlYXJBY3Rpb24gPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVycm9yVUwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICBlcnJvclVMLmlkID0gXCJsb2ctY29udGFpbmVyXCJcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvclVMKVxuXG4gICAgICBjb25zdCBsb2dzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgbG9ncy5pZCA9IFwibG9nXCJcbiAgICAgIGxvZ3MuaW5uZXJIVE1MID0gYWxsTG9ncy5qb2luKFwiPGhyIC8+XCIpXG4gICAgICBlcnJvclVMLmFwcGVuZENoaWxkKGxvZ3MpXG5cbiAgICAgIGNvbnN0IGxvZ1Rvb2xzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgbG9nVG9vbHNDb250YWluZXIuaWQgPSBcImxvZy10b29sc1wiXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobG9nVG9vbHNDb250YWluZXIpXG5cbiAgICAgIGNvbnN0IGNsZWFyTG9nc0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgIGNsZWFyTG9nc0J1dHRvbi5pZCA9IFwiY2xlYXItbG9ncy1idXR0b25cIlxuICAgICAgY2xlYXJMb2dzQnV0dG9uLmlubmVySFRNTCA9IGNhbmNlbEJ1dHRvblNWR1xuICAgICAgY2xlYXJMb2dzQnV0dG9uLm9uY2xpY2sgPSBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGNsZWFyTG9nc0FjdGlvbi5ydW4oKVxuXG4gICAgICAgIGNvbnN0IGZpbHRlclRleHRCb3g6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyLWxvZ3NcIilcbiAgICAgICAgZmlsdGVyVGV4dEJveCEudmFsdWUgPSBcIlwiXG4gICAgICB9XG4gICAgICBsb2dUb29sc0NvbnRhaW5lci5hcHBlbmRDaGlsZChjbGVhckxvZ3NCdXR0b24pXG5cbiAgICAgIGNvbnN0IGZpbHRlclRleHRCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcbiAgICAgIGZpbHRlclRleHRCb3guaWQgPSBcImZpbHRlci1sb2dzXCJcbiAgICAgIGZpbHRlclRleHRCb3gucGxhY2Vob2xkZXIgPSBpKFwicGxheV9zaWRlYmFyX3Rvb2xzX2ZpbHRlcl9wbGFjZWhvbGRlclwiKVxuICAgICAgZmlsdGVyVGV4dEJveC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGU6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dFRleHQgPSBlLnRhcmdldC52YWx1ZVxuXG4gICAgICAgIGNvbnN0IGVsZUxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nXCIpIVxuICAgICAgICBlbGVMb2cuaW5uZXJIVE1MID0gYWxsTG9nc1xuICAgICAgICAgIC5maWx0ZXIobG9nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJMb2dnZWRUZXh0ID0gbG9nLnN1YnN0cmluZyhsb2cuaW5kZXhPZihcIjpcIikgKyAxLCBsb2cuaW5kZXhPZihcIiZuYnNwOzxicj5cIikpXG4gICAgICAgICAgICByZXR1cm4gdXNlckxvZ2dlZFRleHQuaW5jbHVkZXMoaW5wdXRUZXh0KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmpvaW4oXCI8aHIgLz5cIilcblxuICAgICAgICBpZiAoaW5wdXRUZXh0ID09PSBcIlwiKSB7XG4gICAgICAgICAgY29uc3QgbG9nQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2ctY29udGFpbmVyXCIpIVxuICAgICAgICAgIGxvZ0NvbnRhaW5lci5zY3JvbGxUb3AgPSBsb2dDb250YWluZXIuc2Nyb2xsSGVpZ2h0XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBsb2dUb29sc0NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWx0ZXJUZXh0Qm94KVxuXG4gICAgICBpZiAoYWxsTG9ncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3Qgbm9FcnJvcnNNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBub0Vycm9yc01lc3NhZ2UuaWQgPSBcImVtcHR5LW1lc3NhZ2UtY29udGFpbmVyXCJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5vRXJyb3JzTWVzc2FnZSlcblxuICAgICAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gbG9jYWxpemUoXCJwbGF5X3NpZGViYXJfbG9nc19ub19sb2dzXCIsIFwiTm8gbG9nc1wiKVxuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoXCJlbXB0eS1wbHVnaW4tbWVzc2FnZVwiKVxuICAgICAgICBub0Vycm9yc01lc3NhZ2UuYXBwZW5kQ2hpbGQobWVzc2FnZSlcblxuICAgICAgICBlcnJvclVMLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgICAgICBsb2dUb29sc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgICAgIH1cbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuXG5leHBvcnQgY29uc3QgY2xlYXJMb2dzID0gKCkgPT4ge1xuICBhbGxMb2dzID0gW11cbiAgY29uc3QgbG9ncyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nXCIpXG4gIGlmIChsb2dzKSB7XG4gICAgbG9ncy50ZXh0Q29udGVudCA9IFwiXCJcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcnVuV2l0aEN1c3RvbUxvZ3MgPSAoY2xvc3VyZTogUHJvbWlzZTxzdHJpbmc+LCBpOiBGdW5jdGlvbikgPT4ge1xuICBjb25zdCBub0xvZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtcHR5LW1lc3NhZ2UtY29udGFpbmVyXCIpXG4gIGNvbnN0IGxvZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nLWNvbnRhaW5lclwiKSFcbiAgY29uc3QgbG9nVG9vbHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZy10b29sc1wiKSFcbiAgaWYgKG5vTG9ncykge1xuICAgIG5vTG9ncy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgICBsb2dDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgIGxvZ1Rvb2xzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxuICB9XG5cbiAgcmV3aXJlTG9nZ2luZ1RvRWxlbWVudChcbiAgICAoKSA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ1wiKSEsXG4gICAgKCkgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2ctY29udGFpbmVyXCIpISxcbiAgICBjbG9zdXJlLFxuICAgIHRydWUsXG4gICAgaVxuICApXG59XG5cbi8vIFRoYW5rcyBTTzogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjAyNTY3NjAvamF2YXNjcmlwdC1jb25zb2xlLWxvZy10by1odG1sLzM1NDQ5MjU2IzM1NDQ5MjU2XG5cbmZ1bmN0aW9uIHJld2lyZUxvZ2dpbmdUb0VsZW1lbnQoXG4gIGVsZUxvY2F0b3I6ICgpID0+IEVsZW1lbnQsXG4gIGVsZU92ZXJmbG93TG9jYXRvcjogKCkgPT4gRWxlbWVudCxcbiAgY2xvc3VyZTogUHJvbWlzZTxzdHJpbmc+LFxuICBhdXRvU2Nyb2xsOiBib29sZWFuLFxuICBpOiBGdW5jdGlvblxuKSB7XG4gIGNvbnN0IHJhd0NvbnNvbGUgPSBjb25zb2xlXG5cbiAgY2xvc3VyZS50aGVuKGpzID0+IHtcbiAgICBjb25zdCByZXBsYWNlID0ge30gYXMgYW55XG4gICAgYmluZExvZ2dpbmdGdW5jKHJlcGxhY2UsIHJhd0NvbnNvbGUsIFwibG9nXCIsIFwiTE9HXCIpXG4gICAgYmluZExvZ2dpbmdGdW5jKHJlcGxhY2UsIHJhd0NvbnNvbGUsIFwiZGVidWdcIiwgXCJEQkdcIilcbiAgICBiaW5kTG9nZ2luZ0Z1bmMocmVwbGFjZSwgcmF3Q29uc29sZSwgXCJ3YXJuXCIsIFwiV1JOXCIpXG4gICAgYmluZExvZ2dpbmdGdW5jKHJlcGxhY2UsIHJhd0NvbnNvbGUsIFwiZXJyb3JcIiwgXCJFUlJcIilcbiAgICByZXBsYWNlW1wiY2xlYXJcIl0gPSBjbGVhckxvZ3NcbiAgICBjb25zdCBjb25zb2xlID0gT2JqZWN0LmFzc2lnbih7fSwgcmF3Q29uc29sZSwgcmVwbGFjZSlcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2FmZUpTID0gc2FuaXRpemVKUyhqcylcbiAgICAgIGV2YWwoc2FmZUpTKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGkoXCJwbGF5X3J1bl9qc19mYWlsXCIpKVxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcblxuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgU3ludGF4RXJyb3IgJiYgL1xcYmV4cG9ydFxcYi91LnRlc3QoZXJyb3IubWVzc2FnZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdUaXA6IENoYW5nZSB0aGUgTW9kdWxlIHNldHRpbmcgdG8gXCJDb21tb25KU1wiIGluIFRTIENvbmZpZyBzZXR0aW5ncyB0byBhbGxvdyB0b3AtbGV2ZWwgZXhwb3J0cyB0byB3b3JrIGluIHRoZSBQbGF5Z3JvdW5kJ1xuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGZ1bmN0aW9uIGJpbmRMb2dnaW5nRnVuYyhvYmo6IGFueSwgcmF3OiBhbnksIG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgIG9ialtuYW1lXSA9IGZ1bmN0aW9uICguLi5vYmpzOiBhbnlbXSkge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gcHJvZHVjZU91dHB1dChvYmpzKVxuICAgICAgY29uc3QgZWxlTG9nID0gZWxlTG9jYXRvcigpXG4gICAgICBjb25zdCBwcmVmaXggPSBgWzxzcGFuIGNsYXNzPVwibG9nLSR7bmFtZX1cIj4ke2lkfTwvc3Bhbj5dOiBgXG4gICAgICBjb25zdCBlbGVDb250YWluZXJMb2cgPSBlbGVPdmVyZmxvd0xvY2F0b3IoKVxuICAgICAgYWxsTG9ncy5wdXNoKGAke3ByZWZpeH0ke291dHB1dH08YnI+YClcbiAgICAgIGVsZUxvZy5pbm5lckhUTUwgPSBhbGxMb2dzLmpvaW4oXCI8aHIgLz5cIilcbiAgICAgIGlmIChhdXRvU2Nyb2xsICYmIGVsZUNvbnRhaW5lckxvZykge1xuICAgICAgICBlbGVDb250YWluZXJMb2cuc2Nyb2xsVG9wID0gZWxlQ29udGFpbmVyTG9nLnNjcm9sbEhlaWdodFxuICAgICAgfVxuICAgICAgcmF3W25hbWVdKC4uLm9ianMpXG4gICAgfVxuICB9XG5cbiAgLy8gSW5saW5lIGNvbnN0YW50cyB3aGljaCBhcmUgc3dpdGNoZWQgb3V0IGF0IHRoZSBlbmQgb2YgcHJvY2Vzc2luZ1xuICBjb25zdCByZXBsYWNlcnMgPSB7XG4gICAgXCI8c3BhbiBjbGFzcz0nbGl0ZXJhbCc+bnVsbDwvc3Bhbj5cIjogXCIxMjMxMjMyMTMxMjMxMjMxNDIzNDM0NTM0NTM0XCIsXG4gICAgXCI8c3BhbiBjbGFzcz0nbGl0ZXJhbCc+dW5kZWZpbmVkPC9zcGFuPlwiOiBcIjQ1MzQ1MzQ1MzQ1NjM1Njc1Njc1NjdcIixcbiAgICBcIjxzcGFuIGNsYXNzPSdjb21tYSc+LCA8L3NwYW4+XCI6IFwiNzg1eTgzNDU4NzM0ODU3NjM4NzQ1Njg3MzR5NTM1NDM4XCJcbiAgfVxuXG4gIGNvbnN0IG9iamVjdFRvVGV4dCA9IChhcmc6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgaXNPYmogPSB0eXBlb2YgYXJnID09PSBcIm9iamVjdFwiXG4gICAgbGV0IHRleHRSZXAgPSBcIlwiXG4gICAgaWYgKGFyZyAmJiBhcmcuc3RhY2sgJiYgYXJnLm1lc3NhZ2UpIHtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgZXJyXG4gICAgICB0ZXh0UmVwID0gaHRtbEVzY2FwZShhcmcubWVzc2FnZSlcbiAgICB9IGVsc2UgaWYgKGFyZyA9PT0gbnVsbCkge1xuICAgICAgdGV4dFJlcCA9IHJlcGxhY2Vyc1tcIjxzcGFuIGNsYXNzPSdsaXRlcmFsJz5udWxsPC9zcGFuPlwiXVxuICAgIH0gZWxzZSBpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRleHRSZXAgPSByZXBsYWNlcnNbXCI8c3BhbiBjbGFzcz0nbGl0ZXJhbCc+dW5kZWZpbmVkPC9zcGFuPlwiXVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgdGV4dFJlcCA9IGA8c3BhbiBjbGFzcz0nbGl0ZXJhbCc+JHtodG1sRXNjYXBlKFN0cmluZyhhcmcpKX08L3NwYW4+YFxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICB0ZXh0UmVwID0gXCJbXCIgKyBhcmcubWFwKG9iamVjdFRvVGV4dCkuam9pbihyZXBsYWNlcnNbXCI8c3BhbiBjbGFzcz0nY29tbWEnPiwgPC9zcGFuPlwiXSkgKyBcIl1cIlxuICAgIH0gZWxzZSBpZiAoYXJnIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICBjb25zdCBzZXRJdGVyID0gWy4uLmFyZ11cbiAgICAgIHRleHRSZXAgPSBgU2V0ICgke2FyZy5zaXplfSkge2AgKyBzZXRJdGVyLm1hcChvYmplY3RUb1RleHQpLmpvaW4ocmVwbGFjZXJzW1wiPHNwYW4gY2xhc3M9J2NvbW1hJz4sIDwvc3Bhbj5cIl0pICsgXCJ9XCJcbiAgICB9IGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgY29uc3QgbWFwSXRlciA9IFsuLi5hcmcuZW50cmllcygpXVxuICAgICAgdGV4dFJlcCA9XG4gICAgICAgIGBNYXAgKCR7YXJnLnNpemV9KSB7YCArXG4gICAgICAgIG1hcEl0ZXIubWFwKChbaywgdl0pID0+IGAke29iamVjdFRvVGV4dChrKX0gPT4gJHtvYmplY3RUb1RleHQodil9YCkuam9pbihyZXBsYWNlcnNbXCI8c3BhbiBjbGFzcz0nY29tbWEnPiwgPC9zcGFuPlwiXSkgK1xuICAgICAgICBcIn1cIlxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdGV4dFJlcCA9ICdcIicgKyBodG1sRXNjYXBlKGFyZykgKyAnXCInXG4gICAgfSBlbHNlIGlmIChpc09iaikge1xuICAgICAgY29uc3QgbmFtZSA9IGFyZy5jb25zdHJ1Y3RvciAmJiBhcmcuY29uc3RydWN0b3IubmFtZVxuICAgICAgLy8gTm8gb25lIG5lZWRzIHRvIGtub3cgYW4gb2JqIGlzIGFuIG9ialxuICAgICAgY29uc3QgbmFtZVdpdGhvdXRPYmplY3QgPSBuYW1lICYmIG5hbWUgPT09IFwiT2JqZWN0XCIgPyBcIlwiIDogaHRtbEVzY2FwZShuYW1lKVxuICAgICAgY29uc3QgcHJlZml4ID0gbmFtZVdpdGhvdXRPYmplY3QgPyBgJHtuYW1lV2l0aG91dE9iamVjdH06IGAgOiBcIlwiXG5cbiAgICAgIC8vIEpTT04uc3RyaW5naWZ5IG9taXRzIGFueSBrZXlzIHdpdGggYSB2YWx1ZSBvZiB1bmRlZmluZWQuIFRvIGdldCBhcm91bmQgdGhpcywgd2UgcmVwbGFjZSB1bmRlZmluZWQgd2l0aCB0aGUgdGV4dCBfX3VuZGVmaW5lZF9fIGFuZCB0aGVuIGRvIGEgZ2xvYmFsIHJlcGxhY2UgdXNpbmcgcmVnZXggYmFjayB0byBrZXl3b3JkIHVuZGVmaW5lZFxuICAgICAgdGV4dFJlcCA9XG4gICAgICAgIHByZWZpeCArXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGFyZywgKF8sIHZhbHVlKSA9PiAodmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiX191bmRlZmluZWRfX1wiIDogdmFsdWUpLCAyKS5yZXBsYWNlKFxuICAgICAgICAgIC9cIl9fdW5kZWZpbmVkX19cIi9nLFxuICAgICAgICAgIFwidW5kZWZpbmVkXCJcbiAgICAgICAgKVxuXG4gICAgICB0ZXh0UmVwID0gaHRtbEVzY2FwZSh0ZXh0UmVwKVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0UmVwID0gaHRtbEVzY2FwZShTdHJpbmcoYXJnKSlcbiAgICB9XG4gICAgcmV0dXJuIHRleHRSZXBcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2R1Y2VPdXRwdXQoYXJnczogYW55W10pIHtcbiAgICBsZXQgcmVzdWx0OiBzdHJpbmcgPSBhcmdzLnJlZHVjZSgob3V0cHV0OiBhbnksIGFyZzogYW55LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgdGV4dFJlcCA9IG9iamVjdFRvVGV4dChhcmcpXG4gICAgICBjb25zdCBzaG93Q29tbWEgPSBpbmRleCAhPT0gYXJncy5sZW5ndGggLSAxXG4gICAgICBjb25zdCBjb21tYSA9IHNob3dDb21tYSA/IFwiPHNwYW4gY2xhc3M9J2NvbW1hJz4sIDwvc3Bhbj5cIiA6IFwiXCJcbiAgICAgIHJldHVybiBvdXRwdXQgKyB0ZXh0UmVwICsgY29tbWEgKyBcIiBcIlxuICAgIH0sIFwiXCIpXG5cbiAgICBPYmplY3Qua2V5cyhyZXBsYWNlcnMpLmZvckVhY2goayA9PiB7XG4gICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShuZXcgUmVnRXhwKChyZXBsYWNlcnMgYXMgYW55KVtrXSwgXCJnXCIpLCBrKVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuLy8gVGhlIHJlZmxlY3QtbWV0YWRhdGEgcnVudGltZSBpcyBhdmFpbGFibGUsIHNvIGFsbG93IHRoYXQgdG8gZ28gdGhyb3VnaFxuZnVuY3Rpb24gc2FuaXRpemVKUyhjb2RlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGNvZGUucmVwbGFjZShgaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiYCwgXCJcIikucmVwbGFjZShgcmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIilgLCBcIlwiKVxufVxuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cjogc3RyaW5nKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbn0iXX0=