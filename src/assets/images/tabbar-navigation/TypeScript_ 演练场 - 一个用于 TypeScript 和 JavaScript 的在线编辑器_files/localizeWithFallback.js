define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localize = void 0;
    /** contains the ts-ignore, and the global window manipulation  */
    const localize = (key, fallback) => 
    // @ts-ignore
    'i' in window ? window.i(key) : fallback;
    exports.localize = localize;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVXaXRoRmFsbGJhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9sb2NhbGl6ZVdpdGhGYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQUEsa0VBQWtFO0lBQzNELE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUN4RCxhQUFhO0lBQ2IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBO0lBRjdCLFFBQUEsUUFBUSxZQUVxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBjb250YWlucyB0aGUgdHMtaWdub3JlLCBhbmQgdGhlIGdsb2JhbCB3aW5kb3cgbWFuaXB1bGF0aW9uICAqL1xuZXhwb3J0IGNvbnN0IGxvY2FsaXplID0gKGtleTogc3RyaW5nLCBmYWxsYmFjazogc3RyaW5nKSA9PlxuICAvLyBAdHMtaWdub3JlXG4gICdpJyBpbiB3aW5kb3cgPyB3aW5kb3cuaShrZXkpIDogZmFsbGJhY2tcbiJdfQ==