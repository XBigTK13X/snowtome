class Config {
    constructor() {
        this.clientVersion = "1.1.0"
        this.clientBuildDate = "September 09, 2025"
        this.clientDevBuildNumber = 1
        this.debugSnowUi = false
    }
}

export const config = new Config()


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning