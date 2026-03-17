import { requireNativeModule, EventEmitter } from 'expo-modules-core'

const SafHelper = requireNativeModule('SafHelper')
const emitter = new EventEmitter(SafHelper)

export function downloadToSaf(
    remoteUrl: string,
    destContentUri: string,
    headers: Record<string, string>,
    onProgress?: (progress: number) => void
): Promise<void> {
    const sub = onProgress
        ? emitter.addListener('onProgress', (e: { progress: number }) => onProgress(e.progress))
        : null
    return SafHelper.downloadToSaf(remoteUrl, destContentUri, headers).finally(() => {
        sub?.remove()
    })
}