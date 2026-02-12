import C from '../../common'

import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Directory, File } from 'expo-file-system';

const downloadFile = async (remoteUrl, token, fileName) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/octet-stream',
    };

    if (Platform.OS === 'web') {
        try {
            const response = await fetch(remoteUrl, { headers });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Web Download Error:", error);
        }
        return;
    }

    try {
        const publicDir = await Directory.pickDirectoryAsync();
        if (!publicDir) return;

        const newFile = publicDir.createFile(fileName);

        await File.downloadFileAsync(remoteUrl, newFile, { headers });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(newFile.uri);
        }
    } catch (error) {
        console.error("Android Download Error:", error);
    }
};

export default function BookDetailsPage() {
    const { bookloreClient } = C.useAppContext()
    const { currentRoute } = C.useSnowContext()

    const [bookInfo, setBookInfo] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookDetails(currentRoute.routeParams.bookId).then((response) => {
            setBookInfo(response)
        })
    }, [])

    const downloadBook = () => {
        let pathParts = bookInfo.filePath.split('.')
        const fileName = `${bookInfo.metadata.title}.${pathParts.at(-1)}`
        bookloreClient.getBookContentUrl(currentRoute.routeParams.bookId)
            .then(response => {
                downloadFile(response.downloadUrl, response.authToken, fileName)
            })
    }

    const toggleRead = () => {

    }

    if (!bookInfo) {
        return <C.SnowText>Loading book details</C.SnowText>
    }

    const thumbnail = bookloreClient.getBookThumbnail(bookInfo.id)

    return (
        <>
            <C.SnowText>Title: {bookInfo.metadata.title}</C.SnowText>
            <C.Image imageSource={thumbnail} />
            <C.SnowGrid>
                <C.SnowTextButton title="Download" onPress={downloadBook} />
                <C.SnowTextButton title="Mark Read" onPress={toggleRead} />
            </C.SnowGrid>
        </>
    )

}
