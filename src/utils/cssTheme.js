export class CssTheme{
    constructor() {
        this.ThemeConfig = {
            Light:{
                local:'/src/styles/Theme/Light.css',
                remote:'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/themeStyle/Light.css'
            },
            Dark:{
                local:'/src/styles/Theme/Dark.css',
                remote:'https://blogs-macos.oss-cn-shenzhen.aliyuncs.com/themeStyle/Dark.css'
            }
        }
        //初始化
        console.log(process.env.NODE_ENV)
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
        let url = this.ThemeConfig[this.getThemeCSSName()][this.getNodeEnv()]; 
        let link = document.createElement('link');
        link.type = 'text/css';
        link.id = "theme-css-gf";
        link.rel = 'stylesheet';
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    getNodeEnv(){
        return process.env.NODE_ENV === 'development' ? 'local' : 'remote'
    }
    updateTheme(){
        let linkDom = document.getElementById("theme-css-gf");
        linkDom.href = this.ThemeConfig[this.getThemeCSSName()][this.getNodeEnv()];
    }
}
