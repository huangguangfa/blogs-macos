define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createVirtualLanguageServiceHost = exports.createVirtualCompilerHost = exports.createFSBackedSystem = exports.createSystem = exports.createDefaultMapFromCDN = exports.addFilesForTypesIntoFolder = exports.addAllFilesFromFolder = exports.createDefaultMapFromNodeModules = exports.knownLibFilesForCompilerOptions = exports.createVirtualTypeScriptEnvironment = void 0;
    let hasLocalStorage = false;
    try {
        hasLocalStorage = typeof localStorage !== `undefined`;
    }
    catch (error) { }
    const hasProcess = typeof process !== `undefined`;
    const shouldDebug = (hasLocalStorage && localStorage.getItem("DEBUG")) || (hasProcess && process.env.DEBUG);
    const debugLog = shouldDebug ? console.log : (_message, ..._optionalParams) => "";
    /**
     * Makes a virtual copy of the TypeScript environment. This is the main API you want to be using with
     * @typescript/vfs. A lot of the other exposed functions are used by this function to get set up.
     *
     * @param sys an object which conforms to the TS Sys (a shim over read/write access to the fs)
     * @param rootFiles a list of files which are considered inside the project
     * @param ts a copy pf the TypeScript module
     * @param compilerOptions the options for this compiler run
     * @param customTransformers custom transformers for this compiler run
     */
    function createVirtualTypeScriptEnvironment(sys, rootFiles, ts, compilerOptions = {}, customTransformers) {
        const mergedCompilerOpts = Object.assign(Object.assign({}, defaultCompilerOptions(ts)), compilerOptions);
        const { languageServiceHost, updateFile } = createVirtualLanguageServiceHost(sys, rootFiles, mergedCompilerOpts, ts, customTransformers);
        const languageService = ts.createLanguageService(languageServiceHost);
        const diagnostics = languageService.getCompilerOptionsDiagnostics();
        if (diagnostics.length) {
            const compilerHost = createVirtualCompilerHost(sys, compilerOptions, ts);
            throw new Error(ts.formatDiagnostics(diagnostics, compilerHost.compilerHost));
        }
        return {
            // @ts-ignore
            name: "vfs",
            sys,
            languageService,
            getSourceFile: fileName => { var _a; return (_a = languageService.getProgram()) === null || _a === void 0 ? void 0 : _a.getSourceFile(fileName); },
            createFile: (fileName, content) => {
                updateFile(ts.createSourceFile(fileName, content, mergedCompilerOpts.target, false));
            },
            updateFile: (fileName, content, optPrevTextSpan) => {
                const prevSourceFile = languageService.getProgram().getSourceFile(fileName);
                if (!prevSourceFile) {
                    throw new Error("Did not find a source file for " + fileName);
                }
                const prevFullContents = prevSourceFile.text;
                // TODO: Validate if the default text span has a fencepost error?
                const prevTextSpan = optPrevTextSpan !== null && optPrevTextSpan !== void 0 ? optPrevTextSpan : ts.createTextSpan(0, prevFullContents.length);
                const newText = prevFullContents.slice(0, prevTextSpan.start) +
                    content +
                    prevFullContents.slice(prevTextSpan.start + prevTextSpan.length);
                const newSourceFile = ts.updateSourceFile(prevSourceFile, newText, {
                    span: prevTextSpan,
                    newLength: content.length,
                });
                updateFile(newSourceFile);
            },
        };
    }
    exports.createVirtualTypeScriptEnvironment = createVirtualTypeScriptEnvironment;
    /**
     * Grab the list of lib files for a particular target, will return a bit more than necessary (by including
     * the dom) but that's OK
     *
     * @param target The compiler settings target baseline
     * @param ts A copy of the TypeScript module
     */
    const knownLibFilesForCompilerOptions = (compilerOptions, ts) => {
        const target = compilerOptions.target || ts.ScriptTarget.ES5;
        const lib = compilerOptions.lib || [];
        const files = [
            "lib.d.ts",
            "lib.dom.d.ts",
            "lib.dom.iterable.d.ts",
            "lib.webworker.d.ts",
            "lib.webworker.importscripts.d.ts",
            "lib.scripthost.d.ts",
            "lib.es5.d.ts",
            "lib.es6.d.ts",
            "lib.es2015.collection.d.ts",
            "lib.es2015.core.d.ts",
            "lib.es2015.d.ts",
            "lib.es2015.generator.d.ts",
            "lib.es2015.iterable.d.ts",
            "lib.es2015.promise.d.ts",
            "lib.es2015.proxy.d.ts",
            "lib.es2015.reflect.d.ts",
            "lib.es2015.symbol.d.ts",
            "lib.es2015.symbol.wellknown.d.ts",
            "lib.es2016.array.include.d.ts",
            "lib.es2016.d.ts",
            "lib.es2016.full.d.ts",
            "lib.es2017.d.ts",
            "lib.es2017.full.d.ts",
            "lib.es2017.intl.d.ts",
            "lib.es2017.object.d.ts",
            "lib.es2017.sharedmemory.d.ts",
            "lib.es2017.string.d.ts",
            "lib.es2017.typedarrays.d.ts",
            "lib.es2018.asyncgenerator.d.ts",
            "lib.es2018.asynciterable.d.ts",
            "lib.es2018.d.ts",
            "lib.es2018.full.d.ts",
            "lib.es2018.intl.d.ts",
            "lib.es2018.promise.d.ts",
            "lib.es2018.regexp.d.ts",
            "lib.es2019.array.d.ts",
            "lib.es2019.d.ts",
            "lib.es2019.full.d.ts",
            "lib.es2019.object.d.ts",
            "lib.es2019.string.d.ts",
            "lib.es2019.symbol.d.ts",
            "lib.es2020.d.ts",
            "lib.es2020.full.d.ts",
            "lib.es2020.string.d.ts",
            "lib.es2020.symbol.wellknown.d.ts",
            "lib.es2020.bigint.d.ts",
            "lib.es2020.promise.d.ts",
            "lib.es2020.sharedmemory.d.ts",
            "lib.es2020.intl.d.ts",
            "lib.es2021.d.ts",
            "lib.es2021.full.d.ts",
            "lib.es2021.promise.d.ts",
            "lib.es2021.string.d.ts",
            "lib.es2021.weakref.d.ts",
            "lib.esnext.d.ts",
            "lib.esnext.full.d.ts",
            "lib.esnext.intl.d.ts",
            "lib.esnext.promise.d.ts",
            "lib.esnext.string.d.ts",
            "lib.esnext.weakref.d.ts",
        ];
        const targetToCut = ts.ScriptTarget[target];
        const matches = files.filter(f => f.startsWith(`lib.${targetToCut.toLowerCase()}`));
        const targetCutIndex = files.indexOf(matches.pop());
        const getMax = (array) => array && array.length ? array.reduce((max, current) => (current > max ? current : max)) : undefined;
        // Find the index for everything in
        const indexesForCutting = lib.map(lib => {
            const matches = files.filter(f => f.startsWith(`lib.${lib.toLowerCase()}`));
            if (matches.length === 0)
                return 0;
            const cutIndex = files.indexOf(matches.pop());
            return cutIndex;
        });
        const libCutIndex = getMax(indexesForCutting) || 0;
        const finalCutIndex = Math.max(targetCutIndex, libCutIndex);
        return files.slice(0, finalCutIndex + 1);
    };
    exports.knownLibFilesForCompilerOptions = knownLibFilesForCompilerOptions;
    /**
     * Sets up a Map with lib contents by grabbing the necessary files from
     * the local copy of typescript via the file system.
     */
    const createDefaultMapFromNodeModules = (compilerOptions, ts) => {
        const tsModule = ts || require("typescript");
        const path = requirePath();
        const fs = requireFS();
        const getLib = (name) => {
            const lib = path.dirname(require.resolve("typescript"));
            return fs.readFileSync(path.join(lib, name), "utf8");
        };
        const libs = (0, exports.knownLibFilesForCompilerOptions)(compilerOptions, tsModule);
        const fsMap = new Map();
        libs.forEach(lib => {
            fsMap.set("/" + lib, getLib(lib));
        });
        return fsMap;
    };
    exports.createDefaultMapFromNodeModules = createDefaultMapFromNodeModules;
    /**
     * Adds recursively files from the FS into the map based on the folder
     */
    const addAllFilesFromFolder = (map, workingDir) => {
        const path = requirePath();
        const fs = requireFS();
        const walk = function (dir) {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach(function (file) {
                file = path.join(dir, file);
                const stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    /* Recurse into a subdirectory */
                    results = results.concat(walk(file));
                }
                else {
                    /* Is a file */
                    results.push(file);
                }
            });
            return results;
        };
        const allFiles = walk(workingDir);
        allFiles.forEach(lib => {
            const fsPath = "/node_modules/@types" + lib.replace(workingDir, "");
            const content = fs.readFileSync(lib, "utf8");
            const validExtensions = [".ts", ".tsx"];
            if (validExtensions.includes(path.extname(fsPath))) {
                map.set(fsPath, content);
            }
        });
    };
    exports.addAllFilesFromFolder = addAllFilesFromFolder;
    /** Adds all files from node_modules/@types into the FS Map */
    const addFilesForTypesIntoFolder = (map) => (0, exports.addAllFilesFromFolder)(map, "node_modules/@types");
    exports.addFilesForTypesIntoFolder = addFilesForTypesIntoFolder;
    /**
     * Create a virtual FS Map with the lib files from a particular TypeScript
     * version based on the target, Always includes dom ATM.
     *
     * @param options The compiler target, which dictates the libs to set up
     * @param version the versions of TypeScript which are supported
     * @param cache should the values be stored in local storage
     * @param ts a copy of the typescript import
     * @param lzstring an optional copy of the lz-string import
     * @param fetcher an optional replacement for the global fetch function (tests mainly)
     * @param storer an optional replacement for the localStorage global (tests mainly)
     */
    const createDefaultMapFromCDN = (options, version, cache, ts, lzstring, fetcher, storer) => {
        const fetchlike = fetcher || fetch;
        const fsMap = new Map();
        const files = (0, exports.knownLibFilesForCompilerOptions)(options, ts);
        const prefix = `https://typescript.azureedge.net/cdn/${version}/typescript/lib/`;
        function zip(str) {
            return lzstring ? lzstring.compressToUTF16(str) : str;
        }
        function unzip(str) {
            return lzstring ? lzstring.decompressFromUTF16(str) : str;
        }
        // Map the known libs to a node fetch promise, then return the contents
        function uncached() {
            return Promise.all(files.map(lib => fetchlike(prefix + lib).then(resp => resp.text()))).then(contents => {
                contents.forEach((text, index) => fsMap.set("/" + files[index], text));
            });
        }
        // A localstorage and lzzip aware version of the lib files
        function cached() {
            const storelike = storer || localStorage;
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                // Remove anything which isn't from this version
                if (key.startsWith("ts-lib-") && !key.startsWith("ts-lib-" + version)) {
                    storelike.removeItem(key);
                }
            });
            return Promise.all(files.map(lib => {
                const cacheKey = `ts-lib-${version}-${lib}`;
                const content = storelike.getItem(cacheKey);
                if (!content) {
                    // Make the API call and store the text concent in the cache
                    return fetchlike(prefix + lib)
                        .then(resp => resp.text())
                        .then(t => {
                        storelike.setItem(cacheKey, zip(t));
                        return t;
                    });
                }
                else {
                    return Promise.resolve(unzip(content));
                }
            })).then(contents => {
                contents.forEach((text, index) => {
                    const name = "/" + files[index];
                    fsMap.set(name, text);
                });
            });
        }
        const func = cache ? cached : uncached;
        return func().then(() => fsMap);
    };
    exports.createDefaultMapFromCDN = createDefaultMapFromCDN;
    function notImplemented(methodName) {
        throw new Error(`Method '${methodName}' is not implemented.`);
    }
    function audit(name, fn) {
        return (...args) => {
            const res = fn(...args);
            const smallres = typeof res === "string" ? res.slice(0, 80) + "..." : res;
            debugLog("> " + name, ...args);
            debugLog("< " + smallres);
            return res;
        };
    }
    /** The default compiler options if TypeScript could ever change the compiler options */
    const defaultCompilerOptions = (ts) => {
        return Object.assign(Object.assign({}, ts.getDefaultCompilerOptions()), { jsx: ts.JsxEmit.React, strict: true, esModuleInterop: true, module: ts.ModuleKind.ESNext, suppressOutputPathCheck: true, skipLibCheck: true, skipDefaultLibCheck: true, moduleResolution: ts.ModuleResolutionKind.NodeJs });
    };
    // "/DOM.d.ts" => "/lib.dom.d.ts"
    const libize = (path) => path.replace("/", "/lib.").toLowerCase();
    /**
     * Creates an in-memory System object which can be used in a TypeScript program, this
     * is what provides read/write aspects of the virtual fs
     */
    function createSystem(files) {
        return {
            args: [],
            createDirectory: () => notImplemented("createDirectory"),
            // TODO: could make a real file tree
            directoryExists: audit("directoryExists", directory => {
                return Array.from(files.keys()).some(path => path.startsWith(directory));
            }),
            exit: () => notImplemented("exit"),
            fileExists: audit("fileExists", fileName => files.has(fileName) || files.has(libize(fileName))),
            getCurrentDirectory: () => "/",
            getDirectories: () => [],
            getExecutingFilePath: () => notImplemented("getExecutingFilePath"),
            readDirectory: audit("readDirectory", directory => (directory === "/" ? Array.from(files.keys()) : [])),
            readFile: audit("readFile", fileName => files.get(fileName) || files.get(libize(fileName))),
            resolvePath: path => path,
            newLine: "\n",
            useCaseSensitiveFileNames: true,
            write: () => notImplemented("write"),
            writeFile: (fileName, contents) => {
                files.set(fileName, contents);
            },
        };
    }
    exports.createSystem = createSystem;
    /**
     * Creates a file-system backed System object which can be used in a TypeScript program, you provide
     * a set of virtual files which are prioritised over the FS versions, then a path to the root of your
     * project (basically the folder your node_modules lives)
     */
    function createFSBackedSystem(files, _projectRoot, ts) {
        // We need to make an isolated folder for the tsconfig, but also need to be able to resolve the
        // existing node_modules structures going back through the history
        const root = _projectRoot + "/vfs";
        const path = requirePath();
        // The default System in TypeScript
        const nodeSys = ts.sys;
        const tsLib = path.dirname(require.resolve("typescript"));
        return {
            // @ts-ignore
            name: "fs-vfs",
            root,
            args: [],
            createDirectory: () => notImplemented("createDirectory"),
            // TODO: could make a real file tree
            directoryExists: audit("directoryExists", directory => {
                return Array.from(files.keys()).some(path => path.startsWith(directory)) || nodeSys.directoryExists(directory);
            }),
            exit: nodeSys.exit,
            fileExists: audit("fileExists", fileName => {
                if (files.has(fileName))
                    return true;
                // Don't let other tsconfigs end up touching the vfs
                if (fileName.includes("tsconfig.json") || fileName.includes("tsconfig.json"))
                    return false;
                if (fileName.startsWith("/lib")) {
                    const tsLibName = `${tsLib}/${fileName.replace("/", "")}`;
                    return nodeSys.fileExists(tsLibName);
                }
                return nodeSys.fileExists(fileName);
            }),
            getCurrentDirectory: () => root,
            getDirectories: nodeSys.getDirectories,
            getExecutingFilePath: () => notImplemented("getExecutingFilePath"),
            readDirectory: audit("readDirectory", (...args) => {
                if (args[0] === "/") {
                    return Array.from(files.keys());
                }
                else {
                    return nodeSys.readDirectory(...args);
                }
            }),
            readFile: audit("readFile", fileName => {
                if (files.has(fileName))
                    return files.get(fileName);
                if (fileName.startsWith("/lib")) {
                    const tsLibName = `${tsLib}/${fileName.replace("/", "")}`;
                    const result = nodeSys.readFile(tsLibName);
                    if (!result) {
                        const libs = nodeSys.readDirectory(tsLib);
                        throw new Error(`TSVFS: A request was made for ${tsLibName} but there wasn't a file found in the file map. You likely have a mismatch in the compiler options for the CDN download vs the compiler program. Existing Libs: ${libs}.`);
                    }
                    return result;
                }
                return nodeSys.readFile(fileName);
            }),
            resolvePath: path => {
                if (files.has(path))
                    return path;
                return nodeSys.resolvePath(path);
            },
            newLine: "\n",
            useCaseSensitiveFileNames: true,
            write: () => notImplemented("write"),
            writeFile: (fileName, contents) => {
                files.set(fileName, contents);
            },
        };
    }
    exports.createFSBackedSystem = createFSBackedSystem;
    /**
     * Creates an in-memory CompilerHost -which is essentially an extra wrapper to System
     * which works with TypeScript objects - returns both a compiler host, and a way to add new SourceFile
     * instances to the in-memory file system.
     */
    function createVirtualCompilerHost(sys, compilerOptions, ts) {
        const sourceFiles = new Map();
        const save = (sourceFile) => {
            sourceFiles.set(sourceFile.fileName, sourceFile);
            return sourceFile;
        };
        const vHost = {
            compilerHost: Object.assign(Object.assign({}, sys), { getCanonicalFileName: fileName => fileName, getDefaultLibFileName: () => "/" + ts.getDefaultLibFileName(compilerOptions), 
                // getDefaultLibLocation: () => '/',
                getDirectories: () => [], getNewLine: () => sys.newLine, getSourceFile: fileName => {
                    return (sourceFiles.get(fileName) ||
                        save(ts.createSourceFile(fileName, sys.readFile(fileName), compilerOptions.target || defaultCompilerOptions(ts).target, false)));
                }, useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames }),
            updateFile: sourceFile => {
                const alreadyExists = sourceFiles.has(sourceFile.fileName);
                sys.writeFile(sourceFile.fileName, sourceFile.text);
                sourceFiles.set(sourceFile.fileName, sourceFile);
                return alreadyExists;
            },
        };
        return vHost;
    }
    exports.createVirtualCompilerHost = createVirtualCompilerHost;
    /**
     * Creates an object which can host a language service against the virtual file-system
     */
    function createVirtualLanguageServiceHost(sys, rootFiles, compilerOptions, ts, customTransformers) {
        const fileNames = [...rootFiles];
        const { compilerHost, updateFile } = createVirtualCompilerHost(sys, compilerOptions, ts);
        const fileVersions = new Map();
        let projectVersion = 0;
        const languageServiceHost = Object.assign(Object.assign({}, compilerHost), { getProjectVersion: () => projectVersion.toString(), getCompilationSettings: () => compilerOptions, getCustomTransformers: () => customTransformers, getScriptFileNames: () => fileNames, getScriptSnapshot: fileName => {
                const contents = sys.readFile(fileName);
                if (contents) {
                    return ts.ScriptSnapshot.fromString(contents);
                }
                return;
            }, getScriptVersion: fileName => {
                return fileVersions.get(fileName) || "0";
            }, writeFile: sys.writeFile });
        const lsHost = {
            languageServiceHost,
            updateFile: sourceFile => {
                projectVersion++;
                fileVersions.set(sourceFile.fileName, projectVersion.toString());
                if (!fileNames.includes(sourceFile.fileName)) {
                    fileNames.push(sourceFile.fileName);
                }
                updateFile(sourceFile);
            },
        };
        return lsHost;
    }
    exports.createVirtualLanguageServiceHost = createVirtualLanguageServiceHost;
    const requirePath = () => {
        return require(String.fromCharCode(112, 97, 116, 104));
    };
    const requireFS = () => {
        return require(String.fromCharCode(102, 115));
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC12ZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zYW5kYm94L3NyYy92ZW5kb3IvdHlwZXNjcmlwdC12ZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVFBLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQTtJQUMzQixJQUFJO1FBQ0YsZUFBZSxHQUFHLE9BQU8sWUFBWSxLQUFLLFdBQVcsQ0FBQTtLQUN0RDtJQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUU7SUFFbEIsTUFBTSxVQUFVLEdBQUcsT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFBO0lBQ2pELE1BQU0sV0FBVyxHQUFHLENBQUMsZUFBZSxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzNHLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFjLEVBQUUsR0FBRyxlQUFzQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUE7SUFVOUY7Ozs7Ozs7OztPQVNHO0lBRUgsU0FBZ0Isa0NBQWtDLENBQ2hELEdBQVcsRUFDWCxTQUFtQixFQUNuQixFQUFNLEVBQ04sa0JBQW1DLEVBQUUsRUFDckMsa0JBQXVDO1FBRXZDLE1BQU0sa0JBQWtCLG1DQUFRLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxHQUFLLGVBQWUsQ0FBRSxDQUFBO1FBRWhGLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsR0FBRyxnQ0FBZ0MsQ0FDMUUsR0FBRyxFQUNILFNBQVMsRUFDVCxrQkFBa0IsRUFDbEIsRUFBRSxFQUNGLGtCQUFrQixDQUNuQixDQUFBO1FBQ0QsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFD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QUFFO2dCQUN2QixjQUFjLEVBQUUsQ0FBQTtnQkFDaEIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2dCQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2lCQUNwQztnQkFDRCxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDeEIsQ0FBQztTQUNGLENBQUE7UUFDRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUEvQ0QsNEVBK0NDO0lBRUQsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQ3ZCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQTBCLENBQUE7SUFDakYsQ0FBQyxDQUFBO0lBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO1FBQ3JCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUF3QixDQUFBO0lBQ3RFLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgU3lzdGVtID0gaW1wb3J0KFwidHlwZXNjcmlwdFwiKS5TeXN0ZW1cbnR5cGUgQ29tcGlsZXJPcHRpb25zID0gaW1wb3J0KFwidHlwZXNjcmlwdFwiKS5Db21waWxlck9wdGlvbnNcbnR5cGUgQ3VzdG9tVHJhbnNmb3JtZXJzID0gaW1wb3J0KFwidHlwZXNjcmlwdFwiKS5DdXN0b21UcmFuc2Zvcm1lcnNcbnR5cGUgTGFuZ3VhZ2VTZXJ2aWNlSG9zdCA9IGltcG9ydChcInR5cGVzY3JpcHRcIikuTGFuZ3VhZ2VTZXJ2aWNlSG9zdFxudHlwZSBDb21waWxlckhvc3QgPSBpbXBvcnQoXCJ0eXBlc2NyaXB0XCIpLkNvbXBpbGVySG9zdFxudHlwZSBTb3VyY2VGaWxlID0gaW1wb3J0KFwidHlwZXNjcmlwdFwiKS5Tb3VyY2VGaWxlXG50eXBlIFRTID0gdHlwZW9mIGltcG9ydChcInR5cGVzY3JpcHRcIilcblxubGV0IGhhc0xvY2FsU3RvcmFnZSA9IGZhbHNlXG50cnkge1xuICBoYXNMb2NhbFN0b3JhZ2UgPSB0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBgdW5kZWZpbmVkYFxufSBjYXRjaCAoZXJyb3IpIHt9XG5cbmNvbnN0IGhhc1Byb2Nlc3MgPSB0eXBlb2YgcHJvY2VzcyAhPT0gYHVuZGVmaW5lZGBcbmNvbnN0IHNob3VsZERlYnVnID0gKGhhc0xvY2FsU3RvcmFnZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIkRFQlVHXCIpKSB8fCAoaGFzUHJvY2VzcyAmJiBwcm9jZXNzLmVudi5ERUJVRylcbmNvbnN0IGRlYnVnTG9nID0gc2hvdWxkRGVidWcgPyBjb25zb2xlLmxvZyA6IChfbWVzc2FnZT86IGFueSwgLi4uX29wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gXCJcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFZpcnR1YWxUeXBlU2NyaXB0RW52aXJvbm1lbnQge1xuICBzeXM6IFN5c3RlbVxuICBsYW5ndWFnZVNlcnZpY2U6IGltcG9ydChcInR5cGVzY3JpcHRcIikuTGFuZ3VhZ2VTZXJ2aWNlXG4gIGdldFNvdXJjZUZpbGU6IChmaWxlTmFtZTogc3RyaW5nKSA9PiBpbXBvcnQoXCJ0eXBlc2NyaXB0XCIpLlNvdXJjZUZpbGUgfCB1bmRlZmluZWRcbiAgY3JlYXRlRmlsZTogKGZpbGVOYW1lOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykgPT4gdm9pZFxuICB1cGRhdGVGaWxlOiAoZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCByZXBsYWNlVGV4dFNwYW4/OiBpbXBvcnQoXCJ0eXBlc2NyaXB0XCIpLlRleHRTcGFuKSA9PiB2b2lkXG59XG5cbi8qKlxuICogTWFrZXMgYSB2aXJ0dWFsIGNvcHkgb2YgdGhlIFR5cGVTY3JpcHQgZW52aXJvbm1lbnQuIFRoaXMgaXMgdGhlIG1haW4gQVBJIHlvdSB3YW50IHRvIGJlIHVzaW5nIHdpdGhcbiAqIEB0eXBlc2NyaXB0L3Zmcy4gQSBsb3Qgb2YgdGhlIG90aGVyIGV4cG9zZWQgZnVuY3Rpb25zIGFyZSB1c2VkIGJ5IHRoaXMgZnVuY3Rpb24gdG8gZ2V0IHNldCB1cC5cbiAqXG4gKiBAcGFyYW0gc3lzIGFuIG9iamVjdCB3aGljaCBjb25mb3JtcyB0byB0aGUgVFMgU3lzIChhIHNoaW0gb3ZlciByZWFkL3dyaXRlIGFjY2VzcyB0byB0aGUgZnMpXG4gKiBAcGFyYW0gcm9vdEZpbGVzIGEgbGlzdCBvZiBmaWxlcyB3aGljaCBhcmUgY29uc2lkZXJlZCBpbnNpZGUgdGhlIHByb2plY3RcbiAqIEBwYXJhbSB0cyBhIGNvcHkgcGYgdGhlIFR5cGVTY3JpcHQgbW9kdWxlXG4gKiBAcGFyYW0gY29tcGlsZXJPcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGlzIGNvbXBpbGVyIHJ1blxuICogQHBhcmFtIGN1c3RvbVRyYW5zZm9ybWVycyBjdXN0b20gdHJhbnNmb3JtZXJzIGZvciB0aGlzIGNvbXBpbGVyIHJ1blxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXJ0dWFsVHlwZVNjcmlwdEVudmlyb25tZW50KFxuICBzeXM6IFN5c3RlbSxcbiAgcm9vdEZpbGVzOiBzdHJpbmdbXSxcbiAgdHM6IFRTLFxuICBjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucyA9IHt9LFxuICBjdXN0b21UcmFuc2Zvcm1lcnM/OiBDdXN0b21UcmFuc2Zvcm1lcnNcbik6IFZpcnR1YWxUeXBlU2NyaXB0RW52aXJvbm1lbnQge1xuICBjb25zdCBtZXJnZWRDb21waWxlck9wdHMgPSB7IC4uLmRlZmF1bHRDb21waWxlck9wdGlvbnModHMpLCAuLi5jb21waWxlck9wdGlvbnMgfVxuXG4gIGNvbnN0IHsgbGFuZ3VhZ2VTZXJ2aWNlSG9zdCwgdXBkYXRlRmlsZSB9ID0gY3JlYXRlVmlydHVhbExhbmd1YWdlU2VydmljZUhvc3QoXG4gICAgc3lzLFxuICAgIHJvb3RGaWxlcyxcbiAgICBtZXJnZWRDb21waWxlck9wdHMsXG4gICAgdHMsXG4gICAgY3VzdG9tVHJhbnNmb3JtZXJzXG4gIClcbiAgY29uc3QgbGFuZ3VhZ2VTZXJ2aWNlID0gdHMuY3JlYXRlTGFuZ3VhZ2VTZXJ2aWNlKGxhbmd1YWdlU2VydmljZUhvc3QpXG4gIGNvbnN0IGRpYWdub3N0aWNzID0gbGFuZ3VhZ2VTZXJ2aWNlLmdldENvbXBpbGVyT3B0aW9uc0RpYWdub3N0aWNzKClcblxuICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoKSB7XG4gICAgY29uc3QgY29tcGlsZXJIb3N0ID0gY3JlYXRlVmlydHVhbENvbXBpbGVySG9zdChzeXMsIGNvbXBpbGVyT3B0aW9ucywgdHMpXG4gICAgdGhyb3cgbmV3IEVycm9yKHRzLmZvcm1hdERpYWdub3N0aWNzKGRpYWdub3N0aWNzLCBjb21waWxlckhvc3QuY29tcGlsZXJIb3N0KSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG5hbWU6IFwidmZzXCIsXG4gICAgc3lzLFxuICAgIGxhbmd1YWdlU2VydmljZSxcbiAgICBnZXRTb3VyY2VGaWxlOiBmaWxlTmFtZSA9PiBsYW5ndWFnZVNlcnZpY2UuZ2V0UHJvZ3JhbSgpPy5nZXRTb3VyY2VGaWxlKGZpbGVOYW1lKSxcblxuICAgIGNyZWF0ZUZpbGU6IChmaWxlTmFtZSwgY29udGVudCkgPT4ge1xuICAgICAgdXBkYXRlRmlsZSh0cy5jcmVhdGVTb3VyY2VGaWxlKGZpbGVOYW1lLCBjb250ZW50LCBtZXJnZWRDb21waWxlck9wdHMudGFyZ2V0ISwgZmFsc2UpKVxuICAgIH0sXG4gICAgdXBkYXRlRmlsZTogKGZpbGVOYW1lLCBjb250ZW50LCBvcHRQcmV2VGV4dFNwYW4pID0+IHtcbiAgICAgIGNvbnN0IHByZXZTb3VyY2VGaWxlID0gbGFuZ3VhZ2VTZXJ2aWNlLmdldFByb2dyYW0oKSEuZ2V0U291cmNlRmlsZShmaWxlTmFtZSlcbiAgICAgIGlmICghcHJldlNvdXJjZUZpbGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlkIG5vdCBmaW5kIGEgc291cmNlIGZpbGUgZm9yIFwiICsgZmlsZU5hbWUpXG4gICAgICB9XG4gICAgICBjb25zdCBwcmV2RnVsbENvbnRlbnRzID0gcHJldlNvdXJjZUZpbGUudGV4dFxuXG4gICAgICAvLyBUT0RPOiBWYWxpZGF0ZSBpZiB0aGUgZGVmYXVsdCB0ZXh0IHNwYW4gaGFzIGEgZmVuY2Vwb3N0IGVycm9yP1xuICAgICAgY29uc3QgcHJldlRleHRTcGFuID0gb3B0UHJldlRleHRTcGFuID8/IHRzLmNyZWF0ZVRleHRTcGFuKDAsIHByZXZGdWxsQ29udGVudHMubGVuZ3RoKVxuICAgICAgY29uc3QgbmV3VGV4dCA9XG4gICAgICAgIHByZXZGdWxsQ29udGVudHMuc2xpY2UoMCwgcHJldlRleHRTcGFuLnN0YXJ0KSArXG4gICAgICAgIGNvbnRlbnQgK1xuICAgICAgICBwcmV2RnVsbENvbnRlbnRzLnNsaWNlKHByZXZUZXh0U3Bhbi5zdGFydCArIHByZXZUZXh0U3Bhbi5sZW5ndGgpXG4gICAgICBjb25zdCBuZXdTb3VyY2VGaWxlID0gdHMudXBkYXRlU291cmNlRmlsZShwcmV2U291cmNlRmlsZSwgbmV3VGV4dCwge1xuICAgICAgICBzcGFuOiBwcmV2VGV4dFNwYW4sXG4gICAgICAgIG5ld0xlbmd0aDogY29udGVudC5sZW5ndGgsXG4gICAgICB9KVxuXG4gICAgICB1cGRhdGVGaWxlKG5ld1NvdXJjZUZpbGUpXG4gICAgfSxcbiAgfVxufVxuXG4vKipcbiAqIEdyYWIgdGhlIGxpc3Qgb2YgbGliIGZpbGVzIGZvciBhIHBhcnRpY3VsYXIgdGFyZ2V0LCB3aWxsIHJldHVybiBhIGJpdCBtb3JlIHRoYW4gbmVjZXNzYXJ5IChieSBpbmNsdWRpbmdcbiAqIHRoZSBkb20pIGJ1dCB0aGF0J3MgT0tcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSBjb21waWxlciBzZXR0aW5ncyB0YXJnZXQgYmFzZWxpbmVcbiAqIEBwYXJhbSB0cyBBIGNvcHkgb2YgdGhlIFR5cGVTY3JpcHQgbW9kdWxlXG4gKi9cbmV4cG9ydCBjb25zdCBrbm93bkxpYkZpbGVzRm9yQ29tcGlsZXJPcHRpb25zID0gKGNvbXBpbGVyT3B0aW9uczogQ29tcGlsZXJPcHRpb25zLCB0czogVFMpID0+IHtcbiAgY29uc3QgdGFyZ2V0ID0gY29tcGlsZXJPcHRpb25zLnRhcmdldCB8fCB0cy5TY3JpcHRUYXJnZXQuRVM1XG4gIGNvbnN0IGxpYiA9IGNvbXBpbGVyT3B0aW9ucy5saWIgfHwgW11cblxuICBjb25zdCBmaWxlcyA9IFtcbiAgICBcImxpYi5kLnRzXCIsXG4gICAgXCJsaWIuZG9tLmQudHNcIixcbiAgICBcImxpYi5kb20uaXRlcmFibGUuZC50c1wiLFxuICAgIFwibGliLndlYndvcmtlci5kLnRzXCIsXG4gICAgXCJsaWIud2Vid29ya2VyLmltcG9ydHNjcmlwdHMuZC50c1wiLFxuICAgIFwibGliLnNjcmlwdGhvc3QuZC50c1wiLFxuICAgIFwibGliLmVzNS5kLnRzXCIsXG4gICAgXCJsaWIuZXM2LmQudHNcIixcbiAgICBcImxpYi5lczIwMTUuY29sbGVjdGlvbi5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE1LmNvcmUuZC50c1wiLFxuICAgIFwibGliLmVzMjAxNS5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE1LmdlbmVyYXRvci5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE1Lml0ZXJhYmxlLmQudHNcIixcbiAgICBcImxpYi5lczIwMTUucHJvbWlzZS5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE1LnByb3h5LmQudHNcIixcbiAgICBcImxpYi5lczIwMTUucmVmbGVjdC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE1LnN5bWJvbC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE1LnN5bWJvbC53ZWxsa25vd24uZC50c1wiLFxuICAgIFwibGliLmVzMjAxNi5hcnJheS5pbmNsdWRlLmQudHNcIixcbiAgICBcImxpYi5lczIwMTYuZC50c1wiLFxuICAgIFwibGliLmVzMjAxNi5mdWxsLmQudHNcIixcbiAgICBcImxpYi5lczIwMTcuZC50c1wiLFxuICAgIFwibGliLmVzMjAxNy5mdWxsLmQudHNcIixcbiAgICBcImxpYi5lczIwMTcuaW50bC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE3Lm9iamVjdC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE3LnNoYXJlZG1lbW9yeS5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE3LnN0cmluZy5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE3LnR5cGVkYXJyYXlzLmQudHNcIixcbiAgICBcImxpYi5lczIwMTguYXN5bmNnZW5lcmF0b3IuZC50c1wiLFxuICAgIFwibGliLmVzMjAxOC5hc3luY2l0ZXJhYmxlLmQudHNcIixcbiAgICBcImxpYi5lczIwMTguZC50c1wiLFxuICAgIFwibGliLmVzMjAxOC5mdWxsLmQudHNcIixcbiAgICBcImxpYi5lczIwMTguaW50bC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE4LnByb21pc2UuZC50c1wiLFxuICAgIFwibGliLmVzMjAxOC5yZWdleHAuZC50c1wiLFxuICAgIFwibGliLmVzMjAxOS5hcnJheS5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE5LmQudHNcIixcbiAgICBcImxpYi5lczIwMTkuZnVsbC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE5Lm9iamVjdC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE5LnN0cmluZy5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDE5LnN5bWJvbC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDIwLmQudHNcIixcbiAgICBcImxpYi5lczIwMjAuZnVsbC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDIwLnN0cmluZy5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDIwLnN5bWJvbC53ZWxsa25vd24uZC50c1wiLFxuICAgIFwibGliLmVzMjAyMC5iaWdpbnQuZC50c1wiLFxuICAgIFwibGliLmVzMjAyMC5wcm9taXNlLmQudHNcIixcbiAgICBcImxpYi5lczIwMjAuc2hhcmVkbWVtb3J5LmQudHNcIixcbiAgICBcImxpYi5lczIwMjAuaW50bC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDIxLmQudHNcIixcbiAgICBcImxpYi5lczIwMjEuZnVsbC5kLnRzXCIsXG4gICAgXCJsaWIuZXMyMDIxLnByb21pc2UuZC50c1wiLFxuICAgIFwibGliLmVzMjAyMS5zdHJpbmcuZC50c1wiLFxuICAgIFwibGliLmVzMjAyMS53ZWFrcmVmLmQudHNcIixcbiAgICBcImxpYi5lc25leHQuZC50c1wiLFxuICAgIFwibGliLmVzbmV4dC5mdWxsLmQudHNcIixcbiAgICBcImxpYi5lc25leHQuaW50bC5kLnRzXCIsXG4gICAgXCJsaWIuZXNuZXh0LnByb21pc2UuZC50c1wiLFxuICAgIFwibGliLmVzbmV4dC5zdHJpbmcuZC50c1wiLFxuICAgIFwibGliLmVzbmV4dC53ZWFrcmVmLmQudHNcIixcbiAgXVxuXG4gIGNvbnN0IHRhcmdldFRvQ3V0ID0gdHMuU2NyaXB0VGFyZ2V0W3RhcmdldF1cbiAgY29uc3QgbWF0Y2hlcyA9IGZpbGVzLmZpbHRlcihmID0+IGYuc3RhcnRzV2l0aChgbGliLiR7dGFyZ2V0VG9DdXQudG9Mb3dlckNhc2UoKX1gKSlcbiAgY29uc3QgdGFyZ2V0Q3V0SW5kZXggPSBmaWxlcy5pbmRleE9mKG1hdGNoZXMucG9wKCkhKVxuXG4gIGNvbnN0IGdldE1heCA9IChhcnJheTogbnVtYmVyW10pID0+XG4gICAgYXJyYXkgJiYgYXJyYXkubGVuZ3RoID8gYXJyYXkucmVkdWNlKChtYXgsIGN1cnJlbnQpID0+IChjdXJyZW50ID4gbWF4ID8gY3VycmVudCA6IG1heCkpIDogdW5kZWZpbmVkXG5cbiAgLy8gRmluZCB0aGUgaW5kZXggZm9yIGV2ZXJ5dGhpbmcgaW5cbiAgY29uc3QgaW5kZXhlc0ZvckN1dHRpbmcgPSBsaWIubWFwKGxpYiA9PiB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGZpbGVzLmZpbHRlcihmID0+IGYuc3RhcnRzV2l0aChgbGliLiR7bGliLnRvTG93ZXJDYXNlKCl9YCkpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gICAgY29uc3QgY3V0SW5kZXggPSBmaWxlcy5pbmRleE9mKG1hdGNoZXMucG9wKCkhKVxuICAgIHJldHVybiBjdXRJbmRleFxuICB9KVxuXG4gIGNvbnN0IGxpYkN1dEluZGV4ID0gZ2V0TWF4KGluZGV4ZXNGb3JDdXR0aW5nKSB8fCAwXG5cbiAgY29uc3QgZmluYWxDdXRJbmRleCA9IE1hdGgubWF4KHRhcmdldEN1dEluZGV4LCBsaWJDdXRJbmRleClcbiAgcmV0dXJuIGZpbGVzLnNsaWNlKDAsIGZpbmFsQ3V0SW5kZXggKyAxKVxufVxuXG4vKipcbiAqIFNldHMgdXAgYSBNYXAgd2l0aCBsaWIgY29udGVudHMgYnkgZ3JhYmJpbmcgdGhlIG5lY2Vzc2FyeSBmaWxlcyBmcm9tXG4gKiB0aGUgbG9jYWwgY29weSBvZiB0eXBlc2NyaXB0IHZpYSB0aGUgZmlsZSBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVEZWZhdWx0TWFwRnJvbU5vZGVNb2R1bGVzID0gKGNvbXBpbGVyT3B0aW9uczogQ29tcGlsZXJPcHRpb25zLCB0cz86IHR5cGVvZiBpbXBvcnQoXCJ0eXBlc2NyaXB0XCIpKSA9PiB7XG4gIGNvbnN0IHRzTW9kdWxlID0gdHMgfHwgcmVxdWlyZShcInR5cGVzY3JpcHRcIilcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmVQYXRoKClcbiAgY29uc3QgZnMgPSByZXF1aXJlRlMoKVxuXG4gIGNvbnN0IGdldExpYiA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBsaWIgPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5yZXNvbHZlKFwidHlwZXNjcmlwdFwiKSlcbiAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihsaWIsIG5hbWUpLCBcInV0ZjhcIilcbiAgfVxuXG4gIGNvbnN0IGxpYnMgPSBrbm93bkxpYkZpbGVzRm9yQ29tcGlsZXJPcHRpb25zKGNvbXBpbGVyT3B0aW9ucywgdHNNb2R1bGUpXG4gIGNvbnN0IGZzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKVxuICBsaWJzLmZvckVhY2gobGliID0+IHtcbiAgICBmc01hcC5zZXQoXCIvXCIgKyBsaWIsIGdldExpYihsaWIpKVxuICB9KVxuICByZXR1cm4gZnNNYXBcbn1cblxuLyoqXG4gKiBBZGRzIHJlY3Vyc2l2ZWx5IGZpbGVzIGZyb20gdGhlIEZTIGludG8gdGhlIG1hcCBiYXNlZCBvbiB0aGUgZm9sZGVyXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRBbGxGaWxlc0Zyb21Gb2xkZXIgPSAobWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+LCB3b3JraW5nRGlyOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmVQYXRoKClcbiAgY29uc3QgZnMgPSByZXF1aXJlRlMoKVxuXG4gIGNvbnN0IHdhbGsgPSBmdW5jdGlvbiAoZGlyOiBzdHJpbmcpIHtcbiAgICBsZXQgcmVzdWx0czogc3RyaW5nW10gPSBbXVxuICAgIGNvbnN0IGxpc3QgPSBmcy5yZWFkZGlyU3luYyhkaXIpXG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlOiBzdHJpbmcpIHtcbiAgICAgIGZpbGUgPSBwYXRoLmpvaW4oZGlyLCBmaWxlKVxuICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKGZpbGUpXG4gICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgLyogUmVjdXJzZSBpbnRvIGEgc3ViZGlyZWN0b3J5ICovXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdCh3YWxrKGZpbGUpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogSXMgYSBmaWxlICovXG4gICAgICAgIHJlc3VsdHMucHVzaChmaWxlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIGNvbnN0IGFsbEZpbGVzID0gd2Fsayh3b3JraW5nRGlyKVxuXG4gIGFsbEZpbGVzLmZvckVhY2gobGliID0+IHtcbiAgICBjb25zdCBmc1BhdGggPSBcIi9ub2RlX21vZHVsZXMvQHR5cGVzXCIgKyBsaWIucmVwbGFjZSh3b3JraW5nRGlyLCBcIlwiKVxuICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMobGliLCBcInV0ZjhcIilcbiAgICBjb25zdCB2YWxpZEV4dGVuc2lvbnMgPSBbXCIudHNcIiwgXCIudHN4XCJdXG5cbiAgICBpZiAodmFsaWRFeHRlbnNpb25zLmluY2x1ZGVzKHBhdGguZXh0bmFtZShmc1BhdGgpKSkge1xuICAgICAgbWFwLnNldChmc1BhdGgsIGNvbnRlbnQpXG4gICAgfVxuICB9KVxufVxuXG4vKiogQWRkcyBhbGwgZmlsZXMgZnJvbSBub2RlX21vZHVsZXMvQHR5cGVzIGludG8gdGhlIEZTIE1hcCAqL1xuZXhwb3J0IGNvbnN0IGFkZEZpbGVzRm9yVHlwZXNJbnRvRm9sZGVyID0gKG1hcDogTWFwPHN0cmluZywgc3RyaW5nPikgPT5cbiAgYWRkQWxsRmlsZXNGcm9tRm9sZGVyKG1hcCwgXCJub2RlX21vZHVsZXMvQHR5cGVzXCIpXG5cbi8qKlxuICogQ3JlYXRlIGEgdmlydHVhbCBGUyBNYXAgd2l0aCB0aGUgbGliIGZpbGVzIGZyb20gYSBwYXJ0aWN1bGFyIFR5cGVTY3JpcHRcbiAqIHZlcnNpb24gYmFzZWQgb24gdGhlIHRhcmdldCwgQWx3YXlzIGluY2x1ZGVzIGRvbSBBVE0uXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgVGhlIGNvbXBpbGVyIHRhcmdldCwgd2hpY2ggZGljdGF0ZXMgdGhlIGxpYnMgdG8gc2V0IHVwXG4gKiBAcGFyYW0gdmVyc2lvbiB0aGUgdmVyc2lvbnMgb2YgVHlwZVNjcmlwdCB3aGljaCBhcmUgc3VwcG9ydGVkXG4gKiBAcGFyYW0gY2FjaGUgc2hvdWxkIHRoZSB2YWx1ZXMgYmUgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2VcbiAqIEBwYXJhbSB0cyBhIGNvcHkgb2YgdGhlIHR5cGVzY3JpcHQgaW1wb3J0XG4gKiBAcGFyYW0gbHpzdHJpbmcgYW4gb3B0aW9uYWwgY29weSBvZiB0aGUgbHotc3RyaW5nIGltcG9ydFxuICogQHBhcmFtIGZldGNoZXIgYW4gb3B0aW9uYWwgcmVwbGFjZW1lbnQgZm9yIHRoZSBnbG9iYWwgZmV0Y2ggZnVuY3Rpb24gKHRlc3RzIG1haW5seSlcbiAqIEBwYXJhbSBzdG9yZXIgYW4gb3B0aW9uYWwgcmVwbGFjZW1lbnQgZm9yIHRoZSBsb2NhbFN0b3JhZ2UgZ2xvYmFsICh0ZXN0cyBtYWlubHkpXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVEZWZhdWx0TWFwRnJvbUNETiA9IChcbiAgb3B0aW9uczogQ29tcGlsZXJPcHRpb25zLFxuICB2ZXJzaW9uOiBzdHJpbmcsXG4gIGNhY2hlOiBib29sZWFuLFxuICB0czogVFMsXG4gIGx6c3RyaW5nPzogdHlwZW9mIGltcG9ydChcImx6LXN0cmluZ1wiKSxcbiAgZmV0Y2hlcj86IHR5cGVvZiBmZXRjaCxcbiAgc3RvcmVyPzogdHlwZW9mIGxvY2FsU3RvcmFnZVxuKSA9PiB7XG4gIGNvbnN0IGZldGNobGlrZSA9IGZldGNoZXIgfHwgZmV0Y2hcbiAgY29uc3QgZnNNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpXG4gIGNvbnN0IGZpbGVzID0ga25vd25MaWJGaWxlc0ZvckNvbXBpbGVyT3B0aW9ucyhvcHRpb25zLCB0cylcbiAgY29uc3QgcHJlZml4ID0gYGh0dHBzOi8vdHlwZXNjcmlwdC5henVyZWVkZ2UubmV0L2Nkbi8ke3ZlcnNpb259L3R5cGVzY3JpcHQvbGliL2BcblxuICBmdW5jdGlvbiB6aXAoc3RyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbHpzdHJpbmcgPyBsenN0cmluZy5jb21wcmVzc1RvVVRGMTYoc3RyKSA6IHN0clxuICB9XG5cbiAgZnVuY3Rpb24gdW56aXAoc3RyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbHpzdHJpbmcgPyBsenN0cmluZy5kZWNvbXByZXNzRnJvbVVURjE2KHN0cikgOiBzdHJcbiAgfVxuXG4gIC8vIE1hcCB0aGUga25vd24gbGlicyB0byBhIG5vZGUgZmV0Y2ggcHJvbWlzZSwgdGhlbiByZXR1cm4gdGhlIGNvbnRlbnRzXG4gIGZ1bmN0aW9uIHVuY2FjaGVkKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChmaWxlcy5tYXAobGliID0+IGZldGNobGlrZShwcmVmaXggKyBsaWIpLnRoZW4ocmVzcCA9PiByZXNwLnRleHQoKSkpKS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgIGNvbnRlbnRzLmZvckVhY2goKHRleHQsIGluZGV4KSA9PiBmc01hcC5zZXQoXCIvXCIgKyBmaWxlc1tpbmRleF0sIHRleHQpKVxuICAgIH0pXG4gIH1cblxuICAvLyBBIGxvY2Fsc3RvcmFnZSBhbmQgbHp6aXAgYXdhcmUgdmVyc2lvbiBvZiB0aGUgbGliIGZpbGVzXG4gIGZ1bmN0aW9uIGNhY2hlZCgpIHtcbiAgICBjb25zdCBzdG9yZWxpa2UgPSBzdG9yZXIgfHwgbG9jYWxTdG9yYWdlXG5cbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKVxuICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGFueXRoaW5nIHdoaWNoIGlzbid0IGZyb20gdGhpcyB2ZXJzaW9uXG4gICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJ0cy1saWItXCIpICYmICFrZXkuc3RhcnRzV2l0aChcInRzLWxpYi1cIiArIHZlcnNpb24pKSB7XG4gICAgICAgIHN0b3JlbGlrZS5yZW1vdmVJdGVtKGtleSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgZmlsZXMubWFwKGxpYiA9PiB7XG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gYHRzLWxpYi0ke3ZlcnNpb259LSR7bGlifWBcbiAgICAgICAgY29uc3QgY29udGVudCA9IHN0b3JlbGlrZS5nZXRJdGVtKGNhY2hlS2V5KVxuXG4gICAgICAgIGlmICghY29udGVudCkge1xuICAgICAgICAgIC8vIE1ha2UgdGhlIEFQSSBjYWxsIGFuZCBzdG9yZSB0aGUgdGV4dCBjb25jZW50IGluIHRoZSBjYWNoZVxuICAgICAgICAgIHJldHVybiBmZXRjaGxpa2UocHJlZml4ICsgbGliKVxuICAgICAgICAgICAgLnRoZW4ocmVzcCA9PiByZXNwLnRleHQoKSlcbiAgICAgICAgICAgIC50aGVuKHQgPT4ge1xuICAgICAgICAgICAgICBzdG9yZWxpa2Uuc2V0SXRlbShjYWNoZUtleSwgemlwKHQpKVxuICAgICAgICAgICAgICByZXR1cm4gdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuemlwKGNvbnRlbnQpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICBjb250ZW50cy5mb3JFYWNoKCh0ZXh0LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gXCIvXCIgKyBmaWxlc1tpbmRleF1cbiAgICAgICAgZnNNYXAuc2V0KG5hbWUsIHRleHQpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBmdW5jID0gY2FjaGUgPyBjYWNoZWQgOiB1bmNhY2hlZFxuICByZXR1cm4gZnVuYygpLnRoZW4oKCkgPT4gZnNNYXApXG59XG5cbmZ1bmN0aW9uIG5vdEltcGxlbWVudGVkKG1ldGhvZE5hbWU6IHN0cmluZyk6IGFueSB7XG4gIHRocm93IG5ldyBFcnJvcihgTWV0aG9kICcke21ldGhvZE5hbWV9JyBpcyBub3QgaW1wbGVtZW50ZWQuYClcbn1cblxuZnVuY3Rpb24gYXVkaXQ8QXJnc1QgZXh0ZW5kcyBhbnlbXSwgUmV0dXJuVD4oXG4gIG5hbWU6IHN0cmluZyxcbiAgZm46ICguLi5hcmdzOiBBcmdzVCkgPT4gUmV0dXJuVFxuKTogKC4uLmFyZ3M6IEFyZ3NUKSA9PiBSZXR1cm5UIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3QgcmVzID0gZm4oLi4uYXJncylcblxuICAgIGNvbnN0IHNtYWxscmVzID0gdHlwZW9mIHJlcyA9PT0gXCJzdHJpbmdcIiA/IHJlcy5zbGljZSgwLCA4MCkgKyBcIi4uLlwiIDogcmVzXG4gICAgZGVidWdMb2coXCI+IFwiICsgbmFtZSwgLi4uYXJncylcbiAgICBkZWJ1Z0xvZyhcIjwgXCIgKyBzbWFsbHJlcylcblxuICAgIHJldHVybiByZXNcbiAgfVxufVxuXG4vKiogVGhlIGRlZmF1bHQgY29tcGlsZXIgb3B0aW9ucyBpZiBUeXBlU2NyaXB0IGNvdWxkIGV2ZXIgY2hhbmdlIHRoZSBjb21waWxlciBvcHRpb25zICovXG5jb25zdCBkZWZhdWx0Q29tcGlsZXJPcHRpb25zID0gKHRzOiB0eXBlb2YgaW1wb3J0KFwidHlwZXNjcmlwdFwiKSk6IENvbXBpbGVyT3B0aW9ucyA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4udHMuZ2V0RGVmYXVsdENvbXBpbGVyT3B0aW9ucygpLFxuICAgIGpzeDogdHMuSnN4RW1pdC5SZWFjdCxcbiAgICBzdHJpY3Q6IHRydWUsXG4gICAgZXNNb2R1bGVJbnRlcm9wOiB0cnVlLFxuICAgIG1vZHVsZTogdHMuTW9kdWxlS2luZC5FU05leHQsXG4gICAgc3VwcHJlc3NPdXRwdXRQYXRoQ2hlY2s6IHRydWUsXG4gICAgc2tpcExpYkNoZWNrOiB0cnVlLFxuICAgIHNraXBEZWZhdWx0TGliQ2hlY2s6IHRydWUsXG4gICAgbW9kdWxlUmVzb2x1dGlvbjogdHMuTW9kdWxlUmVzb2x1dGlvbktpbmQuTm9kZUpzLFxuICB9XG59XG5cbi8vIFwiL0RPTS5kLnRzXCIgPT4gXCIvbGliLmRvbS5kLnRzXCJcbmNvbnN0IGxpYml6ZSA9IChwYXRoOiBzdHJpbmcpID0+IHBhdGgucmVwbGFjZShcIi9cIiwgXCIvbGliLlwiKS50b0xvd2VyQ2FzZSgpXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpbi1tZW1vcnkgU3lzdGVtIG9iamVjdCB3aGljaCBjYW4gYmUgdXNlZCBpbiBhIFR5cGVTY3JpcHQgcHJvZ3JhbSwgdGhpc1xuICogaXMgd2hhdCBwcm92aWRlcyByZWFkL3dyaXRlIGFzcGVjdHMgb2YgdGhlIHZpcnR1YWwgZnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN5c3RlbShmaWxlczogTWFwPHN0cmluZywgc3RyaW5nPik6IFN5c3RlbSB7XG4gIHJldHVybiB7XG4gICAgYXJnczogW10sXG4gICAgY3JlYXRlRGlyZWN0b3J5OiAoKSA9PiBub3RJbXBsZW1lbnRlZChcImNyZWF0ZURpcmVjdG9yeVwiKSxcbiAgICAvLyBUT0RPOiBjb3VsZCBtYWtlIGEgcmVhbCBmaWxlIHRyZWVcbiAgICBkaXJlY3RvcnlFeGlzdHM6IGF1ZGl0KFwiZGlyZWN0b3J5RXhpc3RzXCIsIGRpcmVjdG9yeSA9PiB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlcy5rZXlzKCkpLnNvbWUocGF0aCA9PiBwYXRoLnN0YXJ0c1dpdGgoZGlyZWN0b3J5KSlcbiAgICB9KSxcbiAgICBleGl0OiAoKSA9PiBub3RJbXBsZW1lbnRlZChcImV4aXRcIiksXG4gICAgZmlsZUV4aXN0czogYXVkaXQoXCJmaWxlRXhpc3RzXCIsIGZpbGVOYW1lID0+IGZpbGVzLmhhcyhmaWxlTmFtZSkgfHwgZmlsZXMuaGFzKGxpYml6ZShmaWxlTmFtZSkpKSxcbiAgICBnZXRDdXJyZW50RGlyZWN0b3J5OiAoKSA9PiBcIi9cIixcbiAgICBnZXREaXJlY3RvcmllczogKCkgPT4gW10sXG4gICAgZ2V0RXhlY3V0aW5nRmlsZVBhdGg6ICgpID0+IG5vdEltcGxlbWVudGVkKFwiZ2V0RXhlY3V0aW5nRmlsZVBhdGhcIiksXG4gICAgcmVhZERpcmVjdG9yeTogYXVkaXQoXCJyZWFkRGlyZWN0b3J5XCIsIGRpcmVjdG9yeSA9PiAoZGlyZWN0b3J5ID09PSBcIi9cIiA/IEFycmF5LmZyb20oZmlsZXMua2V5cygpKSA6IFtdKSksXG4gICAgcmVhZEZpbGU6IGF1ZGl0KFwicmVhZEZpbGVcIiwgZmlsZU5hbWUgPT4gZmlsZXMuZ2V0KGZpbGVOYW1lKSB8fCBmaWxlcy5nZXQobGliaXplKGZpbGVOYW1lKSkpLFxuICAgIHJlc29sdmVQYXRoOiBwYXRoID0+IHBhdGgsXG4gICAgbmV3TGluZTogXCJcXG5cIixcbiAgICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzOiB0cnVlLFxuICAgIHdyaXRlOiAoKSA9PiBub3RJbXBsZW1lbnRlZChcIndyaXRlXCIpLFxuICAgIHdyaXRlRmlsZTogKGZpbGVOYW1lLCBjb250ZW50cykgPT4ge1xuICAgICAgZmlsZXMuc2V0KGZpbGVOYW1lLCBjb250ZW50cylcbiAgICB9LFxuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZpbGUtc3lzdGVtIGJhY2tlZCBTeXN0ZW0gb2JqZWN0IHdoaWNoIGNhbiBiZSB1c2VkIGluIGEgVHlwZVNjcmlwdCBwcm9ncmFtLCB5b3UgcHJvdmlkZVxuICogYSBzZXQgb2YgdmlydHVhbCBmaWxlcyB3aGljaCBhcmUgcHJpb3JpdGlzZWQgb3ZlciB0aGUgRlMgdmVyc2lvbnMsIHRoZW4gYSBwYXRoIHRvIHRoZSByb290IG9mIHlvdXJcbiAqIHByb2plY3QgKGJhc2ljYWxseSB0aGUgZm9sZGVyIHlvdXIgbm9kZV9tb2R1bGVzIGxpdmVzKVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRlNCYWNrZWRTeXN0ZW0oZmlsZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4sIF9wcm9qZWN0Um9vdDogc3RyaW5nLCB0czogVFMpOiBTeXN0ZW0ge1xuICAvLyBXZSBuZWVkIHRvIG1ha2UgYW4gaXNvbGF0ZWQgZm9sZGVyIGZvciB0aGUgdHNjb25maWcsIGJ1dCBhbHNvIG5lZWQgdG8gYmUgYWJsZSB0byByZXNvbHZlIHRoZVxuICAvLyBleGlzdGluZyBub2RlX21vZHVsZXMgc3RydWN0dXJlcyBnb2luZyBiYWNrIHRocm91Z2ggdGhlIGhpc3RvcnlcbiAgY29uc3Qgcm9vdCA9IF9wcm9qZWN0Um9vdCArIFwiL3Zmc1wiXG4gIGNvbnN0IHBhdGggPSByZXF1aXJlUGF0aCgpXG5cbiAgLy8gVGhlIGRlZmF1bHQgU3lzdGVtIGluIFR5cGVTY3JpcHRcbiAgY29uc3Qgbm9kZVN5cyA9IHRzLnN5c1xuICBjb25zdCB0c0xpYiA9IHBhdGguZGlybmFtZShyZXF1aXJlLnJlc29sdmUoXCJ0eXBlc2NyaXB0XCIpKVxuXG4gIHJldHVybiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG5hbWU6IFwiZnMtdmZzXCIsXG4gICAgcm9vdCxcbiAgICBhcmdzOiBbXSxcbiAgICBjcmVhdGVEaXJlY3Rvcnk6ICgpID0+IG5vdEltcGxlbWVudGVkKFwiY3JlYXRlRGlyZWN0b3J5XCIpLFxuICAgIC8vIFRPRE86IGNvdWxkIG1ha2UgYSByZWFsIGZpbGUgdHJlZVxuICAgIGRpcmVjdG9yeUV4aXN0czogYXVkaXQoXCJkaXJlY3RvcnlFeGlzdHNcIiwgZGlyZWN0b3J5ID0+IHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVzLmtleXMoKSkuc29tZShwYXRoID0+IHBhdGguc3RhcnRzV2l0aChkaXJlY3RvcnkpKSB8fCBub2RlU3lzLmRpcmVjdG9yeUV4aXN0cyhkaXJlY3RvcnkpXG4gICAgfSksXG4gICAgZXhpdDogbm9kZVN5cy5leGl0LFxuICAgIGZpbGVFeGlzdHM6IGF1ZGl0KFwiZmlsZUV4aXN0c1wiLCBmaWxlTmFtZSA9PiB7XG4gICAgICBpZiAoZmlsZXMuaGFzKGZpbGVOYW1lKSkgcmV0dXJuIHRydWVcbiAgICAgIC8vIERvbid0IGxldCBvdGhlciB0c2NvbmZpZ3MgZW5kIHVwIHRvdWNoaW5nIHRoZSB2ZnNcbiAgICAgIGlmIChmaWxlTmFtZS5pbmNsdWRlcyhcInRzY29uZmlnLmpzb25cIikgfHwgZmlsZU5hbWUuaW5jbHVkZXMoXCJ0c2NvbmZpZy5qc29uXCIpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChmaWxlTmFtZS5zdGFydHNXaXRoKFwiL2xpYlwiKSkge1xuICAgICAgICBjb25zdCB0c0xpYk5hbWUgPSBgJHt0c0xpYn0vJHtmaWxlTmFtZS5yZXBsYWNlKFwiL1wiLCBcIlwiKX1gXG4gICAgICAgIHJldHVybiBub2RlU3lzLmZpbGVFeGlzdHModHNMaWJOYW1lKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGVTeXMuZmlsZUV4aXN0cyhmaWxlTmFtZSlcbiAgICB9KSxcbiAgICBnZXRDdXJyZW50RGlyZWN0b3J5OiAoKSA9PiByb290LFxuICAgIGdldERpcmVjdG9yaWVzOiBub2RlU3lzLmdldERpcmVjdG9yaWVzLFxuICAgIGdldEV4ZWN1dGluZ0ZpbGVQYXRoOiAoKSA9PiBub3RJbXBsZW1lbnRlZChcImdldEV4ZWN1dGluZ0ZpbGVQYXRoXCIpLFxuICAgIHJlYWREaXJlY3Rvcnk6IGF1ZGl0KFwicmVhZERpcmVjdG9yeVwiLCAoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKGFyZ3NbMF0gPT09IFwiL1wiKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVzLmtleXMoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBub2RlU3lzLnJlYWREaXJlY3RvcnkoLi4uYXJncylcbiAgICAgIH1cbiAgICB9KSxcbiAgICByZWFkRmlsZTogYXVkaXQoXCJyZWFkRmlsZVwiLCBmaWxlTmFtZSA9PiB7XG4gICAgICBpZiAoZmlsZXMuaGFzKGZpbGVOYW1lKSkgcmV0dXJuIGZpbGVzLmdldChmaWxlTmFtZSlcbiAgICAgIGlmIChmaWxlTmFtZS5zdGFydHNXaXRoKFwiL2xpYlwiKSkge1xuICAgICAgICBjb25zdCB0c0xpYk5hbWUgPSBgJHt0c0xpYn0vJHtmaWxlTmFtZS5yZXBsYWNlKFwiL1wiLCBcIlwiKX1gXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5vZGVTeXMucmVhZEZpbGUodHNMaWJOYW1lKVxuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgIGNvbnN0IGxpYnMgPSBub2RlU3lzLnJlYWREaXJlY3RvcnkodHNMaWIpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFRTVkZTOiBBIHJlcXVlc3Qgd2FzIG1hZGUgZm9yICR7dHNMaWJOYW1lfSBidXQgdGhlcmUgd2Fzbid0IGEgZmlsZSBmb3VuZCBpbiB0aGUgZmlsZSBtYXAuIFlvdSBsaWtlbHkgaGF2ZSBhIG1pc21hdGNoIGluIHRoZSBjb21waWxlciBvcHRpb25zIGZvciB0aGUgQ0ROIGRvd25sb2FkIHZzIHRoZSBjb21waWxlciBwcm9ncmFtLiBFeGlzdGluZyBMaWJzOiAke2xpYnN9LmBcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGVTeXMucmVhZEZpbGUoZmlsZU5hbWUpXG4gICAgfSksXG4gICAgcmVzb2x2ZVBhdGg6IHBhdGggPT4ge1xuICAgICAgaWYgKGZpbGVzLmhhcyhwYXRoKSkgcmV0dXJuIHBhdGhcbiAgICAgIHJldHVybiBub2RlU3lzLnJlc29sdmVQYXRoKHBhdGgpXG4gICAgfSxcbiAgICBuZXdMaW5lOiBcIlxcblwiLFxuICAgIHVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXM6IHRydWUsXG4gICAgd3JpdGU6ICgpID0+IG5vdEltcGxlbWVudGVkKFwid3JpdGVcIiksXG4gICAgd3JpdGVGaWxlOiAoZmlsZU5hbWUsIGNvbnRlbnRzKSA9PiB7XG4gICAgICBmaWxlcy5zZXQoZmlsZU5hbWUsIGNvbnRlbnRzKVxuICAgIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGluLW1lbW9yeSBDb21waWxlckhvc3QgLXdoaWNoIGlzIGVzc2VudGlhbGx5IGFuIGV4dHJhIHdyYXBwZXIgdG8gU3lzdGVtXG4gKiB3aGljaCB3b3JrcyB3aXRoIFR5cGVTY3JpcHQgb2JqZWN0cyAtIHJldHVybnMgYm90aCBhIGNvbXBpbGVyIGhvc3QsIGFuZCBhIHdheSB0byBhZGQgbmV3IFNvdXJjZUZpbGVcbiAqIGluc3RhbmNlcyB0byB0aGUgaW4tbWVtb3J5IGZpbGUgc3lzdGVtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVmlydHVhbENvbXBpbGVySG9zdChzeXM6IFN5c3RlbSwgY29tcGlsZXJPcHRpb25zOiBDb21waWxlck9wdGlvbnMsIHRzOiBUUykge1xuICBjb25zdCBzb3VyY2VGaWxlcyA9IG5ldyBNYXA8c3RyaW5nLCBTb3VyY2VGaWxlPigpXG4gIGNvbnN0IHNhdmUgPSAoc291cmNlRmlsZTogU291cmNlRmlsZSkgPT4ge1xuICAgIHNvdXJjZUZpbGVzLnNldChzb3VyY2VGaWxlLmZpbGVOYW1lLCBzb3VyY2VGaWxlKVxuICAgIHJldHVybiBzb3VyY2VGaWxlXG4gIH1cblxuICB0eXBlIFJldHVybiA9IHtcbiAgICBjb21waWxlckhvc3Q6IENvbXBpbGVySG9zdFxuICAgIHVwZGF0ZUZpbGU6IChzb3VyY2VGaWxlOiBTb3VyY2VGaWxlKSA9PiBib29sZWFuXG4gIH1cblxuICBjb25zdCB2SG9zdDogUmV0dXJuID0ge1xuICAgIGNvbXBpbGVySG9zdDoge1xuICAgICAgLi4uc3lzLFxuICAgICAgZ2V0Q2Fub25pY2FsRmlsZU5hbWU6IGZpbGVOYW1lID0+IGZpbGVOYW1lLFxuICAgICAgZ2V0RGVmYXVsdExpYkZpbGVOYW1lOiAoKSA9PiBcIi9cIiArIHRzLmdldERlZmF1bHRMaWJGaWxlTmFtZShjb21waWxlck9wdGlvbnMpLCAvLyAnL2xpYi5kLnRzJyxcbiAgICAgIC8vIGdldERlZmF1bHRMaWJMb2NhdGlvbjogKCkgPT4gJy8nLFxuICAgICAgZ2V0RGlyZWN0b3JpZXM6ICgpID0+IFtdLFxuICAgICAgZ2V0TmV3TGluZTogKCkgPT4gc3lzLm5ld0xpbmUsXG4gICAgICBnZXRTb3VyY2VGaWxlOiBmaWxlTmFtZSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgc291cmNlRmlsZXMuZ2V0KGZpbGVOYW1lKSB8fFxuICAgICAgICAgIHNhdmUoXG4gICAgICAgICAgICB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgc3lzLnJlYWRGaWxlKGZpbGVOYW1lKSEsXG4gICAgICAgICAgICAgIGNvbXBpbGVyT3B0aW9ucy50YXJnZXQgfHwgZGVmYXVsdENvbXBpbGVyT3B0aW9ucyh0cykudGFyZ2V0ISxcbiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzOiAoKSA9PiBzeXMudXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcyxcbiAgICB9LFxuICAgIHVwZGF0ZUZpbGU6IHNvdXJjZUZpbGUgPT4ge1xuICAgICAgY29uc3QgYWxyZWFkeUV4aXN0cyA9IHNvdXJjZUZpbGVzLmhhcyhzb3VyY2VGaWxlLmZpbGVOYW1lKVxuICAgICAgc3lzLndyaXRlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lLCBzb3VyY2VGaWxlLnRleHQpXG4gICAgICBzb3VyY2VGaWxlcy5zZXQoc291cmNlRmlsZS5maWxlTmFtZSwgc291cmNlRmlsZSlcbiAgICAgIHJldHVybiBhbHJlYWR5RXhpc3RzXG4gICAgfSxcbiAgfVxuICByZXR1cm4gdkhvc3Rcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCB3aGljaCBjYW4gaG9zdCBhIGxhbmd1YWdlIHNlcnZpY2UgYWdhaW5zdCB0aGUgdmlydHVhbCBmaWxlLXN5c3RlbVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVmlydHVhbExhbmd1YWdlU2VydmljZUhvc3QoXG4gIHN5czogU3lzdGVtLFxuICByb290RmlsZXM6IHN0cmluZ1tdLFxuICBjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucyxcbiAgdHM6IFRTLFxuICBjdXN0b21UcmFuc2Zvcm1lcnM/OiBDdXN0b21UcmFuc2Zvcm1lcnNcbikge1xuICBjb25zdCBmaWxlTmFtZXMgPSBbLi4ucm9vdEZpbGVzXVxuICBjb25zdCB7IGNvbXBpbGVySG9zdCwgdXBkYXRlRmlsZSB9ID0gY3JlYXRlVmlydHVhbENvbXBpbGVySG9zdChzeXMsIGNvbXBpbGVyT3B0aW9ucywgdHMpXG4gIGNvbnN0IGZpbGVWZXJzaW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KClcbiAgbGV0IHByb2plY3RWZXJzaW9uID0gMFxuICBjb25zdCBsYW5ndWFnZVNlcnZpY2VIb3N0OiBMYW5ndWFnZVNlcnZpY2VIb3N0ID0ge1xuICAgIC4uLmNvbXBpbGVySG9zdCxcbiAgICBnZXRQcm9qZWN0VmVyc2lvbjogKCkgPT4gcHJvamVjdFZlcnNpb24udG9TdHJpbmcoKSxcbiAgICBnZXRDb21waWxhdGlvblNldHRpbmdzOiAoKSA9PiBjb21waWxlck9wdGlvbnMsXG4gICAgZ2V0Q3VzdG9tVHJhbnNmb3JtZXJzOiAoKSA9PiBjdXN0b21UcmFuc2Zvcm1lcnMsXG4gICAgZ2V0U2NyaXB0RmlsZU5hbWVzOiAoKSA9PiBmaWxlTmFtZXMsXG4gICAgZ2V0U2NyaXB0U25hcHNob3Q6IGZpbGVOYW1lID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gc3lzLnJlYWRGaWxlKGZpbGVOYW1lKVxuICAgICAgaWYgKGNvbnRlbnRzKSB7XG4gICAgICAgIHJldHVybiB0cy5TY3JpcHRTbmFwc2hvdC5mcm9tU3RyaW5nKGNvbnRlbnRzKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfSxcbiAgICBnZXRTY3JpcHRWZXJzaW9uOiBmaWxlTmFtZSA9PiB7XG4gICAgICByZXR1cm4gZmlsZVZlcnNpb25zLmdldChmaWxlTmFtZSkgfHwgXCIwXCJcbiAgICB9LFxuICAgIHdyaXRlRmlsZTogc3lzLndyaXRlRmlsZSxcbiAgfVxuXG4gIHR5cGUgUmV0dXJuID0ge1xuICAgIGxhbmd1YWdlU2VydmljZUhvc3Q6IExhbmd1YWdlU2VydmljZUhvc3RcbiAgICB1cGRhdGVGaWxlOiAoc291cmNlRmlsZTogaW1wb3J0KFwidHlwZXNjcmlwdFwiKS5Tb3VyY2VGaWxlKSA9PiB2b2lkXG4gIH1cblxuICBjb25zdCBsc0hvc3Q6IFJldHVybiA9IHtcbiAgICBsYW5ndWFnZVNlcnZpY2VIb3N0LFxuICAgIHVwZGF0ZUZpbGU6IHNvdXJjZUZpbGUgPT4ge1xuICAgICAgcHJvamVjdFZlcnNpb24rK1xuICAgICAgZmlsZVZlcnNpb25zLnNldChzb3VyY2VGaWxlLmZpbGVOYW1lLCBwcm9qZWN0VmVyc2lvbi50b1N0cmluZygpKVxuICAgICAgaWYgKCFmaWxlTmFtZXMuaW5jbHVkZXMoc291cmNlRmlsZS5maWxlTmFtZSkpIHtcbiAgICAgICAgZmlsZU5hbWVzLnB1c2goc291cmNlRmlsZS5maWxlTmFtZSlcbiAgICAgIH1cbiAgICAgIHVwZGF0ZUZpbGUoc291cmNlRmlsZSlcbiAgICB9LFxuICB9XG4gIHJldHVybiBsc0hvc3Rcbn1cblxuY29uc3QgcmVxdWlyZVBhdGggPSAoKSA9PiB7XG4gIHJldHVybiByZXF1aXJlKFN0cmluZy5mcm9tQ2hhckNvZGUoMTEyLCA5NywgMTE2LCAxMDQpKSBhcyB0eXBlb2YgaW1wb3J0KFwicGF0aFwiKVxufVxuXG5jb25zdCByZXF1aXJlRlMgPSAoKSA9PiB7XG4gIHJldHVybiByZXF1aXJlKFN0cmluZy5mcm9tQ2hhckNvZGUoMTAyLCAxMTUpKSBhcyB0eXBlb2YgaW1wb3J0KFwiZnNcIilcbn1cbiJdfQ==