define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showASTPlugin = void 0;
    const showASTPlugin = (i, utils) => {
        let container;
        let ast;
        let disposable;
        const plugin = {
            id: "ast",
            displayName: "AST",
            willMount: (_, _container) => {
                container = _container;
            },
            didMount: (sandbox, container) => {
                // While this plugin is forefront, keep cursor changes in sync with the AST selection
                disposable = sandbox.editor.onDidChangeCursorPosition(e => {
                    var _a;
                    const cursorPos = sandbox.getModel().getOffsetAt(e.position);
                    const allTreeStarts = container.querySelectorAll("div.ast-tree-start");
                    let deepestElement = null;
                    allTreeStarts.forEach(e => {
                        // Close them all first, because we're about to open them up after
                        e.classList.remove("open");
                        // Find the deepest element in the set and open it up
                        const { pos, end, depth } = e.dataset;
                        const nPos = Number(pos);
                        const nEnd = Number(end);
                        if (cursorPos > nPos && cursorPos <= nEnd) {
                            if (deepestElement) {
                                const currentDepth = Number(deepestElement.dataset.depth);
                                if (currentDepth < Number(depth)) {
                                    deepestElement = e;
                                }
                            }
                            else {
                                deepestElement = e;
                            }
                        }
                    });
                    // Take that element, open it up, then go through its ancestors till they are all opened
                    let openUpElement = deepestElement;
                    while (openUpElement) {
                        openUpElement.classList.add("open");
                        openUpElement = (_a = openUpElement.parentElement) === null || _a === void 0 ? void 0 : _a.closest(".ast-tree-start");
                    }
                    // Scroll and flash to let folks see what's happening
                    deepestElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    utils.flashHTMLElement(deepestElement);
                });
            },
            modelChangedDebounce: sandbox => {
                const ds = utils.createDesignSystem(container);
                ds.clear();
                ds.title("AST");
                sandbox.getAST().then(tree => {
                    ast = ds.createASTTree(tree);
                });
            },
            didUnmount: () => {
                disposable && disposable.dispose();
            },
        };
        return plugin;
    };
    exports.showASTPlugin = showASTPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvc2lkZWJhci9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUdPLE1BQU0sYUFBYSxHQUFrQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN2RCxJQUFJLFNBQXNCLENBQUE7UUFDMUIsSUFBSSxHQUFnQixDQUFBO1FBQ3BCLElBQUksVUFBbUMsQ0FBQTtRQUV2QyxNQUFNLE1BQU0sR0FBcUI7WUFDL0IsRUFBRSxFQUFFLEtBQUs7WUFDVCxXQUFXLEVBQUUsS0FBSztZQUNsQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUU7Z0JBQzNCLFNBQVMsR0FBRyxVQUFVLENBQUE7WUFDeEIsQ0FBQztZQUNELFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDL0IscUZBQXFGO2dCQUVyRixVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsRUFBRTs7b0JBQ3hELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO29CQUM1RCxNQUFNLGFBQWEsR0FBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQTZCLENBQUE7b0JBRW5HLElBQUksY0FBYyxHQUFtQixJQUFXLENBQUE7b0JBRWhELGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3hCLGtFQUFrRTt3QkFDbEUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7d0JBRTFCLHFEQUFxRDt3QkFDckQsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQXNELENBQUE7d0JBQ3BGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTt3QkFDeEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUV4QixJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTs0QkFDekMsSUFBSSxjQUFjLEVBQUU7Z0NBQ2xCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUMxRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7b0NBQ2hDLGNBQWMsR0FBRyxDQUFDLENBQUE7aUNBQ25COzZCQUNGO2lDQUFNO2dDQUNMLGNBQWMsR0FBRyxDQUFDLENBQUE7NkJBQ25CO3lCQUNGO29CQUNILENBQUMsQ0FBQyxDQUFBO29CQUVGLHdGQUF3RjtvQkFDeEYsSUFBSSxhQUFhLEdBQXNDLGNBQWMsQ0FBQTtvQkFDckUsT0FBTyxhQUFhLEVBQUU7d0JBQ3BCLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3dCQUNuQyxhQUFhLEdBQUcsTUFBQSxhQUFhLENBQUMsYUFBYSwwQ0FBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtxQkFDeEU7b0JBRUQscURBQXFEO29CQUNyRCxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtvQkFDdkUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFBO2dCQUN4QyxDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxvQkFBb0IsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUM5QyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQ1YsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFFZixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMzQixHQUFHLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDOUIsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsVUFBVSxFQUFFLEdBQUcsRUFBRTtnQkFDZixVQUFVLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ3BDLENBQUM7U0FDRixDQUFBO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDLENBQUE7SUFwRVksUUFBQSxhQUFhLGlCQW9FekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5IH0gZnJvbSBcIi4uXCJcbmltcG9ydCB0eXBlIHsgSURpc3Bvc2FibGUgfSBmcm9tIFwibW9uYWNvLWVkaXRvclwiXG5cbmV4cG9ydCBjb25zdCBzaG93QVNUUGx1Z2luOiBQbHVnaW5GYWN0b3J5ID0gKGksIHV0aWxzKSA9PiB7XG4gIGxldCBjb250YWluZXI6IEhUTUxFbGVtZW50XG4gIGxldCBhc3Q6IEhUTUxFbGVtZW50XG4gIGxldCBkaXNwb3NhYmxlOiBJRGlzcG9zYWJsZSB8IHVuZGVmaW5lZFxuXG4gIGNvbnN0IHBsdWdpbjogUGxheWdyb3VuZFBsdWdpbiA9IHtcbiAgICBpZDogXCJhc3RcIixcbiAgICBkaXNwbGF5TmFtZTogXCJBU1RcIixcbiAgICB3aWxsTW91bnQ6IChfLCBfY29udGFpbmVyKSA9PiB7XG4gICAgICBjb250YWluZXIgPSBfY29udGFpbmVyXG4gICAgfSxcbiAgICBkaWRNb3VudDogKHNhbmRib3gsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgLy8gV2hpbGUgdGhpcyBwbHVnaW4gaXMgZm9yZWZyb250LCBrZWVwIGN1cnNvciBjaGFuZ2VzIGluIHN5bmMgd2l0aCB0aGUgQVNUIHNlbGVjdGlvblxuXG4gICAgICBkaXNwb3NhYmxlID0gc2FuZGJveC5lZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihlID0+IHtcbiAgICAgICAgY29uc3QgY3Vyc29yUG9zID0gc2FuZGJveC5nZXRNb2RlbCgpLmdldE9mZnNldEF0KGUucG9zaXRpb24pXG4gICAgICAgIGNvbnN0IGFsbFRyZWVTdGFydHMgPSAoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXYuYXN0LXRyZWUtc3RhcnRcIikgYXMgYW55KSBhcyBIVE1MRGl2RWxlbWVudFtdXG5cbiAgICAgICAgbGV0IGRlZXBlc3RFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IG51bGwgYXMgYW55XG5cbiAgICAgICAgYWxsVHJlZVN0YXJ0cy5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgIC8vIENsb3NlIHRoZW0gYWxsIGZpcnN0LCBiZWNhdXNlIHdlJ3JlIGFib3V0IHRvIG9wZW4gdGhlbSB1cCBhZnRlclxuICAgICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZShcIm9wZW5cIilcblxuICAgICAgICAgIC8vIEZpbmQgdGhlIGRlZXBlc3QgZWxlbWVudCBpbiB0aGUgc2V0IGFuZCBvcGVuIGl0IHVwXG4gICAgICAgICAgY29uc3QgeyBwb3MsIGVuZCwgZGVwdGggfSA9IGUuZGF0YXNldCBhcyB7IHBvczogc3RyaW5nOyBlbmQ6IHN0cmluZzsgZGVwdGg6IHN0cmluZyB9XG4gICAgICAgICAgY29uc3QgblBvcyA9IE51bWJlcihwb3MpXG4gICAgICAgICAgY29uc3QgbkVuZCA9IE51bWJlcihlbmQpXG5cbiAgICAgICAgICBpZiAoY3Vyc29yUG9zID4gblBvcyAmJiBjdXJzb3JQb3MgPD0gbkVuZCkge1xuICAgICAgICAgICAgaWYgKGRlZXBlc3RFbGVtZW50KSB7XG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREZXB0aCA9IE51bWJlcihkZWVwZXN0RWxlbWVudCEuZGF0YXNldC5kZXB0aClcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnREZXB0aCA8IE51bWJlcihkZXB0aCkpIHtcbiAgICAgICAgICAgICAgICBkZWVwZXN0RWxlbWVudCA9IGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGVlcGVzdEVsZW1lbnQgPSBlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRha2UgdGhhdCBlbGVtZW50LCBvcGVuIGl0IHVwLCB0aGVuIGdvIHRocm91Z2ggaXRzIGFuY2VzdG9ycyB0aWxsIHRoZXkgYXJlIGFsbCBvcGVuZWRcbiAgICAgICAgbGV0IG9wZW5VcEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZCA9IGRlZXBlc3RFbGVtZW50XG4gICAgICAgIHdoaWxlIChvcGVuVXBFbGVtZW50KSB7XG4gICAgICAgICAgb3BlblVwRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwib3BlblwiKVxuICAgICAgICAgIG9wZW5VcEVsZW1lbnQgPSBvcGVuVXBFbGVtZW50LnBhcmVudEVsZW1lbnQ/LmNsb3Nlc3QoXCIuYXN0LXRyZWUtc3RhcnRcIilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNjcm9sbCBhbmQgZmxhc2ggdG8gbGV0IGZvbGtzIHNlZSB3aGF0J3MgaGFwcGVuaW5nXG4gICAgICAgIGRlZXBlc3RFbGVtZW50LnNjcm9sbEludG9WaWV3KHsgYmxvY2s6IFwibmVhcmVzdFwiLCBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KVxuICAgICAgICB1dGlscy5mbGFzaEhUTUxFbGVtZW50KGRlZXBlc3RFbGVtZW50KVxuICAgICAgfSlcbiAgICB9LFxuICAgIG1vZGVsQ2hhbmdlZERlYm91bmNlOiBzYW5kYm94ID0+IHtcbiAgICAgIGNvbnN0IGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGNvbnRhaW5lcilcbiAgICAgIGRzLmNsZWFyKClcbiAgICAgIGRzLnRpdGxlKFwiQVNUXCIpXG5cbiAgICAgIHNhbmRib3guZ2V0QVNUKCkudGhlbih0cmVlID0+IHtcbiAgICAgICAgYXN0ID0gZHMuY3JlYXRlQVNUVHJlZSh0cmVlKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGRpZFVubW91bnQ6ICgpID0+IHtcbiAgICAgIGRpc3Bvc2FibGUgJiYgZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuIl19