import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import {mainColor} from './../staticVar.js/color'

const  {width, height} = Dimensions.get("window")
export default function UserOption({navigation}){
    return(
        <View style={styles.container}>
        <ImageBackground style={{ flex:1}} source={require("./../assets/admin/bg_options.png")}>
            <View style={styles.optionBox}>
                <Text style={{ fontSize:17, marginTop:10, marginBottom:10, fontFamily:'poppinsBold'}}>Welcome</Text>
                <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate("signInStack")}>
                    <Text style={styles.btntxt}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate("CreateAccountStack")}>
                    <Text style={styles.btntxt}>Sign up</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%"
       
    },
    optionBox:{
        position:'absolute',
        width:"90%",
        height:'25%',
        backgroundColor:'white',
        top:height-(height*0.68),
        alignSelf:'center',
        borderRadius:10,
        padding:15
    },
    btn:{
        width:'98%',
        padding:12,
        backgroundColor:'#41c258',
        alignSelf:'center',
        borderRadius:30,
        marginBottom:20
    },
    btntxt:{
        color:'white',
        marginLeft:20,
        fontWeight:'bold',
    }
  
})