function haeAsiakkaat(){
	let url = "asiakkaat";
	let requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/x-www.form-urlencoded" }
	};
	fetch(url, requestOptions)
	.then(response => response.json()) // muutetaan vastausteksti JSON-objektiksi
	//.then(response => console.log(response)) //
	.then(response => printItems(response))
	.catch(errorText => console.error("Fetch failed: " + errorText))
}

function printItems(respObjList){
	let htmlStr="";
	for(let item of respObjList){
		htmlStr+="<tr id = 'rivi_'" +item.asiakas_id+"'>";
		htmlStr+="<td>" + item.etunimi + "</td>";
		htmlStr+="<td>" + item.sukunimi + "</td>";
		htmlStr+="<td>" + item.puhelin + "</td>";
		htmlStr+="<td>" + item.sposti + "</td>";
		htmlStr+="</tr>"
	
	}
	document.getElementById("tbody").innerHTML = htmlStr;	
}
