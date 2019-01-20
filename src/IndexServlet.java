import com.google.gson.JsonObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

@WebServlet(name = "IndexServlet", urlPatterns = "/api/index")
public class IndexServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        HttpSession session = request.getSession();
        String sessionId = session.getId();
        Long lastAccessTime = session.getLastAccessedTime();

        JsonObject responseJsonObject = new JsonObject();
        responseJsonObject.addProperty("sessionID", sessionId);
        responseJsonObject.addProperty("lastAccessTime", new Date(lastAccessTime).toString());

        response.getWriter().write(responseJsonObject.toString());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String item = request.getParameter("item");
        System.out.println(item);
        HttpSession session = request.getSession();

        ArrayList<String> previousItems = (ArrayList<String>) session.getAttribute("previousItems");
        if (previousItems == null) {
            previousItems = new ArrayList<>();
            previousItems.add(item);
            session.setAttribute("previousItems", previousItems);
        } else {
            synchronized (previousItems) {
                previousItems.add(item);
            }
        }
        response.getWriter().write(String.join(",", previousItems));

    }
}
