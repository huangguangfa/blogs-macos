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
    exports.getExampleSourceCode = void 0;
    const getExampleSourceCode = (prefix, lang, exampleID) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const site = `${document.location.protocol}//${document.location.host}${prefix}`;
            const examplesTOCHref = `${site}/js/examples/${lang}.json`;
            const res = yield fetch(examplesTOCHref);
            if (!res.ok) {
                console.error("Could not fetch example TOC for lang: " + lang);
                return {};
            }
            const toc = yield res.json();
            const example = toc.examples.find((e) => e.id === exampleID);
            if (!example) {
                // prettier-ignore
                console.error(`Could not find example with id: ${exampleID} in\n// ${document.location.protocol}//${document.location.host}${examplesTOCHref}`);
                return {};
            }
            const exampleCodePath = `${site}/js/examples/${example.lang}/${example.path.join("/")}/${example.name}`;
            const codeRes = yield fetch(exampleCodePath);
            let code = yield codeRes.text();
            // Handle removing the compiler settings stuff
            if (code.startsWith("//// {")) {
                code = code.split("\n").slice(1).join("\n").trim();
            }
            // @ts-ignore
            window.appInsights &&
                // @ts-ignore
                window.appInsights.trackEvent({ name: "Read Playground Example", properties: { id: exampleID, lang } });
            return {
                example,
                code,
            };
        }
        catch (e) {
            console.log(e);
            return {};
        }
    });
    exports.getExampleSourceCode = getExampleSourceCode;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL2dldEV4YW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFPLE1BQU0sb0JBQW9CLEdBQUcsQ0FBTyxNQUFjLEVBQUUsSUFBWSxFQUFFLFNBQWlCLEVBQUUsRUFBRTtRQUM1RixJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQTtZQUNoRixNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksZ0JBQWdCLElBQUksT0FBTyxDQUFBO1lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxDQUFDLENBQUE7Z0JBQzlELE9BQU8sRUFBRSxDQUFBO2FBQ1Y7WUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUM1QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQTtZQUNqRSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLGtCQUFrQjtnQkFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsU0FBUyxXQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGVBQWUsRUFBRSxDQUFDLENBQUE7Z0JBQy9JLE9BQU8sRUFBRSxDQUFBO2FBQ1Y7WUFFRCxNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksZ0JBQWdCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3ZHLE1BQU0sT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQzVDLElBQUksSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1lBRS9CLDhDQUE4QztZQUM5QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDbkQ7WUFFRCxhQUFhO1lBQ2IsTUFBTSxDQUFDLFdBQVc7Z0JBQ2hCLGFBQWE7Z0JBQ2IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFekcsT0FBTztnQkFDTCxPQUFPO2dCQUNQLElBQUk7YUFDTCxDQUFBO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDZCxPQUFPLEVBQUUsQ0FBQTtTQUNWO0lBQ0gsQ0FBQyxDQUFBLENBQUE7SUF4Q1ksUUFBQSxvQkFBb0Isd0JBd0NoQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBnZXRFeGFtcGxlU291cmNlQ29kZSA9IGFzeW5jIChwcmVmaXg6IHN0cmluZywgbGFuZzogc3RyaW5nLCBleGFtcGxlSUQ6IHN0cmluZykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNpdGUgPSBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vLyR7ZG9jdW1lbnQubG9jYXRpb24uaG9zdH0ke3ByZWZpeH1gXG4gICAgY29uc3QgZXhhbXBsZXNUT0NIcmVmID0gYCR7c2l0ZX0vanMvZXhhbXBsZXMvJHtsYW5nfS5qc29uYFxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGV4YW1wbGVzVE9DSHJlZilcbiAgICBpZiAoIXJlcy5vaykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBmZXRjaCBleGFtcGxlIFRPQyBmb3IgbGFuZzogXCIgKyBsYW5nKVxuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgY29uc3QgdG9jID0gYXdhaXQgcmVzLmpzb24oKVxuICAgIGNvbnN0IGV4YW1wbGUgPSB0b2MuZXhhbXBsZXMuZmluZCgoZTogYW55KSA9PiBlLmlkID09PSBleGFtcGxlSUQpXG4gICAgaWYgKCFleGFtcGxlKSB7XG4gICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgIGNvbnNvbGUuZXJyb3IoYENvdWxkIG5vdCBmaW5kIGV4YW1wbGUgd2l0aCBpZDogJHtleGFtcGxlSUR9IGluXFxuLy8gJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vLyR7ZG9jdW1lbnQubG9jYXRpb24uaG9zdH0ke2V4YW1wbGVzVE9DSHJlZn1gKVxuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuXG4gICAgY29uc3QgZXhhbXBsZUNvZGVQYXRoID0gYCR7c2l0ZX0vanMvZXhhbXBsZXMvJHtleGFtcGxlLmxhbmd9LyR7ZXhhbXBsZS5wYXRoLmpvaW4oXCIvXCIpfS8ke2V4YW1wbGUubmFtZX1gXG4gICAgY29uc3QgY29kZVJlcyA9IGF3YWl0IGZldGNoKGV4YW1wbGVDb2RlUGF0aClcbiAgICBsZXQgY29kZSA9IGF3YWl0IGNvZGVSZXMudGV4dCgpXG5cbiAgICAvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGNvbXBpbGVyIHNldHRpbmdzIHN0dWZmXG4gICAgaWYgKGNvZGUuc3RhcnRzV2l0aChcIi8vLy8ge1wiKSkge1xuICAgICAgY29kZSA9IGNvZGUuc3BsaXQoXCJcXG5cIikuc2xpY2UoMSkuam9pbihcIlxcblwiKS50cmltKClcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2luZG93LmFwcEluc2lnaHRzICYmXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB3aW5kb3cuYXBwSW5zaWdodHMudHJhY2tFdmVudCh7IG5hbWU6IFwiUmVhZCBQbGF5Z3JvdW5kIEV4YW1wbGVcIiwgcHJvcGVydGllczogeyBpZDogZXhhbXBsZUlELCBsYW5nIH0gfSlcblxuICAgIHJldHVybiB7XG4gICAgICBleGFtcGxlLFxuICAgICAgY29kZSxcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiB7fVxuICB9XG59XG4iXX0=