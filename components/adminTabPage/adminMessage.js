import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView, Modal, Image, TextInput, Button, Alert, ToastAndroid } from "react-native"
import axiosConfig from "../../staticVar.js/axiosConfig"
import { ActivityIndicator } from "react-native"

let interval = 0
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
        <Text style={{fontSize:10, color:'#726f6f', marginLeft:10}}>You - {props.createdAt.split("T")[0]} {props.createdAt.split("T")[1].split(".")[0]}</Text>
    </View>
    )
}

const Box = (props)=>{
    return(
        <TouchableOpacity style={styles.messageBox} onPress={()=>props.click()}>
        <Text style={{fontFamily:'poppinsBold', color:'white'}}>{props.data.fullaname}</Text>
        <Text style={{color:"white"}}>see message</Text>
    </TouchableOpacity>
    )
}
const {height, width} = Dimensions.get("window")
export default function AdminMessage(){
    const [modal, setModal] = useState(false)
    const [to, setTo] = useState("")
    const [msgContent, setMsgContent] = useState("")
    const [message, setMessage] = useState([])
    const [admin, setAdmin] = useState([])
    const [userss, setUsers] = useState([])
    const [isOpen, setOpen] = useState(false)

    async function markReadMessage(id){
        try {
            await axiosConfig.post("/message/isRead",{id:id})
        } catch (error) {
            Alert.alert(`Error on reading message`, error.message)
        }
    }
    async function getMessage() {
        try {
            if(!to) return
            console.log(to)
            const {data} = await axiosConfig.get(`/message/get/${to}`)
            setMessage(prev=>([...data.message]))
            async function exe() {
               data.message.forEach(element => {
                if(element.isRead !== true) markReadMessage(element.id)
               });
            }
            exe()

        } catch (error) {
            // Alert.alert("Error on Get message", `${error.message}`)
            console.log(error)
        }

    }
    async function fetchChat(params) {
        try {
            const {data} = await axiosConfig.get(`/user`)
            console.log(data.users.length)
            setUsers(data.users)
            getMessage()
            
        } catch (error) {
            Alert.alert("Error on fetchChat", `${error}`)
        }
        
    }
    async function sendMessage(){
        try {
            if(msgContent.length < 1) return;
            await axiosConfig.post("/message/send", {to:to, from:"admin", content:msgContent})
            ToastAndroid.show('Message Sent !', ToastAndroid.LONG);
             getMessage()
            setMsgContent("")
        } catch (error) {
            Alert.alert("error on message", `${error}`)
        }
    }
    useFocusEffect(
        useCallback(()=>{
            fetchChat()
         
        }, [])
    )
    useEffect(()=>{
        let a = setInterval(()=>{
            getMessage()
        },500)
       
        return ()=> clearInterval(a)
    },[to])
    return(
        <View style={{flex:1, padding:5}}>
             <Modal visible={modal}>
                <View style={{backgroundColor:'#f9fafc', width:'100%', height:'100%'}}>
                        <View style={{width:'100%', height:height*0.09, backgroundColor:'#3f9f2a', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <Text style={{textAlign:'center', fontSize:16, color:'white', fontFamily:'poppinsBold'}}>{to.toUpperCase()}</Text>
                            <TouchableOpacity style={{position:'absolute', left:5}} onPress={()=> {setModal(false);setOpen(false); setTo("")}}>
                                  <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")}></Image>
                            </TouchableOpacity>
                        </View>
                        {/* CONTENT */}
                        <View style={{ height:height*0.82, padding:10, width:'100%'}}>
                              {/* Message from */}
                              <ScrollView>
                            {
                                message.length > 0 && isOpen?
                                message.map((e,i)=>{
                                    if(e.from != "admin") return (<ToBox content={e.content} createdAt={e.createdAt} key={i} />)
                                    else return (<FromBox content={e.content} createdAt = {e.createdAt} key={i}/>)
                                }):<ActivityIndicator size={"large"} color={"red"}/>
                            }
                            </ScrollView>
                        </View>

                        
                        <View style={{position:'absolute', bottom:0, padding:10, width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', gap:2}}> 
                            <TextInput multiline={true} style={{width:"80%", borderWidth:2, borderColor:'black', padding:10, borderRadius:5, fontSize:15, backgroundColor:'white'}} onChangeText={(e)=> setMsgContent(e)} value={msgContent}></TextInput>
                            <Button title="send" onPress={()=> sendMessage()}/>
                        </View>
                </View>
            </Modal>
            <ScrollView> 
                {
                    userss.length>0 ?
                    userss.map((e,i)=>{
                        return(
                            <Box data={e} click={()=>{
                                setTo(e.fullaname);
                                setModal(true);
                                setTimeout(()=>{
                                    setOpen(true)
                                }, 1000)
                                }} key={i} />
                        )              
                    }):""
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    messageBox:{
        // borderColor:'red',
        // borderWidth:1,
        height:height*0.1,
        padding:10,
        backgroundColor:'#2e934d',
        borderRadius:10,
        marginBottom:5
    }
})
