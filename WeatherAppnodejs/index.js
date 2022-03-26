// 5f1cdd1767e649d99538aefe9659c9c9 - api key nikita
// from website https://home.openweathermap.org/api_keys
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// api.openweathermap.org/data/2.5/weather?q=Pune&appid=fd90bf618ea96246755cdb6566b80483

const http = require('http');
const fs = require('fs');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal ,orgVal)=>{
    const Ctemp =orgVal.main.temp - 273.15;
    const minCtemp =orgVal.main.temp_min - 273.15;
    const maxCtemp =orgVal.main.temp_max - 273.15;
    let temperature = tempVal.replace("{%tempval%}",Ctemp.toFixed(2))
    temperature = temperature.replace("{%tempmin%}",minCtemp.toFixed(2))
    temperature = temperature.replace("{%tempmax%}",maxCtemp.toFixed(2))
    temperature = temperature.replace("{%location%}",orgVal.name)
    temperature = temperature.replace("{%country%}",orgVal.sys.country)
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main)
    
    return temperature;
}
//we will use requests module and now we need package.json file to keep track on which dependencies/modules we have in project
// for that go to WeatherAppnpodejs path in terminal and type npm init to create package.json
// now install requests --> npm i requests
const server = http.createServer((req,res)=>{
    if(req.url == '/'){
        var requests = require('requests');
        //refer EventModule folder for further code 
        requests("http://api.openweathermap.org/data/2.5/weather?q=kathlal&appid=fd90bf618ea96246755cdb6566b80483",
        ).on("data",(chunk)=>{
            //chunk is the json data we are getting from the url but lets convert it into object
            const objData = JSON.parse(chunk);
            //also converting object into array(of object)
            const arrData = [objData];
            // const Ctemp = arrData[0].main.temp - 273.15
            // console.log(Ctemp.toFixed(2)); //observe arrData content and there u'll get temperature by going to arrData[0].main.temp
            const realTimeData = arrData.map((val)=>
                replaceVal(homeFile,val)).join(""); //replacing the placedolders value of home.html  -- > val is whole api 
                //replaceVal will be defined at top bcoz After reading file , it must be fetched only once
            // }).join(""); //using join -->existing data will be converted fro array into string
             res.write(realTimeData); //after sending response , you'll be able to see info
            // console.log(realTimeData); 
        })
        .on("end",(err)=>{
            if(err) return console.log("connection closed! due to errors",err);
            res.end();
        });
        //in above code , it is important to write "data" and "end" as they both are events --
        // data event  - this event is fired when there is data is available to read
        // end event - this event is fired when there is no more data to read
          //if file doesnt exist then use "err" event - this event is fired when there is any error receiving or writing data 
    }
})

//now lets make server listen to the requests

server.listen(3000,"127.0.0.1",()=>{
    console.log("server is listening on port no: 3000");
})

