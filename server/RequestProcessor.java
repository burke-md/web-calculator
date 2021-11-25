import java.io.*;
import java.net.Socket;


import org.json.JSONException;
import org.json.JSONObject;

public class RequestProcessor implements Runnable {
	private Socket socket = null;
	private OutputStream os = null;
	private BufferedReader in = null;
	private DataInputStream dis = null;
	private String msgToClient = "HTTP/1.1 200 OK\n" + "Server: HTTP server/0.1\n"
			+ "Access-Control-Allow-Origin: *\n\n";
	private JSONObject jsonObject = new JSONObject();

	public RequestProcessor(Socket Socket) {
		super();
		try {
			socket = Socket;
			in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			os = socket.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void run() {

		String incoming;
		try {
			incoming = in.readLine();
			System.out.println(incoming);
			
			String leftOp = "";
		    boolean leftOpComplete = false;
		    String rightOp = "";
		    boolean rightOpComplete = false;
		    char operation = 'x';
		    
		    for (int i = 17; i < incoming.length(); i++) {
		    			
		    
		      //add char to leftOp
		      if (!leftOpComplete && incoming.charAt(i) != '&'){
		      leftOp += incoming.charAt(i);
		      }
		      
		      //set left op as complete
		      if (!leftOpComplete && incoming.charAt(i) == '&'){
		      leftOpComplete = true;
		      i += 14;
		      }
		      
		      //add char to rightOp
		      if (!rightOpComplete && leftOpComplete && incoming.charAt(i) != '&'){
		      rightOp += incoming.charAt(i);
		      }
		      
		      //Locate operation
		      if (leftOpComplete && incoming.charAt(i) == '&'){
		      rightOpComplete = true;
		      operation = incoming.charAt(i + 11);
		      }	      
		    }  
			
		    System.out.println(leftOp);
		    System.out.println(rightOp);
		    System.out.println(operation); 
		    
			
			jsonObject.put("Expression", "1 + 2");
			jsonObject.put("Result", "3");
		} catch (IOException | JSONException e) {
			e.printStackTrace();
		}

		// Implemented this try/catch block to resolve unhandled error, errors.
		try {
			String response = msgToClient + jsonObject.toString();
			os.write(response.getBytes());
			os.flush();
			socket.close();
		} catch (IOException ioe) {

		}
	}
	
	
	
}
