class Config {
    constructor() {
        this.clientVersion = "1.3.9"
        this.clientBuildDate = "June 20, 2026"
        this.clientDevBuildNumber = 1
        this.debugSnowUi = false
    }
}

export const config = new Config()


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning