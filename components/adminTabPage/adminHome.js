import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { Alert, FlatList, Modal, ScrollView, TouchableOpacity } from "react-native"
import { View,Text, StyleSheet, ImageBackground, Dimensions, Image } from "react-native"
import axiosConfig from "../../staticVar.js/axiosConfig"
import { TextInput } from "react-native"
import { SelectList } from "react-native-dropdown-select-list"



const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const masbateCityBarangays = [
    "Anas",
    "Asid",
    "B. Titong",
    "Bagumbayan",
    "Bantigue",
    "Bapor",
    "Batuhan",
    "Bayombon",
    "Bolo",
    "Bunducan",
    "Cagba",
    "Cangcayat",
    "Centro",
    "Espinosa",
    "Ibingay",
    "Kinamaligan",
    "Maingaran",
    "Malinta",
    "Mapiña",
    "Mayngaran",
    "Nursery",
    "Pating",
    "Pawa",
    "Pinamarbuhan",
    "Sinalongan",
    "Sinalongan Dacu",
    "Sinalongan Sadit",
    "Tugbo",
    "Ubongan Diot",
    "Usab"
  ];
  

const SchedCont = (props)=>{

    return(
        <View style={styles.sched}>
        <View style={{display:'flex', flexDirection:'row', padding:10, justifyContent:"space-between", alignItems:'center'}}>
            <View>
                <Text style={{fontSize:15, fontWeight:'bold'}}>Brgy. {props.data.place}</Text>
                <Text>{props.data.month} {props.data.day} - {props.data.time}</Text>
            </View>
           <TouchableOpacity onPress={props.exe}>
                <Text>Remove</Text>
           </TouchableOpacity>
        </View>
    </View>
    )
}

