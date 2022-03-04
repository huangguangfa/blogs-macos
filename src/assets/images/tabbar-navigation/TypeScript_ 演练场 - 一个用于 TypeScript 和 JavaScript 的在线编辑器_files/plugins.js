define(["require", "exports", "./fixtures/npmPlugins"], function (require, exports, npmPlugins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.optionsPlugin = exports.addCustomPlugin = exports.activePlugins = exports.allowConnectingToLocalhost = void 0;
    const pluginRegistry = ["typescript-playground-presentation-mode", "playground-transformer-timeline"];
    /** Whether the playground should actively reach out to an existing plugin */
    const allowConnectingToLocalhost = () => {
        return !!localStorage.getItem("compiler-setting-connect-dev-plugin");
    };
    exports.allowConnectingToLocalhost = allowConnectingToLocalhost;
    const activePlugins = () => {
        const existing = customPlugins().map(module => ({ id: module }));
        return existing.concat(npmPlugins_1.allNPMPlugins.filter(p => !!localStorage.getItem("plugin-" + p.id)));
    };
    exports.activePlugins = activePlugins;
    const removeCustomPlugins = (mod) => {
        const newPlugins = customPlugins().filter(p => p !== mod);
        localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins));
    };
    const addCustomPlugin = (mod) => {
        const newPlugins = customPlugins();
        newPlugins.push(mod);
        localStorage.setItem("custom-plugins-playground", JSON.stringify(newPlugins));
        // @ts-ignore
        window.appInsights &&
            // @ts-ignore
            window.appInsights.trackEvent({ name: "Added Custom Module", properties: { id: mod } });
    };
    exports.addCustomPlugin = addCustomPlugin;
    const customPlugins = () => {
        return JSON.parse(localStorage.getItem("custom-plugins-playground") || "[]");
    };
    const optionsPlugin = (i, utils) => {
        const plugin = {
            id: "plugins",
            displayName: i("play_sidebar_plugins"),
            // shouldBeSelected: () => true, // uncomment to make this the first tab on reloads
            willMount: (_sandbox, container) => {
                const ds = utils.createDesignSystem(container);
                const featured = npmPlugins_1.allNPMPlugins.filter(p => pluginRegistry.includes(p.id));
                const rest = npmPlugins_1.allNPMPlugins.filter(p => !pluginRegistry.includes(p.id));
                ds.subtitle(i("play_sidebar_featured_plugins"));
                const featuredPluginsOL = document.createElement("ol");
                featuredPluginsOL.className = "playground-plugins featured";
                featured.forEach(plugin => {
                    const settingButton = createPlugin(plugin);
                    featuredPluginsOL.appendChild(settingButton);
                });
                container.appendChild(featuredPluginsOL);
                ds.subtitle(i("play_sidebar_plugins_options_external"));
                const pluginsOL = document.createElement("ol");
                pluginsOL.className = "playground-plugins";
                rest.forEach(plugin => {
                    const settingButton = createPlugin(plugin);
                    pluginsOL.appendChild(settingButton);
                });
                container.appendChild(pluginsOL);
                const warning = document.createElement("p");
                warning.className = "warning";
                warning.textContent = i("play_sidebar_plugins_options_external_warning");
                container.appendChild(warning);
                const subheading = ds.subtitle(i("play_sidebar_plugins_options_modules"));
                subheading.id = "custom-modules-header";
                const customModulesOL = document.createElement("ol");
                customModulesOL.className = "custom-modules";
                const updateCustomModules = () => {
                    while (customModulesOL.firstChild) {
                        customModulesOL.removeChild(customModulesOL.firstChild);
                    }
                    customPlugins().forEach(module => {
                        const li = document.createElement("li");
                        li.innerHTML = module;
                        const a = document.createElement("a");
                        a.href = "#";
                        a.textContent = "X";
                        a.onclick = () => {
                            removeCustomPlugins(module);
                            updateCustomModules();
                            ds.declareRestartRequired(i);
                            return false;
                        };
                        li.appendChild(a);
                        customModulesOL.appendChild(li);
                    });
                };
                updateCustomModules();
                container.appendChild(customModulesOL);
                const inputForm = createNewModuleInputForm(updateCustomModules, i);
                container.appendChild(inputForm);
                ds.subtitle(i("play_sidebar_plugins_plugin_dev"));
                const pluginsDevOL = document.createElement("ol");
                pluginsDevOL.className = "playground-options";
                const connectToDev = ds.localStorageOption({
                    display: i("play_sidebar_plugins_plugin_dev_option"),
                    blurb: i("play_sidebar_plugins_plugin_dev_copy"),
                    flag: "compiler-setting-connect-dev-plugin",
                    onchange: () => {
                        ds.declareRestartRequired(i);
                    },
                });
                pluginsDevOL.appendChild(connectToDev);
                container.appendChild(pluginsDevOL);
            },
        };
        const createPlugin = (plugin) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const label = document.createElement("label");
            // Avoid XSS by someone injecting JS via the description, which is the only free text someone can use
            var p = document.createElement("p");
            p.appendChild(document.createTextNode(plugin.description));
            const escapedDescription = p.innerHTML;
            const top = `<span>${plugin.name}</span> by <a href='https://www.npmjs.com/~${plugin.author}'>${plugin.author}</a><br/>${escapedDescription}`;
            const repo = plugin.href.includes("github") ? `| <a href="${plugin.href}">repo</a>` : "";
            const bottom = `<a href='https://www.npmjs.com/package/${plugin.id}'>npm</a> ${repo}`;
            label.innerHTML = `${top}<br/>${bottom}`;
            const key = "plugin-" + plugin.id;
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = key;
            input.checked = !!localStorage.getItem(key);
            input.onchange = () => {
                const ds = utils.createDesignSystem(div);
                ds.declareRestartRequired(i);
                if (input.checked) {
                    // @ts-ignore
                    window.appInsights &&
                        // @ts-ignore
                        window.appInsights.trackEvent({ name: "Added Registry Plugin", properties: { id: key } });
                    localStorage.setItem(key, "true");
                }
                else {
                    localStorage.removeItem(key);
                }
            };
            label.htmlFor = input.id;
            div.appendChild(input);
            div.appendChild(label);
            li.appendChild(div);
            return li;
        };
        const createNewModuleInputForm = (updateOL, i) => {
            const form = document.createElement("form");
            const newModuleInput = document.createElement("input");
            newModuleInput.type = "text";
            newModuleInput.placeholder = i("play_sidebar_plugins_options_modules_placeholder");
            newModuleInput.setAttribute("aria-labelledby", "custom-modules-header");
            form.appendChild(newModuleInput);
            form.onsubmit = e => {
                const ds = utils.createDesignSystem(form);
                ds.declareRestartRequired(i);
                (0, exports.addCustomPlugin)(newModuleInput.value);
                e.stopPropagation();
                updateOL();
                return false;
            };
            return form;
        };
        return plugin;
    };
    exports.optionsPlugin = optionsPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2lucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvcGx1Z2lucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBSUEsTUFBTSxjQUFjLEdBQUcsQ0FBQyx5Q0FBeUMsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFBO0lBRXJHLDZFQUE2RTtJQUN0RSxNQUFNLDBCQUEwQixHQUFHLEdBQUcsRUFBRTtRQUM3QyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7SUFDdEUsQ0FBQyxDQUFBO0lBRlksUUFBQSwwQkFBMEIsOEJBRXRDO0lBRU0sTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sUUFBUSxHQUFHLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2hFLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQywwQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzdGLENBQUMsQ0FBQTtJQUhZLFFBQUEsYUFBYSxpQkFHekI7SUFFRCxNQUFNLG1CQUFtQixHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7UUFDMUMsTUFBTSxVQUFVLEdBQUcsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBQ3pELFlBQVksQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBQy9FLENBQUMsQ0FBQTtJQUVNLE1BQU0s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QUUsdUJBQXVCLENBQUMsQ0FBQTtZQUN2RSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBRWhDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDekMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUU1QixJQUFBLHVCQUFlLEVBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNyQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7Z0JBQ25CLFFBQVEsRUFBRSxDQUFBO2dCQUNWLE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQyxDQUFBO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQTtJQTNKWSxRQUFBLGFBQWEsaUJBMkp6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsYXlncm91bmRQbHVnaW4sIFBsdWdpbkZhY3RvcnkgfSBmcm9tIFwiLi5cIlxuXG5pbXBvcnQgeyBhbGxOUE1QbHVnaW5zIH0gZnJvbSBcIi4vZml4dHVyZXMvbnBtUGx1Z2luc1wiXG5cbmNvbnN0IHBsdWdpblJlZ2lzdHJ5ID0gW1widHlwZXNjcmlwdC1wbGF5Z3JvdW5kLXByZXNlbnRhdGlvbi1tb2RlXCIsIFwicGxheWdyb3VuZC10cmFuc2Zvcm1lci10aW1lbGluZVwiXVxuXG4vKiogV2hldGhlciB0aGUgcGxheWdyb3VuZCBzaG91bGQgYWN0aXZlbHkgcmVhY2ggb3V0IHRvIGFuIGV4aXN0aW5nIHBsdWdpbiAqL1xuZXhwb3J0IGNvbnN0IGFsbG93Q29ubmVjdGluZ1RvTG9jYWxob3N0ID0gKCkgPT4ge1xuICByZXR1cm4gISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNvbXBpbGVyLXNldHRpbmctY29ubmVjdC1kZXYtcGx1Z2luXCIpXG59XG5cbmV4cG9ydCBjb25zdCBhY3RpdmVQbHVnaW5zID0gKCkgPT4ge1xuICBjb25zdCBleGlzdGluZyA9IGN1c3RvbVBsdWdpbnMoKS5tYXAobW9kdWxlID0+ICh7IGlkOiBtb2R1bGUgfSkpXG4gIHJldHVybiBleGlzdGluZy5jb25jYXQoYWxsTlBNUGx1Z2lucy5maWx0ZXIocCA9PiAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGx1Z2luLVwiICsgcC5pZCkpKVxufVxuXG5jb25zdCByZW1vdmVDdXN0b21QbHVnaW5zID0gKG1vZDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IG5ld1BsdWdpbnMgPSBjdXN0b21QbHVnaW5zKCkuZmlsdGVyKHAgPT4gcCAhPT0gbW9kKVxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImN1c3RvbS1wbHVnaW5zLXBsYXlncm91bmRcIiwgSlNPTi5zdHJpbmdpZnkobmV3UGx1Z2lucykpXG59XG5cbmV4cG9ydCBjb25zdCBhZGRDdXN0b21QbHVnaW4gPSAobW9kOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgbmV3UGx1Z2lucyA9IGN1c3RvbVBsdWdpbnMoKVxuICBuZXdQbHVnaW5zLnB1c2gobW9kKVxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImN1c3RvbS1wbHVnaW5zLXBsYXlncm91bmRcIiwgSlNPTi5zdHJpbmdpZnkobmV3UGx1Z2lucykpXG4gIC8vIEB0cy1pZ25vcmVcbiAgd2luZG93LmFwcEluc2lnaHRzICYmXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdpbmRvdy5hcHBJbnNpZ2h0cy50cmFja0V2ZW50KHsgbmFtZTogXCJBZGRlZCBDdXN0b20gTW9kdWxlXCIsIHByb3BlcnRpZXM6IHsgaWQ6IG1vZCB9IH0pXG59XG5cbmNvbnN0IGN1c3RvbVBsdWdpbnMgPSAoKTogc3RyaW5nW10gPT4ge1xuICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImN1c3RvbS1wbHVnaW5zLXBsYXlncm91bmRcIikgfHwgXCJbXVwiKVxufVxuXG5leHBvcnQgY29uc3Qgb3B0aW9uc1BsdWdpbjogUGx1Z2luRmFjdG9yeSA9IChpLCB1dGlscykgPT4ge1xuICBjb25zdCBwbHVnaW46IFBsYXlncm91bmRQbHVnaW4gPSB7XG4gICAgaWQ6IFwicGx1Z2luc1wiLFxuICAgIGRpc3BsYXlOYW1lOiBpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNcIiksXG4gICAgLy8gc2hvdWxkQmVTZWxlY3RlZDogKCkgPT4gdHJ1ZSwgLy8gdW5jb21tZW50IHRvIG1ha2UgdGhpcyB0aGUgZmlyc3QgdGFiIG9uIHJlbG9hZHNcbiAgICB3aWxsTW91bnQ6IChfc2FuZGJveCwgY29udGFpbmVyKSA9PiB7XG4gICAgICBjb25zdCBkcyA9IHV0aWxzLmNyZWF0ZURlc2lnblN5c3RlbShjb250YWluZXIpXG5cbiAgICAgIGNvbnN0IGZlYXR1cmVkID0gYWxsTlBNUGx1Z2lucy5maWx0ZXIocCA9PiBwbHVnaW5SZWdpc3RyeS5pbmNsdWRlcyhwLmlkKSlcbiAgICAgIGNvbnN0IHJlc3QgPSBhbGxOUE1QbHVnaW5zLmZpbHRlcihwID0+ICFwbHVnaW5SZWdpc3RyeS5pbmNsdWRlcyhwLmlkKSlcblxuICAgICAgZHMuc3VidGl0bGUoaShcInBsYXlfc2lkZWJhcl9mZWF0dXJlZF9wbHVnaW5zXCIpKVxuXG4gICAgICBjb25zdCBmZWF0dXJlZFBsdWdpbnNPTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvbFwiKVxuICAgICAgZmVhdHVyZWRQbHVnaW5zT0wuY2xhc3NOYW1lID0gXCJwbGF5Z3JvdW5kLXBsdWdpbnMgZmVhdHVyZWRcIlxuICAgICAgZmVhdHVyZWQuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICBjb25zdCBzZXR0aW5nQnV0dG9uID0gY3JlYXRlUGx1Z2luKHBsdWdpbilcbiAgICAgICAgZmVhdHVyZWRQbHVnaW5zT0wuYXBwZW5kQ2hpbGQoc2V0dGluZ0J1dHRvbilcbiAgICAgIH0pXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZmVhdHVyZWRQbHVnaW5zT0wpXG5cbiAgICAgIGRzLnN1YnRpdGxlKGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19vcHRpb25zX2V4dGVybmFsXCIpKVxuXG4gICAgICBjb25zdCBwbHVnaW5zT0wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib2xcIilcbiAgICAgIHBsdWdpbnNPTC5jbGFzc05hbWUgPSBcInBsYXlncm91bmQtcGx1Z2luc1wiXG4gICAgICByZXN0LmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ0J1dHRvbiA9IGNyZWF0ZVBsdWdpbihwbHVnaW4pXG4gICAgICAgIHBsdWdpbnNPTC5hcHBlbmRDaGlsZChzZXR0aW5nQnV0dG9uKVxuICAgICAgfSlcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwbHVnaW5zT0wpXG5cbiAgICAgIGNvbnN0IHdhcm5pbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxuICAgICAgd2FybmluZy5jbGFzc05hbWUgPSBcIndhcm5pbmdcIlxuICAgICAgd2FybmluZy50ZXh0Q29udGVudCA9IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19vcHRpb25zX2V4dGVybmFsX3dhcm5pbmdcIilcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3YXJuaW5nKVxuXG4gICAgICBjb25zdCBzdWJoZWFkaW5nID0gZHMuc3VidGl0bGUoaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX29wdGlvbnNfbW9kdWxlc1wiKSlcbiAgICAgIHN1YmhlYWRpbmcuaWQgPSBcImN1c3RvbS1tb2R1bGVzLWhlYWRlclwiXG5cbiAgICAgIGNvbnN0IGN1c3RvbU1vZHVsZXNPTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvbFwiKVxuICAgICAgY3VzdG9tTW9kdWxlc09MLmNsYXNzTmFtZSA9IFwiY3VzdG9tLW1vZHVsZXNcIlxuXG4gICAgICBjb25zdCB1cGRhdGVDdXN0b21Nb2R1bGVzID0gKCkgPT4ge1xuICAgICAgICB3aGlsZSAoY3VzdG9tTW9kdWxlc09MLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBjdXN0b21Nb2R1bGVzT0wucmVtb3ZlQ2hpbGQoY3VzdG9tTW9kdWxlc09MLmZpcnN0Q2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgY3VzdG9tUGx1Z2lucygpLmZvckVhY2gobW9kdWxlID0+IHtcbiAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICAgIGxpLmlubmVySFRNTCA9IG1vZHVsZVxuICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgICAgICAgIGEuaHJlZiA9IFwiI1wiXG4gICAgICAgICAgYS50ZXh0Q29udGVudCA9IFwiWFwiXG4gICAgICAgICAgYS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlQ3VzdG9tUGx1Z2lucyhtb2R1bGUpXG4gICAgICAgICAgICB1cGRhdGVDdXN0b21Nb2R1bGVzKClcbiAgICAgICAgICAgIGRzLmRlY2xhcmVSZXN0YXJ0UmVxdWlyZWQoaSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBsaS5hcHBlbmRDaGlsZChhKVxuXG4gICAgICAgICAgY3VzdG9tTW9kdWxlc09MLmFwcGVuZENoaWxkKGxpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdXBkYXRlQ3VzdG9tTW9kdWxlcygpXG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjdXN0b21Nb2R1bGVzT0wpXG4gICAgICBjb25zdCBpbnB1dEZvcm0gPSBjcmVhdGVOZXdNb2R1bGVJbnB1dEZvcm0odXBkYXRlQ3VzdG9tTW9kdWxlcywgaSlcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnB1dEZvcm0pXG5cbiAgICAgIGRzLnN1YnRpdGxlKGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19wbHVnaW5fZGV2XCIpKVxuXG4gICAgICBjb25zdCBwbHVnaW5zRGV2T0wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib2xcIilcbiAgICAgIHBsdWdpbnNEZXZPTC5jbGFzc05hbWUgPSBcInBsYXlncm91bmQtb3B0aW9uc1wiXG5cbiAgICAgIGNvbnN0IGNvbm5lY3RUb0RldiA9IGRzLmxvY2FsU3RvcmFnZU9wdGlvbih7XG4gICAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19wbHVnaW5fZGV2X29wdGlvblwiKSxcbiAgICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19wbHVnaW5fZGV2X2NvcHlcIiksXG4gICAgICAgIGZsYWc6IFwiY29tcGlsZXItc2V0dGluZy1jb25uZWN0LWRldi1wbHVnaW5cIixcbiAgICAgICAgb25jaGFuZ2U6ICgpID0+IHtcbiAgICAgICAgICBkcy5kZWNsYXJlUmVzdGFydFJlcXVpcmVkKGkpXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBwbHVnaW5zRGV2T0wuYXBwZW5kQ2hpbGQoY29ubmVjdFRvRGV2KVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBsdWdpbnNEZXZPTClcbiAgICB9LFxuICB9XG5cbiAgY29uc3QgY3JlYXRlUGx1Z2luID0gKHBsdWdpbjogdHlwZW9mIGFsbE5QTVBsdWdpbnNbMF0pID0+IHtcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcblxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpXG5cbiAgICAvLyBBdm9pZCBYU1MgYnkgc29tZW9uZSBpbmplY3RpbmcgSlMgdmlhIHRoZSBkZXNjcmlwdGlvbiwgd2hpY2ggaXMgdGhlIG9ubHkgZnJlZSB0ZXh0IHNvbWVvbmUgY2FuIHVzZVxuICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIilcbiAgICBwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHBsdWdpbi5kZXNjcmlwdGlvbikpXG4gICAgY29uc3QgZXNjYXBlZERlc2NyaXB0aW9uID0gcC5pbm5lckhUTUxcblxuICAgIGNvbnN0IHRvcCA9IGA8c3Bhbj4ke3BsdWdpbi5uYW1lfTwvc3Bhbj4gYnkgPGEgaHJlZj0naHR0cHM6Ly93d3cubnBtanMuY29tL34ke3BsdWdpbi5hdXRob3J9Jz4ke3BsdWdpbi5hdXRob3J9PC9hPjxici8+JHtlc2NhcGVkRGVzY3JpcHRpb259YFxuICAgIGNvbnN0IHJlcG8gPSBwbHVnaW4uaHJlZi5pbmNsdWRlcyhcImdpdGh1YlwiKSA/IGB8IDxhIGhyZWY9XCIke3BsdWdpbi5ocmVmfVwiPnJlcG88L2E+YCA6IFwiXCJcbiAgICBjb25zdCBib3R0b20gPSBgPGEgaHJlZj0naHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvJHtwbHVnaW4uaWR9Jz5ucG08L2E+ICR7cmVwb31gXG4gICAgbGFiZWwuaW5uZXJIVE1MID0gYCR7dG9wfTxici8+JHtib3R0b219YFxuXG4gICAgY29uc3Qga2V5ID0gXCJwbHVnaW4tXCIgKyBwbHVnaW4uaWRcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCJcbiAgICBpbnB1dC5pZCA9IGtleVxuICAgIGlucHV0LmNoZWNrZWQgPSAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcblxuICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgY29uc3QgZHMgPSB1dGlscy5jcmVhdGVEZXNpZ25TeXN0ZW0oZGl2KVxuICAgICAgZHMuZGVjbGFyZVJlc3RhcnRSZXF1aXJlZChpKVxuICAgICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB3aW5kb3cuYXBwSW5zaWdodHMgJiZcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgd2luZG93LmFwcEluc2lnaHRzLnRyYWNrRXZlbnQoeyBuYW1lOiBcIkFkZGVkIFJlZ2lzdHJ5IFBsdWdpblwiLCBwcm9wZXJ0aWVzOiB7IGlkOiBrZXkgfSB9KVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIFwidHJ1ZVwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIGxhYmVsLmh0bWxGb3IgPSBpbnB1dC5pZFxuXG4gICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KVxuICAgIGRpdi5hcHBlbmRDaGlsZChsYWJlbClcbiAgICBsaS5hcHBlbmRDaGlsZChkaXYpXG4gICAgcmV0dXJuIGxpXG4gIH1cblxuICBjb25zdCBjcmVhdGVOZXdNb2R1bGVJbnB1dEZvcm0gPSAodXBkYXRlT0w6IEZ1bmN0aW9uLCBpOiBhbnkpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIilcblxuICAgIGNvbnN0IG5ld01vZHVsZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgbmV3TW9kdWxlSW5wdXQudHlwZSA9IFwidGV4dFwiXG4gICAgbmV3TW9kdWxlSW5wdXQucGxhY2Vob2xkZXIgPSBpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfb3B0aW9uc19tb2R1bGVzX3BsYWNlaG9sZGVyXCIpXG4gICAgbmV3TW9kdWxlSW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiY3VzdG9tLW1vZHVsZXMtaGVhZGVyXCIpXG4gICAgZm9ybS5hcHBlbmRDaGlsZChuZXdNb2R1bGVJbnB1dClcblxuICAgIGZvcm0ub25zdWJtaXQgPSBlID0+IHtcbiAgICAgIGNvbnN0IGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGZvcm0pXG4gICAgICBkcy5kZWNsYXJlUmVzdGFydFJlcXVpcmVkKGkpXG5cbiAgICAgIGFkZEN1c3RvbVBsdWdpbihuZXdNb2R1bGVJbnB1dC52YWx1ZSlcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHVwZGF0ZU9MKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICByZXR1cm4gcGx1Z2luXG59XG4iXX0=