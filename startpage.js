
fetchData(97, 78);

async function fetchData(X, Y) {
    try {
	const response1 = await fetch("https://api.weather.gov/gridpoints/LSX/" + X + "," + Y + "/forecast/hourly");
        const response2 = await fetch("https://api.weather.gov/gridpoints/LSX/" + X + "," + Y + "/forecast");
        if((!response1.ok) && (!response2.ok)){throw new Error("Could not fetch response's");}
 
        const data1 = await response1.json();
	const data2 = await response2.json();
	if(X == 97 && Y == 78) {document.getElementById('location').innerHTML = "Edwardsville, Illinois";}
       
	var jsondata1 = data1; 
        var jsondata2 = data2;
	console.log(jsondata1, jsondata2); 
	getWeather(jsondata1,jsondata2);
    }
    catch(error){console.error(error);}
}


function getWeather(jsondata1, jsondata2) {
    var temp = document.getElementById("temp");
        temp.innerHTML = jsondata1.properties.periods[0].temperature + jsondata1.properties.periods[0].temperatureUnit;
    
    var a = document.getElementById('main_img'); 

        scrollmenu(jsondata1,jsondata2);
        a.src = determineIcon(jsondata1, 0);
}


function determineIcon(jsondata1, t) {
    var name = jsondata1.properties.periods[t].name;
    var iconlink = jsondata1.properties.periods[t].icon;

    var iconN = iconlink.slice(35, 42);
    console.log(iconN, iconlink); 

    if(iconlink.slice(35, 40) == "night") {return "img/clear_night.png";}
    else if((iconN == "day/skc") || (iconN == "day/few")) {return "img/Sunny.png";}
           else if((iconN == "day/sct") || (iconN == "day/bkn")) {return "img/cloudy_weather.png";}
              else if((iconN == "day/rain") || (iconN == "day/rain_showers") || (iconN == "rain_showers_hi")) {return "img/rainy.png"}
}


async function SearchBox() {
    document.getElementById("scrollmenu").innerHTML = "";
    var search = document.getElementById('link_id').value;

    var query = "https://nominatim.openstreetmap.org/search?q=" + search + "&format=json";

    try {const response = await fetch(query);
         if(!response.ok) {throw new Error("could not fetch geolocation");}
	 const geodata = await response.json();
         console.log(geodata)

	 var lat = geodata[0].lat; var lon = geodata[0].lon; var location = geodata[0].display_name;
	 document.getElementById('location').innerHTML = location;
	 
	} catch(error){console.log(error);}

    console.log(location);
    UpdateLocation(lat, lon);
}


async function UpdateLocation(lat, lon) {
const gridpoints = "https://api.weather.gov/points/" + lat + "," + lon;
    try {
	const response = await fetch(gridpoints)
        if(!response.ok) {throw new Error("Could not catch error");} 
        const griddata = await response.json();

        const Xcoord = griddata.properties.gridX;
        const Ycoord = griddata.properties.gridY;

	console.log(griddata);
	fetchData(Xcoord, Ycoord);
    }
    catch(error){console.error(error);}
}


async function getlinks() {    
    var name = document.getElementById("redsearch").value;
    if(name == "") {var url = ["https://www.reddit.com/r/javascript/hot.json", "https://www.reddit.com/r/tech/hot.json"];}
 
   else {var link = "https://www.reddit.com/r/" + name + "/hot.json"; var url = [link];}

    try {
	for(let i = 0; i < url.length; i++) {
	    const linkres = await fetch(url[i]);
	    if(!linkres.ok) {throw new Error("could not fetch response");}
	    const linkdata = await linkres.json();
	    console.log(linkdata);
	    appendlinks(linkdata);
	}
    }
	catch(error){console.error(error)};
}



function appendlinks(linkdata) {
    const names = document.getElementById("links");
    names.appendChild(document.createElement("br"));

    for(var j = 3; j < 13; j++) {
    var a = document.createElement('a');
    var title = linkdata.data.children[j].data.title;
    var linkText = document.createTextNode(title);
    const subreddit = "r/" + linkdata.data.children[j].data.subreddit;
    const link = "https://www.reddit.com/" + linkdata.data.children[j].data.permalink;

    a.appendChild(linkText);
    a.title = linkdata.data.children[j].data.title;
    a.href = link;
    a.target = "_blank";

    const p = document.getElementById("links");
    p.appendChild(document.createTextNode(subreddit));
    p.appendChild(document.createElement("br"));
    p.appendChild(a);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createElement("br"));
    }
 }

function reloadbutton() {
const container = document.getElementById('links');
container.textContent = '';
}


function scrollmenu(jsondata1, jsondata2){
    for(var t = 1; t < 10; t++){
    var temp = jsondata1.properties.periods[t].temperature + jsondata1.properties.periods[t].temperatureUnit;
    const p = document.createElement("p");  p.innerHTML = temp;
    var img = document.createElement("img");
    var divName = "childDiv" + t;
    const childDiv = document.createElement("div"); childDiv.style.id = (divName);
	
    img.src = determineIcon(jsondata1, t);
    img.width = "30"; img.height = "30"; 
    const headdiv = document.getElementById('scrollmenu');

	childDiv.appendChild(img);
	childDiv.appendChild(p);
	childDiv.style.float = "left";
	headdiv.appendChild(childDiv);
	headdiv.style.marginTop = "30px";
	headdiv.style.fontSize = "20px";
	headdiv.style.marginLeft = "130px";
	childDiv.style.marginRight = "35px";
    }
}


function gotoSubreddit(link) {
    return link;
}
