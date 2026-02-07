import C from '../../common'
export default function LibraryListPage() {
    const { navPush } = C.useSnowContext()
    const { routes } = C.useAppContext()

    return (
        <>
            <C.SnowGrid itemsPerRow={2}>
                <C.SnowTextButton title='Library' onPress={navPush({ path: routes.libraryList })} />
                <C.SnowTextButton title='Series' onPress={navPush({ path: routes.seriesList })} />
                <C.SnowTextButton title='Author' onPress={navPush({ path: routes.authorList })} />
                <C.SnowTextButton title='Title' onPress={navPush({ path: routes.titleList })} />
                <C.SnowTextButton title='Search' onPress={navPush({ path: routes.search })} />
            </C.SnowGrid>
        </>
    )
}
