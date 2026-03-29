class Config {
    constructor() {
        this.clientVersion = "1.2.5"
        this.clientBuildDate = "March 29, 2026"
        this.clientDevBuildNumber = 1
        this.debugSnowUi = false
    }
}

export const config = new Config()


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning