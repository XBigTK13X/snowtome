import { View, Text } from 'react-native'
import Style from '../snow-style'

const styles = {
    label: {
        fontSize: Style.fontSize.label,
        color: Style.color.text,
        marginTop: -20
    },
    center: {
        alignItems: 'center',
        width: '100%'
    }
}

export function SnowLabel(props) {
    if (props.center) {
        return (
            <View style={styles.center}>
                <Text style={styles.label} children={props.children} />
            </View>
        )
    }
    return <Text style={styles.label} children={props.children} />
}

export default SnowLabel