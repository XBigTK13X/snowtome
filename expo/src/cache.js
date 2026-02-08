import { Directory, File, Paths } from 'expo-file-system';

const CACHE_DIR_URI = `${Paths.cacheDirectory}/api_cache`;
const TTL_MS = 24 * 60 * 60 * 1000;

export const getSmartData = async (key, apiCall) => {

    const cacheDir = new Directory(CACHE_DIR_URI);
    const targetFile = new File(cacheDir, `${key}.json`);

    try {
        if (!cacheDir.exists) {
            cacheDir.create();
        }

        if (targetFile.exists) {
            const isFresh = (now - targetFile.modificationTime) < TTL_MS;

            if (isFresh) {
                const content = targetFile.readAsString();
                return JSON.parse(content);
            }
        }

        const data = await apiCall()

        if (data) {
            targetFile.write(JSON.stringify(data))
        }

        return data;

    } catch (error) {
        return apiCall()
    }
};