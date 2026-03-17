import { requireNativeModule } from 'expo-modules-core'

const SafCopy = requireNativeModule('SafCopy')

export function copyToSaf(sourceUri: string, destContentUri: string): Promise<void> {
    return SafCopy.copyToSaf(sourceUri, destContentUri)
}