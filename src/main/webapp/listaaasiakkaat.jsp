<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>

<meta charset="ISO-8859-1">
<script src ="scripts/main.js"></script>
<link rel="stylesheet" type="text/css" href= "css/tyyli.css">
<title>Asiakkaat</title>
</head>
<body> 	
<table id="listaus">
<thead>
		<tr>
			<th colspan="5" class="oikealle"><a id="linkki" href="lisaaasiakas.jsp">Lisää uusi asiakas</a></th>
		</tr>
<tr>
<th>Hakusana:</th>
<th colspan="3"><input type= "text" id="hakusana"></th>
<th><input type= "button" value = "hae" id="hakunappi" onclick= "haeAsiakkaat()"></th>
</tr>
<tr>

<th>Etunimi</th>
<th>Sukunimi</th>
<th>Puhelinnumero</th>
<th>Sähköpostiosoite</th>
<th> </th>

</tr>
</thead>
<tbody id ="tbody"></tbody>
</table>
<span id = "ilmo"></span>
<script>
haeAsiakkaat();
</script>
</body>
</html>