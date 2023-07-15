//  fetch the items first
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadMyScreen = document.querySelector(".loading-container");
const userInfoContainer =  document.querySelector(".user-info-container"); 

// initially variable needed?

let currentTab = userTab;
const API_KEY = "ea8fa4de73aca2a4d09dd10ebbd5050d";
currentTab.classList.add("current-tab");

//  call the function till get coordinates first 
getFromSessionContainer();

//  creating the function of switchTab
function switchTab(clickedTab){
    if(clickedTab != currentTab ){
        currentTab.classList.remove("current-tab");
        currentTab =  clickedTab;
        currentTab.classList.add("current-tab");
 

     }

    //   agar search invisible hai toh kuch kro else kuch kro 
    if(!searchForm.classList.contains("active")){
        //  user info ko invisible kra do
        userInfoContainer.classList.remove("active")
        
        // grant access continer ko remove kra do 
        grantAccessContainer.classList.remove("active");



        // search tab ko visible kra do 

        // ab mein your weather me aagya hu toh weather show krna padega mujhe from uor local storage first

        // for coordinates if we have save there  
        searchForm.classList.add("active");

    }
    else{

        // agar visible  hai toh search ko invisible kr do
        searchForm.classList.remove("active");

        // user info ko visible kra do 
        userInfoContainer.classList.remove("active");


        getFromSessionContainer();




    }


    

}




// if i clicked on user tab then 
userTab.addEventListener('click' , ()=>{

    //  toh user tab pr switch kr do
    switchTab(userTab);
});

//  if i clicked on search tab then
searchTab.addEventListener('click' , ()=>{
    //  toh search tab pr switch kr do
    switchTab(searchTab); 
});




// console.log("bbbby");




// funcion  if coordinates are already present in session/local storage
function getFromSessionContainer(){
    
    const localCoardinates =  sessionStorage.getItem("user-coordinates");
    if(!localCoardinates){
        // coordinates nhi mile toh visible kra do grant acces ko
        grantAccessContainer.classList.add("active");
        //  agar coordinates nhi mile toh ek kaam or kro grant acces wale button pr listener lgao or 
        //  apni current location fetch krkr longitude latitude and city etc data session storage me save kra do
        //  ye kaam hmne niche kiya hai 
    
    }
    else{
        // const{lat, log} = 
    
        let coardinates = JSON.parse(localCoardinates);
        fetchUserWeather(coardinates);
    
    }


}



//  function to fetch the user weather
async function fetchUserWeather(coardinates){
//   find latitude and longitude

    const {lat, lon} = coardinates;

    //  remove grantAcces 
    grantAccessContainer.classList.remove("active");

    // make loader visible so that data fetch ho rha hhai 
    
    loadMyScreen.classList.add("active");


    //  make API CALL
    try{
      

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        
        //  convert the data in json format
        const data = await response.json();

        //  now data aagya  so remove the  loader
        loadMyScreen.classList.remove("active");

        // now visible the ui jisme data show krna hai  
        userInfoContainer.classList.add("active");

        //  line 140 me sirf ui show hua hai ab isme values bhi daalni hai  using render functio 
        renderWeatherInfo(data);


    }
    catch(err){

        loadMyScreen.classList.remove("active");

    }
   
}


//  function to render the data to the ui 

 function renderWeatherInfo(weatherInfo){

    // firstly we have to fetch the elements 
     const city_name =  document.querySelector("[data-cityName]");
     const country_icon =  document.querySelector("[data-countryIcon]");
     const desc =  document.querySelector("[data-weatherDesc]");
     const  weatherIcon = document.querySelector("[data-weatherIcon]");
     const temp = document.querySelector("[data-temp]");
    const windSpeed =  document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //  now put the dynamic value in the ui
    
    city_name.innerText =  weatherInfo?.name;
    country_icon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;


    //  CHECK KR LENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNA
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` ;



    //  set the temp to the ui after fetching dynamically
    if(weatherInfo?.main?.temp === undefined){
            temp.innerText = "NOT FOUND";
    }else{
        temp.innerText = `${weatherInfo?.main?.temp}°C`
    }
   ;
     //  set the windspeed to the ui after fetching dynamically
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    
     //  set the humidity to the ui after fetching dynamically
    humidity.innerText =  `${weatherInfo?.main?.humidity}%`;

     //  set the cloudiness to the ui after fetching dynamically
    cloudiness.innerText =  `${weatherInfo?.clouds?.all}%`;


}



// describe functio that is getLocation
function getLocation(){

    // lone 203 means ki support available hai  
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show an alert for no support geolocation
        // alert("geolocation is not supported");
        
    }

}




// now describe the show position method
function showPosition(position){

    const userCoordinates = {
        lat:  position.coords.latitude,
        lon:  position.coords.longitude
    }
    
    // save this data into the session storage
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    //  now call the fetchusser weather api to get the data

    fetchUserWeather(userCoordinates);

       
}


//  ADD EVENT LISTENER ON GRANT ACCESS BUTTON
const grantAccesButton =  document.querySelector("[data-grantAccess]");
grantAccesButton.addEventListener("click" , getLocation);





// AB SEARCH WALE OPOTION PR AA GYE JB HM INPUT ME CITY DAALENGE TOH USKO FETCH KRNA HAI CITY KO OR API CALL KR DENA HAI THEN JO API SE DATA AAYEGA USKO RENDER KRA DENA HAI UI PAR
const searchInput =  document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit" , (e)=>{

    e.preventDefault(); // this line is used to prevent us to open the link  to the next page
// let cityName =  searchInput.ariaValueMax;
let cityName = searchInput.value;

// console.log("entered city is "+ cityName)
    if(cityName === ""){
        return;
    }
    else{
        fetchWeatherUsingApi(cityName);
    }
});

//  making the function that is fetchweather using the city name only
async function fetchWeatherUsingApi(city){

    // loader ko active kro
    loadMyScreen.classList.add("active");

    //  user content ko inactive kro
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
// console.log("input city is "+ cityName);

    try{
        const resp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        
        const data = await  resp.json();

        //  make loader inactive
         loadMyScreen.classList.remove("active");
         
        //  make userInfoConatainer active
        userInfoContainer.classList.add("active");

        //  now set the values jo api se aai hai ui par uske lye call the render wala function
        renderWeatherInfo(data);
    }  
    catch(err){

        // loadMyScreen.classList.remove("active");

      

    }

    // const resp = await fetch()
}








