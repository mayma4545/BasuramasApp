import { useCallback, useEffect, useState } from "react"
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Modal, ScrollView, TextInput, Image, Alert, ToastAndroid, ImageBackground} from "react-native"
import axiosConfig from "../../staticVar.js/axiosConfig"
import { useFocusEffect } from "@react-navigation/native"
import { SelectList } from "react-native-dropdown-select-list"
import PremiumAccount from "./premiumAcc"
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"

const CustomInput = (props)=>{
    const [isGood, setGood] = useState(true)
    return(
        <View style={styles.inputContainer}>
        <Text style={styles.label}>{props.label}:</Text>
        <TextInput style={styles.input} value={props.val} onChangeText={(e)=> props.onChange(e)} secureTextEntry={props.isPwd || false}/>
        {props.isGood ? <Text style={{color:'red'}}>* This field is required</Text> : ""}
    </View>
    )
}

const timeArr = [
    "4:00 am",
    "5:00 am",
    "6:00 am",
    "7:00 am",
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
    "6:00 pm",
    "8:00 pm",
    "9:00 pm",
    "10:00 pm",
    "11:00 pm",
    "12:00 pm",
]
const {width, height} = Dimensions.get("window")
export default function AdminMoreTab({navigation,route}){
    const nav = route.params
    console.log(nav)
    const [modal, setModal] = useState({addUser:false, collector:false, viewCollection:false, premium:false})
    const [userData, setUserData] = useState({})
    const [isField,setField] = useState({})
    const [isUp, setUp] = useState(false)
    const [collectorData, setCollectorData] = useState([])
    const [selectCollection, setSelectedCollection] = useState({})
    const [selectedUser, setSelectedUser] = useState({})
    const [acceptTime, setAcceptTime] = useState("")
    const [msgContent,setMsgContent] = useState("")
    useEffect(()=>{
        if(isUp){
        setField(prev=>({...prev,
            firstname:userData.firstname ? false : true,
            middlename:userData.middlename ? false : true,
            lastname:userData.lastname ? false : true,
            address:userData.address ? false : true,
            email:userData.email ? false : true,
            password:userData.password ? false : true,
            cpassword:userData.cpassword ? false : true,
        }))
    }
    console.log(userData)
    }, [userData])
    async function signUp(){
        setField(prev=>({...prev,
            firstname:userData.firstname ? false : true,
            middlename:userData.middlename ? false : true,
            lastname:userData.lastname ? false : true,
            address:userData.address ? false : true,
            email:userData.email ? false : true,
            password:userData.password ? false : true,
            cpassword:userData.cpassword ? false : true,
        }))
        setUp(true)
        if(!userData?.firstname ||!userData?.middlename ||!userData?.lastname ||!userData?.address ||!userData?.email ||!userData?.password || !userData?.cpassword ){
            Alert.alert("Field required", "Fill all the fields!")
            return
        }
        if(userData?.password !== userData?.cpassword){
            Alert.alert("Password!", "Password did not match!")
            return
        }

        try {
            await axiosConfig.post("/user", {username:userData.email, fullaname: `${userData.firstname} ${userData.middlename} ${userData.lastname}`, password:userData.password, priv:'user', isPremium:"false", contactNumber:'', birthdate:'', address:userData.address})
            console.log("Success")
            Alert.alert("Success", "New user created!")
            setModal(prev=>({...prev, addUser:false}))
        } catch (error) {
            Alert.alert("Erron on add User ",  `${error}`)
        }
    }
async function fetchRequestCollection(){
    try {
        const {data} = await axiosConfig.get("/collector")
        setCollectorData(prev=>(data.data))
    } catch (error) {
        Alert.alert("Error on fetchRequestCollection()", error.message)
    }
}

    useFocusEffect(
        useCallback(()=>{
fetchRequestCollection()
        },[])
    )

async function getUserById(){
    try {
        const {data} = await axiosConfig.get(`/user/getById/${selectCollection.userId}`)
        console.log(data.user)
        setSelectedUser(prev=>({...data.user}))
    } catch (error) {
        Alert.alert("Error on getUserById", error.message)
    }
}

async function acceptRequest() {
    try {
       
        await axiosConfig.post("/collector/update", {id:selectCollection.id, time:acceptTime, status:"accepted"})
        ToastAndroid.show("Request Accepted!", 10)
        fetchRequestCollection()
        sendMessage()
        setModal(prev=>({...prev, viewCollection:false}))
    } catch (error) {
        Alert.alert("Error on getUserById", error.message)
    }
}
    async function getItem(){
        try {
            const intervalId = await AsyncStorage.getItem("intervalKey")
            clearInterval(JSON.parse(intervalId))
        } catch (error) {
            
        }
    }
async function declineRequest() {
    try {
        await axiosConfig.get(`/collector/delete/${selectCollection.id}`)
        Alert.alert("Success", "Request has been declined")
        fetchRequestCollection()
        sendMessageDecline()
        setModal(prev=>({...prev,viewCollection:false}))
    } catch (error) {
        Alert.alert("Error on getUserById", error.message)
    }
}
useEffect(()=>{
    if(selectCollection?.userId){
        getUserById()
    }
},[selectCollection])

async function sendMessage(){
    try {
         let a = 'Your request has been accepted. Please check your GARBGE COLLECTOR REQUEST page to check for more information.'
        await axiosConfig.post("/message/send", {to:selectedUser.fullaname, from:"admin", content:a})
        ToastAndroid.show('Message Sent !', ToastAndroid.LONG);
       
    } catch (error) {
        Alert.alert("error on message", `${error}`)
    }
}

async function doneRequest(id){
    try {   
        await axiosConfig.get(`/collector/delete/${id}`)
        Alert.alert("Success", "Garbage collector request done!")
        fetchRequestCollection()
        setModal(prev=>({...prev,viewCollection:false}))
    } catch (error) {
        Alert.alert("Error on done request!!", error.message)
    }
}
async function sendMessageDecline(){
    try {
         let a = `Your request has been Rejected. Please check your GARBGE COLLECTOR REQUEST page and message ADMIN for more information.`
        await axiosConfig.post("/message/send", {to:selectedUser.fullaname, from:"admin", content:a})
        ToastAndroid.show('Message Sent !', ToastAndroid.LONG);
       
    } catch (error) {
        Alert.alert("error on message", `${error}`)
    }
}
    return(
        <View style={{flex:1}}>
            <ImageBackground source={require("./../../assets/admin/Background.png")} style={{position:'absolute', width:'100%', height:'100%', opacity:0.8}} resizeMode="cover"/>
            <Modal visible={modal.addUser}>
            <View style={{height:height*0.1, backgroundColor:'#337559', justifyContent:'center'}}>
                <Text style={{fontFamily:'poppinsBold', color:'white', textAlign:'center', fontSize:20}}>Create New User</Text>
               <TouchableOpacity style={{position:"absolute", left:10}} onPress={()=>setModal(prev=>({...prev, addUser:false}))}>
                     <Image  source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")}/> 
               </TouchableOpacity>
            </View>
            <View style={{flex:1, margin:20}}>
            <ScrollView>
                    <CustomInput label={"Firstname"} val={userData.user} onChange={(e)=>setUserData(prev=>({...prev, firstname:e}))} isGood={isField.firstname}/>
                    <CustomInput label={"Middlename:"} val={userData.middlename} onChange={(e)=>setUserData(prev=>({...prev, middlename:e}))}   isGood={isField.middlename}/>
                    <CustomInput label={"Lastname:"} val={userData.lastname} onChange={(e)=>setUserData(prev=>({...prev, lastname:e}))}  isGood={isField.lastname}/>
                    <CustomInput label={"address:"} val={userData.address} onChange={(e)=>setUserData(prev=>({...prev, address:e}))}  isGood={isField.address}/>
                    <CustomInput label={"Username:"} val={userData.email} onChange={(e)=>setUserData(prev=>({...prev, email:e}))}  isGood={isField.email}/>
                    <CustomInput label={"Password:"} val={userData.password} onChange={(e)=>setUserData(prev=>({...prev, password:e}))} isPwd={true}  isGood={isField.password}/>
                    <CustomInput label={"Confirm Password:"} val={userData.cpasword} onChange={(e)=>setUserData(prev=>({...prev, cpassword:e}))}  isGood={isField.cpassword} isPwd={true}/>
                    <TouchableOpacity style={{width:width*0.7, padding:20, backgroundColor:'#31785f', justifyContent:'center', alignItems:'center', borderRadius:10, alignSelf:'center', marginTop:20}} onPress={signUp}>
                    <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>Create Account</Text>
                    </TouchableOpacity>
            </ScrollView>
</View>
            </Modal>
            {/* GARBAGE COLLECTOR REQUEST HEHE :) */}
            <Modal visible={modal.collector}>
                <View style={{flex:1}}>
                    <View style={{height:height*0.1, backgroundColor:'#418251', justifyContent:'center'}}>
                        <Text style={{color:"white", fontFamily:'poppinsBold', textAlign:'center', fontSize:16}}>Trash Collector Request</Text>
                        <TouchableOpacity style={{position:'absolute', left:10}} onPress={()=>setModal(prev=>({...prev, collector:false}))}>
                            <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")} />
                        </TouchableOpacity>
                    </View>     
                <View style={{height:height*0.9, padding:10}}>
                   {
                    collectorData.length > 0 ?
                    collectorData.map((e,i)=>{
                        return(
                            <View style={{height:height*0.12, backgroundColor:'#b36666', borderRadius:10, padding:10, paddingHorizontal:20, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10}} key={i}>
                            <View>
                                <Text style={{color:"white", fontSize:15, fontFamily:'poppinsBold'}}>Brgy. {e.place}</Text>
                                <Text style={{color:'white'}}>{e.date} {e.day}, 2024</Text>
                                <Text style={{color:'white'}}>Status: {e.status}</Text>
                            </View>
                           <TouchableOpacity style={{padding:10}} onPress={()=>{setSelectedCollection(prev=>({...e}));setModal(prev=>({...prev,viewCollection:true }))  }}>
                                <Text style={{color:"white"}}>View</Text>
                           </TouchableOpacity>
                        </View>
                        )
                    }): <Text style={{margin:'auto', fontSize:20, fontWeight:'bold', color:'#605f5f'}}>No request yet :)</Text>
                   }
                </View>
                </View>
            </Modal>
            {/* END OF COLLECTION */}
            {/* VIEW COLLECTION */}
            <Modal visible={modal.viewCollection}>
                <View style={{display:'flex'}}>
                    <View style={{height:height*0.1, backgroundColor:'#3f8272', justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'poppinsBold', color:'white',fontSize:18 }}>Request Data Preview</Text>
                        <TouchableOpacity style={{position:'absolute', left:10}} onPress={()=>setModal(prev=>({...prev, viewCollection:false}))}>
                            <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={{height:height*0.6, width:'100%', padding:10}}>
                    <Text style={{fontFamily:"poppins", fontWeight:"bold", fontSize:20, marginBottom:5}}>User:</Text>
                    <Text style={{fontFamily:"poppins", fontWeight:"600", fontSize:18}}>{selectedUser.fullaname}</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"bold", fontSize:20, marginBottom:5}}>Location:</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"600", fontSize:18}}>Brgy. {selectCollection.place}, Masbate city</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"bold", fontSize:20, marginBottom:5}}>Date:</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"600", fontSize:18}}>{selectCollection.date}, {new Date().getFullYear()}</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"bold", fontSize:20, marginBottom:5}}>Status:</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"600", fontSize:18}}>{selectCollection.status}</Text>
                        <Text style={{fontFamily:"poppins", fontWeight:"bold", fontSize:20, marginBottom:5}}>Time:</Text>
                        <SelectList data={timeArr} setSelected={(e)=>setAcceptTime(prev=>(e))} search={false} placeholder="Set time" boxStyles={selectCollection.time ? {display:"none"} : {display:'flex'}}/>
                        <Text style={selectCollection.time ? {fontFamily:"poppins", fontWeight:"600", fontSize:18} : {display:'none'}}>{selectCollection.time}</Text>
                      { 
                        selectCollection.status === "pending" ?
                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around', marginTop:20}}>
                            <TouchableOpacity style={{padding:15, backgroundColor:'#942e2e', width:"40%", borderRadius:30}} onPress={()=>declineRequest()}>
                                    <Text style={{color:'white', textAlign:'center', fontWeight:'bold'}}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{padding:15, backgroundColor:'#35942e', width:"40%", borderRadius:30}} onPress={()=> acceptRequest()}>
                                    <Text style={{color:'white', textAlign:'center', fontWeight:"bold"}}>Accept</Text>
                            </TouchableOpacity>
                       </View>: ""
                       }
                       {
                        selectCollection.status === "accepted" ?
                                <TouchableOpacity style={{padding:15, backgroundColor:'#942e2e', width:"40%", borderRadius:30}} onPress={()=>doneRequest(selectCollection.id)}>
                                     <Text style={{color:'white', textAlign:'center', fontWeight:'bold'}}>Done</Text>
                                </TouchableOpacity>: ""
                       }
                     </View>
                    
                </View>
            </Modal>
            {/* END OF VIEW COLLECTION */}
           <PremiumAccount visible={modal.premium} setExit={(e)=>setModal(prev=>({...prev, premium:e}))}/>
            <TouchableOpacity style={styless.box} onPress={()=>setModal(prev=>({...prev, addUser:true}))}>
                <Text style={{fontFamily:'poppinsBold',color:"white", fontSize:17 }}>Add new User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styless.box} onPress={()=>setModal(prev=>({...prev, collector:true}))}>
                <Text style={{fontFamily:'poppinsBold',color:"white", fontSize:17 }}>Garbage Collector Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styless.box} onPress={()=>setModal(prev=>({...prev, premium:true}))}>
                <Text style={{fontFamily:'poppinsBold',color:"white", fontSize:17 }}>Premium Account activation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styless.logoutBtn} onPress={async()=>{
                const map = await AsyncStorage.getItem("mapInterval")
                clearInterval(map)
                const b = await AsyncStorage.getItem("messageInterval")
                clearInterval(b)
               nav.reset({
                index:0,
                routes:[{'name':'signInStack'}]
                // routes:[{'name':'adminStack', params:{userData: {}}}]
            })
                getItem()
                  
            }}>
                <Text style={{fontFamily:'poppinsBold',color:"white", fontSize:17 }}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styless = StyleSheet.create({
    box:{
       
        width:width*0.9,
        height: width*0.2,
        borderRadius:10,
        padding:10,
        backgroundColor:'#3e7b4d',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:10
    },
    logoutBtn:{
        position:'absolute',
        width:"70%",
        height:"10%",
        top:'89%',
        textAlign:'center',
        padding:10,
        backgroundColor:'#8da292',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        borderRadius:10
    }
})

const styles = StyleSheet.create({
    inputContainer:{
        // borderColor:'red',
        // borderWidth:1
        marginTop:20
    },
    input:{
        borderColor:'#828080',
        borderWidth:2,
        fontSize:15,
        padding:12,
        borderRadius:5,
        fontFamily:'poppins',
    },
    label:{
        fontFamily: "poppinsBold",
        fontSize:15,
        color:'#666464'
    }
})