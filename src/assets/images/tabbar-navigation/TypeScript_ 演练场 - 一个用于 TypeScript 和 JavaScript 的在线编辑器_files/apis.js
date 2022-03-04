var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDTSFileForModuleWithVersion = exports.getFiletreeForModuleWithVersion = exports.getNPMVersionForModuleReference = exports.getNPMVersionsForModule = void 0;
    //  https://github.com/jsdelivr/data.jsdelivr.com
    const getNPMVersionsForModule = (config, moduleName) => {
        const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}`;
        return api(config, url, { cache: "no-store" });
    };
    exports.getNPMVersionsForModule = getNPMVersionsForModule;
    const getNPMVersionForModuleReference = (config, moduleName, reference) => {
        const url = `https://data.jsdelivr.com/v1/package/resolve/npm/${moduleName}@${reference}`;
        return api(config, url);
    };
    exports.getNPMVersionForModuleReference = getNPMVersionForModuleReference;
    const getFiletreeForModuleWithVersion = (config, moduleName, version) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}@${version}/flat`;
        const res = yield api(config, url);
        if (res instanceof Error) {
            return res;
        }
        else {
            return Object.assign(Object.assign({}, res), { moduleName,
                version });
        }
    });
    exports.getFiletreeForModuleWithVersion = getFiletreeForModuleWithVersion;
    const getDTSFileForModuleWithVersion = (config, moduleName, version, file) => __awaiter(void 0, void 0, void 0, function* () {
        // file comes with a prefix / 
        const url = `https://cdn.jsdelivr.net/npm/${moduleName}@${version}${file}`;
        const f = config.fetcher || fetch;
        const res = yield f(url);
        if (res.ok) {
            return res.text();
        }
        else {
            return new Error("OK");
        }
    });
    exports.getDTSFileForModuleWithVersion = getDTSFileForModuleWithVersion;
    function api(config, url, init) {
        const f = config.fetcher || fetch;
        return f(url, init).then(res => {
            if (res.ok) {
                return res.json().then(f => f);
            }
            else {
                return new Error("OK");
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NhbmRib3gvc3JjL3ZlbmRvci9hdGEvYXBpcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBRUEsaURBQWlEO0lBRTFDLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxNQUEwQixFQUFFLFVBQWtCLEVBQUUsRUFBRTtRQUN4RixNQUFNLEdBQUcsR0FBRyw0Q0FBNEMsVUFBVSxFQUFFLENBQUE7UUFDcEUsT0FBTyxHQUFHLENBQXVELE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUN0RyxDQUFDLENBQUE7SUFIWSxRQUFBLHVCQUF1QiwyQkFHbkM7SUFFTSxNQUFNLCtCQUErQixHQUFHLENBQUMsTUFBMEIsRUFBRSxVQUFrQixFQUFFLFNBQWlCLEVBQUUsRUFBRTtRQUNuSCxNQUFNLEdBQUcsR0FBRyxvREFBb0QsVUFBVSxJQUFJLFNBQVMsRUFBRSxDQUFBO1FBQ3pGLE9BQU8sR0FBRyxDQUE2QixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDckQsQ0FBQyxDQUFBO0lBSFksUUFBQSwrQkFBK0IsbUNBRzNDO0lBSU0sTUFBTSwrQkFBK0IsR0FBRyxDQUM3QyxNQUEwQixFQUMxQixVQUFrQixFQUNsQixPQUFlLEVBQ2YsRUFBRTtRQUNGLE1BQU0sR0FBRyxHQUFHLDRDQUE0QyxVQUFVLElBQUksT0FBTyxPQUFPLENBQUE7UUFDcEYsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQWMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQy9DLElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtZQUN4QixPQUFPLEdBQUcsQ0FBQTtTQUNYO2FBQU07WUFDTCx1Q0FDSyxHQUFHLEtBQ04sVUFBVTtnQkFDVixPQUFPLElBQ1I7U0FDRjtJQUNILENBQUMsQ0FBQSxDQUFBO0lBaEJZLFFBQUEsK0JBQStCLG1DQWdCM0M7SUFFTSxNQUFNLDhCQUE4QixHQUFHLENBQzVDLE1BQTBCLEVBQzFCLFVBQWtCLEVBQ2xCLE9BQWUsRUFDZixJQUFZLEVBQ1osRUFBRTtRQUNGLDhCQUE4QjtRQUM5QixNQUFNLEdBQUcsR0FBRyxnQ0FBZ0MsVUFBVSxJQUFJLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQTtRQUMxRSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQTtRQUNqQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN4QixJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUU7WUFDVixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNsQjthQUFNO1lBQ0wsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN2QjtJQUNILENBQUMsQ0FBQSxDQUFBO0lBZlksUUFBQSw4QkFBOEIsa0NBZTFDO0lBRUQsU0FBUyxHQUFHLENBQUksTUFBMEIsRUFBRSxHQUFXLEVBQUUsSUFBa0I7UUFDekUsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUE7UUFFakMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBTSxDQUFDLENBQUE7YUFDcEM7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN2QjtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFUQUJvb3RzdHJhcENvbmZpZyB9IGZyb20gXCIuXCJcblxuLy8gIGh0dHBzOi8vZ2l0aHViLmNvbS9qc2RlbGl2ci9kYXRhLmpzZGVsaXZyLmNvbVxuXG5leHBvcnQgY29uc3QgZ2V0TlBNVmVyc2lvbnNGb3JNb2R1bGUgPSAoY29uZmlnOiBBVEFCb290c3RyYXBDb25maWcsIG1vZHVsZU5hbWU6IHN0cmluZykgPT4ge1xuICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9kYXRhLmpzZGVsaXZyLmNvbS92MS9wYWNrYWdlL25wbS8ke21vZHVsZU5hbWV9YFxuICByZXR1cm4gYXBpPHsgdGFnczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjsgdmVyc2lvbnM6IHN0cmluZ1tdIH0+KGNvbmZpZywgdXJsLCB7IGNhY2hlOiBcIm5vLXN0b3JlXCIgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGdldE5QTVZlcnNpb25Gb3JNb2R1bGVSZWZlcmVuY2UgPSAoY29uZmlnOiBBVEFCb290c3RyYXBDb25maWcsIG1vZHVsZU5hbWU6IHN0cmluZywgcmVmZXJlbmNlOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgdXJsID0gYGh0dHBzOi8vZGF0YS5qc2RlbGl2ci5jb20vdjEvcGFja2FnZS9yZXNvbHZlL25wbS8ke21vZHVsZU5hbWV9QCR7cmVmZXJlbmNlfWBcbiAgcmV0dXJuIGFwaTx7IHZlcnNpb246IHN0cmluZyB8IG51bGwgfT4oY29uZmlnLCB1cmwpXG59XG5cbmV4cG9ydCB0eXBlIE5QTVRyZWVNZXRhID0geyBkZWZhdWx0OiBzdHJpbmc7IGZpbGVzOiBBcnJheTx7IG5hbWU6IHN0cmluZyB9PjsgbW9kdWxlTmFtZTogc3RyaW5nOyB2ZXJzaW9uOiBzdHJpbmcgfVxuXG5leHBvcnQgY29uc3QgZ2V0RmlsZXRyZWVGb3JNb2R1bGVXaXRoVmVyc2lvbiA9IGFzeW5jIChcbiAgY29uZmlnOiBBVEFCb290c3RyYXBDb25maWcsXG4gIG1vZHVsZU5hbWU6IHN0cmluZyxcbiAgdmVyc2lvbjogc3RyaW5nXG4pID0+IHtcbiAgY29uc3QgdXJsID0gYGh0dHBzOi8vZGF0YS5qc2RlbGl2ci5jb20vdjEvcGFja2FnZS9ucG0vJHttb2R1bGVOYW1lfUAke3ZlcnNpb259L2ZsYXRgXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGFwaTxOUE1UcmVlTWV0YT4oY29uZmlnLCB1cmwpXG4gIGlmIChyZXMgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiByZXNcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVzLFxuICAgICAgbW9kdWxlTmFtZSxcbiAgICAgIHZlcnNpb24sXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXREVFNGaWxlRm9yTW9kdWxlV2l0aFZlcnNpb24gPSBhc3luYyAoXG4gIGNvbmZpZzogQVRBQm9vdHN0cmFwQ29uZmlnLFxuICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gIHZlcnNpb246IHN0cmluZyxcbiAgZmlsZTogc3RyaW5nXG4pID0+IHtcbiAgLy8gZmlsZSBjb21lcyB3aXRoIGEgcHJlZml4IC8gXG4gIGNvbnN0IHVybCA9IGBodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtLyR7bW9kdWxlTmFtZX1AJHt2ZXJzaW9ufSR7ZmlsZX1gXG4gIGNvbnN0IGYgPSBjb25maWcuZmV0Y2hlciB8fCBmZXRjaFxuICBjb25zdCByZXMgPSBhd2FpdCBmKHVybClcbiAgaWYgKHJlcy5vaykge1xuICAgIHJldHVybiByZXMudGV4dCgpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihcIk9LXCIpXG4gIH1cbn1cblxuZnVuY3Rpb24gYXBpPFQ+KGNvbmZpZzogQVRBQm9vdHN0cmFwQ29uZmlnLCB1cmw6IHN0cmluZywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxUIHwgRXJyb3I+IHtcbiAgY29uc3QgZiA9IGNvbmZpZy5mZXRjaGVyIHx8IGZldGNoXG5cbiAgcmV0dXJuIGYodXJsLCBpbml0KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHJlcy5vaykge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCkudGhlbihmID0+IGYgYXMgVClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIk9LXCIpXG4gICAgfVxuICB9KVxufVxuIl19