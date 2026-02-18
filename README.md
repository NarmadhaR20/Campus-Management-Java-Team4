Digital Resource Booking System
    Digital Resource Booking is a premium, full-stack university resource management platform designed to streamline the scheduling of halls, labs, and event spaces.
    It features a robust multi-role portal system (Admin, Faculty, and Students) with built-in security, conflict prevention, and transparent feedback loops.

    
✨ Key Features:

🏢 Multi-Role Portals:
     Admin Dashboard: Full control over campus resources. Approve or reject formal booking requests and provide detailed feedback for denials. Monitor the entire university schedule in real-time.
     Faculty Portal: Formalize resource requests for workshops or labs. Review event suggestions from students and convert them into official booking requests.
     Student Dashboard: Propose event ideas directly to faculty. Track the status of suggestions and view a comprehensive campus-wide event schedule.
     
🛡️ Security & Reliability:
       Brute-Force Protection: Accounts are automatically locked for 30 minutes after 3 failed login attempts to safeguard user data.
       Conflict Prevention (30-Min Buffer): Stricter scheduling ensures a mandatory 30-minute transition gap between events, preventing double-bookings and allowing for venue preparation.
       JWT Authentication: Secure, token-based identity management across all portals.
       
📢 Transparent Feedback:
      Rejection Reasons: Administrators can provide specific reasons for denying a request (e.g., "Under maintenance"), which are instantly visible to the faculty and student involved.
      Global Error Handling: A centralized error system points out exactly what went wrong and where in the logic, ensuring a smoother user experience.

      
🚀 Technical Stack:
Frontend

  Framework: React.js
  Icons: Lucide-React
  API Client: Axios
  Styling: Premium Vanilla CSS (Glassmorphism & Vibrant Aesthetic)
Backend

  Framework: Spring Boot (Java)
  Database: MongoDB (NoSQL)
  Security: Spring Security with JWT (JSON Web Token)
  
API: RESTful architecture:

🛠️ Installation & Setup
1. Prerequisites
Java Development Kit (JDK 17 or higher)
MongoDB (MongoDB Compass)

2. Backend Setup
Navigate to the Campus-Backend directory.
Update application.properties with your MongoDB URI.

Run the application:
bash
./mvnw spring-boot:run

3. Frontend Setup
Navigate to the Campus-Frontend directory.
Install dependencies:
bash
npm install

Start the development server:
bash
npm run dev



📝 Usage Note
To ensure the new Security (3-attempt limit) and Overlapping Buffer logic are active, please ensure the backend is restarted after any configuration changes.

