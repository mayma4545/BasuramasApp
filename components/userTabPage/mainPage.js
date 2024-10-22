import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import {View, Text, StyleSheet, ImageBackground, Alert, ScrollView, Dimensions} from 'react-native'
import axiosConfig from '../../staticVar.js/axiosConfig'


const SchedComp = (props)=>{
    return(
        <View style={{width:'100%',backgroundColor:'white', height:height*0.09, borderRadius:10, padding:10, justifyContent:'space-between',display:'flex',  flexDirection:'row', alignItems:'center', marginBottom:10}}>
        <View style={{display:'flex', }}>
          <Text style={{fontSize:15, fontWeight:'bold'}}>Brgy. {props.place}</Text>
          <Text>{props.month} {props.day}, 2024, {props.time}</Text>
        </View>
        {/* <Text>Click here</Text> */}
      </View>
    )
}

const {width, height} = Dimensions.get("window")
export default function UserMainPageTab(){
    const [schedule, setSchedule] = useState([])
    useFocusEffect(
        useCallback(()=>{
            async function fetchSchedule(params) {
                try {
                    const {data} = await axiosConfig.get("/schedule")
                    console.log(data.schedules)
                    const newData = await data.schedules.filter(e=> e.isDone != true)
                    setSchedule(newData)
                } catch (error) {
                    Alert.alert("Error on fetching Schedule")
                }
            }
           
            setInterval(()=>{
                fetchSchedule()
            },3000)
        },[])
    )
    return(
        <View  style={styles.container}>
            <ImageBackground source={require("./../../assets/admin/Background2.png")} style={{position:'absolute', width:'100%', height:'100%', opacity:0.7}}></ImageBackground>
            <View style={{width:'95%', height:"20%", backgroundColor:'#217098', alignSelf:'center', marginTop:5, borderRadius:20, padding:15, justifyContent:'center'}}>
                <Text style={{color:'white', fontFamily:'poppinsBold', fontSize:15}}>Status:</Text>
                <Text style={{color:'white', fontFamily:'poppinsBold', fontSize:25, textAlign:'center'}}>{schedule.length > 0 ? "Truck is on the way!": "No Schedule"}</Text>
            </View>
            <View style={styles.schedContainer}>
                <Text style={{fontFamily:'poppinsBold', fontSize:17, textAlign:'center'}}>Schedules</Text>
                <ScrollView style={styles.schedules}>
                   {
                    schedule.length > 0 ? 
                    schedule.map((e, i)=>{
                        return(
                        <SchedComp month={e.month} time = {e.time} place ={e.place} day={e.day} key={i}/>
                        )
                    }): ""
                   }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ede4e4',

    },
    schedContainer:{
        width:'95%',
        height:"75%",
        backgroundColor:'#fbf7f700',
        alignSelf:'center',
        borderRadius:10,
        margin:'auto',
    
    },
    schedules:{
        flex:1,
        // borderWidth:1,
        // borderColor:'red',
    
    }
})

