import { View, Text, StyleSheet, ImageBackground } from "react-native"
import { useState } from "react"

export default function DriverHomePage(){

    return(
        <View style={{flex:1}}>
            <ImageBackground source={require("./../../assets/admin/Background.png")} style={{position:'absolute', width:'100%', height:'100%'}}></ImageBackground>
        </View>
    )
}