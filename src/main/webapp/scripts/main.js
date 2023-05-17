//funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
		Array.from(new FormData(form).entries())
		.reduce((m, [ key, value ]) => Object.assing(m, {[key]: value}), {})
	);
}


//funktio arvon lukemiseen urlista avaimen perusteella
function requestURLParam(sParam){
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++){
        let sParameterName = sURLVariables[i].split("=");
        if(sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}


//tutkitaan lisättävät tiedot ennen niiden lähettämistä vackendiin
function tutkiJaLisaa(){
	if(tutkiTiedot()){ //jos tutkiTiedot palauttaa true,  lisää tiedot
		lisaaTiedot();
	}
}

//tutkitaan lisättävät tiedot ennen niiden lähettämistä vackendiin
function tutkiJaPaivita(){
	if(tutkiTiedot()){ //jos tutkiTiedot palauttaa true,  lisää tiedot
		paivitaTiedot();
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
	}else if(document.getElementById("sposti").value.length<7||document.getElementById("sposti").value.indexOf(".")==-1||document.getElementById("sposti").value.indexOf("@")==-1){
		// -1 tarkoittaa, että merkkiä ei löydy
		// voisi käyttää regular expression google java reg ex email 
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
	teksti=teksti.replace(/;/g, "");//&#59;	//sql-lauseen voi lopettaa puolipisteellä ja ajaa siihen toiseen lauseen eli tällä estetään se

	return teksti;
}


function varmistaPoisto(asiakas_id, nimi){
	if(confirm("Poista asiakas " + decodeURI(nimi)+ "?")){
		poistaAsiakas(asiakas_id, nimi);
	}
}

function asetaFocus(target){
	document.getElementById(target).focus();
	
}

//Funktio Enter-nappiin. Kutsu bodyn onkeydown()-metodista.
function tutkiKey(event, target){	
	if(event.keyCode==13){//13=Enter
		if(target=="listaa"){
			haeAsiakkaat();
		}else if(target=="lisaa"){
			tutkiJaLisaa();
		}else if(target=="paivita"){
			tutkiJaPaivita();
		}
	}else if(event.keyCode==113){//F2
		document.location="listaaasiakkaat.jsp"; //F2 pääsee takaisin listaa asiakkaat -sivulle
	}
}
