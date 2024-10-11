import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from "react-native";
import { Dimensions } from "react-native";

const  {width, height} = Dimensions.get("window")
export default function GetStartedPage({navigation}){
    
    return(
        <View style={styles.container}>
        <ImageBackground style={{ flex:1}} source={require("./../assets/admin/get_started.png")}>
            <TouchableOpacity  style={styles.btn} onPress={()=>navigation.navigate("signInStack")}>
                <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>

        </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    btn:{
        top:height-120,
        backgroundColor:'#4cdd66',
        width:'90%',
        alignSelf:'center',
        padding:15,
        borderRadius:20
    },
    btnText:{
        fontSize:21,
        fontFamily:'poppinsBold',
        textAlign:'center',
        color:"white"
    }
})