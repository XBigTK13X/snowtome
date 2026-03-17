class Config {
    constructor() {
        this.clientVersion = "1.2.2"
        this.clientBuildDate = "March 17, 2026"
        this.clientDevBuildNumber = 1
        this.debugSnowUi = false
    }
}

export const config = new Config()


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning