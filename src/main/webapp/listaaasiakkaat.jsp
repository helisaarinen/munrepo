<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>

<meta charset="ISO-8859-1">
<link rel="stylesheet" type="text/css" href= "tyyli.css">
<script src ="scripts/main.js"></script>
<title>Asiakkaat</title>
</head>
<body>
Testi

<table id="listaus">
<thead>
<tr>
<th>Asiakas id</th>
<th>Etunimi</th>
<th>Sukunimi</th>
<th>Puhelinnumero</th>
<th>Sähköpostiosoite</th>
<th> </th>
</tr>
</thead>
<tbody id ="tbody"></tbody>
</table>


<span id="ilmo"> </span>


<script>

/*function haeAsiakkaat(){
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
*/
haeAsiakkaat();
</script>

</body>
</html>