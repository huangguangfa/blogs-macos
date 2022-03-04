define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compiledJSPlugin = void 0;
    const compiledJSPlugin = (i, utils) => {
        let codeElement;
        const plugin = {
            id: "js",
            displayName: i("play_sidebar_js"),
            willMount: (_, container) => {
                const { code } = utils.createDesignSystem(container);
                codeElement = code("");
            },
            modelChangedDebounce: (sandbox, model) => {
                sandbox.getRunnableJS().then(js => {
                    sandbox.monaco.editor.colorize(js, "javascript", {}).then(coloredJS => {
                        codeElement.innerHTML = coloredJS;
                    });
                });
            },
        };
        return plugin;
    };
    exports.compiledJSPlugin = compiledJSPlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd0pTLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvc2lkZWJhci9zaG93SlMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUVPLE1BQU0sZ0JBQWdCLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzFELElBQUksV0FBd0IsQ0FBQTtRQUU1QixNQUFNLE1BQU0sR0FBcUI7WUFDL0IsRUFBRSxFQUFFLElBQUk7WUFDUixXQUFXLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDcEQsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN4QixDQUFDO1lBQ0Qsb0JBQW9CLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3ZDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ2hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDcEUsV0FBVyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7b0JBQ25DLENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQTtJQXBCWSxRQUFBLGdCQUFnQixvQkFvQjVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxheWdyb3VuZFBsdWdpbiwgUGx1Z2luRmFjdG9yeSB9IGZyb20gXCIuLlwiXG5cbmV4cG9ydCBjb25zdCBjb21waWxlZEpTUGx1Z2luOiBQbHVnaW5GYWN0b3J5ID0gKGksIHV0aWxzKSA9PiB7XG4gIGxldCBjb2RlRWxlbWVudDogSFRNTEVsZW1lbnRcblxuICBjb25zdCBwbHVnaW46IFBsYXlncm91bmRQbHVnaW4gPSB7XG4gICAgaWQ6IFwianNcIixcbiAgICBkaXNwbGF5TmFtZTogaShcInBsYXlfc2lkZWJhcl9qc1wiKSxcbiAgICB3aWxsTW91bnQ6IChfLCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnN0IHsgY29kZSB9ID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGNvbnRhaW5lcilcbiAgICAgIGNvZGVFbGVtZW50ID0gY29kZShcIlwiKVxuICAgIH0sXG4gICAgbW9kZWxDaGFuZ2VkRGVib3VuY2U6IChzYW5kYm94LCBtb2RlbCkgPT4ge1xuICAgICAgc2FuZGJveC5nZXRSdW5uYWJsZUpTKCkudGhlbihqcyA9PiB7XG4gICAgICAgIHNhbmRib3gubW9uYWNvLmVkaXRvci5jb2xvcml6ZShqcywgXCJqYXZhc2NyaXB0XCIsIHt9KS50aGVuKGNvbG9yZWRKUyA9PiB7XG4gICAgICAgICAgY29kZUVsZW1lbnQuaW5uZXJIVE1MID0gY29sb3JlZEpTXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gcGx1Z2luXG59XG4iXX0=