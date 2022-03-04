define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.twoslashCompletions = exports.parsePrimitive = exports.extractTwoSlashCompilerOptions = void 0;
    const booleanConfigRegexp = /^\/\/\s?@(\w+)$/;
    // https://regex101.com/r/8B2Wwh/1
    const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/;
    /**
     * This is a port of the twoslash bit which grabs compiler options
     * from the source code
     */
    const extractTwoSlashCompilerOptions = (ts) => {
        let optMap = new Map();
        if (!("optionDeclarations" in ts)) {
            console.error("Could not get compiler options from ts.optionDeclarations - skipping twoslash support.");
        }
        else {
            // @ts-ignore - optionDeclarations is not public API
            for (const opt of ts.optionDeclarations) {
                optMap.set(opt.name.toLowerCase(), opt);
            }
        }
        return (code) => {
            const codeLines = code.split("\n");
            const options = {};
            codeLines.forEach(_line => {
                let match;
                const line = _line.trim();
                if ((match = booleanConfigRegexp.exec(line))) {
                    if (optMap.has(match[1].toLowerCase())) {
                        options[match[1]] = true;
                        setOption(match[1], "true", options, optMap);
                    }
                }
                else if ((match = valuedConfigRegexp.exec(line))) {
                    if (optMap.has(match[1].toLowerCase())) {
                        setOption(match[1], match[2], options, optMap);
                    }
                }
            });
            return options;
        };
    };
    exports.extractTwoSlashCompilerOptions = extractTwoSlashCompilerOptions;
    function setOption(name, value, opts, optMap) {
        const opt = optMap.get(name.toLowerCase());
        if (!opt)
            return;
        switch (opt.type) {
            case "number":
            case "string":
            case "boolean":
                opts[opt.name] = parsePrimitive(value, opt.type);
                break;
            case "list":
                const elementType = opt.element.type;
                const strings = value.split(",");
                if (typeof elementType === "string") {
                    opts[opt.name] = strings.map(v => parsePrimitive(v, elementType));
                }
                else {
                    opts[opt.name] = strings.map(v => getOptionValueFromMap(opt.name, v, elementType)).filter(Boolean);
                }
                break;
            default: // It's a map!
                const optMap = opt.type;
                opts[opt.name] = getOptionValueFromMap(opt.name, value, optMap);
        }
        if (opts[opt.name] === undefined) {
            const keys = Array.from(opt.type.keys());
            console.log(`Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(",")}`);
        }
    }
    function parsePrimitive(value, type) {
        switch (type) {
            case "number":
                return +value;
            case "string":
                return value;
            case "boolean":
                return value.toLowerCase() === "true" || value.length === 0;
        }
        console.log(`Unknown primitive type ${type} with - ${value}`);
    }
    exports.parsePrimitive = parsePrimitive;
    function getOptionValueFromMap(name, key, optMap) {
        const result = optMap.get(key.toLowerCase());
        if (result === undefined) {
            const keys = Array.from(optMap.keys());
            console.error(`Invalid inline compiler value`, `Got ${key} for ${name} but it is not a supported value by the TS compiler.`, `Allowed values: ${keys.join(",")}`);
        }
        return result;
    }
    // Function to generate autocompletion results
    const twoslashCompletions = (ts, monaco) => (model, position, _token) => {
        const result = [];
        // Split everything the user has typed on the current line up at each space, and only look at the last word
        const thisLine = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
        });
        // Not a comment
        if (!thisLine.startsWith("//")) {
            return { suggestions: [] };
        }
        const words = thisLine.replace("\t", "").split(" ");
        // Not the right amount of
        if (words.length !== 2) {
            return { suggestions: [] };
        }
        const word = words[1];
        if (word.startsWith("-")) {
            return {
                suggestions: [
                    {
                        label: "---cut---",
                        kind: 14,
                        detail: "Twoslash split output",
                        insertText: "---cut---".replace(word, ""),
                    },
                ],
            };
        }
        // Not a @ at the first word
        if (!word.startsWith("@")) {
            return { suggestions: [] };
        }
        const knowns = [
            "noErrors",
            "errors",
            "showEmit",
            "showEmittedFile",
            "noStaticSemanticInfo",
            "emit",
            "noErrorValidation",
            "filename",
        ];
        // @ts-ignore - ts.optionDeclarations is private
        const optsNames = ts.optionDeclarations.map(o => o.name);
        knowns.concat(optsNames).forEach(name => {
            if (name.startsWith(word.slice(1))) {
                // somehow adding the range seems to not give autocomplete results?
                result.push({
                    label: name,
                    kind: 14,
                    detail: "Twoslash comment",
                    insertText: name,
                });
            }
        });
        return {
            suggestions: result,
        };
    };
    exports.twoslashCompletions = twoslashCompletions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdvc2xhc2hTdXBwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvdHdvc2xhc2hTdXBwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQSxNQUFNLG1CQUFtQixHQUFHLGlCQUFpQixDQUFBO0lBRTdDLGtDQUFrQztJQUNsQyxNQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUFBO0lBS3BEOzs7T0FHRztJQUVJLE1BQU0sOEJBQThCLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRTtRQUN2RCxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFBO1FBRW5DLElBQUksQ0FBQyxDQUFDLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0ZBQXdGLENBQUMsQ0FBQTtTQUN4RzthQUFNO1lBQ0wsb0RBQW9EO1lBQ3BELEtBQUssTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLGtCQUFrQixFQUFFO2dCQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7YUFDeEM7U0FDRjtRQUVELE9BQU8sQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUN0QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLEVBQVMsQ0FBQTtZQUV6QixTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEtBQUssQ0FBQTtnQkFDVCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7b0JBQzVDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFL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QUNuQixVQUFVO1NBQ1gsQ0FBQTtRQUNELGdEQUFnRDtRQUNoRCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xDLG1FQUFtRTtnQkFDbkUsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDVixLQUFLLEVBQUUsSUFBSTtvQkFDWCxJQUFJLEVBQUUsRUFBRTtvQkFDUixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixVQUFVLEVBQUUsSUFBSTtpQkFDVixDQUFDLENBQUE7YUFDVjtRQUNILENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTztZQUNMLFdBQVcsRUFBRSxNQUFNO1NBQ3BCLENBQUE7SUFDSCxDQUFDLENBQUE7SUF6RVksUUFBQSxtQkFBbUIsdUJBeUUvQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGJvb2xlYW5Db25maWdSZWdleHAgPSAvXlxcL1xcL1xccz9AKFxcdyspJC9cblxuLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci84QjJXd2gvMVxuY29uc3QgdmFsdWVkQ29uZmlnUmVnZXhwID0gL15cXC9cXC9cXHM/QChcXHcrKTpcXHM/KC4rKSQvXG5cbnR5cGUgVFMgPSB0eXBlb2YgaW1wb3J0KFwidHlwZXNjcmlwdFwiKVxudHlwZSBDb21waWxlck9wdGlvbnMgPSBpbXBvcnQoXCJ0eXBlc2NyaXB0XCIpLkNvbXBpbGVyT3B0aW9uc1xuXG4vKipcbiAqIFRoaXMgaXMgYSBwb3J0IG9mIHRoZSB0d29zbGFzaCBiaXQgd2hpY2ggZ3JhYnMgY29tcGlsZXIgb3B0aW9uc1xuICogZnJvbSB0aGUgc291cmNlIGNvZGVcbiAqL1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFR3b1NsYXNoQ29tcGlsZXJPcHRpb25zID0gKHRzOiBUUykgPT4ge1xuICBsZXQgb3B0TWFwID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKVxuXG4gIGlmICghKFwib3B0aW9uRGVjbGFyYXRpb25zXCIgaW4gdHMpKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBnZXQgY29tcGlsZXIgb3B0aW9ucyBmcm9tIHRzLm9wdGlvbkRlY2xhcmF0aW9ucyAtIHNraXBwaW5nIHR3b3NsYXNoIHN1cHBvcnQuXCIpXG4gIH0gZWxzZSB7XG4gICAgLy8gQHRzLWlnbm9yZSAtIG9wdGlvbkRlY2xhcmF0aW9ucyBpcyBub3QgcHVibGljIEFQSVxuICAgIGZvciAoY29uc3Qgb3B0IG9mIHRzLm9wdGlvbkRlY2xhcmF0aW9ucykge1xuICAgICAgb3B0TWFwLnNldChvcHQubmFtZS50b0xvd2VyQ2FzZSgpLCBvcHQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChjb2RlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBjb2RlTGluZXMgPSBjb2RlLnNwbGl0KFwiXFxuXCIpXG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9IGFzIGFueVxuXG4gICAgY29kZUxpbmVzLmZvckVhY2goX2xpbmUgPT4ge1xuICAgICAgbGV0IG1hdGNoXG4gICAgICBjb25zdCBsaW5lID0gX2xpbmUudHJpbSgpXG4gICAgICBpZiAoKG1hdGNoID0gYm9vbGVhbkNvbmZpZ1JlZ2V4cC5leGVjKGxpbmUpKSkge1xuICAgICAgICBpZiAob3B0TWFwLmhhcyhtYXRjaFsxXS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIG9wdGlvbnNbbWF0Y2hbMV1dID0gdHJ1ZVxuICAgICAgICAgIHNldE9wdGlvbihtYXRjaFsxXSwgXCJ0cnVlXCIsIG9wdGlvbnMsIG9wdE1hcClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgobWF0Y2ggPSB2YWx1ZWRDb25maWdSZWdleHAuZXhlYyhsaW5lKSkpIHtcbiAgICAgICAgaWYgKG9wdE1hcC5oYXMobWF0Y2hbMV0udG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBzZXRPcHRpb24obWF0Y2hbMV0sIG1hdGNoWzJdLCBvcHRpb25zLCBvcHRNYXApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0T3B0aW9uKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgb3B0czogQ29tcGlsZXJPcHRpb25zLCBvcHRNYXA6IE1hcDxzdHJpbmcsIGFueT4pIHtcbiAgY29uc3Qgb3B0ID0gb3B0TWFwLmdldChuYW1lLnRvTG93ZXJDYXNlKCkpXG5cbiAgaWYgKCFvcHQpIHJldHVyblxuICBzd2l0Y2ggKG9wdC50eXBlKSB7XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgb3B0c1tvcHQubmFtZV0gPSBwYXJzZVByaW1pdGl2ZSh2YWx1ZSwgb3B0LnR5cGUpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSBcImxpc3RcIjpcbiAgICAgIGNvbnN0IGVsZW1lbnRUeXBlID0gb3B0LmVsZW1lbnQhLnR5cGVcbiAgICAgIGNvbnN0IHN0cmluZ3MgPSB2YWx1ZS5zcGxpdChcIixcIilcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudFR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgb3B0c1tvcHQubmFtZV0gPSBzdHJpbmdzLm1hcCh2ID0+IHBhcnNlUHJpbWl0aXZlKHYsIGVsZW1lbnRUeXBlKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdHNbb3B0Lm5hbWVdID0gc3RyaW5ncy5tYXAodiA9PiBnZXRPcHRpb25WYWx1ZUZyb21NYXAob3B0Lm5hbWUsIHYsIGVsZW1lbnRUeXBlIGFzIE1hcDxzdHJpbmcsIHN0cmluZz4pISkuZmlsdGVyKEJvb2xlYW4pXG4gICAgICB9XG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDogICAgICAgICAgLy8gSXQncyBhIG1hcCFcbiAgICAgIGNvbnN0IG9wdE1hcCA9IG9wdC50eXBlIGFzIE1hcDxzdHJpbmcsIHN0cmluZz5cbiAgICAgIG9wdHNbb3B0Lm5hbWVdID0gZ2V0T3B0aW9uVmFsdWVGcm9tTWFwKG9wdC5uYW1lLCB2YWx1ZSwgb3B0TWFwKVxuICB9XG5cbiAgaWYgKG9wdHNbb3B0Lm5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBrZXlzID0gQXJyYXkuZnJvbShvcHQudHlwZS5rZXlzKCkgYXMgYW55KVxuICAgIGNvbnNvbGUubG9nKGBJbnZhbGlkIHZhbHVlICR7dmFsdWV9IGZvciAke29wdC5uYW1lfS4gQWxsb3dlZCB2YWx1ZXM6ICR7a2V5cy5qb2luKFwiLFwiKX1gKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVByaW1pdGl2ZSh2YWx1ZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpOiBhbnkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gK3ZhbHVlXG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIiB8fCB2YWx1ZS5sZW5ndGggPT09IDBcbiAgfVxuICBjb25zb2xlLmxvZyhgVW5rbm93biBwcmltaXRpdmUgdHlwZSAke3R5cGV9IHdpdGggLSAke3ZhbHVlfWApXG59XG5cblxuZnVuY3Rpb24gZ2V0T3B0aW9uVmFsdWVGcm9tTWFwKG5hbWU6IHN0cmluZywga2V5OiBzdHJpbmcsIG9wdE1hcDogTWFwPHN0cmluZywgc3RyaW5nPikge1xuICBjb25zdCByZXN1bHQgPSBvcHRNYXAuZ2V0KGtleS50b0xvd2VyQ2FzZSgpKVxuICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBrZXlzID0gQXJyYXkuZnJvbShvcHRNYXAua2V5cygpIGFzIGFueSlcblxuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICBgSW52YWxpZCBpbmxpbmUgY29tcGlsZXIgdmFsdWVgLFxuICAgICAgYEdvdCAke2tleX0gZm9yICR7bmFtZX0gYnV0IGl0IGlzIG5vdCBhIHN1cHBvcnRlZCB2YWx1ZSBieSB0aGUgVFMgY29tcGlsZXIuYCxcbiAgICAgIGBBbGxvd2VkIHZhbHVlczogJHtrZXlzLmpvaW4oXCIsXCIpfWBcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBGdW5jdGlvbiB0byBnZW5lcmF0ZSBhdXRvY29tcGxldGlvbiByZXN1bHRzXG5leHBvcnQgY29uc3QgdHdvc2xhc2hDb21wbGV0aW9ucyA9ICh0czogVFMsIG1vbmFjbzogdHlwZW9mIGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikpID0+IChcbiAgbW9kZWw6IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikuZWRpdG9yLklUZXh0TW9kZWwsXG4gIHBvc2l0aW9uOiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpLlBvc2l0aW9uLFxuICBfdG9rZW46IGFueVxuKTogaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5sYW5ndWFnZXMuQ29tcGxldGlvbkxpc3QgPT4ge1xuICBjb25zdCByZXN1bHQ6IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikubGFuZ3VhZ2VzLkNvbXBsZXRpb25JdGVtW10gPSBbXVxuXG4gIC8vIFNwbGl0IGV2ZXJ5dGhpbmcgdGhlIHVzZXIgaGFzIHR5cGVkIG9uIHRoZSBjdXJyZW50IGxpbmUgdXAgYXQgZWFjaCBzcGFjZSwgYW5kIG9ubHkgbG9vayBhdCB0aGUgbGFzdCB3b3JkXG4gIGNvbnN0IHRoaXNMaW5lID0gbW9kZWwuZ2V0VmFsdWVJblJhbmdlKHtcbiAgICBzdGFydExpbmVOdW1iZXI6IHBvc2l0aW9uLmxpbmVOdW1iZXIsXG4gICAgc3RhcnRDb2x1bW46IDAsXG4gICAgZW5kTGluZU51bWJlcjogcG9zaXRpb24ubGluZU51bWJlcixcbiAgICBlbmRDb2x1bW46IHBvc2l0aW9uLmNvbHVtbixcbiAgfSlcblxuICAvLyBOb3QgYSBjb21tZW50XG4gIGlmICghdGhpc0xpbmUuc3RhcnRzV2l0aChcIi8vXCIpKSB7XG4gICAgcmV0dXJuIHsgc3VnZ2VzdGlvbnM6IFtdIH1cbiAgfVxuXG4gIGNvbnN0IHdvcmRzID0gdGhpc0xpbmUucmVwbGFjZShcIlxcdFwiLCBcIlwiKS5zcGxpdChcIiBcIilcblxuICAvLyBOb3QgdGhlIHJpZ2h0IGFtb3VudCBvZlxuICBpZiAod29yZHMubGVuZ3RoICE9PSAyKSB7XG4gICAgcmV0dXJuIHsgc3VnZ2VzdGlvbnM6IFtdIH1cbiAgfVxuXG4gIGNvbnN0IHdvcmQgPSB3b3Jkc1sxXVxuICBpZiAod29yZC5zdGFydHNXaXRoKFwiLVwiKSkge1xuICAgIHJldHVybiB7XG4gICAgICBzdWdnZXN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6IFwiLS0tY3V0LS0tXCIsXG4gICAgICAgICAga2luZDogMTQsXG4gICAgICAgICAgZGV0YWlsOiBcIlR3b3NsYXNoIHNwbGl0IG91dHB1dFwiLFxuICAgICAgICAgIGluc2VydFRleHQ6IFwiLS0tY3V0LS0tXCIucmVwbGFjZSh3b3JkLCBcIlwiKSxcbiAgICAgICAgfSBhcyBhbnksXG4gICAgICBdLFxuICAgIH1cbiAgfVxuXG4gIC8vIE5vdCBhIEAgYXQgdGhlIGZpcnN0IHdvcmRcbiAgaWYgKCF3b3JkLnN0YXJ0c1dpdGgoXCJAXCIpKSB7XG4gICAgcmV0dXJuIHsgc3VnZ2VzdGlvbnM6IFtdIH1cbiAgfVxuXG4gIGNvbnN0IGtub3ducyA9IFtcbiAgICBcIm5vRXJyb3JzXCIsXG4gICAgXCJlcnJvcnNcIixcbiAgICBcInNob3dFbWl0XCIsXG4gICAgXCJzaG93RW1pdHRlZEZpbGVcIixcbiAgICBcIm5vU3RhdGljU2VtYW50aWNJbmZvXCIsXG4gICAgXCJlbWl0XCIsXG4gICAgXCJub0Vycm9yVmFsaWRhdGlvblwiLFxuICAgIFwiZmlsZW5hbWVcIixcbiAgXVxuICAvLyBAdHMtaWdub3JlIC0gdHMub3B0aW9uRGVjbGFyYXRpb25zIGlzIHByaXZhdGVcbiAgY29uc3Qgb3B0c05hbWVzID0gdHMub3B0aW9uRGVjbGFyYXRpb25zLm1hcChvID0+IG8ubmFtZSlcbiAga25vd25zLmNvbmNhdChvcHRzTmFtZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKG5hbWUuc3RhcnRzV2l0aCh3b3JkLnNsaWNlKDEpKSkge1xuICAgICAgLy8gc29tZWhvdyBhZGRpbmcgdGhlIHJhbmdlIHNlZW1zIHRvIG5vdCBnaXZlIGF1dG9jb21wbGV0ZSByZXN1bHRzP1xuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICBsYWJlbDogbmFtZSxcbiAgICAgICAga2luZDogMTQsXG4gICAgICAgIGRldGFpbDogXCJUd29zbGFzaCBjb21tZW50XCIsXG4gICAgICAgIGluc2VydFRleHQ6IG5hbWUsXG4gICAgICB9IGFzIGFueSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHtcbiAgICBzdWdnZXN0aW9uczogcmVzdWx0LFxuICB9XG59XG4iXX0=