package control;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import model.Asiakas;
import model.dao.Dao;

/**
 * Servlet implementation class Asiakkaat
 */
@WebServlet("/asiakkaat/*") // osoite/endpoint
public class Asiakkaat extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
   
    public Asiakkaat() {
      System.out.println("Asiakkaat.Asiakkaat()");
    }

//tietojen hakeminen
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	System.out.println("Asiakkaat.doGet()");
	HttpSession session = request.getSession(true);
	if(session.getAttribute("kayttaja")==null){
		return;
	}
	String hakusana = request.getParameter("hakusana");
	String asiakas_id = request.getParameter("asiakas_id");
	Dao dao = new Dao();
	ArrayList<Asiakas> asiakkaat = dao.getAllItems();
	String strJSON = "";
	if(hakusana!=null) { // jos kutsun mukana tuli hakusana
		if (!hakusana.equals("")) {//jos hakusana ei ole tyhjä
			asiakkaat= dao.getAllItems(hakusana); //haetaan kaikki hakusanan mukaiset asiakkaat
	}else {
		asiakkaat = dao.getAllItems();//haetaan kaikki asiakkaat
	}
		strJSON = new Gson().toJson(asiakkaat);
	}else if(asiakas_id!=null) {
		Asiakas asiakas = dao.getItem(Integer.parseInt(asiakas_id));
		strJSON = new Gson().toJson(asiakas);
	}else {
		asiakkaat = dao.getAllItems();//haetaan kaikki asiakkaat
		strJSON = new Gson().toJson(asiakkaat);
	}
	
	response.setContentType("application/json; charset = UTF-8");
	PrintWriter out = response.getWriter();
	out.print(strJSON);
	
	
		}

	//tietojen lisääminen
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doPost()");
		HttpSession session = request.getSession(true);
		if(session.getAttribute("kayttaja")==null){
			return;
		}
		
		//Luetaan JSON-tiedot POST-pyynnön bodysta ja luodaan niiden perusteella uusi auto
		String strJSONInput = request.getReader().lines().collect(Collectors.joining());
		//System.out.println(strJSONInput); //otetaan vastaan lomakkeelta tullut data
		Asiakas asiakas = new Gson().fromJson(strJSONInput, Asiakas.class);	 // luodaan uusi asiakas
		//System.out.println(asiakas);
		Dao dao = new Dao();
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter();
		if(dao.addItem(asiakas)) {
			out.println("{\"response\":1}");  //lisääminen onnistui {"response":1}
		}else {
			out.println("{\"response\":0}");  //lisääminen epäonnistui {"response":0}
		}
		
		
		
	}

//tietojen muuttaminen
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doPut()");
		HttpSession session = request.getSession(true);
		if(session.getAttribute("kayttaja")==null){
			return;
		}
		//Luetaan JSON-tiedot PUT-pyynnön bodysta ja luodaan niiden perusteella uusi auto
		String strJSONInput = request.getReader().lines().collect(Collectors.joining());
		//System.out.println("strJSONInput " + strJSONInput);		
		Asiakas asiakas= new Gson().fromJson(strJSONInput, Asiakas.class);		
		//System.out.println(auto);		
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter out = response.getWriter();
		Dao dao = new Dao();			
		if(dao.changeItem(asiakas)){ //metodi palauttaa true/false
			out.println("{\"response\":1}");  //Asiakkaan muuttaminen onnistui {"response":1}
		}else{
			out.println("{\"response\":0}");  //ASiakkaan muuttaminen epäonnistui {"response":0}
		}
	}

//tietojen poistaminen
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Asiakkaat.doDelete()");
		HttpSession session = request.getSession(true);
		if(session.getAttribute("kayttaja")==null){
			return;
		}
		
		int asiakas_id = Integer.parseInt(request.getParameter("asiakas_id")); //merkki muutettava kokonaisluvukssi
		Dao dao = new Dao();
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		if(dao.removeItem(asiakas_id)) {
			out.println("{\"response\":1}");  // poistaminen onnistui {"response":1}
		}else {
			out.println("{\"response\":0}");  //poistaminen epäonnistui {"response":0}
		}
		
	
	}

}
