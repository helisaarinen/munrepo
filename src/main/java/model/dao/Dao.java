package model.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import model.Asiakas;

public class Dao {
	
	private Connection con=null;
	private ResultSet rs = null;
	private PreparedStatement stmtPrep=null; 
	private String sql;
	private String db ="Myynti.sqlite";

	private Connection yhdista(){		
		Connection con = null;    	
		
		String path = System.getProperty("catalina.base");
		path = path.substring(0, path.indexOf(".metadata")).replace("\\", "/"); // Eclipsessa
		//path =  new File(System.getProperty("user.dir")).getParentFile().toString() +"\\"; //Testauksessa
				//System.out.println(path); //Tästä näet mihin kansioon laitat tietokanta-tiedostosi
				//path += "/webapps/"; //Tuotannossa. Laita tietokanta webapps-kansioon
		String url = "jdbc:sqlite:" + path + db;

		try {	       
			Class.forName("org.sqlite.JDBC");
	        con = DriverManager.getConnection(url);	
	        System.out.println("Yhteys avattu.");
	     }catch (Exception e){	
	    	 System.out.println("Yhteyden avaus epäonnistui.");
	        e.printStackTrace();	         
	     }
	     return con;
	}
	/*
	private void testaaYhteys() {
		con = yhdista();
		try {
			con.close();
			System.out.println("Yhteys suljettu.");
		} catch (SQLException e) {			
			e.printStackTrace();
		}
	}
	*/

