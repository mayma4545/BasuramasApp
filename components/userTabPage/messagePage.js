import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Button, Image, Alert, ScrollView, ToastAndroid} from "react-native";
import { Dimensions } from "react-native";
import axiosConfig from "../../staticVar.js/axiosConfig";
import { Modal } from "react-native";
import { TextInput } from "react-native";
import { wrap } from "lodash";


const  {width, height} = Dimensions.get("window")

const ToBox = (props)=>{
    return(
        <View style={{display:'flex', justifyContent:"flex-start", maxWidth:width*0.8, minWidth:2, flexWrap:'wrap', marginTop:10}}>
        <View style={{padding:10, backgroundColor:'#85af87',borderRadius:10, width:'auto'}}>
            <Text style={{color:'white',fontSize:18}}>{props.content}</Text>
        </View>
        <Text style={{fontSize:10, color:'#726f6f', marginLeft:10}}>Admin - {props.createdAt}</Text>
    </View>
    )
}

const FromBox =(props)=>{
    return(
        <View style={{display:'flex', alignItems:'flex-end', marginTop:10}}>
        <View style={{padding:10, backgroundColor:'#757776', minWidth:width*0.2, maxWidth:width*0.8, borderRadius:10}}>
            <Text style={{color:'white',fontSize:18}}>{props.content}</Text>
        </View>
        <Text style={{fontSize:10, color:'#726f6f', marginLeft:10}}>You - {props.createdAt}</Text>
    </View>
    )
}

export default function MessagePage({route}){
    const user = route.params.user
    console.log(user)
    const [message, setMessage] = useState([])
    const [modal, setModal] = useState(false)
    const [to, setTo] = useState("")
    const [msgContent, setMsgContent] = useState("")


    useFocusEffect(
        useCallback(()=>{
            async function fetchMessage() {
                try {
                    const {data} = await axiosConfig.get(`/message/get/admin/uwu`)
                    console.log(data.message)

                } catch (error) {
                    Alert.alert(`Error`, `${error}`)
                }
            }
          
           let a = setInterval(()=>{
            fetchChat()
           }, 2000)
        },[])
    )
    async function fetchChat(params) {
        try {
            const {data} = await axiosConfig.get(`/message/get/${user.fullaname}`)
            console.log(data.message.length)
            setMessage(data.message)
        } catch (error) {
            Alert.alert("Error on fetchChat", `${error}`)
        }
        
    }
    async function sendMessage(){
        try {
            if(msgContent.length < 1) return;
            await axiosConfig.post("/message/send", {to:to, from:user.fullaname, content:msgContent})
            ToastAndroid.show('Message Sent !', ToastAndroid.LONG);
            fetchChat()
            setMsgContent("")
        } catch (error) {
            Alert.alert("error on message", `${error}`)
        }
    }
    return(
        
        <View style={styles.container}>
            <Modal visible={modal}>
                <View style={{backgroundColor:'#f9fafc', width:'100%', height:'100%'}}>
                        <View style={{width:'100%', height:height*0.09, backgroundColor:'#3f9f2a', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <Text style={{textAlign:'center', fontSize:20, color:'white', fontFamily:'poppinsBold'}}>{to.toUpperCase()}</Text>
                            <TouchableOpacity style={{position:'absolute', left:5}} onPress={()=> setModal(false)}>
                                  <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")}></Image>
                            </TouchableOpacity>
                        </View>
                        {/* CONTENT */}
                        <View style={{ height:height*0.82, padding:10, width:'100%'}}>
                              {/* Message from */}
                              <ScrollView>
                            {
                                message.length > 0 ?
                                message.map((e,i)=>{
                                    if(e.from == "admin") return (<ToBox content={e.content} createdAt={e.createdAt} key={i} />)
                                    else return (<FromBox content={e.content} createdAt = {e.createdAt} key={i}/>)
                                }):""
                            }
                            </ScrollView>
                        </View>

                        
                        <View style={{position:'absolute', bottom:0, padding:10, width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', gap:2}}> 
                            <TextInput multiline={true} style={{width:"80%", borderWidth:2, borderColor:'black', padding:10, borderRadius:5, fontSize:15, backgroundColor:'white'}} onChangeText={(e)=> setMsgContent(e)} value={msgContent}></TextInput>
                            <Button title="send" onPress={()=> sendMessage()}/>
                        </View>
                </View>
            </Modal>
        <ImageBackground style={{position:'static', width:"100%", height:"100%", opacity:1}} source={require("./../../assets/admin/chat_bg.png")}>
        </ImageBackground>
        
            <View style={styles.content}>
               
                <TouchableOpacity style={styles.messageBox} onPress={()=>{
                    setTo("admin")
                    setModal(true)
                }}>
                    <Image source={require("./../../assets/forgot-password.png")} style={{width:height*0.06, height:height*0.06, borderRadius:100, marginRight:10}} />
                    <View style={{height:'90%',  overflow:'hidden', width:'83%'}}>
                        <Text style={{fontSize:15, fontFamily:'poppinsBold', color:'#676666'}}>Admin</Text>
                        <Text style={{color:'#6f6e6e'}}>1 unread message</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black'   
    },
  content:{
    position:'absolute',
    padding:5,
    backgroundColor:'#9edeb06f',
    width:"100%",
    height:"100%",
    margin:"auto",
    borderRadius:10,
  },
  messageBox:{
    width:'100%',
    height:height*0.1,
    backgroundColor:'hsl(195, 100%, 99%)',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:10,
    borderBottom:10,
    overflow:'hidden',
    marginBottom:5,
    borderRadius:10
  },
})