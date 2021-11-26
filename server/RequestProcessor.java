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

			// Parse through query string.
			String leftOp = "";
			boolean leftOpComplete = false;
			String rightOp = "";
			boolean rightOpComplete = false;
			char operation = 'x';
			for (int i = 17; i < incoming.length(); i++) {

				// add char to leftOp
				if (!leftOpComplete && incoming.charAt(i) != '&') {
					leftOp += incoming.charAt(i);
				}

				// set leftOp as complete
				if (!leftOpComplete && incoming.charAt(i) == '&') {
					leftOpComplete = true;
					i += 14;
				}

				// add char to rightOp
				if (!rightOpComplete && leftOpComplete && incoming.charAt(i) != '&') {
					rightOp += incoming.charAt(i);
				}

				// Locate operation
				if (leftOpComplete && incoming.charAt(i) == '&') {
					rightOpComplete = true;
					operation = incoming.charAt(i + 11);
				}
			}

			// Handle operator as a char value.
			float total = 0;
			if (operation == '+') {
				total = Float.parseFloat(leftOp) + Float.parseFloat(rightOp);
			} else if (operation == '-') {
				total = Float.parseFloat(leftOp) - Float.parseFloat(rightOp);
			} else if (operation == '*') {
				total = Float.parseFloat(leftOp) * Float.parseFloat(rightOp);
			} else if (operation == '/') {
				total = Float.parseFloat(leftOp) / Float.parseFloat(rightOp);
			} else if (operation == '%') {
				total = Float.parseFloat(leftOp) % Float.parseFloat(rightOp);
			}

			// Build JSON Obj for response.
			jsonObject.put("Expression", leftOp + operation + rightOp);
			jsonObject.put("Result", total);
		} catch (IOException | JSONException e) {
			e.printStackTrace();
		}

		try {
			String response = msgToClient + jsonObject.toString();
			os.write(response.getBytes());
			os.flush();
			socket.close();
		} catch (IOException ioe) {

		}
	}

}