const {width, height} = Dimensions.get("window")
export default function AdminHome({navigation}){
    const [schedule, setSchedule] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [schedData, setSchedData] = useState({})
    const date = new Date().toDateString().split(" ")
    async function fetchSchedule(params) {
        try {
           console.log( months[new Date().getMonth()])
            const {data} = await axiosConfig.get("/schedule")
            console.log(data.schedules)
            const newData = await data.schedules.filter(e=> e.isDone != true )
            setSchedule(newData)
        } catch (error) {
            Alert.alert("Error on fetching Schedule", `${error}`)
        }
    }
    useFocusEffect(
        useCallback(()=>{
            fetchSchedule()
        },[])
    )
 async function addSched(){
    try {
        await axiosConfig.post("/schedule", {place:schedData.place ,month:schedData?.date && months[new Date().getMonth()], day:schedData.day, time:`${schedData.hour}:${schedData.min} ${schedData.dayTime}`})
        console.log("Done UPloading")
        Alert.alert("Success", "New Schedule Added!")
        fetchSchedule()
    } catch (error) {
        Alert.alert("Error on Server")
    }
 }
    return(
        <View style={{flex:1, backgroundColor:'black'}}>
            <Modal visible={addModal}>
                <View style={{flex:1}}>
                    <View style={{height:height*0.1, backgroundColor:'#3b7772', justifyContent:'center'}}>
                       
                        <Text style={{color:'white', textAlign:'center', fontFamily:'poppinsBold', fontSize:20}}>Add new schedule</Text>
                        <TouchableOpacity style={{position:'absolute', left:10}} onPress={()=>setAddModal(false)}>
                            <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")} />
                        </TouchableOpacity>
                    </View>
                    {/* INPUTS FIELD CONTAINER */}
                    <View style={{borderColor:'red', borderWidth:1, height:height*0.9, padding:10}}>
                        <View style={{display:'flex', alignItems:'flex-start', width:'90%', marginHorizontal:'auto',  marginBottom:10}}>
                            <Text style={{fontFamily:'poppinsBold', fontSize:13}}>Baranggay:</Text>
                            {/* <TextInput style={{width:'100%', borderColor:'black', borderWidth:1, padding:6,fontSize:15, borderRadius:10, paddingVertical:10}} onChangeText={(e)=> setSchedData(prev=>({...prev, place:e}))}></TextInput> */}
                            <SelectList data={masbateCityBarangays} setSelected={(e)=> setSchedData(prev=>({...prev, place:e}))} boxStyles={{padding:10, width:"100%"}} search={false} />
                        </View>
                        <View style={{display:'flex', width:'90%', marginHorizontal:'auto', marginBottom:10}}>
                            <Text style={{fontFamily:'poppinsBold', fontSize:13}}>Date:</Text>
                            <SelectList data={months} setSelected={(e)=> setSchedData(prev=>({...prev, date:e}))} boxStyles={{padding:10}} search={false} placeholder={months[new Date().getMonth()]}/>
                        </View>
                       <View style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                                 <View style={{display:'flex', width:'20%', marginBottom:10}}>
                                    <Text style={{fontFamily:'poppinsBold', fontSize:13}}>Day:</Text>
                                    <TextInput style={{width:'100%', borderColor:'black', borderWidth:1, padding:6,fontSize:15, borderRadius:10, paddingVertical:10, textAlign:'center'}} onChangeText={(e)=> setSchedData(prev=>({...prev, day:e}))}/>
                                </View>
                                <View style={{display:'flex', width:'55%', marginBottom:10}}>
                                    <Text style={{fontFamily:'poppinsBold', fontSize:13}}>Time:</Text>
                                   <View style={{display:'flex', flexDirection:'row'}}>
                                      <TextInput style={{width:'30%', borderColor:'black', borderWidth:1, padding:6,fontSize:15, borderRadius:10, paddingVertical:10,textAlign:'center'}} onChangeText={(e)=> setSchedData(prev=>({...prev, hour:e}))}/>
                                    <Text style={{fontSize:30, fontWeight:'bold'}}>:</Text>
                                      <TextInput style={{width:'30%', borderColor:'black', borderWidth:1, padding:6,fontSize:15, borderRadius:10, paddingVertical:10, textAlign:'center'}} onChangeText={(e)=> setSchedData(prev=>({...prev, min:e}))}/>
                                      <TextInput style={{width:'40%', borderColor:'black', borderWidth:1, padding:6,fontSize:15, borderRadius:10, paddingVertical:10, marginLeft:10, textAlign:'center'}} placeholder="eg. am" onChangeText={(e)=> setSchedData(prev=>({...prev, dayTime:e}))}/>
        
                                   </View>
                                </View>
                       </View>
                       <TouchableOpacity style={{padding:10, backgroundColor:'green', width:"40%", borderRadius:20, alignSelf:'flex-end', marginTop:10}} onPress={addSched}>
                        <Text style={{fontSize:20, color:'white', fontFamily:'poppinsBold', textAlign:'center'}}>Submit</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ImageBackground source={require("./../../assets/ADMIN DASHBOARD BACKGROUND.gif")} style={{position:'absolute', width:'100%', height:'100%', opacity:0.6}} resizeMode="cover"></ImageBackground>
            <View style={styles.schedListCont}>
                <ScrollView style={{flex:1}}>
                {
                    schedule.length > 0 ?
                    schedule.map((e,i)=>{
                        return(
                            <SchedCont data={e} key={i} exe={async()=>{
                                try {
                                    await axiosConfig.post("/schedule/delete", {id: e.id})
                                    console.log("data is deleted")
                                    fetchSchedule()
                                    
                                } catch (error) {
                                    Alert.alert("Error on delete", `${error}`)
                                }
                            }}/>
                        )
                    }):""
                }
                </ScrollView>
            </View>
            <View style={{ display:'flex' ,alignItems:'flex-end', justifyContent:'center', marginVertical:'auto', marginHorizontal:10}}>
                <TouchableOpacity onPress={()=> setAddModal(true)}>
                    <Image source={require("./../../assets/plus.png")} style={{width:60, height:60}} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    schedListCont:{
        // borderColor:'red',
        // borderWidth:1,
        height:height*0.74,
        padding:10
    },
    sched:{
        width:'100%',
        backgroundColor:'white',
        height:height*0.1,
        borderRadius:10,
        marginBottom:10
    }
})