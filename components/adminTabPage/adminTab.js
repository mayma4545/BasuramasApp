import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { size } from "lodash";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminHome from "./adminHome";
import AdminMessage from "./adminMessage";
import AdminMoreTab from "./adminMoreTab";
import AdminRoute from "./adminRoute";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axiosConfig from "../../staticVar.js/axiosConfig";

const  {width, height} = Dimensions.get("window")
const Tab = createBottomTabNavigator();
export default function AdminTab({navigation}){
  //hooks
  const [userss, setUsers] = useState([])
  const [message, setMessage] = useState([])
  const [count, setCount] = useState(0)

    async function storeData(key, value) {
      try {
        await AsyncStorage.setItem(key, value)
      } catch (error) {
        console.log(`Error on storing Data on async Storage: ${error}`)
      }
    }

    
  async function getMessage() {
    try {
        const {data} = await axiosConfig.get(`/message/isRead?to=admin`)
        const a = await JSON.stringify(data.data)
        storeData("msg", a)
        setCount(e=>(data.count))

    } catch (error) {
        // Alert.alert("Error on Get message", `${error.message}`)
        console.log(error)
    }

}
useEffect(()=>{
  let intervalId = setInterval(()=>{
    getMessage()
    console.log(intervalId)
  },1000)
  storeData("intervalKey",JSON.stringify(intervalId))
  return ()=> clearInterval(intervalId)
},[])
    return(
        <NavigationContainer  independent={true} >
        <Tab.Navigator   initialRouteName="Home"
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Dashboard') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'message') {
                iconName = focused ? 'mail' : 'mail-outline';
              } else if (route.name === 'Route') {
                iconName = focused ? 'location' : 'location-outline';
              } else if (route.name === 'More') {
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
        
          <Tab.Screen name="Dashboard" component={AdminHome} />
          <Tab.Screen name="message" component={AdminMessage} options={{tabBarBadge:count < 1 ? null : count}}/>
          <Tab.Screen name="Route" component={AdminRoute} />
          <Tab.Screen name="More" component={AdminMoreTab} initialParams={navigation}/>
         
        </Tab.Navigator>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
       
    },
  
})