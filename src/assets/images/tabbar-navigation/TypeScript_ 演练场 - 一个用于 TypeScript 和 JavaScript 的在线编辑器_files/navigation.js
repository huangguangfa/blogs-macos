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
    exports.hideNavForHandbook = exports.showNavForHandbook = exports.gistPoweredNavBar = void 0;
    /**
     * Uses the Playground gist proxy to generate a set of stories ^ which
     * correspond to files in the
     */
    const gistPoweredNavBar = (sandbox, ui, showNav) => {
        const gistHash = location.hash.split("#gist/")[1];
        const [gistID] = gistHash.split("-");
        // @ts-ignore
        window.appInsights && window.appInsights.trackEvent({ name: "Loaded Gist Playground", properties: { id: gistID } });
        sandbox.editor.updateOptions({ readOnly: true });
        ui.flashInfo(`Opening Gist ${gistID} as a Docset`, 2000);
        // Disable the handbook button because we can't have two sidenavs
        const handbookButton = document.getElementById("handbook-button");
        if (handbookButton) {
            handbookButton.parentElement.classList.add("disabled");
        }
        const playground = document.getElementById("playground-container");
        playground.style.opacity = "0.5";
        // const relay = "http://localhost:7071/api/API"
        const relay = "https://typescriptplaygroundgistproxyapi.azurewebsites.net/api/API";
        fetch(`${relay}?gistID=${gistID}`)
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            // Make editor work again
            playground.style.opacity = "1";
            sandbox.editor.updateOptions({ readOnly: false });
            const response = yield res.json();
            if ("error" in response) {
                return ui.flashInfo(`Error with getting your gist: ${response.display}.`, 3000);
            }
            // If the API response is a single code file, just throw that in
            if (response.type === "code") {
                sandbox.setText(response.code);
                sandbox.setCompilerSettings(response.params);
                // If it's multi-file, then there's work to do
            }
            else if (response.type === "story") {
                showNav();
                const prefix = `#gist/${gistID}`;
                updateNavWithStoryContent(response.title, response.files, prefix, sandbox);
            }
        }))
            .catch(() => {
            ui.flashInfo("Could not reach the gist to playground API, are you (or it) offline?");
            playground.style.opacity = "1";
            sandbox.editor.updateOptions({ readOnly: false });
        });
    };
    exports.gistPoweredNavBar = gistPoweredNavBar;
    /** Use the handbook TOC which is injected into the globals to create a sidebar  */
    const showNavForHandbook = (sandbox, escapeFunction) => {
        // @ts-ignore
        const content = window.playgroundHandbookTOC.docs;
        const button = document.createElement("button");
        button.ariaLabel = "Close handbook";
        button.className = "examples-close";
        button.innerText = "Close";
        button.onclick = escapeFunction;
        const story = document.getElementById("editor-container");
        story === null || story === void 0 ? void 0 : story.appendChild(button);
        updateNavWithStoryContent("Handbook", content, "#handbook", sandbox);
        const nav = document.getElementById("navigation-container");
        if (nav)
            nav.classList.add("handbook");
    };
    exports.showNavForHandbook = showNavForHandbook;
    /**
     * Hides the nav and the close button, specifically only when we have
     * the handbook open and not when a gist is open
     */
    const hideNavForHandbook = (sandbox) => {
        const nav = document.getElementById("navigation-container");
        if (!nav)
            return;
        if (!nav.classList.contains("handbook"))
            return;
        showCode(sandbox);
        nav.style.display = "none";
        const leftDrag = document.querySelector(".playground-dragbar.left");
        if (leftDrag)
            leftDrag.style.display = "none";
        const story = document.getElementById("editor-container");
        const possibleButtonToRemove = story === null || story === void 0 ? void 0 : story.querySelector("button");
        if (story && possibleButtonToRemove)
            story.removeChild(possibleButtonToRemove);
    };
    exports.hideNavForHandbook = hideNavForHandbook;
    /**
     * Assumes a nav has been set up already, and then fills out the content of the nav bar
     * with clickable links for each potential story.
     */
    const updateNavWithStoryContent = (title, storyContent, prefix, sandbox) => {
        const nav = document.getElementById("navigation-container");
        if (!nav)
            return;
        while (nav.firstChild) {
            nav.removeChild(nav.firstChild);
        }
        const titleh4 = document.createElement("h4");
        titleh4.textContent = title;
        nav.appendChild(titleh4);
        // Make all the sidebar elements
        const ul = document.createElement("ul");
        storyContent.forEach((element, i) => {
            const li = document.createElement("li");
            switch (element.type) {
                case "html":
                case "href":
                case "code": {
                    li.classList.add("selectable");
                    const a = document.createElement("a");
                    let logo;
                    if (element.type === "code") {
                        logo = `<svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="7" height="7" fill="#187ABF"/></svg>`;
                    }
                    else if (element.type === "html") {
                        logo = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5.5V3.25L6 1H4M8 5.5V10H1V1H4M8 5.5H4V1" stroke="#C4C4C4"/></svg>`;
                    }
                    else {
                        logo = "";
                    }
                    a.innerHTML = `${logo}${element.title}`;
                    a.href = `/play#${prefix}-${i}`;
                    a.onclick = e => {
                        e.preventDefault();
                        // Note: I'm not sure why this is needed?
                        const ed = sandbox.editor.getDomNode();
                        if (!ed)
                            return;
                        sandbox.editor.updateOptions({ readOnly: false });
                        const alreadySelected = ul.querySelector(".selected");
                        if (alreadySelected)
                            alreadySelected.classList.remove("selected");
                        li.classList.add("selected");
                        switch (element.type) {
                            case "code":
                                setCode(element.code, sandbox);
                                break;
                            case "html":
                                setStory(element.html, sandbox);
                                break;
                            case "href":
                                setStoryViaHref(element.href, sandbox);
                                break;
                        }
                        // Set the URL after selecting
                        const alwaysUpdateURL = !localStorage.getItem("disable-save-on-type");
                        if (alwaysUpdateURL) {
                            location.hash = `${prefix}-${i}`;
                        }
                        return false;
                    };
                    li.appendChild(a);
                    break;
                }
                case "hr": {
                    const hr = document.createElement("hr");
                    li.appendChild(hr);
                }
            }
            ul.appendChild(li);
        });
        nav.appendChild(ul);
        const pageID = location.hash.split("-")[1] || "";
        const index = Number(pageID) || 0;
        const targetedLi = ul.children.item(index) || ul.children.item(0);
        if (targetedLi) {
            const a = targetedLi.getElementsByTagName("a").item(0);
            // @ts-ignore
            if (a)
                a.click();
        }
    };
    // Use fetch to grab the HTML from a URL, with a special case 
    // when that is a gatsby URL where we pull out the important
    // HTML from inside the __gatsby id.
    const setStoryViaHref = (href, sandbox) => {
        fetch(href).then((req) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.ok) {
                const text = yield req.text();
                if (text.includes("___gatsby")) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, "text/html");
                    const gatsby = doc.getElementById('___gatsby');
                    if (gatsby) {
                        gatsby.id = "___inner_g";
                        setStory(gatsby, sandbox);
                    }
                    return;
                }
                if (document.location.host === "localhost:8000") {
                    setStory("<p>Because the gatsby dev server uses JS to build your pages, and not statically, the page will not load during dev. It does work in prod though - use <code>yarn build-site</code> to test locally with a static build.</p>", sandbox);
                }
                else {
                    setStory(text, sandbox);
                }
            }
            else {
                setStory(`<p>Failed to load the content at ${href}. Reason: ${req.status} ${req.statusText}</p>`, sandbox);
            }
        }));
    };
    /**
     * Passing in either a root HTML element or the HTML for the story, present a
     * markdown doc as a 'story' inside the playground.
     */
    const setStory = (html, sandbox) => {
        const toolbar = document.getElementById("editor-toolbar");
        if (toolbar)
            toolbar.style.display = "none";
        const monaco = document.getElementById("monaco-editor-embed");
        if (monaco)
            monaco.style.display = "none";
        const story = document.getElementById("story-container");
        if (!story)
            return;
        story.style.display = "block";
        if (typeof html === "string") {
            story.innerHTML = html;
        }
        else {
            while (story.firstChild) {
                story.removeChild(story.firstChild);
            }
            story.appendChild(html);
        }
        // We need to hijack internal links
        for (const a of Array.from(story.getElementsByTagName("a"))) {
            if (!a.pathname.startsWith("/play"))
                continue;
            // Note the the header generated links also count in here
            // overwrite playground links
            if (a.hash.includes("#code/")) {
                a.onclick = e => {
                    const code = a.hash.replace("#code/", "").trim();
                    let userCode = sandbox.lzstring.decompressFromEncodedURIComponent(code);
                    // Fallback incase there is an extra level of decoding:
                    // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
                    if (!userCode)
                        userCode = sandbox.lzstring.decompressFromEncodedURIComponent(decodeURIComponent(code));
                    if (userCode)
                        setCode(userCode, sandbox);
                    e.preventDefault();
                    const alreadySelected = document.getElementById("navigation-container").querySelector("li.selected");
                    if (alreadySelected)
                        alreadySelected.classList.remove("selected");
                    return false;
                };
            }
            // overwrite gist/handbook links
            else if (a.hash.includes("#gist/") || a.hash.includes("#handbook")) {
                a.onclick = e => {
                    const index = Number(a.hash.split("-")[1]);
                    const nav = document.getElementById("navigation-container");
                    if (!nav)
                        return;
                    const ul = nav.getElementsByTagName("ul").item(0);
                    const targetedLi = ul.children.item(Number(index) || 0) || ul.children.item(0);
                    if (targetedLi) {
                        const a = targetedLi.getElementsByTagName("a").item(0);
                        // @ts-ignore
                        if (a)
                            a.click();
                    }
                    e.preventDefault();
                    return false;
                };
            }
            else {
                a.setAttribute("target", "_blank");
            }
        }
    };
    const showCode = (sandbox) => {
        const story = document.getElementById("story-container");
        if (story)
            story.style.display = "none";
        const toolbar = document.getElementById("editor-toolbar");
        if (toolbar)
            toolbar.style.display = "block";
        const monaco = document.getElementById("monaco-editor-embed");
        if (monaco)
            monaco.style.display = "block";
        sandbox.editor.layout();
    };
    const setCode = (code, sandbox) => {
        sandbox.setText(code);
        showCode(sandbox);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL25hdmlnYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBOzs7T0FHRztJQUNJLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQU0sRUFBRSxPQUFtQixFQUFFLEVBQUU7UUFDakYsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFcEMsYUFBYTtRQUNiLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVuSCxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLE1BQU0sY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRXhELGlFQUFpRTtRQUNqRSxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDakUsSUFBSSxjQUFjLEVBQUU7WUFDbEIsY0FBYyxDQUFDLGFBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1NBQ3hEO1FBRUQsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBRSxDQUFBO1FBQ25FLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUss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Q0FBQTtRQUNyQixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDbkIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBTdG9yeUNvbnRlbnQgPVxuICB8IHsgdHlwZTogXCJodG1sXCI7IGh0bWw6IHN0cmluZzsgdGl0bGU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiBcImhyZWZcIjsgaHJlZjogc3RyaW5nOyB0aXRsZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6IFwiY29kZVwiOyBjb2RlOiBzdHJpbmc7IHBhcmFtczogc3RyaW5nOyB0aXRsZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6IFwiaHJcIiB9XG5cbmltcG9ydCB0eXBlIHsgU2FuZGJveCB9IGZyb20gXCJ0eXBlc2NyaXB0bGFuZy1vcmcvc3RhdGljL2pzL3NhbmRib3hcIlxuaW1wb3J0IHR5cGUgeyBVSSB9IGZyb20gXCIuL2NyZWF0ZVVJXCJcblxuLyoqXG4gKiBVc2VzIHRoZSBQbGF5Z3JvdW5kIGdpc3QgcHJveHkgdG8gZ2VuZXJhdGUgYSBzZXQgb2Ygc3RvcmllcyBeIHdoaWNoIFxuICogY29ycmVzcG9uZCB0byBmaWxlcyBpbiB0aGUgXG4gKi9cbmV4cG9ydCBjb25zdCBnaXN0UG93ZXJlZE5hdkJhciA9IChzYW5kYm94OiBTYW5kYm94LCB1aTogVUksIHNob3dOYXY6ICgpID0+IHZvaWQpID0+IHtcbiAgY29uc3QgZ2lzdEhhc2ggPSBsb2NhdGlvbi5oYXNoLnNwbGl0KFwiI2dpc3QvXCIpWzFdXG4gIGNvbnN0IFtnaXN0SURdID0gZ2lzdEhhc2guc3BsaXQoXCItXCIpXG5cbiAgLy8gQHRzLWlnbm9yZVxuICB3aW5kb3cuYXBwSW5zaWdodHMgJiYgd2luZG93LmFwcEluc2lnaHRzLnRyYWNrRXZlbnQoeyBuYW1lOiBcIkxvYWRlZCBHaXN0IFBsYXlncm91bmRcIiwgcHJvcGVydGllczogeyBpZDogZ2lzdElEIH0gfSlcblxuICBzYW5kYm94LmVkaXRvci51cGRhdGVPcHRpb25zKHsgcmVhZE9ubHk6IHRydWUgfSlcbiAgdWkuZmxhc2hJbmZvKGBPcGVuaW5nIEdpc3QgJHtnaXN0SUR9IGFzIGEgRG9jc2V0YCwgMjAwMClcblxuICAvLyBEaXNhYmxlIHRoZSBoYW5kYm9vayBidXR0b24gYmVjYXVzZSB3ZSBjYW4ndCBoYXZlIHR3byBzaWRlbmF2c1xuICBjb25zdCBoYW5kYm9va0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGFuZGJvb2stYnV0dG9uXCIpXG4gIGlmIChoYW5kYm9va0J1dHRvbikge1xuICAgIGhhbmRib29rQnV0dG9uLnBhcmVudEVsZW1lbnQhLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKVxuICB9XG5cbiAgY29uc3QgcGxheWdyb3VuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWdyb3VuZC1jb250YWluZXJcIikhXG4gIHBsYXlncm91bmQuc3R5bGUub3BhY2l0eSA9IFwiMC41XCJcblxuICAvLyBjb25zdCByZWxheSA9IFwiaHR0cDovL2xvY2FsaG9zdDo3MDcxL2FwaS9BUElcIlxuICBjb25zdCByZWxheSA9IFwiaHR0cHM6Ly90eXBlc2NyaXB0cGxheWdyb3VuZGdpc3Rwcm94eWFwaS5henVyZXdlYnNpdGVzLm5ldC9hcGkvQVBJXCJcbiAgZmV0Y2goYCR7cmVsYXl9P2dpc3RJRD0ke2dpc3RJRH1gKVxuICAgIC50aGVuKGFzeW5jIHJlcyA9PiB7XG4gICAgICAvLyBNYWtlIGVkaXRvciB3b3JrIGFnYWluXG4gICAgICBwbGF5Z3JvdW5kLnN0eWxlLm9wYWNpdHkgPSBcIjFcIlxuICAgICAgc2FuZGJveC5lZGl0b3IudXBkYXRlT3B0aW9ucyh7IHJlYWRPbmx5OiBmYWxzZSB9KVxuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcy5qc29uKClcbiAgICAgIGlmIChcImVycm9yXCIgaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHVpLmZsYXNoSW5mbyhgRXJyb3Igd2l0aCBnZXR0aW5nIHlvdXIgZ2lzdDogJHtyZXNwb25zZS5kaXNwbGF5fS5gLCAzMDAwKVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgQVBJIHJlc3BvbnNlIGlzIGEgc2luZ2xlIGNvZGUgZmlsZSwganVzdCB0aHJvdyB0aGF0IGluXG4gICAgICBpZiAocmVzcG9uc2UudHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICAgICAgc2FuZGJveC5zZXRUZXh0KHJlc3BvbnNlLmNvZGUpXG4gICAgICAgIHNhbmRib3guc2V0Q29tcGlsZXJTZXR0aW5ncyhyZXNwb25zZS5wYXJhbXMpXG5cbiAgICAgICAgLy8gSWYgaXQncyBtdWx0aS1maWxlLCB0aGVuIHRoZXJlJ3Mgd29yayB0byBkb1xuICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS50eXBlID09PSBcInN0b3J5XCIpIHtcbiAgICAgICAgc2hvd05hdigpXG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGAjZ2lzdC8ke2dpc3RJRH1gXG4gICAgICAgIHVwZGF0ZU5hdldpdGhTdG9yeUNvbnRlbnQocmVzcG9uc2UudGl0bGUsIHJlc3BvbnNlLmZpbGVzLCBwcmVmaXgsIHNhbmRib3gpXG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgdWkuZmxhc2hJbmZvKFwiQ291bGQgbm90IHJlYWNoIHRoZSBnaXN0IHRvIHBsYXlncm91bmQgQVBJLCBhcmUgeW91IChvciBpdCkgb2ZmbGluZT9cIilcbiAgICAgIHBsYXlncm91bmQuc3R5bGUub3BhY2l0eSA9IFwiMVwiXG4gICAgICBzYW5kYm94LmVkaXRvci51cGRhdGVPcHRpb25zKHsgcmVhZE9ubHk6IGZhbHNlIH0pXG4gICAgfSlcbn1cblxuLyoqIFVzZSB0aGUgaGFuZGJvb2sgVE9DIHdoaWNoIGlzIGluamVjdGVkIGludG8gdGhlIGdsb2JhbHMgdG8gY3JlYXRlIGEgc2lkZWJhciAgKi9cbmV4cG9ydCBjb25zdCBzaG93TmF2Rm9ySGFuZGJvb2sgPSAoc2FuZGJveDogU2FuZGJveCwgZXNjYXBlRnVuY3Rpb246ICgpID0+IHZvaWQpID0+IHtcbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdCBjb250ZW50ID0gd2luZG93LnBsYXlncm91bmRIYW5kYm9va1RPQy5kb2NzXG5cbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICBidXR0b24uYXJpYUxhYmVsID0gXCJDbG9zZSBoYW5kYm9va1wiXG4gIGJ1dHRvbi5jbGFzc05hbWUgPSBcImV4YW1wbGVzLWNsb3NlXCJcbiAgYnV0dG9uLmlubmVyVGV4dCA9IFwiQ2xvc2VcIlxuICBidXR0b24ub25jbGljayA9IGVzY2FwZUZ1bmN0aW9uXG5cbiAgY29uc3Qgc3RvcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvci1jb250YWluZXJcIilcbiAgc3Rvcnk/LmFwcGVuZENoaWxkKGJ1dHRvbilcbiAgdXBkYXRlTmF2V2l0aFN0b3J5Q29udGVudChcIkhhbmRib29rXCIsIGNvbnRlbnQsIFwiI2hhbmRib29rXCIsIHNhbmRib3gpXG5cbiAgY29uc3QgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYXZpZ2F0aW9uLWNvbnRhaW5lclwiKVxuICBpZiAobmF2KSBuYXYuY2xhc3NMaXN0LmFkZChcImhhbmRib29rXCIpXG59XG5cbi8qKiBcbiAqIEhpZGVzIHRoZSBuYXYgYW5kIHRoZSBjbG9zZSBidXR0b24sIHNwZWNpZmljYWxseSBvbmx5IHdoZW4gd2UgaGF2ZVxuICogdGhlIGhhbmRib29rIG9wZW4gYW5kIG5vdCB3aGVuIGEgZ2lzdCBpcyBvcGVuXG4gKi9cbmV4cG9ydCBjb25zdCBoaWRlTmF2Rm9ySGFuZGJvb2sgPSAoc2FuZGJveDogU2FuZGJveCkgPT4ge1xuICBjb25zdCBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdmlnYXRpb24tY29udGFpbmVyXCIpXG4gIGlmICghbmF2KSByZXR1cm5cbiAgaWYgKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGFuZGJvb2tcIikpIHJldHVyblxuXG4gIHNob3dDb2RlKHNhbmRib3gpXG4gIG5hdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcblxuICBjb25zdCBsZWZ0RHJhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWdyb3VuZC1kcmFnYmFyLmxlZnRcIikgYXMgSFRNTEVsZW1lbnRcbiAgaWYgKGxlZnREcmFnKSBsZWZ0RHJhZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcblxuICBjb25zdCBzdG9yeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yLWNvbnRhaW5lclwiKVxuICBjb25zdCBwb3NzaWJsZUJ1dHRvblRvUmVtb3ZlID0gc3Rvcnk/LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIilcbiAgaWYgKHN0b3J5ICYmIHBvc3NpYmxlQnV0dG9uVG9SZW1vdmUpIHN0b3J5LnJlbW92ZUNoaWxkKHBvc3NpYmxlQnV0dG9uVG9SZW1vdmUpXG59XG5cbi8qKiBcbiAqIEFzc3VtZXMgYSBuYXYgaGFzIGJlZW4gc2V0IHVwIGFscmVhZHksIGFuZCB0aGVuIGZpbGxzIG91dCB0aGUgY29udGVudCBvZiB0aGUgbmF2IGJhclxuICogd2l0aCBjbGlja2FibGUgbGlua3MgZm9yIGVhY2ggcG90ZW50aWFsIHN0b3J5LlxuICovXG5jb25zdCB1cGRhdGVOYXZXaXRoU3RvcnlDb250ZW50ID0gKHRpdGxlOiBzdHJpbmcsIHN0b3J5Q29udGVudDogU3RvcnlDb250ZW50W10sIHByZWZpeDogc3RyaW5nLCBzYW5kYm94OiBTYW5kYm94KSA9PiB7XG4gIGNvbnN0IG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2aWdhdGlvbi1jb250YWluZXJcIilcbiAgaWYgKCFuYXYpIHJldHVyblxuXG4gIHdoaWxlIChuYXYuZmlyc3RDaGlsZCkge1xuICAgIG5hdi5yZW1vdmVDaGlsZChuYXYuZmlyc3RDaGlsZClcbiAgfVxuXG4gIGNvbnN0IHRpdGxlaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIilcbiAgdGl0bGVoNC50ZXh0Q29udGVudCA9IHRpdGxlXG4gIG5hdi5hcHBlbmRDaGlsZCh0aXRsZWg0KVxuXG4gIC8vIE1ha2UgYWxsIHRoZSBzaWRlYmFyIGVsZW1lbnRzXG4gIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpXG4gIHN0b3J5Q29udGVudC5mb3JFYWNoKChlbGVtZW50OiBTdG9yeUNvbnRlbnQsIGk6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcbiAgICAgIGNhc2UgXCJodG1sXCI6XG4gICAgICBjYXNlIFwiaHJlZlwiOlxuICAgICAgY2FzZSBcImNvZGVcIjoge1xuICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0YWJsZVwiKVxuICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcblxuICAgICAgICBsZXQgbG9nbzogc3RyaW5nXG4gICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgICAgICAgbG9nbyA9IGA8c3ZnIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIiB2aWV3Qm94PVwiMCAwIDcgN1wiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxyZWN0IHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIiBmaWxsPVwiIzE4N0FCRlwiLz48L3N2Zz5gXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgICAgIGxvZ28gPSBgPHN2ZyB3aWR0aD1cIjlcIiBoZWlnaHQ9XCIxMVwiIHZpZXdCb3g9XCIwIDAgOSAxMVwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNOCA1LjVWMy4yNUw2IDFINE04IDUuNVYxMEgxVjFINE04IDUuNUg0VjFcIiBzdHJva2U9XCIjQzRDNEM0XCIvPjwvc3ZnPmBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dvID0gXCJcIlxuICAgICAgICB9XG5cbiAgICAgICAgYS5pbm5lckhUTUwgPSBgJHtsb2dvfSR7ZWxlbWVudC50aXRsZX1gXG4gICAgICAgIGEuaHJlZiA9IGAvcGxheSMke3ByZWZpeH0tJHtpfWBcblxuICAgICAgICBhLm9uY2xpY2sgPSBlID0+IHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgIC8vIE5vdGU6IEknbSBub3Qgc3VyZSB3aHkgdGhpcyBpcyBuZWVkZWQ/XG4gICAgICAgICAgY29uc3QgZWQgPSBzYW5kYm94LmVkaXRvci5nZXREb21Ob2RlKClcbiAgICAgICAgICBpZiAoIWVkKSByZXR1cm5cbiAgICAgICAgICBzYW5kYm94LmVkaXRvci51cGRhdGVPcHRpb25zKHsgcmVhZE9ubHk6IGZhbHNlIH0pXG5cbiAgICAgICAgICBjb25zdCBhbHJlYWR5U2VsZWN0ZWQgPSB1bC5xdWVyeVNlbGVjdG9yKFwiLnNlbGVjdGVkXCIpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgaWYgKGFscmVhZHlTZWxlY3RlZCkgYWxyZWFkeVNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKVxuXG4gICAgICAgICAgbGkuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpXG4gICAgICAgICAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjb2RlXCI6XG4gICAgICAgICAgICAgIHNldENvZGUoZWxlbWVudC5jb2RlLCBzYW5kYm94KVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJodG1sXCI6XG4gICAgICAgICAgICAgIHNldFN0b3J5KGVsZW1lbnQuaHRtbCwgc2FuZGJveClcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiaHJlZlwiOlxuICAgICAgICAgICAgICBzZXRTdG9yeVZpYUhyZWYoZWxlbWVudC5ocmVmLCBzYW5kYm94KVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTZXQgdGhlIFVSTCBhZnRlciBzZWxlY3RpbmdcbiAgICAgICAgICBjb25zdCBhbHdheXNVcGRhdGVVUkwgPSAhbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkaXNhYmxlLXNhdmUtb24tdHlwZVwiKVxuICAgICAgICAgIGlmIChhbHdheXNVcGRhdGVVUkwpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBgJHtwcmVmaXh9LSR7aX1gXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGxpLmFwcGVuZENoaWxkKGEpXG5cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJoclwiOiB7XG4gICAgICAgIGNvbnN0IGhyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKGhyKVxuICAgICAgfVxuICAgIH1cbiAgICB1bC5hcHBlbmRDaGlsZChsaSlcbiAgfSlcbiAgbmF2LmFwcGVuZENoaWxkKHVsKVxuXG4gIGNvbnN0IHBhZ2VJRCA9IGxvY2F0aW9uLmhhc2guc3BsaXQoXCItXCIpWzFdIHx8IFwiXCJcbiAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFnZUlEKSB8fCAwXG5cbiAgY29uc3QgdGFyZ2V0ZWRMaSA9IHVsLmNoaWxkcmVuLml0ZW0oaW5kZXgpIHx8IHVsLmNoaWxkcmVuLml0ZW0oMClcbiAgaWYgKHRhcmdldGVkTGkpIHtcbiAgICBjb25zdCBhID0gdGFyZ2V0ZWRMaS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIikuaXRlbSgwKVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoYSkgYS5jbGljaygpXG4gIH1cbn1cblxuLy8gVXNlIGZldGNoIHRvIGdyYWIgdGhlIEhUTUwgZnJvbSBhIFVSTCwgd2l0aCBhIHNwZWNpYWwgY2FzZSBcbi8vIHdoZW4gdGhhdCBpcyBhIGdhdHNieSBVUkwgd2hlcmUgd2UgcHVsbCBvdXQgdGhlIGltcG9ydGFudFxuLy8gSFRNTCBmcm9tIGluc2lkZSB0aGUgX19nYXRzYnkgaWQuXG5jb25zdCBzZXRTdG9yeVZpYUhyZWYgPSAoaHJlZjogc3RyaW5nLCBzYW5kYm94OiBTYW5kYm94KSA9PiB7XG4gIGZldGNoKGhyZWYpLnRoZW4oYXN5bmMgcmVxID0+IHtcbiAgICBpZiAocmVxLm9rKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVxLnRleHQoKVxuXG4gICAgICBpZiAodGV4dC5pbmNsdWRlcyhcIl9fX2dhdHNieVwiKSkge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGV4dCwgXCJ0ZXh0L2h0bWxcIik7XG5cbiAgICAgICAgY29uc3QgZ2F0c2J5ID0gZG9jLmdldEVsZW1lbnRCeUlkKCdfX19nYXRzYnknKVxuICAgICAgICBpZiAoZ2F0c2J5KSB7XG4gICAgICAgICAgZ2F0c2J5LmlkID0gXCJfX19pbm5lcl9nXCJcbiAgICAgICAgICBzZXRTdG9yeShnYXRzYnksIHNhbmRib3gpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5ob3N0ID09PSBcImxvY2FsaG9zdDo4MDAwXCIpIHtcbiAgICAgICAgc2V0U3RvcnkoXCI8cD5CZWNhdXNlIHRoZSBnYXRzYnkgZGV2IHNlcnZlciB1c2VzIEpTIHRvIGJ1aWxkIHlvdXIgcGFnZXMsIGFuZCBub3Qgc3RhdGljYWxseSwgdGhlIHBhZ2Ugd2lsbCBub3QgbG9hZCBkdXJpbmcgZGV2LiBJdCBkb2VzIHdvcmsgaW4gcHJvZCB0aG91Z2ggLSB1c2UgPGNvZGU+eWFybiBidWlsZC1zaXRlPC9jb2RlPiB0byB0ZXN0IGxvY2FsbHkgd2l0aCBhIHN0YXRpYyBidWlsZC48L3A+XCIsIHNhbmRib3gpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRTdG9yeSh0ZXh0LCBzYW5kYm94KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZXRTdG9yeShgPHA+RmFpbGVkIHRvIGxvYWQgdGhlIGNvbnRlbnQgYXQgJHtocmVmfS4gUmVhc29uOiAke3JlcS5zdGF0dXN9ICR7cmVxLnN0YXR1c1RleHR9PC9wPmAsIHNhbmRib3gpXG4gICAgfVxuICB9KVxufVxuXG4vKiogXG4gKiBQYXNzaW5nIGluIGVpdGhlciBhIHJvb3QgSFRNTCBlbGVtZW50IG9yIHRoZSBIVE1MIGZvciB0aGUgc3RvcnksIHByZXNlbnQgYSBcbiAqIG1hcmtkb3duIGRvYyBhcyBhICdzdG9yeScgaW5zaWRlIHRoZSBwbGF5Z3JvdW5kLlxuICovXG5jb25zdCBzZXRTdG9yeSA9IChodG1sOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgc2FuZGJveDogU2FuZGJveCkgPT4ge1xuICBjb25zdCB0b29sYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3ItdG9vbGJhclwiKVxuICBpZiAodG9vbGJhcikgdG9vbGJhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcblxuICBjb25zdCBtb25hY28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vbmFjby1lZGl0b3ItZW1iZWRcIilcbiAgaWYgKG1vbmFjbykgbW9uYWNvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuXG4gIGNvbnN0IHN0b3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9yeS1jb250YWluZXJcIilcbiAgaWYgKCFzdG9yeSkgcmV0dXJuXG5cbiAgc3Rvcnkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICBpZiAodHlwZW9mIGh0bWwgPT09IFwic3RyaW5nXCIpIHtcbiAgICBzdG9yeS5pbm5lckhUTUwgPSBodG1sXG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0b3J5LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0b3J5LnJlbW92ZUNoaWxkKHN0b3J5LmZpcnN0Q2hpbGQpXG4gICAgfVxuICAgIHN0b3J5LmFwcGVuZENoaWxkKGh0bWwpXG4gIH1cblxuICAvLyBXZSBuZWVkIHRvIGhpamFjayBpbnRlcm5hbCBsaW5rc1xuICBmb3IgKGNvbnN0IGEgb2YgQXJyYXkuZnJvbShzdG9yeS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIikpKSB7XG4gICAgaWYgKCFhLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvcGxheVwiKSkgY29udGludWVcbiAgICAvLyBOb3RlIHRoZSB0aGUgaGVhZGVyIGdlbmVyYXRlZCBsaW5rcyBhbHNvIGNvdW50IGluIGhlcmVcblxuICAgIC8vIG92ZXJ3cml0ZSBwbGF5Z3JvdW5kIGxpbmtzXG4gICAgaWYgKGEuaGFzaC5pbmNsdWRlcyhcIiNjb2RlL1wiKSkge1xuICAgICAgYS5vbmNsaWNrID0gZSA9PiB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBhLmhhc2gucmVwbGFjZShcIiNjb2RlL1wiLCBcIlwiKS50cmltKClcbiAgICAgICAgbGV0IHVzZXJDb2RlID0gc2FuZGJveC5senN0cmluZy5kZWNvbXByZXNzRnJvbUVuY29kZWRVUklDb21wb25lbnQoY29kZSlcbiAgICAgICAgLy8gRmFsbGJhY2sgaW5jYXNlIHRoZXJlIGlzIGFuIGV4dHJhIGxldmVsIG9mIGRlY29kaW5nOlxuICAgICAgICAvLyBodHRwczovL2dpdHRlci5pbS9NaWNyb3NvZnQvVHlwZVNjcmlwdD9hdD01ZGM0NzhhYjljMzk4MjE1MDlmZjE4OWFcbiAgICAgICAgaWYgKCF1c2VyQ29kZSkgdXNlckNvZGUgPSBzYW5kYm94Lmx6c3RyaW5nLmRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQoY29kZSkpXG4gICAgICAgIGlmICh1c2VyQ29kZSkgc2V0Q29kZSh1c2VyQ29kZSwgc2FuZGJveClcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBjb25zdCBhbHJlYWR5U2VsZWN0ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdmlnYXRpb24tY29udGFpbmVyXCIpIS5xdWVyeVNlbGVjdG9yKFwibGkuc2VsZWN0ZWRcIikgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgaWYgKGFscmVhZHlTZWxlY3RlZCkgYWxyZWFkeVNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBvdmVyd3JpdGUgZ2lzdC9oYW5kYm9vayBsaW5rc1xuICAgIGVsc2UgaWYgKGEuaGFzaC5pbmNsdWRlcyhcIiNnaXN0L1wiKSB8fCBhLmhhc2guaW5jbHVkZXMoXCIjaGFuZGJvb2tcIikpIHtcbiAgICAgIGEub25jbGljayA9IGUgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihhLmhhc2guc3BsaXQoXCItXCIpWzFdKVxuICAgICAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdmlnYXRpb24tY29udGFpbmVyXCIpXG4gICAgICAgIGlmICghbmF2KSByZXR1cm5cbiAgICAgICAgY29uc3QgdWwgPSBuYXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1bFwiKS5pdGVtKDApIVxuXG4gICAgICAgIGNvbnN0IHRhcmdldGVkTGkgPSB1bC5jaGlsZHJlbi5pdGVtKE51bWJlcihpbmRleCkgfHwgMCkgfHwgdWwuY2hpbGRyZW4uaXRlbSgwKVxuICAgICAgICBpZiAodGFyZ2V0ZWRMaSkge1xuICAgICAgICAgIGNvbnN0IGEgPSB0YXJnZXRlZExpLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKS5pdGVtKDApXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGlmIChhKSBhLmNsaWNrKClcbiAgICAgICAgfVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGEuc2V0QXR0cmlidXRlKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNob3dDb2RlID0gKHNhbmRib3g6IFNhbmRib3gpID0+IHtcbiAgY29uc3Qgc3RvcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3J5LWNvbnRhaW5lclwiKVxuICBpZiAoc3RvcnkpIHN0b3J5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuXG4gIGNvbnN0IHRvb2xiYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvci10b29sYmFyXCIpXG4gIGlmICh0b29sYmFyKSB0b29sYmFyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcblxuICBjb25zdCBtb25hY28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vbmFjby1lZGl0b3ItZW1iZWRcIilcbiAgaWYgKG1vbmFjbykgbW9uYWNvLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcblxuICBzYW5kYm94LmVkaXRvci5sYXlvdXQoKVxufVxuXG5jb25zdCBzZXRDb2RlID0gKGNvZGU6IHN0cmluZywgc2FuZGJveDogU2FuZGJveCkgPT4ge1xuICBzYW5kYm94LnNldFRleHQoY29kZSlcbiAgc2hvd0NvZGUoc2FuZGJveClcbn0iXX0=