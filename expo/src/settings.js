class Config {
    constructor() {
        this.clientVersion = "1.4.0"
        this.clientBuildDate = "July 06, 2026"
        this.clientDevBuildNumber = 1
        this.debugSnowUi = false
    }
}

export const config = new Config()


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning