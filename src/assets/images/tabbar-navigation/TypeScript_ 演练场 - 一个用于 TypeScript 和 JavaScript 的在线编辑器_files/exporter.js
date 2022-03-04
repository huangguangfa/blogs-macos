var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createExporter = void 0;
    const createExporter = (sandbox, monaco, ui) => {
        function getScriptTargetText(option) {
            return monaco.languages.typescript.ScriptTarget[option];
        }
        function getJsxEmitText(option) {
            if (option === monaco.languages.typescript.JsxEmit.None) {
                return undefined;
            }
            return monaco.languages.typescript.JsxEmit[option].toLowerCase();
        }
        function getModuleKindText(option) {
            if (option === monaco.languages.typescript.ModuleKind.None) {
                return undefined;
            }
            return monaco.languages.typescript.ModuleKind[option];
        }
        function getModuleResolutionText(option) {
            return option === monaco.languages.typescript.ModuleResolutionKind.Classic ? "classic" : "node";
        }
        // These are the compiler's defaults, and we want a diff from
        // these before putting it in the issue
        const defaultCompilerOptionsForTSC = {
            esModuleInterop: false,
            strictNullChecks: false,
            strict: false,
            strictFunctionTypes: false,
            strictPropertyInitialization: false,
            strictBindCallApply: false,
            noImplicitAny: false,
            noImplicitThis: false,
            noImplicitReturns: false,
            checkJs: false,
            allowJs: false,
            experimentalDecorators: false,
            emitDecoratorMetadata: false,
        };
        function getValidCompilerOptions(options) {
            const { target: targetOption, jsx: jsxOption, module: moduleOption, moduleResolution: moduleResolutionOption } = options, restOptions = __rest(options, ["target", "jsx", "module", "moduleResolution"]);
            const targetText = getScriptTargetText(targetOption);
            const jsxText = getJsxEmitText(jsxOption);
            const moduleKindText = getModuleKindText(moduleOption);
            const moduleResolutionText = getModuleResolutionText(moduleResolutionOption);
            const opts = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, restOptions), (targetText && { target: targetText })), (jsxText && { jsx: jsxText })), (moduleKindText && { module: moduleKindText })), { moduleResolution: moduleResolutionText });
            const diffFromTSCDefaults = Object.entries(opts).reduce((acc, [key, value]) => {
                if (opts[key] && value != defaultCompilerOptionsForTSC[key]) {
                    // @ts-ignore
                    acc[key] = opts[key];
                }
                return acc;
            }, {});
            return diffFromTSCDefaults;
        }
        // Based on https://github.com/stackblitz/core/blob/master/sdk/src/generate.ts
        function createHiddenInput(name, value) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            return input;
        }
        function createProjectForm(project) {
            const form = document.createElement("form");
            form.method = "POST";
            form.setAttribute("style", "display:none;");
            form.appendChild(createHiddenInput("project[title]", project.title));
            form.appendChild(createHiddenInput("project[description]", project.description));
            form.appendChild(createHiddenInput("project[template]", project.template));
            if (project.tags) {
                project.tags.forEach((tag) => {
                    form.appendChild(createHiddenInput("project[tags][]", tag));
                });
            }
            if (project.dependencies) {
                form.appendChild(createHiddenInput("project[dependencies]", JSON.stringify(project.dependencies)));
            }
            if (project.settings) {
                form.appendChild(createHiddenInput("project[settings]", JSON.stringify(project.settings)));
            }
            Object.keys(project.files).forEach(path => {
                form.appendChild(createHiddenInput(`project[files][${path}]`, project.files[path]));
            });
            return form;
        }
        const typescriptVersion = sandbox.ts.version;
        // prettier-ignore
        const stringifiedCompilerOptions = JSON.stringify({ compilerOptions: getValidCompilerOptions(sandbox.getCompilerOptions()) }, null, '  ');
        // TODO: pull deps
        function openProjectInStackBlitz() {
            const project = {
                title: "Playground Export - ",
                description: "123",
                template: "typescript",
                files: {
                    "index.ts": sandbox.getText(),
                    "tsconfig.json": stringifiedCompilerOptions,
                },
                dependencies: {
                    typescript: typescriptVersion,
                },
            };
            const form = createProjectForm(project);
            form.action = "https://stackblitz.com/run?view=editor";
            // https://github.com/stackblitz/core/blob/master/sdk/src/helpers.ts#L9
            // + buildProjectQuery(options);
            form.target = "_blank";
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
        function openInBugWorkbench() {
            const hash = `#code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`;
            document.location.assign(`/dev/bug-workbench/${hash}`);
        }
        function openInTSAST() {
            const hash = `#code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`;
            document.location.assign(`https://ts-ast-viewer.com/${hash}`);
        }
        function openInVSCodeDev() {
            const search = document.location.search;
            const hash = `#code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`;
            document.location.assign(`https://insiders.vscode.dev/tsplay/${search}${hash}`);
        }
        function openProjectInCodeSandbox() {
            const files = {
                "package.json": {
                    content: {
                        name: "TypeScript Playground Export",
                        version: "0.0.0",
                        description: "TypeScript playground exported Sandbox",
                        dependencies: {
                            typescript: typescriptVersion,
                        },
                    },
                },
                "index.ts": {
                    content: sandbox.getText(),
                },
                "tsconfig.json": {
                    content: stringifiedCompilerOptions,
                },
            };
            // Using the v1 get API
            const parameters = sandbox.lzstring
                .compressToBase64(JSON.stringify({ files }))
                .replace(/\+/g, "-") // Convert '+' to '-'
                .replace(/\//g, "_") // Convert '/' to '_'
                .replace(/=+$/, ""); // Remove ending '='
            const url = `https://codesandbox.io/api/v1/sandboxes/define?view=editor&parameters=${parameters}`;
            document.location.assign(url);
            // Alternative using the http URL API, which uses POST. This has the trade-off where
            // the async nature of the call means that the redirect at the end triggers
            // popup security mechanisms in browsers because the function isn't blessed as
            // being a direct result of a user action.
            // fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
            //   method: "POST",
            //   body: JSON.stringify({ files }),
            //   headers: {
            //     Accept: "application/json",
            //     "Content-Type": "application/json"
            //   }
            // })
            // .then(x => x.json())
            // .then(data => {
            //   window.open('https://codesandbox.io/s/' + data.sandbox_id, '_blank');
            // });
        }
        function codify(code, ext) {
            return "```" + ext + "\n" + code + "\n```\n";
        }
        function makeMarkdown() {
            return __awaiter(this, void 0, void 0, function* () {
                const query = sandbox.createURLQueryWithCompilerOptions(sandbox);
                const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`;
                const jsSection = sandbox.config.filetype === "js"
                    ? ""
                    : `
<details><summary><b>Output</b></summary>

${codify(yield sandbox.getRunnableJS(), "ts")}

</details>
`;
                return `
${codify(sandbox.getText(), "ts")}

${jsSection}

<details><summary><b>Compiler Options</b></summary>

${codify(stringifiedCompilerOptions, "json")}

</details>

**Playground Link:** [Provided](${fullURL})
      `;
            });
        }
        function copyAsMarkdownIssue(e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.persist();
                const markdown = yield makeMarkdown();
                ui.showModal(markdown, document.getElementById("exports-dropdown"), "Markdown Version of Playground Code for GitHub Issue", undefined, e);
                return false;
            });
        }
        function copyForChat(e) {
            const query = sandbox.createURLQueryWithCompilerOptions(sandbox);
            const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`;
            const chat = `[Playground Link](${fullURL})`;
            ui.showModal(chat, document.getElementById("exports-dropdown"), "Markdown for chat", undefined, e);
            return false;
        }
        function copyForChatWithPreview(e) {
            e.persist();
            const query = sandbox.createURLQueryWithCompilerOptions(sandbox);
            const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`;
            const ts = sandbox.getText();
            const preview = ts.length > 200 ? ts.substring(0, 200) + "..." : ts.substring(0, 200);
            const jsx = getJsxEmitText(sandbox.getCompilerOptions().jsx);
            const codeLanguage = jsx !== undefined ? "tsx" : "ts";
            const code = "```" + codeLanguage + "\n" + preview + "\n```\n";
            const chat = `${code}\n[Playground Link](${fullURL})`;
            ui.showModal(chat, document.getElementById("exports-dropdown"), "Markdown code", undefined, e);
            return false;
        }
        function exportAsTweet() {
            const query = sandbox.createURLQueryWithCompilerOptions(sandbox);
            const fullURL = `${document.location.protocol}//${document.location.host}${document.location.pathname}${query}`;
            document.location.assign(`http://www.twitter.com/share?url=${fullURL}`);
        }
        return {
            openProjectInStackBlitz,
            openProjectInCodeSandbox,
            copyAsMarkdownIssue,
            copyForChat,
            copyForChatWithPreview,
            openInTSAST,
            openInBugWorkbench,
            openInVSCodeDev,
            exportAsTweet,
        };
    };
    exports.createExporter = createExporter;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9leHBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLTyxNQUFNLGNBQWMsR0FBRyxDQUFDLE9BQWdCLEVBQUUsTUFBc0MsRUFBRSxFQUFNLEVBQUUsRUFBRTtRQUNqRyxTQUFTLG1CQUFtQixDQUFDLE1BQVc7WUFDdEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDekQsQ0FBQztRQUVELFNBQVMsY0FBYyxDQUFDLE1BQVc7WUFDakMsSUFBSSxNQUFNLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDdkQsT0FBTyxTQUFTLENBQUE7YUFDakI7WUFDRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNsRSxDQUFDO1FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxNQUFXO1lBQ3BDLElBQUksTUFBTSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQzFELE9BQU8sU0FBUyxDQUFBO2FBQ2pCO1lBQ0QsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDdkQsQ0FBQztRQUVELFNBQVMsdUJBQXVCLENBQUMsTUFBVztZQUMxQyxPQUFPLE1BQU0sS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO1FBQ2pHLENBQUM7UUFFRCw2REFBNkQ7UUFD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LEdBQUcsS0FBSyxFQUFFLENBQUE7WUFFL0csUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsb0NBQW9DLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDekUsQ0FBQztRQUVELE9BQU87WUFDTCx1QkFBdUI7WUFDdkIsd0JBQXdCO1lBQ3hCLG1CQUFtQjtZQUNuQixXQUFXO1lBQ1gsc0JBQXNCO1lBQ3RCLFdBQVc7WUFDWCxrQkFBa0I7WUFDbEIsZUFBZTtZQUNmLGFBQWE7U0FDZCxDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBMVNZLFFBQUEsY0FBYyxrQkEwUzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVUkgfSBmcm9tIFwiLi9jcmVhdGVVSVwiXG5cbnR5cGUgU2FuZGJveCA9IGltcG9ydChcIkB0eXBlc2NyaXB0L3NhbmRib3hcIikuU2FuZGJveFxudHlwZSBDb21waWxlck9wdGlvbnMgPSBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpLmxhbmd1YWdlcy50eXBlc2NyaXB0LkNvbXBpbGVyT3B0aW9uc1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXhwb3J0ZXIgPSAoc2FuZGJveDogU2FuZGJveCwgbW9uYWNvOiB0eXBlb2YgaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKSwgdWk6IFVJKSA9PiB7XG4gIGZ1bmN0aW9uIGdldFNjcmlwdFRhcmdldFRleHQob3B0aW9uOiBhbnkpIHtcbiAgICByZXR1cm4gbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0LlNjcmlwdFRhcmdldFtvcHRpb25dXG4gIH1cblxuICBmdW5jdGlvbiBnZXRKc3hFbWl0VGV4dChvcHRpb246IGFueSkge1xuICAgIGlmIChvcHRpb24gPT09IG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5Kc3hFbWl0Lk5vbmUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5Kc3hFbWl0W29wdGlvbl0udG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TW9kdWxlS2luZFRleHQob3B0aW9uOiBhbnkpIHtcbiAgICBpZiAob3B0aW9uID09PSBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuTW9kdWxlS2luZC5Ob25lKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuICAgIHJldHVybiBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuTW9kdWxlS2luZFtvcHRpb25dXG4gIH1cblxuICBmdW5jdGlvbiBnZXRNb2R1bGVSZXNvbHV0aW9uVGV4dChvcHRpb246IGFueSkge1xuICAgIHJldHVybiBvcHRpb24gPT09IG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5Nb2R1bGVSZXNvbHV0aW9uS2luZC5DbGFzc2ljID8gXCJjbGFzc2ljXCIgOiBcIm5vZGVcIlxuICB9XG5cbiAgLy8gVGhlc2UgYXJlIHRoZSBjb21waWxlcidzIGRlZmF1bHRzLCBhbmQgd2Ugd2FudCBhIGRpZmYgZnJvbVxuICAvLyB0aGVzZSBiZWZvcmUgcHV0dGluZyBpdCBpbiB0aGUgaXNzdWVcbiAgY29uc3QgZGVmYXVsdENvbXBpbGVyT3B0aW9uc0ZvclRTQzogQ29tcGlsZXJPcHRpb25zID0ge1xuICAgIGVzTW9kdWxlSW50ZXJvcDogZmFsc2UsXG4gICAgc3RyaWN0TnVsbENoZWNrczogZmFsc2UsXG4gICAgc3RyaWN0OiBmYWxzZSxcbiAgICBzdHJpY3RGdW5jdGlvblR5cGVzOiBmYWxzZSxcbiAgICBzdHJpY3RQcm9wZXJ0eUluaXRpYWxpemF0aW9uOiBmYWxzZSxcbiAgICBzdHJpY3RCaW5kQ2FsbEFwcGx5OiBmYWxzZSxcbiAgICBub0ltcGxpY2l0QW55OiBmYWxzZSxcbiAgICBub0ltcGxpY2l0VGhpczogZmFsc2UsXG4gICAgbm9JbXBsaWNpdFJldHVybnM6IGZhbHNlLFxuICAgIGNoZWNrSnM6IGZhbHNlLFxuICAgIGFsbG93SnM6IGZhbHNlLFxuICAgIGV4cGVyaW1lbnRhbERlY29yYXRvcnM6IGZhbHNlLFxuICAgIGVtaXREZWNvcmF0b3JNZXRhZGF0YTogZmFsc2UsXG4gIH1cblxuICBmdW5jdGlvbiBnZXRWYWxpZENvbXBpbGVyT3B0aW9ucyhvcHRpb25zOiBDb21waWxlck9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICB0YXJnZXQ6IHRhcmdldE9wdGlvbixcbiAgICAgIGpzeDoganN4T3B0aW9uLFxuICAgICAgbW9kdWxlOiBtb2R1bGVPcHRpb24sXG4gICAgICBtb2R1bGVSZXNvbHV0aW9uOiBtb2R1bGVSZXNvbHV0aW9uT3B0aW9uLFxuICAgICAgLi4ucmVzdE9wdGlvbnNcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgY29uc3QgdGFyZ2V0VGV4dCA9IGdldFNjcmlwdFRhcmdldFRleHQodGFyZ2V0T3B0aW9uKVxuICAgIGNvbnN0IGpzeFRleHQgPSBnZXRKc3hFbWl0VGV4dChqc3hPcHRpb24pXG4gICAgY29uc3QgbW9kdWxlS2luZFRleHQgPSBnZXRNb2R1bGVLaW5kVGV4dChtb2R1bGVPcHRpb24pXG4gICAgY29uc3QgbW9kdWxlUmVzb2x1dGlvblRleHQgPSBnZXRNb2R1bGVSZXNvbHV0aW9uVGV4dChtb2R1bGVSZXNvbHV0aW9uT3B0aW9uKVxuXG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIC4uLnJlc3RPcHRpb25zLFxuICAgICAgLi4uKHRhcmdldFRleHQgJiYgeyB0YXJnZXQ6IHRhcmdldFRleHQgfSksXG4gICAgICAuLi4oanN4VGV4dCAmJiB7IGpzeDoganN4VGV4dCB9KSxcbiAgICAgIC4uLihtb2R1bGVLaW5kVGV4dCAmJiB7IG1vZHVsZTogbW9kdWxlS2luZFRleHQgfSksXG4gICAgICBtb2R1bGVSZXNvbHV0aW9uOiBtb2R1bGVSZXNvbHV0aW9uVGV4dCxcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmRnJvbVRTQ0RlZmF1bHRzID0gT2JqZWN0LmVudHJpZXMob3B0cykucmVkdWNlKChhY2MsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgaWYgKChvcHRzIGFzIGFueSlba2V5XSAmJiB2YWx1ZSAhPSBkZWZhdWx0Q29tcGlsZXJPcHRpb25zRm9yVFNDW2tleV0pIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBhY2Nba2V5XSA9IG9wdHNba2V5XVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG5cbiAgICByZXR1cm4gZGlmZkZyb21UU0NEZWZhdWx0c1xuICB9XG5cbiAgLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL3N0YWNrYmxpdHovY29yZS9ibG9iL21hc3Rlci9zZGsvc3JjL2dlbmVyYXRlLnRzXG4gIGZ1bmN0aW9uIGNyZWF0ZUhpZGRlbklucHV0KG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCJcbiAgICBpbnB1dC5uYW1lID0gbmFtZVxuICAgIGlucHV0LnZhbHVlID0gdmFsdWVcbiAgICByZXR1cm4gaW5wdXRcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByb2plY3RGb3JtKHByb2plY3Q6IGFueSkge1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKVxuXG4gICAgZm9ybS5tZXRob2QgPSBcIlBPU1RcIlxuICAgIGZvcm0uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmU7XCIpXG5cbiAgICBmb3JtLmFwcGVuZENoaWxkKGNyZWF0ZUhpZGRlbklucHV0KFwicHJvamVjdFt0aXRsZV1cIiwgcHJvamVjdC50aXRsZSkpXG4gICAgZm9ybS5hcHBlbmRDaGlsZChjcmVhdGVIaWRkZW5JbnB1dChcInByb2plY3RbZGVzY3JpcHRpb25dXCIsIHByb2plY3QuZGVzY3JpcHRpb24pKVxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3JlYXRlSGlkZGVuSW5wdXQoXCJwcm9qZWN0W3RlbXBsYXRlXVwiLCBwcm9qZWN0LnRlbXBsYXRlKSlcblxuICAgIGlmIChwcm9qZWN0LnRhZ3MpIHtcbiAgICAgIHByb2plY3QudGFncy5mb3JFYWNoKCh0YWc6IHN0cmluZykgPT4ge1xuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGNyZWF0ZUhpZGRlbklucHV0KFwicHJvamVjdFt0YWdzXVtdXCIsIHRhZykpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChwcm9qZWN0LmRlcGVuZGVuY2llcykge1xuICAgICAgZm9ybS5hcHBlbmRDaGlsZChjcmVhdGVIaWRkZW5JbnB1dChcInByb2plY3RbZGVwZW5kZW5jaWVzXVwiLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0LmRlcGVuZGVuY2llcykpKVxuICAgIH1cblxuICAgIGlmIChwcm9qZWN0LnNldHRpbmdzKSB7XG4gICAgICBmb3JtLmFwcGVuZENoaWxkKGNyZWF0ZUhpZGRlbklucHV0KFwicHJvamVjdFtzZXR0aW5nc11cIiwgSlNPTi5zdHJpbmdpZnkocHJvamVjdC5zZXR0aW5ncykpKVxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHByb2plY3QuZmlsZXMpLmZvckVhY2gocGF0aCA9PiB7XG4gICAgICBmb3JtLmFwcGVuZENoaWxkKGNyZWF0ZUhpZGRlbklucHV0KGBwcm9qZWN0W2ZpbGVzXVske3BhdGh9XWAsIHByb2plY3QuZmlsZXNbcGF0aF0pKVxuICAgIH0pXG5cbiAgICByZXR1cm4gZm9ybVxuICB9XG5cbiAgY29uc3QgdHlwZXNjcmlwdFZlcnNpb24gPSBzYW5kYm94LnRzLnZlcnNpb25cbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIGNvbnN0IHN0cmluZ2lmaWVkQ29tcGlsZXJPcHRpb25zID0gSlNPTi5zdHJpbmdpZnkoeyBjb21waWxlck9wdGlvbnM6IGdldFZhbGlkQ29tcGlsZXJPcHRpb25zKHNhbmRib3guZ2V0Q29tcGlsZXJPcHRpb25zKCkpIH0sIG51bGwsICcgICcpXG5cbiAgLy8gVE9ETzogcHVsbCBkZXBzXG4gIGZ1bmN0aW9uIG9wZW5Qcm9qZWN0SW5TdGFja0JsaXR6KCkge1xuICAgIGNvbnN0IHByb2plY3QgPSB7XG4gICAgICB0aXRsZTogXCJQbGF5Z3JvdW5kIEV4cG9ydCAtIFwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiMTIzXCIsXG4gICAgICB0ZW1wbGF0ZTogXCJ0eXBlc2NyaXB0XCIsXG4gICAgICBmaWxlczoge1xuICAgICAgICBcImluZGV4LnRzXCI6IHNhbmRib3guZ2V0VGV4dCgpLFxuICAgICAgICBcInRzY29uZmlnLmpzb25cIjogc3RyaW5naWZpZWRDb21waWxlck9wdGlvbnMsXG4gICAgICB9LFxuICAgICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAgIHR5cGVzY3JpcHQ6IHR5cGVzY3JpcHRWZXJzaW9uLFxuICAgICAgfSxcbiAgICB9XG4gICAgY29uc3QgZm9ybSA9IGNyZWF0ZVByb2plY3RGb3JtKHByb2plY3QpXG4gICAgZm9ybS5hY3Rpb24gPSBcImh0dHBzOi8vc3RhY2tibGl0ei5jb20vcnVuP3ZpZXc9ZWRpdG9yXCJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3RhY2tibGl0ei9jb3JlL2Jsb2IvbWFzdGVyL3Nkay9zcmMvaGVscGVycy50cyNMOVxuICAgIC8vICsgYnVpbGRQcm9qZWN0UXVlcnkob3B0aW9ucyk7XG4gICAgZm9ybS50YXJnZXQgPSBcIl9ibGFua1wiXG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pXG4gICAgZm9ybS5zdWJtaXQoKVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZm9ybSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW5JbkJ1Z1dvcmtiZW5jaCgpIHtcbiAgICBjb25zdCBoYXNoID0gYCNjb2RlLyR7c2FuZGJveC5senN0cmluZy5jb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudChzYW5kYm94LmdldFRleHQoKSl9YFxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmFzc2lnbihgL2Rldi9idWctd29ya2JlbmNoLyR7aGFzaH1gKVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbkluVFNBU1QoKSB7XG4gICAgY29uc3QgaGFzaCA9IGAjY29kZS8ke3NhbmRib3gubHpzdHJpbmcuY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQoc2FuZGJveC5nZXRUZXh0KCkpfWBcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5hc3NpZ24oYGh0dHBzOi8vdHMtYXN0LXZpZXdlci5jb20vJHtoYXNofWApXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuSW5WU0NvZGVEZXYoKSB7XG4gICAgY29uc3Qgc2VhcmNoID0gZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoXG4gICAgY29uc3QgaGFzaCA9IGAjY29kZS8ke3NhbmRib3gubHpzdHJpbmcuY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQoc2FuZGJveC5nZXRUZXh0KCkpfWBcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5hc3NpZ24oYGh0dHBzOi8vaW5zaWRlcnMudnNjb2RlLmRldi90c3BsYXkvJHtzZWFyY2h9JHtoYXNofWApXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuUHJvamVjdEluQ29kZVNhbmRib3goKSB7XG4gICAgY29uc3QgZmlsZXMgPSB7XG4gICAgICBcInBhY2thZ2UuanNvblwiOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICBuYW1lOiBcIlR5cGVTY3JpcHQgUGxheWdyb3VuZCBFeHBvcnRcIixcbiAgICAgICAgICB2ZXJzaW9uOiBcIjAuMC4wXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiVHlwZVNjcmlwdCBwbGF5Z3JvdW5kIGV4cG9ydGVkIFNhbmRib3hcIixcbiAgICAgICAgICBkZXBlbmRlbmNpZXM6IHtcbiAgICAgICAgICAgIHR5cGVzY3JpcHQ6IHR5cGVzY3JpcHRWZXJzaW9uLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgXCJpbmRleC50c1wiOiB7XG4gICAgICAgIGNvbnRlbnQ6IHNhbmRib3guZ2V0VGV4dCgpLFxuICAgICAgfSxcbiAgICAgIFwidHNjb25maWcuanNvblwiOiB7XG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZ2lmaWVkQ29tcGlsZXJPcHRpb25zLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBVc2luZyB0aGUgdjEgZ2V0IEFQSVxuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBzYW5kYm94Lmx6c3RyaW5nXG4gICAgICAuY29tcHJlc3NUb0Jhc2U2NChKU09OLnN0cmluZ2lmeSh7IGZpbGVzIH0pKVxuICAgICAgLnJlcGxhY2UoL1xcKy9nLCBcIi1cIikgLy8gQ29udmVydCAnKycgdG8gJy0nXG4gICAgICAucmVwbGFjZSgvXFwvL2csIFwiX1wiKSAvLyBDb252ZXJ0ICcvJyB0byAnXydcbiAgICAgIC5yZXBsYWNlKC89KyQvLCBcIlwiKSAvLyBSZW1vdmUgZW5kaW5nICc9J1xuXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vY29kZXNhbmRib3guaW8vYXBpL3YxL3NhbmRib3hlcy9kZWZpbmU/dmlldz1lZGl0b3ImcGFyYW1ldGVycz0ke3BhcmFtZXRlcnN9YFxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmFzc2lnbih1cmwpXG5cbiAgICAvLyBBbHRlcm5hdGl2ZSB1c2luZyB0aGUgaHR0cCBVUkwgQVBJLCB3aGljaCB1c2VzIFBPU1QuIFRoaXMgaGFzIHRoZSB0cmFkZS1vZmYgd2hlcmVcbiAgICAvLyB0aGUgYXN5bmMgbmF0dXJlIG9mIHRoZSBjYWxsIG1lYW5zIHRoYXQgdGhlIHJlZGlyZWN0IGF0IHRoZSBlbmQgdHJpZ2dlcnNcbiAgICAvLyBwb3B1cCBzZWN1cml0eSBtZWNoYW5pc21zIGluIGJyb3dzZXJzIGJlY2F1c2UgdGhlIGZ1bmN0aW9uIGlzbid0IGJsZXNzZWQgYXNcbiAgICAvLyBiZWluZyBhIGRpcmVjdCByZXN1bHQgb2YgYSB1c2VyIGFjdGlvbi5cblxuICAgIC8vIGZldGNoKFwiaHR0cHM6Ly9jb2Rlc2FuZGJveC5pby9hcGkvdjEvc2FuZGJveGVzL2RlZmluZT9qc29uPTFcIiwge1xuICAgIC8vICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAvLyAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZmlsZXMgfSksXG4gICAgLy8gICBoZWFkZXJzOiB7XG4gICAgLy8gICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgLy8gICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgLy8gICB9XG4gICAgLy8gfSlcbiAgICAvLyAudGhlbih4ID0+IHguanNvbigpKVxuICAgIC8vIC50aGVuKGRhdGEgPT4ge1xuICAgIC8vICAgd2luZG93Lm9wZW4oJ2h0dHBzOi8vY29kZXNhbmRib3guaW8vcy8nICsgZGF0YS5zYW5kYm94X2lkLCAnX2JsYW5rJyk7XG4gICAgLy8gfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb2RpZnkoY29kZTogc3RyaW5nLCBleHQ6IHN0cmluZykge1xuICAgIHJldHVybiBcImBgYFwiICsgZXh0ICsgXCJcXG5cIiArIGNvZGUgKyBcIlxcbmBgYFxcblwiXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBtYWtlTWFya2Rvd24oKSB7XG4gICAgY29uc3QgcXVlcnkgPSBzYW5kYm94LmNyZWF0ZVVSTFF1ZXJ5V2l0aENvbXBpbGVyT3B0aW9ucyhzYW5kYm94KVxuICAgIGNvbnN0IGZ1bGxVUkwgPSBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vLyR7ZG9jdW1lbnQubG9jYXRpb24uaG9zdH0ke2RvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lfSR7cXVlcnl9YFxuICAgIGNvbnN0IGpzU2VjdGlvbiA9XG4gICAgICBzYW5kYm94LmNvbmZpZy5maWxldHlwZSA9PT0gXCJqc1wiXG4gICAgICAgID8gXCJcIlxuICAgICAgICA6IGBcbjxkZXRhaWxzPjxzdW1tYXJ5PjxiPk91dHB1dDwvYj48L3N1bW1hcnk+XG5cbiR7Y29kaWZ5KGF3YWl0IHNhbmRib3guZ2V0UnVubmFibGVKUygpLCBcInRzXCIpfVxuXG48L2RldGFpbHM+XG5gXG5cbiAgICByZXR1cm4gYFxuJHtjb2RpZnkoc2FuZGJveC5nZXRUZXh0KCksIFwidHNcIil9XG5cbiR7anNTZWN0aW9ufVxuXG48ZGV0YWlscz48c3VtbWFyeT48Yj5Db21waWxlciBPcHRpb25zPC9iPjwvc3VtbWFyeT5cblxuJHtjb2RpZnkoc3RyaW5naWZpZWRDb21waWxlck9wdGlvbnMsIFwianNvblwiKX1cblxuPC9kZXRhaWxzPlxuXG4qKlBsYXlncm91bmQgTGluazoqKiBbUHJvdmlkZWRdKCR7ZnVsbFVSTH0pXG4gICAgICBgXG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gY29weUFzTWFya2Rvd25Jc3N1ZShlOiBSZWFjdC5Nb3VzZUV2ZW50KSB7XG4gICAgZS5wZXJzaXN0KClcblxuICAgIGNvbnN0IG1hcmtkb3duID0gYXdhaXQgbWFrZU1hcmtkb3duKClcbiAgICB1aS5zaG93TW9kYWwoXG4gICAgICBtYXJrZG93bixcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXhwb3J0cy1kcm9wZG93blwiKSEsXG4gICAgICBcIk1hcmtkb3duIFZlcnNpb24gb2YgUGxheWdyb3VuZCBDb2RlIGZvciBHaXRIdWIgSXNzdWVcIixcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGVcbiAgICApXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBjb3B5Rm9yQ2hhdChlOiBSZWFjdC5Nb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgcXVlcnkgPSBzYW5kYm94LmNyZWF0ZVVSTFF1ZXJ5V2l0aENvbXBpbGVyT3B0aW9ucyhzYW5kYm94KVxuICAgIGNvbnN0IGZ1bGxVUkwgPSBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vLyR7ZG9jdW1lbnQubG9jYXRpb24uaG9zdH0ke2RvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lfSR7cXVlcnl9YFxuICAgIGNvbnN0IGNoYXQgPSBgW1BsYXlncm91bmQgTGlua10oJHtmdWxsVVJMfSlgXG4gICAgdWkuc2hvd01vZGFsKGNoYXQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXhwb3J0cy1kcm9wZG93blwiKSEsIFwiTWFya2Rvd24gZm9yIGNoYXRcIiwgdW5kZWZpbmVkLCBlKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gY29weUZvckNoYXRXaXRoUHJldmlldyhlOiBSZWFjdC5Nb3VzZUV2ZW50KSB7XG4gICAgZS5wZXJzaXN0KClcblxuICAgIGNvbnN0IHF1ZXJ5ID0gc2FuZGJveC5jcmVhdGVVUkxRdWVyeVdpdGhDb21waWxlck9wdGlvbnMoc2FuZGJveClcbiAgICBjb25zdCBmdWxsVVJMID0gYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly8ke2RvY3VtZW50LmxvY2F0aW9uLmhvc3R9JHtkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZX0ke3F1ZXJ5fWBcblxuICAgIGNvbnN0IHRzID0gc2FuZGJveC5nZXRUZXh0KClcbiAgICBjb25zdCBwcmV2aWV3ID0gdHMubGVuZ3RoID4gMjAwID8gdHMuc3Vic3RyaW5nKDAsIDIwMCkgKyBcIi4uLlwiIDogdHMuc3Vic3RyaW5nKDAsIDIwMClcblxuICAgIGNvbnN0IGpzeCA9IGdldEpzeEVtaXRUZXh0KHNhbmRib3guZ2V0Q29tcGlsZXJPcHRpb25zKCkuanN4KVxuICAgIGNvbnN0IGNvZGVMYW5ndWFnZSA9IGpzeCAhPT0gdW5kZWZpbmVkID8gXCJ0c3hcIiA6IFwidHNcIlxuICAgIGNvbnN0IGNvZGUgPSBcImBgYFwiICsgY29kZUxhbmd1YWdlICsgXCJcXG5cIiArIHByZXZpZXcgKyBcIlxcbmBgYFxcblwiXG4gICAgY29uc3QgY2hhdCA9IGAke2NvZGV9XFxuW1BsYXlncm91bmQgTGlua10oJHtmdWxsVVJMfSlgXG4gICAgdWkuc2hvd01vZGFsKGNoYXQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXhwb3J0cy1kcm9wZG93blwiKSEsIFwiTWFya2Rvd24gY29kZVwiLCB1bmRlZmluZWQsIGUpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBleHBvcnRBc1R3ZWV0KCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gc2FuZGJveC5jcmVhdGVVUkxRdWVyeVdpdGhDb21waWxlck9wdGlvbnMoc2FuZGJveClcbiAgICBjb25zdCBmdWxsVVJMID0gYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly8ke2RvY3VtZW50LmxvY2F0aW9uLmhvc3R9JHtkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZX0ke3F1ZXJ5fWBcblxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmFzc2lnbihgaHR0cDovL3d3dy50d2l0dGVyLmNvbS9zaGFyZT91cmw9JHtmdWxsVVJMfWApXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9wZW5Qcm9qZWN0SW5TdGFja0JsaXR6LFxuICAgIG9wZW5Qcm9qZWN0SW5Db2RlU2FuZGJveCxcbiAgICBjb3B5QXNNYXJrZG93bklzc3VlLFxuICAgIGNvcHlGb3JDaGF0LFxuICAgIGNvcHlGb3JDaGF0V2l0aFByZXZpZXcsXG4gICAgb3BlbkluVFNBU1QsXG4gICAgb3BlbkluQnVnV29ya2JlbmNoLFxuICAgIG9wZW5JblZTQ29kZURldixcbiAgICBleHBvcnRBc1R3ZWV0LFxuICB9XG59XG4iXX0=