import { Platform } from 'react-native'

export const readApiCache = async (key, apiCall) => {
    if (Platform.OS === 'web') {
        return new Promise(resolve => {
            return apiCall().then((data) => {
                return resolve(data)
            })
        })

    }
    return new Promise(async resolve => {
        try {
            const FileSystem = await import('expo-file-system');
            const FileSystemLegacy = await import('expo-file-system/legacy');
            const CACHE_DIR_PATH = `${FileSystemLegacy.cacheDirectory}api_cache`;
            const TTL_MS = 24 * 60 * 60 * 1000;
            const now = Date.now();
            const cacheDir = new FileSystem.Directory(CACHE_DIR_PATH);
            const targetFile = new FileSystem.File(cacheDir, `${key}.json`)
            if (!cacheDir.exists) {
                cacheDir.create()
            }

            if (targetFile.exists) {
                const isFresh = (now - targetFile.modificationTime) < TTL_MS

                if (isFresh) {
                    const content = targetFile.readAsString()
                    return resolve(JSON.parse(content))
                }
            }

            return apiCall().then(data => {
                if (data) {
                    targetFile.write(JSON.stringify(data))
                }
                return resolve(data)
            })

        } catch (error) {
            return apiCall().then(data => {
                return resolve(data)
            })
        }
    }).catch(err => {
        console.log({ err })
    })
}

export default {
    readApiCache
}