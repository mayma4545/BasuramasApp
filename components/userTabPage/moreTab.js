import { useCallback, useState } from 'react'
import { Alert, Button, TouchableOpacity } from 'react-native'
import {View, Text, StyleSheet, ImageBackground, Image, Dimensions, Modal, ToastAndroid} from 'react-native'
import DatePicker from 'react-native-date-picker'
import { SelectList } from 'react-native-dropdown-select-list'
import { TextInput } from 'react-native'
import axiosConfig from '../../staticVar.js/axiosConfig'
import { times } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  

const {width, height} = Dimensions.get("window")
export default function MoreTab({route}){
    const {users, navigation} = route.params
    const user = users.user
    const [modal, setModal] = useState({trashCollector: false})
    const [isSubscribe, setSubscribe] = useState(false)
    const [collectorData, setCollectorData] = useState({date:'', place: '', day: ''})
    const [request, setRequest] = useState([])
    async function addCollector() {
        try {

            if(request.length > 0){
                Alert.alert("Request Limit", "You already have request for today!")
                return
            }
            await axiosConfig.post("/collector", {userId:user.id, place: collectorData.place,
                
                date:`${collectorData.date} ${collectorData.day}`,
                time: "",
                status:"pending"
            })
            Alert.alert("Success", "Request Sent!")
            fetchUserRequestCollector()
        } catch (error) {
            Alert.alert("Collector Error", `${error}`)
        }
        
    }
    async function fetchUserRequestCollector(params) {
        try {
            const {data} = await axiosConfig.get(`/collector/${user.id}`)
            console.log("Collection" ,data.data)
            setRequest(data.data)
        } catch (error) {
            Alert.alert("error on request on collect fetch", error.message)
        }
    }
    useFocusEffect(
        useCallback(()=>{
            // setSubscribe(prev=>{
            //     if(user.isSubscribe == "true"){
            //         setSubscribe(true)
            //     }
            // })
           console.log("HOY data ini--->", user.isPremium)
            if(user.isPremium == "true") setSubscribe(true)
            fetchUserRequestCollector()
        },[])
    )
    return(
            <View style={styles.container}>
            {/* Grabage Collector Modal */}
            <Modal visible={modal.trashCollector} >  
                <View style={{width:'100%', height:height*0.09, backgroundColor:'#254d7b', justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity  style={{position:'absolute', left:10}} onPress={()=> setModal(prev=>({...prev, trashCollector:false}))}>
                        <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")} />
                    </TouchableOpacity>
                    
                    <Text style={{color:'white', fontSize:20, fontFamily:'poppinsBold'}}>Garbage Collector</Text>
                </View>
              
                <View style={{width:'95%', height:height*0.2,backgroundColor:'#cb7474', alignSelf:'center', borderRadius:20, marginTop:15, padding:10}} >
                      <Text style={request.length > 0 ? {display:"none"} :{color:'white', fontFamily:'poppins', fontSize:15}}>You do not have any requests at the moment</Text>
                    {
                        request.length > 0 ? 
                        <>
                            <Text style={{color:'white', fontFamily:"poppins"}}>Active request:</Text>
                            <View style={{width:'95%', height:height*0.1,backgroundColor:'#487496', alignSelf:"center", borderRadius:20, margin:'auto', padding:10, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                  <View>
                                      <Text style={{fontSize:15, color:'white', fontFamily:'poppinsBold'}}>Brgy. {request[request.length-1].place}</Text>
                                      <Text style={{color:'white', fontSize:10}}>{request[request.length-1].date}, 2024</Text>
                                      <Text style={{color:'white', fontSize:10}}>Time: {request[request.length-1].time}</Text>
                                  </View>
                                  <View style={{paddingRight:10}}>
                                      <Text style={{color:"white", fontWeight:'bold'}}>Status: </Text>
                                      <Text style={{color:'white'}}>{request[request.length-1].status}</Text>
                                  </View>
                            </View>
                        </>: ""
                    }
                </View>
            <View style={{padding:10, width:'100%'}}>
                    <View style={{display:"flex", flexDirection:'row', width:'100%', justifyContent:'left', marginTop:20, gap:20, alignItems:'center'}}>
                        <Text style={{fontSize:15, fontWeight:'bold'}}>Date:</Text>
                        <SelectList data={months}  setSelected={e=> setCollectorData(prev=>({...prev, date: e}))}placeholder='Select month' boxStyles={{width:width*0.5}} dropdownStyles={{width:width*0.5, position:'absolute', top:40, backgroundColor:'#1b1c57', zIndex:99}} dropdownItemStyles={{width:width*0.5}} dropdownTextStyles={{color:'white'}} search={false}/> 
                        <TextInput placeholder='00' style={{borderColor:'black', borderWidth:1, width:width*0.2, textAlign:'center', padding:10}} inputMode='numeric' maxLength={2} onChangeText={(e)=>setCollectorData(prev=>({...prev, day:e}))}></TextInput>
                    </View>
                    <View style={{display:"flex", flexDirection:'row', width:'100%', justifyContent:'left', marginTop:20, gap:20, alignItems:'center'}}>
                        <Text style={{fontSize:15, fontWeight:'bold'}}>Place:</Text>
                        <TextInput placeholder='Baranggay' style={{borderColor:'black', borderWidth:1, width:width*0.6, fontSize:15, padding:10, borderRadius:10}} onChangeText={(e)=>setCollectorData(prev=>({...prev, place:e}))} ></TextInput>
                    </View>
                    <TouchableOpacity style={{width:"40%", padding:15, backgroundColor:'#254d7b', marginTop:20, alignSelf:'flex-end', borderRadius:10}} onPress={addCollector}>
                        <Text style={{fontSize:18, textAlign:'center', color:'white', fontWeight:'bold'}}>Submit</Text>
                    </TouchableOpacity>
            </View>
            </Modal>
             {/* END OF GARBAGE COLLECTOR MODAL*/}
            <ImageBackground source={require("./../../assets/admin/chat_bg.png")} style={{flex:1, opacity:0.9}}>
            <Text style={styles.headerText}>More Features</Text>
               <View style={styles.btnBox}>

               { isSubscribe ?  <Text style={styles.boxHeader}>Trade</Text> : "" }
                { isSubscribe ?  <View style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        <TouchableOpacity style={styles.btn} onPress={()=> ToastAndroid.show("On progress", ToastAndroid.SHORT)}>
                        <Image source={require('./../../assets/admin/buy.png')} style={{width:50, height:50, marginBottom:10}}/>
                                <Text style={styles.btnTxt}>Buy</Text>
                               
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=> ToastAndroid.show("On progress", ToastAndroid.SHORT)}>
                            <Image source={require('./../../assets/admin/sell.png')} style={{width:50, height:50, marginBottom:10}}/>
                                <Text style={styles.btnTxt}>Sell</Text>
                        </TouchableOpacity>
                  </View>: "" }
                  <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', marginBottom:20}}>
                        <Text style={isSubscribe ? {display:"none"} :{fontSize:20, color:'white'}}>Please Subscribe to our Premium account, to access more features on our app.</Text>
                  </View>
                  <Text style={isSubscribe ? styles.boxHeader: {display:'none'}}>Services</Text>
                  <View style={{display:'flex', flexDirection:'row', justifyContent:'left'}}>
                        <TouchableOpacity style={isSubscribe ? styles.btn:{display:"none"}} onPress={()=> {setModal(prev =>({...prev, trashCollector:true})); fetchUserRequestCollector()}}>
                                <Text style={styles.btnTxt}>Garbage Collector Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=>{
                                 navigation.reset({
                                    index:0,
                                    routes:[{'name':'signInStack'}]

                                    // routes:[{'name':'adminStack', params:{userData: {}}}]
                                })
                        }}>
                                <Text style={styles.btnTxt}>Logout</Text>
                        </TouchableOpacity>
                  </View>
                        
               </View>
             
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black',
    },
    btnBox:{
        width:'95%',
        height:'100%',
        // backgroundColor:'red',
        alignSelf:'center',
        justifyContent:'flex-start',
       
     
    },
    btn:{
        alignSelf:'center',
        width:'45%',
        height:height*0.19,
        backgroundColor:'#59cc17',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        margin:5,
        marginBottom:20,
        padding:5
    },
    btnTxt:{
        fontSize:16,
        fontWeight:'bold',
        color:'white',
        textAlign:'center'
    },
    headerText:{
        marginTop:20,
        marginBottom:50,
        fontFamily:"poppinsBold",
        fontSize:20,
        textAlign:'center',
        color:'white'
    },
    boxHeader:{
        fontSize:13,
        color:'white',
        fontFamily:'poppinsBold'

    }
})