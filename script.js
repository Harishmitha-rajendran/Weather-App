const wrapper=document.querySelector(".wrapper");
inputPart=wrapper.querySelector(".input-part");
infoTxt=inputPart.querySelector(".info-txt");
inputField=inputPart.querySelector("input");
locationBtn=inputPart.querySelector("button");
let api;
wIcon=document.querySelector(".weather-part img")
arrow=wrapper.querySelector("header i");

inputField.addEventListener("keyup",e =>{                         // if user enters city
    // if user press enter btn and input value is not null
    if(e.key=="Enter" && inputField.value!=" "){
      requestApi(inputField.value);
    } 
});


locationBtn.addEventListener("click",()=>{      //if user clicks btn we find lat and long then pass to api to find weather details
    if(navigator.geolocation){                  //if browser supports geoloc api:if we click "allow"
      navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }
    else{
      alert("Your browser does not support geolocation api");
    }
});

function onSuccess(position){
    const {latitude,longitude}=position.coords;   //Geolocationposition > coords >lat,long
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=1e21a38d79357a47821da7539826e062`;
    fetchData();
}
function onError(error){
  infoTxt.innerText=error.message;               //fetch error msg from response  "Geolocationerror"
  infoTxt.classList.add("error");
}

function requestApi(city){
   api=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1e21a38d79357a47821da7539826e062`;
   fetchData();
}

function fetchData(){
  infoTxt.innerText="Getting weather details...";
  infoTxt.classList.add("pending");
  // response doesnt contain actual json format : so used .json() method and pass result as arg
  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
  if(info.cod=="404"){                                             // invlid city name
    infoTxt.innerText=`${inputField.value} isn't a valid city`;
    infoTxt.classList.replace("pending","error");                  //first shows getting weather details,after check should show invalid city (replace)
  }
  else{
    //getting required objects from object info
    const city=info.name;
    const country=info.sys.country;
    const {description,id}=info.weather[0];
    const {feels_like,humidity,temp}=info.main;

    if(id==800){
      wIcon.src="images/clear.svg";
    }
    else if(id>=200 && id<=232){
      wIcon.src="images/storm.svg";
    }
    else if(id>=600 && id<=622){
      wIcon.src="images/snow.svg";
    }
    else if(id>=701 && id<=781){
      wIcon.src="images/haze.svg";
    }
    else if(id>=801 && id<=804){
      wIcon.src="images/cloud.svg";
    }
    else if((id>=300 && id<=321)||(id>=500 && id<=531)){
      wIcon.src="images/rain.svg";
    }

    //setting values to html elems
    wrapper.querySelector(".temp .numb").innerText=Math.floor(temp);
    wrapper.querySelector(".weather").innerText=description;
    wrapper.querySelector(".location span").innerText=`${city},${country}`;
    wrapper.querySelector(".temp .numb-2").innerText=Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText=`${humidity}%`;

    infoTxt.classList.remove("pending","error");                  //for next city entered rmv those classes existing
    wrapper.classList.add("active");                              //make weather page visible
    console.log(info);
    inputField.value="";
  }
}


arrow.addEventListener("click",()=>{
  wrapper.classList.remove("active");
});


