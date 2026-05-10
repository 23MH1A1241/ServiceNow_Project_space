# CaseFlow AI - Enterprise Support Portal

CaseFlow AI is a modern, high-performance, enterprise-grade customer support portal built with **React, Vite, and Tailwind CSS**. It acts as the frontend interface for a dedicated **ServiceNow Zurich scoped application**, providing a seamless, role-based experience for customers, agents, supervisors, and administrators.

---

## 🚀 Key Features

*   **ServiceNow REST API Integration**: Directly interfaces with the ServiceNow backend (dev296999 instance) via securely proxied REST API endpoints.
*   **Dynamic Role-Based Dashboards**: Intelligent UI rendering based on user role (Authentication simulated via `sys_user` concepts):
    *   **Customer Dashboard**: View personal open cases, recent activity, and SLA tracking timelines.
    *   **Agent Dashboard**: Workload distribution pie charts, SLA warnings, and assigned case management.
    *   **Supervisor Dashboard**: Team queue overviews, agent performance comparison charts, and critical escalation alerts.
    *   **Admin Dashboard**: Global system analytics, case ingestion volume area charts, and priority distribution metrics.
*   **Native AI Virtual Agent**: A conversational React chatbot that guides users through the "Report An Issue" flow, capturing product categories, descriptions, and urgencies before automatically invoking the ServiceNow API to generate a Case.
*   **Live Case Tracking**: Real-time status updates and animated SLA progression indicators.
*   **Enterprise UI/UX**: Designed using "Samsung-inspired" enterprise aesthetics featuring glassmorphism, responsive data tables, Recharts visualizations, and Lucide-react iconography.

---

## 🏗️ Architecture Stack

*   **Framework**: React 18 + Vite (for lightning-fast HMR and optimized builds)
*   **Styling**: Tailwind CSS v3 (Custom Enterprise Configuration)
*   **Data Visualization**: Recharts (Dynamic Dashboarding)
*   **Icons**: Lucide React
*   **Routing**: React Router DOM (Role-protected routes)
*   **Backend Interop**: Axios + Vite Dev Server Proxy (Resolving ServiceNow CORS & Authentication)

---

## ⚙️ Local Development Setup

To run this project locally, ensure you have **Node.js** installed.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **View the Portal**:
   Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

---

## 🔐 ServiceNow Connection Details

The portal communicates with the ServiceNow instance using a secure proxy configured in `vite.config.js`. 

*   **Target Instance**: `https://dev296999.service-now.com`
*   **Primary Data Table**: `sn_customerservice_case`
*   **Proxy Setup**: All requests to `/api/now/...` are intercepted by Vite, injected with the required Basic Authentication headers, and forwarded to ServiceNow to bypass CORS restrictions during local development.

> **Note for Production Deployment**: When moving this application to production, the `vite.config.js` proxy will not be active. Ensure your production web server (Nginx, Node, etc.) handles the proxying or that proper OAuth / CORS policies are configured on the ServiceNow instance.

---

## 👥 Authentication Testing

For demonstration and development purposes, you can use the quick login buttons on the portal's login screen to instantly simulate different user roles without requiring strict OAuth handshakes:

*   **Customer** (Simulates a standard user creating and tracking their own cases)
*   **Agent** (Simulates an ITIL user managing assigned queues)
*   **Supervisor** (Simulates a team lead monitoring escalations)
*   **Admin** (Simulates a system administrator with global data visibility)

---

## 📁 Repository Structure

```text
/src
 ├── /api               # ServiceNow API integration logic (serviceNow.js)
 ├── /components        # Reusable UI components (Layout, Dashboards, etc.)
 ├── /context           # React Context for global state (AuthContext.jsx)
 ├── /pages             # Top-level route components (Home, Chatbot, TrackCase)
 ├── App.jsx            # Application root and route definitions
 ├── index.css          # Global Tailwind and Glassmorphism utilities
 └── main.jsx           # React Entry point
```

---

*Designed and integrated for the CaseFlow AI ServiceNow Scoped Application.*
