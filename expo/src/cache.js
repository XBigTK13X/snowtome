import { Directory, File } from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';

const CACHE_DIR_PATH = `${FileSystemLegacy.cacheDirectory}api_cache`;
const TTL_MS = 24 * 60 * 60 * 1000;

export const readApiCache = (key, apiCall) => {
    console.log("Reading cache")
    return new Promise(resolve => {
        console.log("New api call")
        const cacheDir = new Directory(CACHE_DIR_PATH);
        console.log(CACHE_DIR_PATH)
        const targetFile = new File(cacheDir, `${key}.json`)
        console.log(`${key}.json`)
        try {
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