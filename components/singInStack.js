import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Image, TextInput, Alert } from "react-native";
import { Dimensions } from "react-native";
import { useEffect, useState } from "react";
import axiosConfig from "../staticVar.js/axiosConfig";


const  {width, height} = Dimensions.get("window")
export default function SingInStack({navigation}){
    const [userInput, setUserInput] = useState({username:"",password:""})

    useEffect(()=>{
        console.log(userInput)
    },[userInput])

    async function login() {
        try {
            const {data} = await axiosConfig.post("/user/login", {username:userInput.username, password: userInput.password})
            if(userInput.username == "admin" && userInput.password == "admin@123"){
                navigation.reset({
                    index:0,
                    routes:[{'name':'adminTab'}]
                    // routes:[{'name':'adminStack', params:{userData: {}}}]
                })
                return
            }
            if(data.success){
                Alert.alert("Success", "logged in")
                navigation.navigate("userMainStack", {...data})
            }else{
                Alert.alert("Invalid", "Invalid username and password")
            }
        } catch (error) {
            Alert.alert("Error on login", `${error}`)
        }
        
    }
    return(
        <View stylre={styles.container}>
        <ImageBackground style={{position: 'absolute',width:width, height:height}} source={require("./../assets/admin/Background2.png")} resizeMode="stretch">
            <View style={{height:"8%",width:"100%", position:'absolute', backgroundColor:'#2ec351', display:'flex', flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity style={{padding:10}}>
                <Image  source={require("./../assets/arrow_left_back_icon_221067.png")} style={{width:20,height:25, marginLeft:10}}/>
                </TouchableOpacity>
                <Text style={{fontSize:17, fontWeight:'bold', color:'white', marginLeft:20}}>BasuraMans</Text>
            </View>
           <View style={styles.signInBox}>
                <Text style={styles.headerText}>Sign In</Text>
                <View style={styles.inputBox}>
                      <Image  source={require("./../assets/user.png")} style={{width:23,height:23, marginLeft:10}}/>
                      <TextInput style={styles.input} placeholder="username" onChangeText={(e)=> setUserInput(prev=>({...prev, username:e}))}/>
                </View>
                <View style={styles.inputBox}>
                      <Image  source={require("./../assets/forgot-password.png")} style={{width:23,height:23, marginLeft:10}}/>
                      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(e)=> setUserInput(prev=>({...prev, password:e}))}/>
                </View>
                <TouchableOpacity style={styles.sBtn} onPress={login}>
                    <Text style={styles.sBtnTxt}>Log In</Text>
                </TouchableOpacity>
           </View>
        </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:width,
       height:height,
    },
    signInBox:{
        position:'static',
        width:'81%',
        height:height*0.45,
        backgroundColor:'white',
        alignSelf:"center",
        top:height*0.27,
        borderRadius:10,
        padding:20
    },
    headerText:{
        fontSize:15,
        fontFamily:'poppinsBold',
        textAlign:'center',
        marginBottom:20
    },
    inputBox:{
        display:'flex',
        flexDirection:'row',
        // borderColor:'red',
        // borderWidth:1,
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#dddada',
        marginBottom:20
    },
    input:{
        // borderColor:"red",
        // borderWidth:1,
        width:"85%",
        padding:14,
        fontSize:15
    },
    sBtn:{
        backgroundColor:'#5cc165',
        padding:15,
        borderRadius:10
    },
    sBtnTxt:{
        fontSize:15,
        color:'white',
       
        textAlign:'center'
    }
})