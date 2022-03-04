var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./showDTS", "./showJS", "./showErrors", "./plugins", "./ast", "./runtime"], function (require, exports, showDTS_1, showJS_1, showErrors_1, plugins_1, ast_1, runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settingsPlugin = exports.getPlaygroundPlugins = void 0;
    const getPlaygroundPlugins = () => {
        const defaults = [];
        if (!localStorage.getItem("disable-sidebar-js"))
            defaults.push(showJS_1.compiledJSPlugin);
        if (!localStorage.getItem("disable-sidebar-dts"))
            defaults.push(showDTS_1.showDTSPlugin);
        if (!localStorage.getItem("disable-sidebar-err"))
            defaults.push(showErrors_1.showErrors);
        if (!localStorage.getItem("disable-sidebar-run"))
            defaults.push(runtime_1.runPlugin);
        if (!localStorage.getItem("disable-sidebar-plugins"))
            defaults.push(plugins_1.optionsPlugin);
        // Sidebar items which are more dev/introspection focused
        if (localStorage.getItem("enable-sidebar-ast"))
            defaults.push(ast_1.showASTPlugin);
        // Don't let it ever be zero, this is mostly laziness on my part but every
        // possible UI state needs to be considered across so many other states
        // and reducing the matrix is worth it
        if (defaults.length === 0)
            defaults.push(showJS_1.compiledJSPlugin);
        return defaults;
    };
    exports.getPlaygroundPlugins = getPlaygroundPlugins;
    const settingsPlugin = (i, utils) => {
        const settings = [
            {
                display: i("play_sidebar_options_disable_ata"),
                blurb: i("play_sidebar_options_disable_ata_copy"),
                flag: "disable-ata",
            },
            {
                display: i("play_sidebar_options_disable_save"),
                blurb: i("play_sidebar_options_disable_save_copy"),
                flag: "disable-save-on-type",
            },
            // {
            //   display: 'Verbose Logging',
            //   blurb: 'Turn on superfluous logging',
            //   flag: 'enable-superfluous-logging',
            // },
        ];
        const uiPlugins = [
            {
                display: i("play_sidebar_js_title"),
                blurb: i("play_sidebar_js_blurb"),
                flag: "disable-sidebar-js",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_dts_title"),
                blurb: i("play_sidebar_dts_blurb"),
                flag: "disable-sidebar-dts",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_err_title"),
                blurb: i("play_sidebar_err_blurb"),
                flag: "disable-sidebar-err",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_run_title"),
                blurb: i("play_sidebar_run_blurb"),
                flag: "disable-sidebar-run",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_plugins_title"),
                blurb: i("play_sidebar_plugins_blurb"),
                flag: "disable-sidebar-plugins",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_ast_title"),
                blurb: i("play_sidebar_ast_blurb"),
                flag: "enable-sidebar-ast",
            },
        ];
        const plugin = {
            id: "settings",
            displayName: i("play_subnav_settings"),
            didMount: (sandbox, container) => __awaiter(void 0, void 0, void 0, function* () {
                const ds = utils.createDesignSystem(container);
                ds.subtitle(i("play_subnav_settings"));
                ds.showOptionList(settings, { style: "separated", requireRestart: true });
                ds.subtitle(i("play_settings_tabs_settings"));
                ds.showOptionList(uiPlugins, { style: "separated", requireRestart: true });
            }),
        };
        return plugin;
    };
    exports.settingsPlugin = settingsPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9zaWRlYmFyL3NldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFTTyxNQUFNLG9CQUFvQixHQUFHLEdBQW9CLEVBQUU7UUFDeEQsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx5QkFBZ0IsQ0FBQyxDQUFBO1FBQ2hGLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBYSxDQUFDLENBQUE7UUFDOUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7WUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsQ0FBQTtRQUMzRSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztZQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQVMsQ0FBQyxDQUFBO1FBQzFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBYSxDQUFDLENBQUE7UUFFbEYseURBQXlEO1FBQ3pELElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztZQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWEsQ0FBQyxDQUFBO1FBRTVFLDBFQUEwRTtRQUMxRSx1RUFBdUU7UUFDdkUsc0NBQXNDO1FBQ3RDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx5QkFBZ0IsQ0FBQyxDQUFBO1FBRTFELE9BQU8sUUFBUSxDQUFBO0lBQ2pC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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5IH0gZnJvbSBcIi4uXCJcbmltcG9ydCB7IHNob3dEVFNQbHVnaW4gfSBmcm9tIFwiLi9zaG93RFRTXCJcbmltcG9ydCB7IGNvbXBpbGVkSlNQbHVnaW4gfSBmcm9tIFwiLi9zaG93SlNcIlxuaW1wb3J0IHsgc2hvd0Vycm9ycyB9IGZyb20gXCIuL3Nob3dFcnJvcnNcIlxuaW1wb3J0IHsgb3B0aW9uc1BsdWdpbiB9IGZyb20gXCIuL3BsdWdpbnNcIlxuaW1wb3J0IHsgc2hvd0FTVFBsdWdpbiB9IGZyb20gXCIuL2FzdFwiXG5pbXBvcnQgeyBydW5QbHVnaW4gfSBmcm9tIFwiLi9ydW50aW1lXCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZU9wdGlvbiB9IGZyb20gXCIuLi9kcy9jcmVhdGVEZXNpZ25TeXN0ZW1cIlxuXG5leHBvcnQgY29uc3QgZ2V0UGxheWdyb3VuZFBsdWdpbnMgPSAoKTogUGx1Z2luRmFjdG9yeVtdID0+IHtcbiAgY29uc3QgZGVmYXVsdHMgPSBbXVxuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZGlzYWJsZS1zaWRlYmFyLWpzXCIpKSBkZWZhdWx0cy5wdXNoKGNvbXBpbGVkSlNQbHVnaW4pXG4gIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkaXNhYmxlLXNpZGViYXItZHRzXCIpKSBkZWZhdWx0cy5wdXNoKHNob3dEVFNQbHVnaW4pXG4gIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkaXNhYmxlLXNpZGViYXItZXJyXCIpKSBkZWZhdWx0cy5wdXNoKHNob3dFcnJvcnMpXG4gIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkaXNhYmxlLXNpZGViYXItcnVuXCIpKSBkZWZhdWx0cy5wdXNoKHJ1blBsdWdpbilcbiAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpc2FibGUtc2lkZWJhci1wbHVnaW5zXCIpKSBkZWZhdWx0cy5wdXNoKG9wdGlvbnNQbHVnaW4pXG5cbiAgLy8gU2lkZWJhciBpdGVtcyB3aGljaCBhcmUgbW9yZSBkZXYvaW50cm9zcGVjdGlvbiBmb2N1c2VkXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImVuYWJsZS1zaWRlYmFyLWFzdFwiKSkgZGVmYXVsdHMucHVzaChzaG93QVNUUGx1Z2luKVxuXG4gIC8vIERvbid0IGxldCBpdCBldmVyIGJlIHplcm8sIHRoaXMgaXMgbW9zdGx5IGxhemluZXNzIG9uIG15IHBhcnQgYnV0IGV2ZXJ5XG4gIC8vIHBvc3NpYmxlIFVJIHN0YXRlIG5lZWRzIHRvIGJlIGNvbnNpZGVyZWQgYWNyb3NzIHNvIG1hbnkgb3RoZXIgc3RhdGVzXG4gIC8vIGFuZCByZWR1Y2luZyB0aGUgbWF0cml4IGlzIHdvcnRoIGl0XG4gIGlmIChkZWZhdWx0cy5sZW5ndGggPT09IDApIGRlZmF1bHRzLnB1c2goY29tcGlsZWRKU1BsdWdpbilcblxuICByZXR1cm4gZGVmYXVsdHNcbn1cblxuZXhwb3J0IGNvbnN0IHNldHRpbmdzUGx1Z2luOiBQbHVnaW5GYWN0b3J5ID0gKGksIHV0aWxzKSA9PiB7XG4gIGNvbnN0IHNldHRpbmdzOiBMb2NhbFN0b3JhZ2VPcHRpb25bXSA9IFtcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX29wdGlvbnNfZGlzYWJsZV9hdGFcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9vcHRpb25zX2Rpc2FibGVfYXRhX2NvcHlcIiksXG4gICAgICBmbGFnOiBcImRpc2FibGUtYXRhXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX29wdGlvbnNfZGlzYWJsZV9zYXZlXCIpLFxuICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfb3B0aW9uc19kaXNhYmxlX3NhdmVfY29weVwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1zYXZlLW9uLXR5cGVcIixcbiAgICB9LFxuICAgIC8vIHtcbiAgICAvLyAgIGRpc3BsYXk6ICdWZXJib3NlIExvZ2dpbmcnLFxuICAgIC8vICAgYmx1cmI6ICdUdXJuIG9uIHN1cGVyZmx1b3VzIGxvZ2dpbmcnLFxuICAgIC8vICAgZmxhZzogJ2VuYWJsZS1zdXBlcmZsdW91cy1sb2dnaW5nJyxcbiAgICAvLyB9LFxuICBdXG5cbiAgY29uc3QgdWlQbHVnaW5zOiBMb2NhbFN0b3JhZ2VPcHRpb25bXSA9IFtcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX2pzX3RpdGxlXCIpLFxuICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfanNfYmx1cmJcIiksXG4gICAgICBmbGFnOiBcImRpc2FibGUtc2lkZWJhci1qc1wiLFxuICAgICAgZW1wdHlJbXBsaWVzRW5hYmxlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfZHRzX3RpdGxlXCIpLFxuICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfZHRzX2JsdXJiXCIpLFxuICAgICAgZmxhZzogXCJkaXNhYmxlLXNpZGViYXItZHRzXCIsXG4gICAgICBlbXB0eUltcGxpZXNFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlzcGxheTogaShcInBsYXlfc2lkZWJhcl9lcnJfdGl0bGVcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9lcnJfYmx1cmJcIiksXG4gICAgICBmbGFnOiBcImRpc2FibGUtc2lkZWJhci1lcnJcIixcbiAgICAgIGVtcHR5SW1wbGllc0VuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX3J1bl90aXRsZVwiKSxcbiAgICAgIGJsdXJiOiBpKFwicGxheV9zaWRlYmFyX3J1bl9ibHVyYlwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1zaWRlYmFyLXJ1blwiLFxuICAgICAgZW1wdHlJbXBsaWVzRW5hYmxlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc190aXRsZVwiKSxcbiAgICAgIGJsdXJiOiBpKFwicGxheV9zaWRlYmFyX3BsdWdpbnNfYmx1cmJcIiksXG4gICAgICBmbGFnOiBcImRpc2FibGUtc2lkZWJhci1wbHVnaW5zXCIsXG4gICAgICBlbXB0eUltcGxpZXNFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlzcGxheTogaShcInBsYXlfc2lkZWJhcl9hc3RfdGl0bGVcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9hc3RfYmx1cmJcIiksXG4gICAgICBmbGFnOiBcImVuYWJsZS1zaWRlYmFyLWFzdFwiLFxuICAgIH0sXG4gIF1cblxuICBjb25zdCBwbHVnaW46IFBsYXlncm91bmRQbHVnaW4gPSB7XG4gICAgaWQ6IFwic2V0dGluZ3NcIixcbiAgICBkaXNwbGF5TmFtZTogaShcInBsYXlfc3VibmF2X3NldHRpbmdzXCIpLFxuICAgIGRpZE1vdW50OiBhc3luYyAoc2FuZGJveCwgY29udGFpbmVyKSA9PiB7XG4gICAgICBjb25zdCBkcyA9IHV0aWxzLmNyZWF0ZURlc2lnblN5c3RlbShjb250YWluZXIpXG5cbiAgICAgIGRzLnN1YnRpdGxlKGkoXCJwbGF5X3N1Ym5hdl9zZXR0aW5nc1wiKSlcbiAgICAgIGRzLnNob3dPcHRpb25MaXN0KHNldHRpbmdzLCB7IHN0eWxlOiBcInNlcGFyYXRlZFwiLCByZXF1aXJlUmVzdGFydDogdHJ1ZSB9KVxuXG4gICAgICBkcy5zdWJ0aXRsZShpKFwicGxheV9zZXR0aW5nc190YWJzX3NldHRpbmdzXCIpKVxuICAgICAgZHMuc2hvd09wdGlvbkxpc3QodWlQbHVnaW5zLCB7IHN0eWxlOiBcInNlcGFyYXRlZFwiLCByZXF1aXJlUmVzdGFydDogdHJ1ZSB9KVxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gcGx1Z2luXG59XG4iXX0=