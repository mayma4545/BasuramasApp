import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import { Dimensions } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { size } from "lodash";
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axiosConfig from "../staticVar.js/axiosConfig";
import DriverHomePage from "./DriverTab/driverHomePage";
import DriverRoutePage from "./DriverTab/DriverRoutePage";
import DriverLogout from "./DriverTab/driverLogout";

const  {width, height} = Dimensions.get("window")
const Tab = createBottomTabNavigator();
const userInfo = {
  id:100,
  fullname: 'Jasper Angeles Fernandez',
  address: 'Brgy. Silangan Sanfernando masbate',
  contactNumber: '09197960151'
}
export default function DriverPageTab({route, navigation}){
  const users = route.params
 
    return(
        <NavigationContainer  independent={true} >
        <Tab.Navigator   initialRouteName="Home"
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'Message') {
                iconName = focused ? 'mail' : 'mail-outline';
              } else if (route.name === 'Route') {
                iconName = focused ? 'location' : 'location-outline';
              } else if (route.name === 'Logout') {
                iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-vertical';
              }
  
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={30} color={"white"} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle:{fontSize:12, color:'white'},
            tabBarItemStyle:{marginBottom:5},
            tabBarStyle:{height:height*0.085, backgroundColor:'#299986ff', padding:10, borderColor:'#3d3b3b', borderTopWidth:1},
            headerStyle:{backgroundColor:'#299986ff'},
            headerTitleStyle:{color:"white"},
            tabBarShowLabel:true,
            
          })}
        >    
          <Tab.Screen  name="Home" component={DriverHomePage} initialParams={users}/>
          <Tab.Screen  name="Route" component={DriverRoutePage} initialParams={users}/>
          <Tab.Screen  name="Logout" component={DriverLogout} initialParams={navigation}/>
        </Tab.Navigator>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
       
    },
  
})