define(["require", "exports", "../localizeWithFallback"], function (require, exports, localizeWithFallback_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showErrors = void 0;
    const showErrors = (i, utils) => {
        let container;
        let sandbox;
        let ds;
        let prevMarkers = [];
        const updateUI = () => {
            if (!sandbox)
                return;
            const model = sandbox.getModel();
            const markers = sandbox.monaco.editor.getModelMarkers({ resource: model.uri });
            // Bail early if there's nothing to show
            if (!markers.length) {
                prevMarkers = [];
                ds.showEmptyScreen((0, localizeWithFallback_1.localize)("play_sidebar_errors_no_errors", "No errors"));
                return;
            }
            // @ts-ignore
            const playground = window.playground;
            if (!playground)
                return;
            if (playground.getCurrentPlugin().id !== "errors")
                return;
            ds.clearDeltaDecorators(true);
            // The hover can trigger this, so avoid that loop
            const markerIDs = markers.filter(m => m.severity !== 1).map(m => m.startColumn + m.startLineNumber);
            if (markerIDs.length === prevMarkers.length && markerIDs.every((value, index) => value === prevMarkers[index]))
                return;
            prevMarkers = markerIDs;
            // Clean any potential empty screens
            ds.clear();
            ds.subtitle("Errors in code");
            ds.listDiags(model, markersToTSDiags(model, markers));
        };
        let changeDecoratorsDispose;
        const plugin = {
            id: "errors",
            displayName: i("play_sidebar_errors"),
            didMount: (_sandbox, _container) => {
                sandbox = _sandbox;
                container = _container;
                ds = utils.createDesignSystem(container);
                changeDecoratorsDispose = sandbox.getModel().onDidChangeDecorations(updateUI);
                prevMarkers = [];
                updateUI();
            },
            didUnmount: () => {
                if (changeDecoratorsDispose)
                    changeDecoratorsDispose.dispose();
                if (ds)
                    ds.clearDeltaDecorators(true);
            },
        };
        return plugin;
    };
    exports.showErrors = showErrors;
    const markersToTSDiags = (model, markers) => {
        return markers
            .map(m => {
            const start = model.getOffsetAt({ column: m.startColumn, lineNumber: m.startLineNumber });
            return {
                code: -1,
                category: markerToDiagSeverity(m.severity),
                file: undefined,
                start,
                length: model.getCharacterCountInRange(m),
                messageText: m.message,
            };
        })
            .sort((lhs, rhs) => lhs.category - rhs.category);
    };
    /*
    export enum MarkerSeverity {
        Hint = 1,
        Info = 2,
        Warning = 4,
        Error = 8
    }
    
    to
    
    export enum DiagnosticCategory {
        Warning = 0,
        Error = 1,
        Suggestion = 2,
        Message = 3
    }
      */
    const markerToDiagSeverity = (markerSev) => {
        switch (markerSev) {
            case 1:
                return 2;
            case 2:
                return 3;
            case 4:
                return 0;
            case 8:
                return 1;
            default:
                return 3;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd0Vycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvc2hvd0Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBS08sTUFBTSxVQUFVLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BELElBQUksU0FBc0IsQ0FBQTtRQUMxQixJQUFJLE9BQWdCLENBQUE7UUFDcEIsSUFBSSxFQUErQyxDQUFBO1FBQ25ELElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQTtRQUU5QixNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU87Z0JBQUUsT0FBTTtZQUNwQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDaEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1lBRTlFLHdDQUF3QztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsV0FBVyxHQUFHLEVBQUUsQ0FBQTtnQkFDaEIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFBLCtCQUFRLEVBQUMsK0JBQStCLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtnQkFDMUUsT0FBTTthQUNQO1lBRUQsYUFBYTtZQUNiLE1BQU0sVUFBVSxHQUFlLE1BQU0sQ0FBQyxVQUFVLENBQUE7WUFFaEQsSUFBSSxDQUFDLFVBQVU7Z0JBQUUsT0FBTTtZQUN2QixJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsS0FBSyxRQUFRO2dCQUFFLE9BQU07WUFFekQsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBRTdCLGlEQUFpRDtZQUNqRCxNQUFNLFNBQVMsR0FBRyxP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QztnQkFDSixPQUFPLENBQUMsQ0FBQTtZQUNWLEtBQUssQ0FBQztnQkFDSixPQUFPLENBQUMsQ0FBQTtZQUNWLEtBQUssQ0FBQztnQkFDSixPQUFPLENBQUMsQ0FBQTtZQUNWO2dCQUNFLE9BQU8sQ0FBQyxDQUFBO1NBQ1g7SUFDSCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IElEaXNwb3NhYmxlIH0gZnJvbSBcIm1vbmFjby1lZGl0b3JcIlxuaW1wb3J0IHR5cGUgeyBTYW5kYm94IH0gZnJvbSBcInR5cGVzY3JpcHRsYW5nLW9yZy9zdGF0aWMvanMvc2FuZGJveFwiXG5pbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5LCBQbGF5Z3JvdW5kIH0gZnJvbSBcIi4uXCJcbmltcG9ydCB7IGxvY2FsaXplIH0gZnJvbSBcIi4uL2xvY2FsaXplV2l0aEZhbGxiYWNrXCJcblxuZXhwb3J0IGNvbnN0IHNob3dFcnJvcnM6IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgbGV0IGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcbiAgbGV0IHNhbmRib3g6IFNhbmRib3hcbiAgbGV0IGRzOiBSZXR1cm5UeXBlPHR5cGVvZiB1dGlscy5jcmVhdGVEZXNpZ25TeXN0ZW0+XG4gIGxldCBwcmV2TWFya2VyczogbnVtYmVyW10gPSBbXVxuXG4gIGNvbnN0IHVwZGF0ZVVJID0gKCkgPT4ge1xuICAgIGlmICghc2FuZGJveCkgcmV0dXJuXG4gICAgY29uc3QgbW9kZWwgPSBzYW5kYm94LmdldE1vZGVsKClcbiAgICBjb25zdCBtYXJrZXJzID0gc2FuZGJveC5tb25hY28uZWRpdG9yLmdldE1vZGVsTWFya2Vycyh7IHJlc291cmNlOiBtb2RlbC51cmkgfSlcblxuICAgIC8vIEJhaWwgZWFybHkgaWYgdGhlcmUncyBub3RoaW5nIHRvIHNob3dcbiAgICBpZiAoIW1hcmtlcnMubGVuZ3RoKSB7XG4gICAgICBwcmV2TWFya2VycyA9IFtdXG4gICAgICBkcy5zaG93RW1wdHlTY3JlZW4obG9jYWxpemUoXCJwbGF5X3NpZGViYXJfZXJyb3JzX25vX2Vycm9yc1wiLCBcIk5vIGVycm9yc1wiKSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBwbGF5Z3JvdW5kOiBQbGF5Z3JvdW5kID0gd2luZG93LnBsYXlncm91bmRcblxuICAgIGlmICghcGxheWdyb3VuZCkgcmV0dXJuXG4gICAgaWYgKHBsYXlncm91bmQuZ2V0Q3VycmVudFBsdWdpbigpLmlkICE9PSBcImVycm9yc1wiKSByZXR1cm5cblxuICAgIGRzLmNsZWFyRGVsdGFEZWNvcmF0b3JzKHRydWUpXG5cbiAgICAvLyBUaGUgaG92ZXIgY2FuIHRyaWdnZXIgdGhpcywgc28gYXZvaWQgdGhhdCBsb29wXG4gICAgY29uc3QgbWFya2VySURzID0gbWFya2Vycy5maWx0ZXIobSA9PiBtLnNldmVyaXR5ICE9PSAxKS5tYXAobSA9PiBtLnN0YXJ0Q29sdW1uICsgbS5zdGFydExpbmVOdW1iZXIpXG4gICAgaWYgKG1hcmtlcklEcy5sZW5ndGggPT09IHByZXZNYXJrZXJzLmxlbmd0aCAmJiBtYXJrZXJJRHMuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHByZXZNYXJrZXJzW2luZGV4XSkpIHJldHVyblxuICAgIHByZXZNYXJrZXJzID0gbWFya2VySURzXG5cbiAgICAvLyBDbGVhbiBhbnkgcG90ZW50aWFsIGVtcHR5IHNjcmVlbnNcbiAgICBkcy5jbGVhcigpXG4gICAgZHMuc3VidGl0bGUoXCJFcnJvcnMgaW4gY29kZVwiKVxuICAgIGRzLmxpc3REaWFncyhtb2RlbCwgbWFya2Vyc1RvVFNEaWFncyhtb2RlbCwgbWFya2VycykpXG4gIH1cblxuICBsZXQgY2hhbmdlRGVjb3JhdG9yc0Rpc3Bvc2U6IElEaXNwb3NhYmxlIHwgdW5kZWZpbmVkXG5cbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcImVycm9yc1wiLFxuICAgIGRpc3BsYXlOYW1lOiBpKFwicGxheV9zaWRlYmFyX2Vycm9yc1wiKSxcbiAgICBkaWRNb3VudDogKF9zYW5kYm94LCBfY29udGFpbmVyKSA9PiB7XG4gICAgICBzYW5kYm94ID0gX3NhbmRib3hcbiAgICAgIGNvbnRhaW5lciA9IF9jb250YWluZXJcbiAgICAgIGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGNvbnRhaW5lcilcbiAgICAgIGNoYW5nZURlY29yYXRvcnNEaXNwb3NlID0gc2FuZGJveC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlRGVjb3JhdGlvbnModXBkYXRlVUkpXG4gICAgICBwcmV2TWFya2VycyA9IFtdXG4gICAgICB1cGRhdGVVSSgpXG4gICAgfSxcbiAgICBkaWRVbm1vdW50OiAoKSA9PiB7XG4gICAgICBpZiAoY2hhbmdlRGVjb3JhdG9yc0Rpc3Bvc2UpIGNoYW5nZURlY29yYXRvcnNEaXNwb3NlLmRpc3Bvc2UoKVxuICAgICAgaWYgKGRzKSBkcy5jbGVhckRlbHRhRGVjb3JhdG9ycyh0cnVlKVxuICAgIH0sXG4gIH1cbiAgcmV0dXJuIHBsdWdpblxufVxuXG5jb25zdCBtYXJrZXJzVG9UU0RpYWdzID0gKFxuICBtb2RlbDogaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5lZGl0b3IuSU1vZGVsLFxuICBtYXJrZXJzOiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpLmVkaXRvci5JTWFya2VyW11cbik6IGltcG9ydChcInR5cGVzY3JpcHRcIikuRGlhZ25vc3RpY1JlbGF0ZWRJbmZvcm1hdGlvbltdID0+IHtcbiAgcmV0dXJuIG1hcmtlcnNcbiAgICAubWFwKG0gPT4ge1xuICAgICAgY29uc3Qgc3RhcnQgPSBtb2RlbC5nZXRPZmZzZXRBdCh7IGNvbHVtbjogbS5zdGFydENvbHVtbiwgbGluZU51bWJlcjogbS5zdGFydExpbmVOdW1iZXIgfSlcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IC0xLFxuICAgICAgICBjYXRlZ29yeTogbWFya2VyVG9EaWFnU2V2ZXJpdHkobS5zZXZlcml0eSksXG4gICAgICAgIGZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3RhcnQsXG4gICAgICAgIGxlbmd0aDogbW9kZWwuZ2V0Q2hhcmFjdGVyQ291bnRJblJhbmdlKG0pLFxuICAgICAgICBtZXNzYWdlVGV4dDogbS5tZXNzYWdlLFxuICAgICAgfVxuICAgIH0pXG4gICAgLnNvcnQoKGxocywgcmhzKSA9PiBsaHMuY2F0ZWdvcnkgLSByaHMuY2F0ZWdvcnkpXG59XG5cbi8qXG5leHBvcnQgZW51bSBNYXJrZXJTZXZlcml0eSB7XG4gICAgSGludCA9IDEsXG4gICAgSW5mbyA9IDIsXG4gICAgV2FybmluZyA9IDQsXG4gICAgRXJyb3IgPSA4XG59XG5cbnRvIFxuXG5leHBvcnQgZW51bSBEaWFnbm9zdGljQ2F0ZWdvcnkge1xuICAgIFdhcm5pbmcgPSAwLFxuICAgIEVycm9yID0gMSxcbiAgICBTdWdnZXN0aW9uID0gMixcbiAgICBNZXNzYWdlID0gM1xufVxuICAqL1xuY29uc3QgbWFya2VyVG9EaWFnU2V2ZXJpdHkgPSAobWFya2VyU2V2OiBudW1iZXIpID0+IHtcbiAgc3dpdGNoIChtYXJrZXJTZXYpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gMlxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAzXG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIDBcbiAgICBjYXNlIDg6XG4gICAgICByZXR1cm4gMVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gM1xuICB9XG59XG4iXX0=