	private void sulje() {		
		if (stmtPrep != null) {
			try {
				stmtPrep.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (con != null) {
			try {
				con.close();
				System.out.println("Yhteys suljettu.");
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	
	public ArrayList<Asiakas> getAllItems(){
		
		ArrayList<Asiakas> asiakkaat = new ArrayList<Asiakas>();
		sql = "SELECT * FROM asiakkaat ORDER BY asiakas_id DESC"; // Suurin id ekaksi
		try {
			con = yhdista();
			if (con != null) { //jos yhteys onnistui
				stmtPrep = con.prepareStatement(sql);
				rs = stmtPrep.executeQuery();
				if (rs != null) {
					while (rs.next()) {
						Asiakas asiakas = new Asiakas();
						asiakas.setAsiakas_id(rs.getInt(1));// suluissa voi lukea myös sarakkeen nimi lainausmerkeissä
						asiakas.setEtunimi(rs.getString(2));
						asiakas.setSukunimi(rs.getString(3));
						asiakas.setPuhelin(rs.getString(4));
						asiakas.setSposti(rs.getString(5));

						asiakkaat.add(asiakas);
					}
				}
						
			}
		}catch (Exception e) {
			e.printStackTrace();
		}finally {
			sulje();
		}
		return asiakkaat;		
	}
	
public ArrayList<Asiakas> getAllItems(String searchStr){//Metodeja voi kuormittaa, 
	//kunhan parametreiss䠥roja
	ArrayList<Asiakas> asiakkaat = new ArrayList<Asiakas>();
	sql ="SELECT * FROM asiakkaat WHERE etunimi LIKE ? or puhelin LIKE ? or sposti LIKE ? ORDER BY asiakas_id DESC";

	try {
		con = yhdista();
		if(con != null) { // jos yhteys onnistui
			stmtPrep = con.prepareStatement(sql);
			stmtPrep.setString(1, "%" + searchStr + "%");
			stmtPrep.setString(2, "%" + searchStr + "%");
			stmtPrep.setString(3, "%" + searchStr + "%");
			stmtPrep.setString(4, "%" + searchStr + "%");
			rs = stmtPrep.executeQuery();
			if (rs != null) { // jos kysely onnistui
				while (rs.next()) {
					Asiakas asiakas = new Asiakas();
					asiakas.setAsiakas_id(rs.getInt(1));
					asiakas.setEtunimi(rs.getString(2));
					asiakas.setSukunimi(rs.getString(3));
					asiakas.setPuhelin(rs.getString(4));
					asiakas.setSposti(rs.getString(5)); //tässä oli arvo 4
					asiakkaat.add(asiakas);		
		}
	}
}
	
} catch (Exception e) {
	e.printStackTrace();
} finally {
	sulje();
}
return asiakkaat;
}


public boolean addItem(Asiakas asiakas) {
	boolean paluuArvo = true;
	sql = "INSERT INTO asiakkaat(etunimi, sukunimi, puhelin, sposti)VALUES(?,?,?,?)";
	try {
		con = yhdista();
		stmtPrep = con.prepareStatement(sql);
		stmtPrep.setString(2, asiakas.getEtunimi());
		stmtPrep.setString(3, asiakas.getSukunimi());
		stmtPrep.setString(4,  asiakas.getPuhelin());
		stmtPrep.setString(5,  asiakas.getSposti());
		stmtPrep.executeUpdate();		// lisätään asiakas tietokantaan
	} catch (Exception e) {
		paluuArvo=false;
		e.printStackTrace();
	} finally {
		sulje();
	}
	return paluuArvo;
}

public boolean removeItem(int asiakas_id) { //oikeassa elämässä tiedot ensisijaisesti merkitään poistetuksi (delete-lausetta ajetaan harvoin)
	boolean paluuArvo = true;
	sql = "DELETE FROM asiakkaat WHERE asiakas_id=?";
	try {
		con = yhdista();
		stmtPrep = con.prepareStatement(sql);
		stmtPrep.setInt(1, asiakas_id);
		stmtPrep.executeUpdate();
	}catch (SQLException e) {
		e.printStackTrace();
		paluuArvo = false;
	}finally {
		sulje();
	}
	return paluuArvo;
	}

public Asiakas getItem(int asiakas_id) {
	Asiakas asiakas= null;
	sql = "SELECT * FROM asiakkaat WHERE id=?";       
	try {
		con=yhdista();
		if(con!=null){ 
			stmtPrep = con.prepareStatement(sql); 
			stmtPrep.setInt(1, asiakas_id);
    		rs = stmtPrep.executeQuery();  
    		if(rs.isBeforeFirst()){ //jos kysely tuotti dataa, eli rekNo on käytössä
    			rs.next();
    			asiakas = new Asiakas();
    			asiakas.setAsiakas_id(rs.getInt(1));
    			asiakas.setEtunimi(rs.getString(2));
    			asiakas.setSukunimi(rs.getString(3));
    			asiakas.setPuhelin(rs.getString(4));
    			asiakas.setSposti(rs.getString(5));
			      			
			}        		
		}			 
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		sulje();
	}		
	return asiakas;		
}

public boolean changeItem(Asiakas asiakas){
	boolean paluuArvo=true;
	sql="UPDATE asiakkaat SET etunimi=?, sukunimi=?, puhelin=?, sposti=? WHERE asiakas_id=?";						  
	try {
		con = yhdista();
		stmtPrep=con.prepareStatement(sql); 
		stmtPrep.setString(1, asiakas.getEtunimi());
		stmtPrep.setString(2, asiakas.getSukunimi());
		stmtPrep.setString(3, asiakas.getPuhelin());
		stmtPrep.setString(4, asiakas.getSposti());
		stmtPrep.setInt(5, asiakas.getAsiakas_id());
		stmtPrep.executeUpdate();	        
	} catch (Exception e) {				
		e.printStackTrace();
		paluuArvo=false;
	} finally {
		sulje();
	}				
	return paluuArvo;
}

public boolean removeAllItems(String pwd){
	boolean paluuArvo=true;
	if(!pwd.equals("Nimda")) { //"Kovakoodattu" salasana -ei ole hyvä idea!
		return false;
	}
	sql="DELETE FROM Autot";						  
	try {
		con = yhdista();
		stmtPrep=con.prepareStatement(sql); 			
		stmtPrep.executeUpdate();	        
	} catch (Exception e) {				
		e.printStackTrace();
		paluuArvo=false;
	} finally {
		sulje();
	}				
	return paluuArvo;
}


public String findUser(String uid, String pwd) {
	String nimi = null;
	sql="SELECT * FROM asiakkaat WHERE sposti=? AND salasana=?";						  
	try {
		con = yhdista();
		if(con!=null){ 
			stmtPrep = con.prepareStatement(sql); 
			stmtPrep.setString(1, uid);
			stmtPrep.setString(2, pwd);
    		rs = stmtPrep.executeQuery();  
    		if(rs.isBeforeFirst()){ //jos kysely tuotti dataa, eli asiakas löytyi
    			rs.next();
    			nimi = rs.getString("etunimi")+ " " +rs.getString("sukunimi");     			      			
			}        		
		}			        
	} catch (Exception e) {				
		e.printStackTrace();			
	} finally {
		sulje();
	}				
	return nimi;
}

}
