import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messagePage from "./userTabPage/messagePage";
import { size } from "lodash";
import Ionicons from 'react-native-vector-icons/Ionicons';
import RouteTab from "./userTabPage/routeTab";
import MoreTab from "./userTabPage/moreTab";
import UserMainPageTab from "./userTabPage/mainPage";


const  {width, height} = Dimensions.get("window")
const Tab = createBottomTabNavigator();
const userInfo = {
  id:100,
  fullname: 'Jasper Angeles Fernandez',
  address: 'Brgy. Silangan Sanfernando masbate',
  contactNumber: '09197960151'
}
export default function UserMainPage({route, navigation}){
  const users = route.params
  console.log("User mooooo", users)
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
        
          <Tab.Screen name="Home" component={UserMainPageTab} initialParams={users} />
          <Tab.Screen  name="Message" component={messagePage} initialParams={users}/>
          <Tab.Screen name="Route" component={RouteTab} initialParams={users}/>
          <Tab.Screen name="More" component={MoreTab} initialParams={{users, navigation}} />
         
        </Tab.Navigator>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
       
    },
  
})