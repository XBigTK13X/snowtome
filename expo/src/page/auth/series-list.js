import TextListPage from './text-list-page'

export default function SeriesListPage() {
    return (
        <TextListPage
            title="Series"
            buttonRoute={(routes) => { return routes.seriesDetails }}
            routeParams={(item) => {
                return {
                    seriesName: item
                }
            }}
            loadData={(bookloreClient) => {
                return bookloreClient.getSeriesList()
            }}
        />
    )
}
