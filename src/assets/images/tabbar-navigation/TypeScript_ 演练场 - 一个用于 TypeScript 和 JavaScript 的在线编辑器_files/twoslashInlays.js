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
    exports.createTwoslashInlayProvider = void 0;
    const createTwoslashInlayProvider = (sandbox) => {
        const provider = {
            provideInlayHints: (model, _, cancel) => __awaiter(void 0, void 0, void 0, function* () {
                const text = model.getValue();
                const queryRegex = /^\s*\/\/\s*\^\?$/gm;
                let match;
                const results = [];
                const worker = yield sandbox.getWorkerProcess();
                if (model.isDisposed()) {
                    return [];
                }
                while ((match = queryRegex.exec(text)) !== null) {
                    const end = match.index + match[0].length - 1;
                    const endPos = model.getPositionAt(end);
                    const inspectionPos = new sandbox.monaco.Position(endPos.lineNumber - 1, endPos.column);
                    const inspectionOff = model.getOffsetAt(inspectionPos);
                    if (cancel.isCancellationRequested)
                        return [];
                    const hint = yield worker.getQuickInfoAtPosition("file://" + model.uri.path, inspectionOff);
                    if (!hint || !hint.displayParts)
                        continue;
                    // Make a one-liner
                    let text = hint.displayParts.map(d => d.text).join("").replace(/\\n/g, "").replace(/  /g, "");
                    if (text.length > 120)
                        text = text.slice(0, 119) + "...";
                    const inlay = {
                        // @ts-ignore
                        kind: 0,
                        position: new sandbox.monaco.Position(endPos.lineNumber, endPos.column + 1),
                        text,
                        whitespaceBefore: true,
                    };
                    results.push(inlay);
                }
                return results;
            }),
        };
        return provider;
    };
    exports.createTwoslashInlayProvider = createTwoslashInlayProvider;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdvc2xhc2hJbmxheXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy90d29zbGFzaElubGF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBRU8sTUFBTSwyQkFBMkIsR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtRQUM5RCxNQUFNLFFBQVEsR0FBeUQ7WUFDckUsaUJBQWlCLEVBQUUsQ0FBTyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUM1QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7Z0JBQzdCLE1BQU0sVUFBVSxHQUFHLG9CQUFvQixDQUFBO2dCQUN2QyxJQUFJLEtBQUssQ0FBQTtnQkFDVCxNQUFNLE9BQU8sR0FBa0QsRUFBRSxDQUFBO2dCQUNqRSxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUMvQyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDdEIsT0FBTyxFQUFFLENBQUE7aUJBQ1Y7Z0JBRUQsT0FBTyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUMvQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO29CQUM3QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUN2QyxNQUFNLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDdkYsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtvQkFFdEQsSUFBSSxNQUFNLENBQUMsdUJBQXVCO3dCQUFFLE9BQU8sRUFBRSxDQUFBO29CQUU3QyxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUE7b0JBQzNGLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTt3QkFBRSxTQUFRO29CQUV6QyxtQkFBbUI7b0JBQ25CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7b0JBQzdGLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHO3dCQUFFLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUE7b0JBRXhELE1BQU0sS0FBSyxHQUFnRDt3QkFDekQsYUFBYTt3QkFDYixJQUFJLEVBQUUsQ0FBQzt3QkFDUCxRQUFRLEVBQUUsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQUMzRSxJQUFJO3dCQUNKLGdCQUFnQixFQUFFLElBQUk7cUJBQ3ZCLENBQUE7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDcEI7Z0JBQ0QsT0FBTyxPQUFPLENBQUE7WUFDaEIsQ0FBQyxDQUFBO1NBQ0YsQ0FBQTtRQUNELE9BQU8sUUFBUSxDQUFBO0lBQ2pCLENBQUMsQ0FBQTtJQXhDWSxRQUFBLDJCQUEyQiwrQkF3Q3ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2FuZGJveCB9IGZyb20gXCJ0eXBlc2NyaXB0bGFuZy1vcmcvc3RhdGljL2pzL3NhbmRib3hcIlxuXG5leHBvcnQgY29uc3QgY3JlYXRlVHdvc2xhc2hJbmxheVByb3ZpZGVyID0gKHNhbmRib3g6IFNhbmRib3gpID0+IHtcbiAgY29uc3QgcHJvdmlkZXI6IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikubGFuZ3VhZ2VzLklubGF5SGludHNQcm92aWRlciA9IHtcbiAgICBwcm92aWRlSW5sYXlIaW50czogYXN5bmMgKG1vZGVsLCBfLCBjYW5jZWwpID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSBtb2RlbC5nZXRWYWx1ZSgpXG4gICAgICBjb25zdCBxdWVyeVJlZ2V4ID0gL15cXHMqXFwvXFwvXFxzKlxcXlxcPyQvZ21cbiAgICAgIGxldCBtYXRjaFxuICAgICAgY29uc3QgcmVzdWx0czogaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5sYW5ndWFnZXMuSW5sYXlIaW50W10gPSBbXVxuICAgICAgY29uc3Qgd29ya2VyID0gYXdhaXQgc2FuZGJveC5nZXRXb3JrZXJQcm9jZXNzKClcbiAgICAgIGlmIChtb2RlbC5pc0Rpc3Bvc2VkKCkpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgICB9XG5cbiAgICAgIHdoaWxlICgobWF0Y2ggPSBxdWVyeVJlZ2V4LmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoIC0gMVxuICAgICAgICBjb25zdCBlbmRQb3MgPSBtb2RlbC5nZXRQb3NpdGlvbkF0KGVuZClcbiAgICAgICAgY29uc3QgaW5zcGVjdGlvblBvcyA9IG5ldyBzYW5kYm94Lm1vbmFjby5Qb3NpdGlvbihlbmRQb3MubGluZU51bWJlciAtIDEsIGVuZFBvcy5jb2x1bW4pXG4gICAgICAgIGNvbnN0IGluc3BlY3Rpb25PZmYgPSBtb2RlbC5nZXRPZmZzZXRBdChpbnNwZWN0aW9uUG9zKVxuXG4gICAgICAgIGlmIChjYW5jZWwuaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQpIHJldHVybiBbXVxuXG4gICAgICAgIGNvbnN0IGhpbnQgPSBhd2FpdCB3b3JrZXIuZ2V0UXVpY2tJbmZvQXRQb3NpdGlvbihcImZpbGU6Ly9cIiArIG1vZGVsLnVyaS5wYXRoLCBpbnNwZWN0aW9uT2ZmKVxuICAgICAgICBpZiAoIWhpbnQgfHwgIWhpbnQuZGlzcGxheVBhcnRzKSBjb250aW51ZVxuXG4gICAgICAgIC8vIE1ha2UgYSBvbmUtbGluZXJcbiAgICAgICAgbGV0IHRleHQgPSBoaW50LmRpc3BsYXlQYXJ0cy5tYXAoZCA9PiBkLnRleHQpLmpvaW4oXCJcIikucmVwbGFjZSgvXFxcXG4vZywgXCJcIikucmVwbGFjZSgvICAvZywgXCJcIilcbiAgICAgICAgaWYgKHRleHQubGVuZ3RoID4gMTIwKSB0ZXh0ID0gdGV4dC5zbGljZSgwLCAxMTkpICsgXCIuLi5cIlxuXG4gICAgICAgIGNvbnN0IGlubGF5OiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpLmxhbmd1YWdlcy5JbmxheUhpbnQgPSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGtpbmQ6IDAsXG4gICAgICAgICAgcG9zaXRpb246IG5ldyBzYW5kYm94Lm1vbmFjby5Qb3NpdGlvbihlbmRQb3MubGluZU51bWJlciwgZW5kUG9zLmNvbHVtbiArIDEpLFxuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgd2hpdGVzcGFjZUJlZm9yZTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goaW5sYXkpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH0sXG4gIH1cbiAgcmV0dXJuIHByb3ZpZGVyXG59XG4iXX0=