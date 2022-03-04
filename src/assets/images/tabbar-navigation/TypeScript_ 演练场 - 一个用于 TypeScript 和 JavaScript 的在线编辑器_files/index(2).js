var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./apis", "./edgeCases"], function (require, exports, apis_1, edgeCases_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFileTreeForModuleWithTag = exports.getNewDependencies = exports.getReferencesForModule = exports.setupTypeAcquisition = void 0;
    /**
     * The function which starts up type acquisition,
     * returns a function which you then pass the initial
     * source code for the app with.
     *
     * This is effectively the main export, everything else is
     * basically exported for tests and should be considered
     * implementation details by consumers.
     */
    const setupTypeAcquisition = (config) => {
        const moduleMap = new Map();
        const fsMap = new Map();
        let estimatedToDownload = 0;
        let estimatedDownloaded = 0;
        return (initialSourceFile) => {
            estimatedToDownload = 0;
            estimatedDownloaded = 0;
            resolveDeps(initialSourceFile, 0).then(t => {
                var _a, _b;
                if (estimatedDownloaded > 0) {
                    (_b = (_a = config.delegate).finished) === null || _b === void 0 ? void 0 : _b.call(_a, fsMap);
                }
            });
        };
        function resolveDeps(initialSourceFile, depth) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function* () {
                const depsToGet = getNewDependencies(config, moduleMap, initialSourceFile);
                // Make it so it won't get re-downloaded
                depsToGet.forEach(dep => moduleMap.set(dep.module, { state: "loading" }));
                // Grab the module trees which gives us a list of files to download
                const trees = yield Promise.all(depsToGet.map(f => (0, exports.getFileTreeForModuleWithTag)(config, f.module, f.version)));
                const treesOnly = trees.filter(t => !("error" in t));
                // These are the modules which we can grab directly
                const hasDTS = treesOnly.filter(t => t.files.find(f => f.name.endsWith(".d.ts")));
                const dtsFilesFromNPM = hasDTS.map(t => treeToDTSFiles(t, `/node_modules/${t.moduleName}`));
                // These are ones we need to look on DT for (which may not be there, who knows)
                const mightBeOnDT = treesOnly.filter(t => !hasDTS.includes(t));
                const dtTrees = yield Promise.all(
                // TODO: Switch from 'latest' to the version from the original tree which is user-controlled
                mightBeOnDT.map(f => (0, exports.getFileTreeForModuleWithTag)(config, `@types/${getDTName(f.moduleName)}`, "latest")));
                const dtTreesOnly = dtTrees.filter(t => !("error" in t));
                const dtsFilesFromDT = dtTreesOnly.map(t => treeToDTSFiles(t, `/node_modules/@types/${getDTName(t.moduleName).replace("types__", "")}`));
                // Collect all the npm and DT DTS requests and flatten their arrays
                const allDTSFiles = dtsFilesFromNPM.concat(dtsFilesFromDT).reduce((p, c) => p.concat(c), []);
                estimatedToDownload += allDTSFiles.length;
                if (allDTSFiles.length && depth === 0) {
                    (_b = (_a = config.delegate).started) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                // Grab the package.jsons for each dependency
                for (const tree of treesOnly) {
                    let prefix = `/node_modules/${tree.moduleName}`;
                    if (dtTreesOnly.includes(tree))
                        prefix = `/node_modules/@types/${getDTName(tree.moduleName).replace("types__", "")}`;
                    const path = prefix + "/package.json";
                    const pkgJSON = yield (0, apis_1.getDTSFileForModuleWithVersion)(config, tree.moduleName, tree.version, "/package.json");
                    if (typeof pkgJSON == "string") {
                        fsMap.set(path, pkgJSON);
                        (_d = (_c = config.delegate).receivedFile) === null || _d === void 0 ? void 0 : _d.call(_c, pkgJSON, path);
                    }
                    else {
                        (_e = config.logger) === null || _e === void 0 ? void 0 : _e.error(`Could not download package.json for ${tree.moduleName}`);
                    }
                }
                // Grab all dts files
                yield Promise.all(allDTSFiles.map((dts) => __awaiter(this, void 0, void 0, function* () {
                    var _f, _g, _h;
                    const dtsCode = yield (0, apis_1.getDTSFileForModuleWithVersion)(config, dts.moduleName, dts.moduleVersion, dts.path);
                    estimatedDownloaded++;
                    if (dtsCode instanceof Error) {
                        // TODO?
                        (_f = config.logger) === null || _f === void 0 ? void 0 : _f.error(`Had an issue getting ${dts.path} for ${dts.moduleName}`);
                    }
                    else {
                        fsMap.set(dts.vfsPath, dtsCode);
                        (_h = (_g = config.delegate).receivedFile) === null || _h === void 0 ? void 0 : _h.call(_g, dtsCode, dts.vfsPath);
                        // Send a progress note every 5 downloads
                        if (config.delegate.progress && estimatedDownloaded % 5 === 0) {
                            config.delegate.progress(estimatedDownloaded, estimatedToDownload);
                        }
                        // Recurse through deps
                        yield resolveDeps(dtsCode, depth + 1);
                    }
                })));
            });
        }
    };
    exports.setupTypeAcquisition = setupTypeAcquisition;
    function treeToDTSFiles(tree, vfsPrefix) {
        const dtsRefs = [];
        for (const file of tree.files) {
            if (file.name.endsWith(".d.ts")) {
                dtsRefs.push({
                    moduleName: tree.moduleName,
                    moduleVersion: tree.version,
                    vfsPath: `${vfsPrefix}${file.name}`,
                    path: file.name,
                });
            }
        }
        return dtsRefs;
    }
    /**
     * Pull out any potential references to other modules (including relatives) with their
     * npm versioning strat too if someone opts into a different version via an inline end of line comment
     */
    const getReferencesForModule = (ts, code) => {
        const meta = ts.preProcessFile(code);
        // Ensure we don't try download TypeScript lib references
        // @ts-ignore - private but likely to never change
        const libMap = ts.libMap || new Map();
        // TODO: strip /// <reference path='X' />?
        const references = meta.referencedFiles
            .concat(meta.importedFiles)
            .concat(meta.libReferenceDirectives)
            .filter(f => !f.fileName.endsWith(".d.ts"))
            .filter(d => !libMap.has(d.fileName));
        return references.map(r => {
            let version = undefined;
            if (!r.fileName.startsWith(".")) {
                version = "latest";
                const line = code.slice(r.end).split("\n")[0];
                if (line.includes("// types:"))
                    version = line.split("// types: ")[1].trim();
            }
            return {
                module: r.fileName,
                version,
            };
        });
    };
    exports.getReferencesForModule = getReferencesForModule;
    /** A list of modules from the current sourcefile which we don't have existing files for */
    function getNewDependencies(config, moduleMap, code) {
        const refs = (0, exports.getReferencesForModule)(config.typescript, code).map(ref => (Object.assign(Object.assign({}, ref), { module: (0, edgeCases_1.mapModuleNameToModule)(ref.module) })));
        // Drop relative paths because we're getting all the files
        const modules = refs.filter(f => !f.module.startsWith(".")).filter(m => !moduleMap.has(m.module));
        return modules;
    }
    exports.getNewDependencies = getNewDependencies;
    /** The bulk load of the work in getting the filetree based on how people think about npm names and versions */
    const getFileTreeForModuleWithTag = (config, moduleName, tag) => __awaiter(void 0, void 0, void 0, function* () {
        let toDownload = tag || "latest";
        // I think having at least 2 dots is a reasonable approx for being a semver and not a tag,
        // we can skip an API request, TBH this is probably rare
        if (toDownload.split(".").length < 2) {
            // The jsdelivr API needs a _version_ not a tag. So, we need to switch out
            // the tag to the version via an API request.
            const response = yield (0, apis_1.getNPMVersionForModuleReference)(config, moduleName, toDownload);
            if (response instanceof Error) {
                return {
                    error: response,
                    userFacingMessage: `Could not go from a tag to version on npm for ${moduleName} - possible typo?`,
                };
            }
            const neededVersion = response.version;
            if (!neededVersion) {
                const versions = yield (0, apis_1.getNPMVersionsForModule)(config, moduleName);
                if (versions instanceof Error) {
                    return {
                        error: response,
                        userFacingMessage: `Could not get versions on npm for ${moduleName} - possible typo?`,
                    };
                }
                const tags = Object.entries(versions.tags).join(", ");
                return {
                    error: new Error("Could not find tag for module"),
                    userFacingMessage: `Could not find a tag for ${moduleName} called ${tag}. Did find ${tags}`,
                };
            }
            toDownload = neededVersion;
        }
        const res = yield (0, apis_1.getFiletreeForModuleWithVersion)(config, moduleName, toDownload);
        if (res instanceof Error) {
            return {
                error: res,
                userFacingMessage: `Could not get the files for ${moduleName}@${toDownload}. Is it possibly a typo?`,
            };
        }
        return res;
    });
    exports.getFileTreeForModuleWithTag = getFileTreeForModuleWithTag;
    // Taken from dts-gen: https://github.com/microsoft/dts-gen/blob/master/lib/names.ts
    function getDTName(s) {
        if (s.indexOf("@") === 0 && s.indexOf("/") !== -1) {
            // we have a scoped module, e.g. @bla/foo
            // which should be converted to   bla__foo
            s = s.substr(1).replace("/", "__");
        }
        return s;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zYW5kYm94L3NyYy92ZW5kb3IvYXRhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFtQ0E7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLG9CQUFvQixHQUFHLENBQUMsTUFBMEIsRUFBRSxFQUFFO1FBQ2pFLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFBO1FBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO1FBRXZDLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFBO1FBRTNCLE9BQU8sQ0FBQyxpQkFBeUIsRUFBRSxFQUFFO1lBQ25DLG1CQUFtQixHQUFHLENBQUMsQ0FBQTtZQUN2QixtQkFBbUIsR0FBRyxDQUFDLENBQUE7WUFFdkIsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTs7Z0JBQ3pDLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxFQUFFO29CQUMzQixNQUFBLE1BQUEsTUFBTSxDQUFDLFFBQVEsRUFBQyxRQUFRLG1EQUFHLEtBQUssQ0FBQyxDQUFBO2lCQUNsQztZQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBO1FBRUQsU0FBZSxXQUFXLENBQUMsaUJBQXlCLEVBQUUsS0FBYTs7O2dCQUNqRSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUE7Z0JBRTFFLHdDQUF3QztnQkFDeEMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFD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QyxDQUFDLEVBQUU7WUFDakQseUNBQXlDO1lBQ3pDLDBDQUEwQztZQUMxQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ25DO1FBQ0QsT0FBTyxDQUFDLENBQUE7SUFDVixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgZ2V0RFRTRmlsZUZvck1vZHVsZVdpdGhWZXJzaW9uLFxuICBnZXRGaWxldHJlZUZvck1vZHVsZVdpdGhWZXJzaW9uLFxuICBnZXROUE1WZXJzaW9uRm9yTW9kdWxlUmVmZXJlbmNlLFxuICBnZXROUE1WZXJzaW9uc0Zvck1vZHVsZSxcbiAgTlBNVHJlZU1ldGEsXG59IGZyb20gXCIuL2FwaXNcIlxuaW1wb3J0IHsgbWFwTW9kdWxlTmFtZVRvTW9kdWxlIH0gZnJvbSBcIi4vZWRnZUNhc2VzXCJcblxuZXhwb3J0IGludGVyZmFjZSBBVEFCb290c3RyYXBDb25maWcge1xuICAvKiogQSBvYmplY3QgeW91IHBhc3MgaW4gdG8gZ2V0IGNhbGxiYWNrcyAqL1xuICBkZWxlZ2F0ZToge1xuICAgIC8qKiBUaGUgY2FsbGJhY2sgd2hpY2ggZ2V0cyBjYWxsZWQgd2hlbiBBVEEgZGVjaWRlcyBhIGZpbGUgbmVlZHMgdG8gYmUgd3JpdHRlbiB0byB5b3VyIFZGUyAgKi9cbiAgICByZWNlaXZlZEZpbGU/OiAoY29kZTogc3RyaW5nLCBwYXRoOiBzdHJpbmcpID0+IHZvaWRcbiAgICAvKiogQSB3YXkgdG8gZGlzcGxheSBwcm9ncmVzcyAqL1xuICAgIHByb2dyZXNzPzogKGRvd25sb2FkZWQ6IG51bWJlciwgZXN0aW1hdGVkVG90YWw6IG51bWJlcikgPT4gdm9pZFxuICAgIC8qKiBOb3RlOiBBbiBlcnJvciBtZXNzYWdlIGRvZXMgbm90IG1lYW4gQVRBIGhhcyBzdG9wcGVkISAqL1xuICAgIGVycm9yTWVzc2FnZT86ICh1c2VyRmFjaW5nTWVzc2FnZTogc3RyaW5nLCBlcnJvcjogRXJyb3IpID0+IHZvaWRcbiAgICAvKiogQSBjYWxsYmFjayBpbmRpY2F0aW5nIHRoYXQgQVRBIGFjdHVhbGx5IGhhcyB3b3JrIHRvIGRvICovXG4gICAgc3RhcnRlZD86ICgpID0+IHZvaWRcbiAgICAvKiogVGhlIGNhbGxiYWNrIHdoZW4gYWxsIEFUQSBoYXMgZmluaXNoZWQgKi9cbiAgICBmaW5pc2hlZD86IChmaWxlczogTWFwPHN0cmluZywgc3RyaW5nPikgPT4gdm9pZFxuICB9XG4gIC8qKiBQYXNzZWQgdG8gZmV0Y2ggYXMgdGhlIHVzZXItYWdlbnQgKi9cbiAgcHJvamVjdE5hbWU6IHN0cmluZ1xuICAvKiogWW91ciBsb2NhbCBjb3B5IG9mIHR5cGVzY3JpcHQgKi9cbiAgdHlwZXNjcmlwdDogdHlwZW9mIGltcG9ydChcInR5cGVzY3JpcHRcIilcbiAgLyoqIElmIHlvdSBuZWVkIGEgY3VzdG9tIHZlcnNpb24gb2YgZmV0Y2ggKi9cbiAgZmV0Y2hlcj86IHR5cGVvZiBmZXRjaFxuICAvKiogSWYgeW91IG5lZWQgYSBjdXN0b20gbG9nZ2VyIGluc3RlYWQgb2YgdGhlIGNvbnNvbGUgZ2xvYmFsICovXG4gIGxvZ2dlcj86IExvZ2dlclxufVxuXG50eXBlIE1vZHVsZU1ldGEgPSB7IHN0YXRlOiBcImxvYWRpbmdcIiB9XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIHdoaWNoIHN0YXJ0cyB1cCB0eXBlIGFjcXVpc2l0aW9uLFxuICogcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIHlvdSB0aGVuIHBhc3MgdGhlIGluaXRpYWxcbiAqIHNvdXJjZSBjb2RlIGZvciB0aGUgYXBwIHdpdGguXG4gKlxuICogVGhpcyBpcyBlZmZlY3RpdmVseSB0aGUgbWFpbiBleHBvcnQsIGV2ZXJ5dGhpbmcgZWxzZSBpc1xuICogYmFzaWNhbGx5IGV4cG9ydGVkIGZvciB0ZXN0cyBhbmQgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAqIGltcGxlbWVudGF0aW9uIGRldGFpbHMgYnkgY29uc3VtZXJzLlxuICovXG5leHBvcnQgY29uc3Qgc2V0dXBUeXBlQWNxdWlzaXRpb24gPSAoY29uZmlnOiBBVEFCb290c3RyYXBDb25maWcpID0+IHtcbiAgY29uc3QgbW9kdWxlTWFwID0gbmV3IE1hcDxzdHJpbmcsIE1vZHVsZU1ldGE+KClcbiAgY29uc3QgZnNNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpXG5cbiAgbGV0IGVzdGltYXRlZFRvRG93bmxvYWQgPSAwXG4gIGxldCBlc3RpbWF0ZWREb3dubG9hZGVkID0gMFxuXG4gIHJldHVybiAoaW5pdGlhbFNvdXJjZUZpbGU6IHN0cmluZykgPT4ge1xuICAgIGVzdGltYXRlZFRvRG93bmxvYWQgPSAwXG4gICAgZXN0aW1hdGVkRG93bmxvYWRlZCA9IDBcblxuICAgIHJlc29sdmVEZXBzKGluaXRpYWxTb3VyY2VGaWxlLCAwKS50aGVuKHQgPT4ge1xuICAgICAgaWYgKGVzdGltYXRlZERvd25sb2FkZWQgPiAwKSB7XG4gICAgICAgIGNvbmZpZy5kZWxlZ2F0ZS5maW5pc2hlZD8uKGZzTWFwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiByZXNvbHZlRGVwcyhpbml0aWFsU291cmNlRmlsZTogc3RyaW5nLCBkZXB0aDogbnVtYmVyKSB7XG4gICAgY29uc3QgZGVwc1RvR2V0ID0gZ2V0TmV3RGVwZW5kZW5jaWVzKGNvbmZpZywgbW9kdWxlTWFwLCBpbml0aWFsU291cmNlRmlsZSlcblxuICAgIC8vIE1ha2UgaXQgc28gaXQgd29uJ3QgZ2V0IHJlLWRvd25sb2FkZWRcbiAgICBkZXBzVG9HZXQuZm9yRWFjaChkZXAgPT4gbW9kdWxlTWFwLnNldChkZXAubW9kdWxlLCB7IHN0YXRlOiBcImxvYWRpbmdcIiB9KSlcblxuICAgIC8vIEdyYWIgdGhlIG1vZHVsZSB0cmVlcyB3aGljaCBnaXZlcyB1cyBhIGxpc3Qgb2YgZmlsZXMgdG8gZG93bmxvYWRcbiAgICBjb25zdCB0cmVlcyA9IGF3YWl0IFByb21pc2UuYWxsKGRlcHNUb0dldC5tYXAoZiA9PiBnZXRGaWxlVHJlZUZvck1vZHVsZVdpdGhUYWcoY29uZmlnLCBmLm1vZHVsZSwgZi52ZXJzaW9uKSkpXG4gICAgY29uc3QgdHJlZXNPbmx5ID0gdHJlZXMuZmlsdGVyKHQgPT4gIShcImVycm9yXCIgaW4gdCkpIGFzIE5QTVRyZWVNZXRhW11cblxuICAgIC8vIFRoZXNlIGFyZSB0aGUgbW9kdWxlcyB3aGljaCB3ZSBjYW4gZ3JhYiBkaXJlY3RseVxuICAgIGNvbnN0IGhhc0RUUyA9IHRyZWVzT25seS5maWx0ZXIodCA9PiB0LmZpbGVzLmZpbmQoZiA9PiBmLm5hbWUuZW5kc1dpdGgoXCIuZC50c1wiKSkpXG4gICAgY29uc3QgZHRzRmlsZXNGcm9tTlBNID0gaGFzRFRTLm1hcCh0ID0+IHRyZWVUb0RUU0ZpbGVzKHQsIGAvbm9kZV9tb2R1bGVzLyR7dC5tb2R1bGVOYW1lfWApKVxuXG4gICAgLy8gVGhlc2UgYXJlIG9uZXMgd2UgbmVlZCB0byBsb29rIG9uIERUIGZvciAod2hpY2ggbWF5IG5vdCBiZSB0aGVyZSwgd2hvIGtub3dzKVxuICAgIGNvbnN0IG1pZ2h0QmVPbkRUID0gdHJlZXNPbmx5LmZpbHRlcih0ID0+ICFoYXNEVFMuaW5jbHVkZXModCkpXG4gICAgY29uc3QgZHRUcmVlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgLy8gVE9ETzogU3dpdGNoIGZyb20gJ2xhdGVzdCcgdG8gdGhlIHZlcnNpb24gZnJvbSB0aGUgb3JpZ2luYWwgdHJlZSB3aGljaCBpcyB1c2VyLWNvbnRyb2xsZWRcbiAgICAgIG1pZ2h0QmVPbkRULm1hcChmID0+IGdldEZpbGVUcmVlRm9yTW9kdWxlV2l0aFRhZyhjb25maWcsIGBAdHlwZXMvJHtnZXREVE5hbWUoZi5tb2R1bGVOYW1lKX1gLCBcImxhdGVzdFwiKSlcbiAgICApXG5cbiAgICBjb25zdCBkdFRyZWVzT25seSA9IGR0VHJlZXMuZmlsdGVyKHQgPT4gIShcImVycm9yXCIgaW4gdCkpIGFzIE5QTVRyZWVNZXRhW11cbiAgICBjb25zdCBkdHNGaWxlc0Zyb21EVCA9IGR0VHJlZXNPbmx5Lm1hcCh0ID0+IHRyZWVUb0RUU0ZpbGVzKHQsIGAvbm9kZV9tb2R1bGVzL0B0eXBlcy8ke2dldERUTmFtZSh0Lm1vZHVsZU5hbWUpLnJlcGxhY2UoXCJ0eXBlc19fXCIsIFwiXCIpfWApKVxuXG4gICAgLy8gQ29sbGVjdCBhbGwgdGhlIG5wbSBhbmQgRFQgRFRTIHJlcXVlc3RzIGFuZCBmbGF0dGVuIHRoZWlyIGFycmF5c1xuICAgIGNvbnN0IGFsbERUU0ZpbGVzID0gZHRzRmlsZXNGcm9tTlBNLmNvbmNhdChkdHNGaWxlc0Zyb21EVCkucmVkdWNlKChwLCBjKSA9PiBwLmNvbmNhdChjKSwgW10pXG4gICAgZXN0aW1hdGVkVG9Eb3dubG9hZCArPSBhbGxEVFNGaWxlcy5sZW5ndGhcbiAgICBpZiAoYWxsRFRTRmlsZXMubGVuZ3RoICYmIGRlcHRoID09PSAwKSB7XG4gICAgICBjb25maWcuZGVsZWdhdGUuc3RhcnRlZD8uKClcbiAgICB9XG5cbiAgICAvLyBHcmFiIHRoZSBwYWNrYWdlLmpzb25zIGZvciBlYWNoIGRlcGVuZGVuY3lcbiAgICBmb3IgKGNvbnN0IHRyZWUgb2YgdHJlZXNPbmx5KSB7XG4gICAgICBsZXQgcHJlZml4ID0gYC9ub2RlX21vZHVsZXMvJHt0cmVlLm1vZHVsZU5hbWV9YFxuICAgICAgaWYgKGR0VHJlZXNPbmx5LmluY2x1ZGVzKHRyZWUpKSBwcmVmaXggPSBgL25vZGVfbW9kdWxlcy9AdHlwZXMvJHtnZXREVE5hbWUodHJlZS5tb2R1bGVOYW1lKS5yZXBsYWNlKFwidHlwZXNfX1wiLCBcIlwiKX1gXG4gICAgICBjb25zdCBwYXRoID0gcHJlZml4ICsgXCIvcGFja2FnZS5qc29uXCJcbiAgICAgIGNvbnN0IHBrZ0pTT04gPSBhd2FpdCBnZXREVFNGaWxlRm9yTW9kdWxlV2l0aFZlcnNpb24oY29uZmlnLCB0cmVlLm1vZHVsZU5hbWUsIHRyZWUudmVyc2lvbiwgXCIvcGFja2FnZS5qc29uXCIpXG5cbiAgICAgIGlmICh0eXBlb2YgcGtnSlNPTiA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGZzTWFwLnNldChwYXRoLCBwa2dKU09OKVxuICAgICAgICBjb25maWcuZGVsZWdhdGUucmVjZWl2ZWRGaWxlPy4ocGtnSlNPTiwgcGF0aClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZy5sb2dnZXI/LmVycm9yKGBDb3VsZCBub3QgZG93bmxvYWQgcGFja2FnZS5qc29uIGZvciAke3RyZWUubW9kdWxlTmFtZX1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEdyYWIgYWxsIGR0cyBmaWxlc1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgYWxsRFRTRmlsZXMubWFwKGFzeW5jIGR0cyA9PiB7XG4gICAgICAgIGNvbnN0IGR0c0NvZGUgPSBhd2FpdCBnZXREVFNGaWxlRm9yTW9kdWxlV2l0aFZlcnNpb24oY29uZmlnLCBkdHMubW9kdWxlTmFtZSwgZHRzLm1vZHVsZVZlcnNpb24sIGR0cy5wYXRoKVxuICAgICAgICBlc3RpbWF0ZWREb3dubG9hZGVkKytcbiAgICAgICAgaWYgKGR0c0NvZGUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIC8vIFRPRE8/XG4gICAgICAgICAgY29uZmlnLmxvZ2dlcj8uZXJyb3IoYEhhZCBhbiBpc3N1ZSBnZXR0aW5nICR7ZHRzLnBhdGh9IGZvciAke2R0cy5tb2R1bGVOYW1lfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnNNYXAuc2V0KGR0cy52ZnNQYXRoLCBkdHNDb2RlKVxuICAgICAgICAgIGNvbmZpZy5kZWxlZ2F0ZS5yZWNlaXZlZEZpbGU/LihkdHNDb2RlLCBkdHMudmZzUGF0aClcblxuICAgICAgICAgIC8vIFNlbmQgYSBwcm9ncmVzcyBub3RlIGV2ZXJ5IDUgZG93bmxvYWRzXG4gICAgICAgICAgaWYgKGNvbmZpZy5kZWxlZ2F0ZS5wcm9ncmVzcyAmJiBlc3RpbWF0ZWREb3dubG9hZGVkICUgNSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLmRlbGVnYXRlLnByb2dyZXNzKGVzdGltYXRlZERvd25sb2FkZWQsIGVzdGltYXRlZFRvRG93bmxvYWQpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVjdXJzZSB0aHJvdWdoIGRlcHNcbiAgICAgICAgICBhd2FpdCByZXNvbHZlRGVwcyhkdHNDb2RlLCBkZXB0aCArIDEpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICB9XG59XG5cbnR5cGUgQVRBRG93bmxvYWQgPSB7XG4gIG1vZHVsZU5hbWU6IHN0cmluZ1xuICBtb2R1bGVWZXJzaW9uOiBzdHJpbmdcbiAgdmZzUGF0aDogc3RyaW5nXG4gIHBhdGg6IHN0cmluZ1xufVxuXG5mdW5jdGlvbiB0cmVlVG9EVFNGaWxlcyh0cmVlOiBOUE1UcmVlTWV0YSwgdmZzUHJlZml4OiBzdHJpbmcpIHtcbiAgY29uc3QgZHRzUmVmczogQVRBRG93bmxvYWRbXSA9IFtdXG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIHRyZWUuZmlsZXMpIHtcbiAgICBpZiAoZmlsZS5uYW1lLmVuZHNXaXRoKFwiLmQudHNcIikpIHtcbiAgICAgIGR0c1JlZnMucHVzaCh7XG4gICAgICAgIG1vZHVsZU5hbWU6IHRyZWUubW9kdWxlTmFtZSxcbiAgICAgICAgbW9kdWxlVmVyc2lvbjogdHJlZS52ZXJzaW9uLFxuICAgICAgICB2ZnNQYXRoOiBgJHt2ZnNQcmVmaXh9JHtmaWxlLm5hbWV9YCxcbiAgICAgICAgcGF0aDogZmlsZS5uYW1lLFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR0c1JlZnNcbn1cblxuLyoqXG4gKiBQdWxsIG91dCBhbnkgcG90ZW50aWFsIHJlZmVyZW5jZXMgdG8gb3RoZXIgbW9kdWxlcyAoaW5jbHVkaW5nIHJlbGF0aXZlcykgd2l0aCB0aGVpclxuICogbnBtIHZlcnNpb25pbmcgc3RyYXQgdG9vIGlmIHNvbWVvbmUgb3B0cyBpbnRvIGEgZGlmZmVyZW50IHZlcnNpb24gdmlhIGFuIGlubGluZSBlbmQgb2YgbGluZSBjb21tZW50XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRSZWZlcmVuY2VzRm9yTW9kdWxlID0gKHRzOiB0eXBlb2YgaW1wb3J0KFwidHlwZXNjcmlwdFwiKSwgY29kZTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IG1ldGEgPSB0cy5wcmVQcm9jZXNzRmlsZShjb2RlKVxuXG4gIC8vIEVuc3VyZSB3ZSBkb24ndCB0cnkgZG93bmxvYWQgVHlwZVNjcmlwdCBsaWIgcmVmZXJlbmNlc1xuICAvLyBAdHMtaWdub3JlIC0gcHJpdmF0ZSBidXQgbGlrZWx5IHRvIG5ldmVyIGNoYW5nZVxuICBjb25zdCBsaWJNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSB0cy5saWJNYXAgfHwgbmV3IE1hcCgpXG5cbiAgLy8gVE9ETzogc3RyaXAgLy8vIDxyZWZlcmVuY2UgcGF0aD0nWCcgLz4/XG5cbiAgY29uc3QgcmVmZXJlbmNlcyA9IG1ldGEucmVmZXJlbmNlZEZpbGVzXG4gICAgLmNvbmNhdChtZXRhLmltcG9ydGVkRmlsZXMpXG4gICAgLmNvbmNhdChtZXRhLmxpYlJlZmVyZW5jZURpcmVjdGl2ZXMpXG4gICAgLmZpbHRlcihmID0+ICFmLmZpbGVOYW1lLmVuZHNXaXRoKFwiLmQudHNcIikpXG4gICAgLmZpbHRlcihkID0+ICFsaWJNYXAuaGFzKGQuZmlsZU5hbWUpKVxuXG4gIHJldHVybiByZWZlcmVuY2VzLm1hcChyID0+IHtcbiAgICBsZXQgdmVyc2lvbiA9IHVuZGVmaW5lZFxuICAgIGlmICghci5maWxlTmFtZS5zdGFydHNXaXRoKFwiLlwiKSkge1xuICAgICAgdmVyc2lvbiA9IFwibGF0ZXN0XCJcbiAgICAgIGNvbnN0IGxpbmUgPSBjb2RlLnNsaWNlKHIuZW5kKS5zcGxpdChcIlxcblwiKVswXSFcbiAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwiLy8gdHlwZXM6XCIpKSB2ZXJzaW9uID0gbGluZS5zcGxpdChcIi8vIHR5cGVzOiBcIilbMV0hLnRyaW0oKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBtb2R1bGU6IHIuZmlsZU5hbWUsXG4gICAgICB2ZXJzaW9uLFxuICAgIH1cbiAgfSlcbn1cblxuLyoqIEEgbGlzdCBvZiBtb2R1bGVzIGZyb20gdGhlIGN1cnJlbnQgc291cmNlZmlsZSB3aGljaCB3ZSBkb24ndCBoYXZlIGV4aXN0aW5nIGZpbGVzIGZvciAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0RlcGVuZGVuY2llcyhjb25maWc6IEFUQUJvb3RzdHJhcENvbmZpZywgbW9kdWxlTWFwOiBNYXA8c3RyaW5nLCBNb2R1bGVNZXRhPiwgY29kZTogc3RyaW5nKSB7XG4gIGNvbnN0IHJlZnMgPSBnZXRSZWZlcmVuY2VzRm9yTW9kdWxlKGNvbmZpZy50eXBlc2NyaXB0LCBjb2RlKS5tYXAocmVmID0+ICh7XG4gICAgLi4ucmVmLFxuICAgIG1vZHVsZTogbWFwTW9kdWxlTmFtZVRvTW9kdWxlKHJlZi5tb2R1bGUpLFxuICB9KSlcblxuICAvLyBEcm9wIHJlbGF0aXZlIHBhdGhzIGJlY2F1c2Ugd2UncmUgZ2V0dGluZyBhbGwgdGhlIGZpbGVzXG4gIGNvbnN0IG1vZHVsZXMgPSByZWZzLmZpbHRlcihmID0+ICFmLm1vZHVsZS5zdGFydHNXaXRoKFwiLlwiKSkuZmlsdGVyKG0gPT4gIW1vZHVsZU1hcC5oYXMobS5tb2R1bGUpKVxuICByZXR1cm4gbW9kdWxlc1xufVxuXG4vKiogVGhlIGJ1bGsgbG9hZCBvZiB0aGUgd29yayBpbiBnZXR0aW5nIHRoZSBmaWxldHJlZSBiYXNlZCBvbiBob3cgcGVvcGxlIHRoaW5rIGFib3V0IG5wbSBuYW1lcyBhbmQgdmVyc2lvbnMgKi9cbmV4cG9ydCBjb25zdCBnZXRGaWxlVHJlZUZvck1vZHVsZVdpdGhUYWcgPSBhc3luYyAoXG4gIGNvbmZpZzogQVRBQm9vdHN0cmFwQ29uZmlnLFxuICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gIHRhZzogc3RyaW5nIHwgdW5kZWZpbmVkXG4pID0+IHtcbiAgbGV0IHRvRG93bmxvYWQgPSB0YWcgfHwgXCJsYXRlc3RcIlxuXG4gIC8vIEkgdGhpbmsgaGF2aW5nIGF0IGxlYXN0IDIgZG90cyBpcyBhIHJlYXNvbmFibGUgYXBwcm94IGZvciBiZWluZyBhIHNlbXZlciBhbmQgbm90IGEgdGFnLFxuICAvLyB3ZSBjYW4gc2tpcCBhbiBBUEkgcmVxdWVzdCwgVEJIIHRoaXMgaXMgcHJvYmFibHkgcmFyZVxuICBpZiAodG9Eb3dubG9hZC5zcGxpdChcIi5cIikubGVuZ3RoIDwgMikge1xuICAgIC8vIFRoZSBqc2RlbGl2ciBBUEkgbmVlZHMgYSBfdmVyc2lvbl8gbm90IGEgdGFnLiBTbywgd2UgbmVlZCB0byBzd2l0Y2ggb3V0XG4gICAgLy8gdGhlIHRhZyB0byB0aGUgdmVyc2lvbiB2aWEgYW4gQVBJIHJlcXVlc3QuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXROUE1WZXJzaW9uRm9yTW9kdWxlUmVmZXJlbmNlKGNvbmZpZywgbW9kdWxlTmFtZSwgdG9Eb3dubG9hZClcbiAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3I6IHJlc3BvbnNlLFxuICAgICAgICB1c2VyRmFjaW5nTWVzc2FnZTogYENvdWxkIG5vdCBnbyBmcm9tIGEgdGFnIHRvIHZlcnNpb24gb24gbnBtIGZvciAke21vZHVsZU5hbWV9IC0gcG9zc2libGUgdHlwbz9gLFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG5lZWRlZFZlcnNpb24gPSByZXNwb25zZS52ZXJzaW9uXG4gICAgaWYgKCFuZWVkZWRWZXJzaW9uKSB7XG4gICAgICBjb25zdCB2ZXJzaW9ucyA9IGF3YWl0IGdldE5QTVZlcnNpb25zRm9yTW9kdWxlKGNvbmZpZywgbW9kdWxlTmFtZSlcbiAgICAgIGlmICh2ZXJzaW9ucyBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHJlc3BvbnNlLFxuICAgICAgICAgIHVzZXJGYWNpbmdNZXNzYWdlOiBgQ291bGQgbm90IGdldCB2ZXJzaW9ucyBvbiBucG0gZm9yICR7bW9kdWxlTmFtZX0gLSBwb3NzaWJsZSB0eXBvP2AsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5lbnRyaWVzKHZlcnNpb25zLnRhZ3MpLmpvaW4oXCIsIFwiKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3I6IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRhZyBmb3IgbW9kdWxlXCIpLFxuICAgICAgICB1c2VyRmFjaW5nTWVzc2FnZTogYENvdWxkIG5vdCBmaW5kIGEgdGFnIGZvciAke21vZHVsZU5hbWV9IGNhbGxlZCAke3RhZ30uIERpZCBmaW5kICR7dGFnc31gLFxuICAgICAgfVxuICAgIH1cblxuICAgIHRvRG93bmxvYWQgPSBuZWVkZWRWZXJzaW9uXG4gIH1cblxuICBjb25zdCByZXMgPSBhd2FpdCBnZXRGaWxldHJlZUZvck1vZHVsZVdpdGhWZXJzaW9uKGNvbmZpZywgbW9kdWxlTmFtZSwgdG9Eb3dubG9hZClcbiAgaWYgKHJlcyBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yOiByZXMsXG4gICAgICB1c2VyRmFjaW5nTWVzc2FnZTogYENvdWxkIG5vdCBnZXQgdGhlIGZpbGVzIGZvciAke21vZHVsZU5hbWV9QCR7dG9Eb3dubG9hZH0uIElzIGl0IHBvc3NpYmx5IGEgdHlwbz9gLFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXNcbn1cblxuaW50ZXJmYWNlIExvZ2dlciB7XG4gIGxvZzogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG4gIGVycm9yOiAoLi4uYXJnczogYW55W10pID0+IHZvaWRcbiAgZ3JvdXBDb2xsYXBzZWQ6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxuICBncm91cEVuZDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG59XG5cbi8vIFRha2VuIGZyb20gZHRzLWdlbjogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9kdHMtZ2VuL2Jsb2IvbWFzdGVyL2xpYi9uYW1lcy50c1xuZnVuY3Rpb24gZ2V0RFROYW1lKHM6IHN0cmluZykge1xuICBpZiAocy5pbmRleE9mKFwiQFwiKSA9PT0gMCAmJiBzLmluZGV4T2YoXCIvXCIpICE9PSAtMSkge1xuICAgIC8vIHdlIGhhdmUgYSBzY29wZWQgbW9kdWxlLCBlLmcuIEBibGEvZm9vXG4gICAgLy8gd2hpY2ggc2hvdWxkIGJlIGNvbnZlcnRlZCB0byAgIGJsYV9fZm9vXG4gICAgcyA9IHMuc3Vic3RyKDEpLnJlcGxhY2UoXCIvXCIsIFwiX19cIilcbiAgfVxuICByZXR1cm4gc1xufVxuIl19