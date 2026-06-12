import Snow from 'expo-snowui'
import C from '../../common'
const snowuiPackageInfo = require('expo-snowui/package.json')

export default function LibraryListPage(props) {
    const { navPush } = Snow.useSnowContext()
    const { config, routes } = C.useAppContext()

    let readerDebug = <Snow.TextButton title='Debug' onPress={navPush({
        path: routes.bookRead,
        params: {
            bookId: 9332
        }
    })} />

    readerDebug = null

    return (
        <Snow.View {...props}>
            <Snow.Grid focusStart itemsPerRow={3}>
                {readerDebug}
                {C.isTV ? null : <Snow.TextButton title='Downloads' onPress={navPush({ path: routes.downloadList })} />}
                {C.isTV ? null : <Snow.TextButton title='Library' onPress={navPush({ path: routes.libraryList })} />}
                <Snow.TextButton title='Series' onPress={navPush({ path: routes.seriesList })} />
                <Snow.TextButton title='Favorites' onPress={navPush({ path: routes.favoriteList })} />
                {C.isTV ? null : <Snow.TextButton title='Author' onPress={navPush({ path: routes.authorList })} />}
                <Snow.TextButton title='Title' onPress={navPush({ path: routes.titleList })} />
                <Snow.TextButton title='Search' onPress={navPush({ path: routes.search })} />
                {C.isTV ? null : <Snow.TextButton title='Options' onPress={navPush({ path: routes.options })} />}

            </Snow.Grid>
            <C.View>
                <Snow.Text style={{
                    position: 'absolute',
                    right: 30,
                    bottom: -250
                }}>{`[built ${config.clientBuildDate}] [snowtome v${config.clientVersion}] [snowui v${snowuiPackageInfo.version}]`}</Snow.Text>
            </C.View>
        </Snow.View>
    )
}
