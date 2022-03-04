define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapModuleNameToModule = void 0;
    /** Converts some of the known global imports to node so that we grab the right info */
    const mapModuleNameToModule = (name) => {
        // in node repl:
        // > require("module").builtinModules
        const builtInNodeMods = [
            "assert",
            "assert/strict",
            "async_hooks",
            "buffer",
            "child_process",
            "cluster",
            "console",
            "constants",
            "crypto",
            "dgram",
            "diagnostics_channel",
            "dns",
            "dns/promises",
            "domain",
            "events",
            "fs",
            "fs/promises",
            "http",
            "http2",
            "https",
            "inspector",
            "module",
            "net",
            "os",
            "path",
            "path/posix",
            "path/win32",
            "perf_hooks",
            "process",
            "punycode",
            "querystring",
            "readline",
            "repl",
            "stream",
            "stream/promises",
            "stream/consumers",
            "stream/web",
            "string_decoder",
            "sys",
            "timers",
            "timers/promises",
            "tls",
            "trace_events",
            "tty",
            "url",
            "util",
            "util/types",
            "v8",
            "vm",
            "wasi",
            "worker_threads",
            "zlib",
        ];
        if (builtInNodeMods.includes(name.replace("node:", ""))) {
            return "node";
        }
        return name;
    };
    exports.mapModuleNameToModule = mapModuleNameToModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRnZUNhc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvdmVuZG9yL2F0YS9lZGdlQ2FzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUFBLHVGQUF1RjtJQUNoRixNQUFNLHFCQUFxQixHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDcEQsZ0JBQWdCO1FBQ2hCLHFDQUFxQztRQUNyQyxNQUFNLGVBQWUsR0FBRztZQUN0QixRQUFRO1lBQ1IsZUFBZTtZQUNmLGFBQWE7WUFDYixRQUFRO1lBQ1IsZUFBZTtZQUNmLFNBQVM7WUFDVCxTQUFTO1lBQ1QsV0FBVztZQUNYLFFBQVE7WUFDUixPQUFPO1lBQ1AscUJBQXFCO1lBQ3JCLEtBQUs7WUFDTCxjQUFjO1lBQ2QsUUFBUTtZQUNSLFFBQVE7WUFDUixJQUFJO1lBQ0osYUFBYTtZQUNiLE1BQU07WUFDTixPQUFPO1lBQ1AsT0FBTztZQUNQLFdBQVc7WUFDWCxRQUFRO1lBQ1IsS0FBSztZQUNMLElBQUk7WUFDSixNQUFNO1lBQ04sWUFBWTtZQUNaLFlBQVk7WUFDWixZQUFZO1lBQ1osU0FBUztZQUNULFVBQVU7WUFDVixhQUFhO1lBQ2IsVUFBVTtZQUNWLE1BQU07WUFDTixRQUFRO1lBQ1IsaUJBQWlCO1lBQ2pCLGtCQUFrQjtZQUNsQixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLEtBQUs7WUFDTCxRQUFRO1lBQ1IsaUJBQWlCO1lBQ2pCLEtBQUs7WUFDTCxjQUFjO1lBQ2QsS0FBSztZQUNMLEtBQUs7WUFDTCxNQUFNO1lBQ04sWUFBWTtZQUNaLElBQUk7WUFDSixJQUFJO1lBQ0osTUFBTTtZQUNOLGdCQUFnQjtZQUNoQixNQUFNO1NBQ1AsQ0FBQTtRQUVELElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3ZELE9BQU8sTUFBTSxDQUFBO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsQ0FBQTtJQS9EWSxRQUFBLHFCQUFxQix5QkErRGpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIENvbnZlcnRzIHNvbWUgb2YgdGhlIGtub3duIGdsb2JhbCBpbXBvcnRzIHRvIG5vZGUgc28gdGhhdCB3ZSBncmFiIHRoZSByaWdodCBpbmZvICovXG5leHBvcnQgY29uc3QgbWFwTW9kdWxlTmFtZVRvTW9kdWxlID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAvLyBpbiBub2RlIHJlcGw6XG4gIC8vID4gcmVxdWlyZShcIm1vZHVsZVwiKS5idWlsdGluTW9kdWxlc1xuICBjb25zdCBidWlsdEluTm9kZU1vZHMgPSBbXG4gICAgXCJhc3NlcnRcIixcbiAgICBcImFzc2VydC9zdHJpY3RcIixcbiAgICBcImFzeW5jX2hvb2tzXCIsXG4gICAgXCJidWZmZXJcIixcbiAgICBcImNoaWxkX3Byb2Nlc3NcIixcbiAgICBcImNsdXN0ZXJcIixcbiAgICBcImNvbnNvbGVcIixcbiAgICBcImNvbnN0YW50c1wiLFxuICAgIFwiY3J5cHRvXCIsXG4gICAgXCJkZ3JhbVwiLFxuICAgIFwiZGlhZ25vc3RpY3NfY2hhbm5lbFwiLFxuICAgIFwiZG5zXCIsXG4gICAgXCJkbnMvcHJvbWlzZXNcIixcbiAgICBcImRvbWFpblwiLFxuICAgIFwiZXZlbnRzXCIsXG4gICAgXCJmc1wiLFxuICAgIFwiZnMvcHJvbWlzZXNcIixcbiAgICBcImh0dHBcIixcbiAgICBcImh0dHAyXCIsXG4gICAgXCJodHRwc1wiLFxuICAgIFwiaW5zcGVjdG9yXCIsXG4gICAgXCJtb2R1bGVcIixcbiAgICBcIm5ldFwiLFxuICAgIFwib3NcIixcbiAgICBcInBhdGhcIixcbiAgICBcInBhdGgvcG9zaXhcIixcbiAgICBcInBhdGgvd2luMzJcIixcbiAgICBcInBlcmZfaG9va3NcIixcbiAgICBcInByb2Nlc3NcIixcbiAgICBcInB1bnljb2RlXCIsXG4gICAgXCJxdWVyeXN0cmluZ1wiLFxuICAgIFwicmVhZGxpbmVcIixcbiAgICBcInJlcGxcIixcbiAgICBcInN0cmVhbVwiLFxuICAgIFwic3RyZWFtL3Byb21pc2VzXCIsXG4gICAgXCJzdHJlYW0vY29uc3VtZXJzXCIsXG4gICAgXCJzdHJlYW0vd2ViXCIsXG4gICAgXCJzdHJpbmdfZGVjb2RlclwiLFxuICAgIFwic3lzXCIsXG4gICAgXCJ0aW1lcnNcIixcbiAgICBcInRpbWVycy9wcm9taXNlc1wiLFxuICAgIFwidGxzXCIsXG4gICAgXCJ0cmFjZV9ldmVudHNcIixcbiAgICBcInR0eVwiLFxuICAgIFwidXJsXCIsXG4gICAgXCJ1dGlsXCIsXG4gICAgXCJ1dGlsL3R5cGVzXCIsXG4gICAgXCJ2OFwiLFxuICAgIFwidm1cIixcbiAgICBcIndhc2lcIixcbiAgICBcIndvcmtlcl90aHJlYWRzXCIsXG4gICAgXCJ6bGliXCIsXG4gIF1cblxuICBpZiAoYnVpbHRJbk5vZGVNb2RzLmluY2x1ZGVzKG5hbWUucmVwbGFjZShcIm5vZGU6XCIsIFwiXCIpKSkge1xuICAgIHJldHVybiBcIm5vZGVcIlxuICB9XG5cbiAgcmV0dXJuIG5hbWVcbn1cbiJdfQ==