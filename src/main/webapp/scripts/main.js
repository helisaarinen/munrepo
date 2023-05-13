//funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
		Array.from(new FormData(form).entries())
		.reduce((m, [ key, value ]) => Object.assing(m, {[key]: value}), {})
	);
}

function haeAsiakkaat(){
	let url = "asiakkaat?hakusana" + document.getElementById("hakusana").value;
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
		htmlStr+="<td><span class='poista' onclick=varmistaPoisto("+item.asiakas_id+",'"+encodeURI(item.etunimi)+"')>Poista</span></td>"; //item.id ei tarvitse 'hipsuja', koska se on int
		//encodeURI() muutetaan erikoismerkit, välilyönnit jne. UTF-8 -merkeiksi
		//decodeURI() otetaan vastaan
		htmlStr+="</tr>"
	
	}
	document.getElementById("tbody").innerHTML = htmlStr;	
}

//tutkitaan lisättävät tiedot ennen niiden lähettämistä vackendiin
function tutkiJaLisaa(){
	if(tutkiTiedot()){
		lisaaTiedot();
	}
}


//tutkitaan syöttötietojen tarkistamista varten (yksinkertainen)
function tutkiTiedot(){
	let ilmo="";
	if(document.getElementById("etunimi").value.length<2){
		ilmo="Etunimi ei kelpaa! Yritä uudelleen.";
		document.getElementById("etunimi").focus();
	}else if(document.getElementById("sukunimi").value.length<2){
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();		
	}else if(document.getElementById("puhelin").value.length<7){
		ilmo="Puhelinnumero ei kelpaa! Skarppaa vähä.";
		document.getElementById("puhelin").focus();		
	}else if(document.getElementById("sposti").value.length<7){
		ilmo="Anna sähköpostiosoite!";
		document.getElementById("sposti").focus();		
	}
	if(ilmo!=""){
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function(){document.getElementById("ilmo").innerHTML="";},3000);
		return false;
	}else{
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value)
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value)
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value)
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value)
	return true;
	}
}


//Funktio XSS-hyökkäysten estämiseksi (Cross-site scripting)
function siivoa(teksti){
	teksti=teksti.replace(/</g, "");//&lt;
	teksti=teksti.replace(/>/g, "");//&gt;	
	teksti=teksti.replace(/'/g, "''");//&apos;	
	return teksti;
}

//Funktio tietojen lisäämistä varten.
//Kutsutaan backin POST-metodia ja välitettään kutsun mukana auton tiedot json-stringinä
function lisaaTiedot(){
	let formData = serialize_form(document.lomake);//Haetaan tiedot lomakkeelta ja muutetaan JSON-stringiksi
	//console.log(formData);
	let url="asiakkaat";
	let requestOptions = {
		method: "POST", //Lisätään asiakas
		headers: {"Content-Type": "application/json"},//lähtevä data
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
	

function varmistaPoisto(etunimi, sukunimi){
	if(confirm("Poista asiakas " + decodeURI(etunimi)+ decodeURI(sukunimi) + "?")){
		poistaAsiakas(encodeURI(etunimi), encodeURI(sukunimi));
	}
}

function poistaAsiakas(etunimi,sukunimi){
	let url = "asiakkaat?asiakas_id"+asiakas_id;
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
			alert("Asiakkaan "+ decodeURI(etunimi) + decodeURI(sukunimi)  + " poistaminen onnistui.");
			haeAsiakkaat();
		}
	})
}



