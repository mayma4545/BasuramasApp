import { useEffect } from "react"
import { View,StyleSheet, ImageBackground, Alert } from "react-native"


export default function LoadStack({navigation}){
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate("getStartedStack")
        },2000)
    },[])
    return(
        <View style={styles.container}>
            <ImageBackground style={{flex:1}} source={require("./../assets/backmo.jpg")}></ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})