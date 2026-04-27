import Snow from 'expo-snowui'
import TextListPage from './template/text-list-page'

export default function SeriesListPage(props) {
    return (
        <Snow.View {...props}>
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
        </Snow.View>
    )
}
