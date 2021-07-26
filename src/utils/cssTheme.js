export class CssTheme{
    constructor() {
        this.ThemeConfig = {
            'Light':'/src/styles/Theme/Light.css',
            'Dark':'/src/styles/Theme/Dark.css'
        }
        //初始化
        this.addLinkDom()
    }
    getThemeCSSName(){
        return localStorage.getItem('gf-css-theme') || 'Light'
    }
    setThemeCssName(themeName,isUpdate = true){
        themeName && localStorage.setItem('gf-css-theme',themeName);
        isUpdate && this.updateTheme()
    }
    addLinkDom(){
        let url = this.ThemeConfig[this.getThemeCSSName()];
        let link = document.createElement('link');
        link.type = 'text/css';
        link.id = "theme-css-gf";
        link.rel = 'stylesheet';
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    updateTheme(){
        let linkDom = document.getElementById("theme-css-gf");
        linkDom.href = this.ThemeConfig[this.getThemeCSSName()];
    }
}

