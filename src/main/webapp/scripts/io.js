
function haeAsiakkaat(){
	let url = "asiakkaat?hakusana=" + document.getElementById("hakusana").value;
	let requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded" }
	};
	fetch(url, requestOptions)
	.then(response => response.json()) // muutetaan vastausteksti JSON-objektiksi
	//.then(response => console.log(response)) //
	.then(response => printItems(response))
	.catch(errorText => console.error("Fetch failed: " + errorText))
}


//kirjoitetaan tiedot taulukkoon JSON-objektilistasta 
function printItems(respObjList){
	//console.log(respObjList);
	let htmlStr="";
	for(let item of respObjList){ //yksi kokoelmaloopeita
		htmlStr+="<tr id = 'rivi_'" +item.asiakas_id+"'>";
		htmlStr+="<td>" + item.etunimi + "</td>";
		htmlStr+="<td>" + item.sukunimi + "</td>";
		htmlStr+="<td>" + item.puhelin + "</td>";
		htmlStr+="<td>" + item.sposti + "</td>";
		htmlStr+="<td><a href='muutaasiakas.jsp?id="+item.asiakas_id+"'>Muuta</a>&nbsp;";    
		htmlStr+="<span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi + " " + item.sukunimi)+"')>Poista</span></td>"; //item.id ei tarvitse 'hipsuja', koska se on int
		//encodeURI() muutetaan erikoismerkit, välilyönnit jne. UTF-8 -merkeiksi
		//decodeURI() otetaan vastaan
		htmlStr+="</tr>"
	
	}
	document.getElementById("tbody").innerHTML = htmlStr;	
}


//Funktio tietojen lisäämistä varten.
//Kutsutaan backin POST-metodia ja välitettään kutsun mukana auton tiedot json-stringinä
function lisaaTiedot(){
	let formData = serialize_form(document.lomake);//Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);
	let url="asiakkaat";
	let requestOptions = {
		method: "POST", //Lisätään asiakas
		headers: {"Content-Type": "application/json; charset=UTF-8"},//lähtevä data
		body: formData //bodyssa lähtevä data on formdata
		};
		fetch(url, requestOptions)
		.then(response => response.json()) //Muutetaan vastausteksti Json-objektiksi
		.then(responseObj => {
			//console.log(responseObj);
			if(responseObj.response==0){ //laitetaan backend palauttamaan meille jotain
				document.getElementById("ilmo").innerHTML = "Asiakkaan lisääminen epäonnistui.";
				
			}else if (responseObj.response==1){
				document.getElementById("ilmo").innerHTML = "Asiakkaan lisääminen onnistui.";
				document.lomake.reset(); //tyhjennetään lomake
			}
					setTimeout(function(){document.getElementById("ilmo").innerHTML="";},3000);
		})
		.catch(errorText => console.errot("Fetch failed: " + errorText));
	}
	
	
	
function poistaAsiakas(asiakas_id, nimi){
	let url = "asiakkaat?asiakas_id="+asiakas_id;
	let requestOptions={
		method: "DELETE",
		//headers: { "Content-Type": "application/json"}
	};
	fetch(url, requestOptions)
	.then(response => response.json()) //Muutetaan vastausteksti JSON-objektiksi
	.then(responseObj => {
		//console.log(responseObj);
		if(responseObj.response==0){
			alert("Asiakkaan poistaminen epäonnistui.");
		}else if(responseObj.response==1){
			document.getElementById("rivi_"+id).style.backgroundColor="red";
			alert("Asiakkaan "+ decodeURI(nimi) + " poistaminen onnistui.");
			haeAsiakkaat();
		}
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}

//Haetaan muutettavan asiakkaan tiedot. 
//Kutsutaan backin GET-metodia ja välitetään kutsun mukana muutettavan tiedon id
function haeAsiakas(){
	let url = "asiakkaat?asiakas_id=" + requestURLParam("asiakas_id"); //funktio, jolla kutsutaan asiakkaat-backendiä
	let requestOptions = {
		method: "GET",
		headers: {"Content-Type": "application/x-www-form-urlencoded"}
	};
	fetch(url, requestOptions)
	.then(response => response.json())// muut4etaan vastausteksti JSON-objektiksi
	.then(response=> {
		documen.getElementById("asiakas_id").value=response.asiakas_id;
		documen.getElementById("etunimi").value=response.etunimi;
		documen.getElementById("sukunimi").value=response.sukunimi;
		documen.getElementById("puhelin").value=response.puhelin;
		documen.getElementById("sposti").value=response.sposti;
	})
	.catch(errorText => console.error("Fetch failed: " + errorText));
}



//funktio tietojen päivittämistä varten. Kutsutaan backin PUT-metodia ja välitetään kutsun mukana uudet tiedot json-stringinä.
function paivitaTiedot(){	
	let formData = serialize_form(lomake); //Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);	
	let url = "asiakkaat";    
    let requestOptions = {
        method: "PUT", //Muutetaan asiakas
        headers: { "Content-Type": "application/json; charset=UTF-8" },  
    	body: formData
    };    
    fetch(url, requestOptions)
    .then(response => response.json())//Muutetaan vastausteksti JSON-objektiksi
   	.then(responseObj => {	
   		//console.log(responseObj);
   		if(responseObj.response==0){
   			document.getElementById("ilmo").innerHTML = "Asiakkaan muutos epäonnistui.";	
        }else if(responseObj.response==1){ 
        	document.getElementById("ilmo").innerHTML = "Asiakkaan muutos onnistui.";
			document.lomake.reset(); //Tyhjennetään asiakkaan muuttamisen lomake		        	
		}
   	})
   	.catch(errorText => console.error("Fetch failed: " + errorText));
}

