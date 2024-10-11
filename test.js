async function getData(){
    try {
        const data = await fetch("http://192.168.1.1/update")
        const json = await data.json()
        console.log(json)
    } catch (error) {
        
    }
}

getData()