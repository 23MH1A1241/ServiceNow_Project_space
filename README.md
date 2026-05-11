# CaseFlow AI — Intelligent Enterprise Support Portal

CaseFlow AI is a high-performance customer service portal designed for large-scale enterprise environments. It integrates directly with ServiceNow to automate case categorization, agent assignment, and escalation management using a weighted AI-routing engine.

## 🚀 Key Features

- **Automated Case Categorization**: Uses `CaseCategorizationEngine` with 30+ keywords to accurately route cases.
- **AI Agent Matching**: Implements `AgentMatchingUtil` with a weighted scoring algorithm (Skill 40%, Workload 30%, Availability 20%, Cert 10%).
- **Multi-Level Escalation**: Full implementation of all 7 ESC rules (ESC-001 through ESC-007) for SLA compliance.
- **Real-Time Dashboards**: Four distinct, role-based dashboards (Admin, Supervisor, Agent, Customer) with live ServiceNow metrics.
- **Intelligent Virtual Agent**: Guided chatbot flow with NLU intent extraction and integrated CSAT survey.
- **SLA & Compliance**: Proactive monitoring of SLA breach risks with regional business hour support.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide-React, Recharts.
- **Backend**: ServiceNow Scoped App (x_1939544_casefl_0).
- **Integration**: ServiceNow REST APIs via secure Vite proxy.
- **CI/CD**: GitHub Actions for automated build and validation.

## 🔧 Setup & Configuration

1. **ServiceNow Instance**: Ensure you have access to a ServiceNow developer instance (e.g., `dev296999`).
2. **Environment Variables**: Copy `.env.example` to `.env` and fill in your credentials:
   ```env
   SN_USERNAME=your_username
   SN_PASSWORD=your_password
   SN_INSTANCE=dev296999
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
5. **ServiceNow Backend**: Import the `ServiceNow_Update_Set/CaseFlow_AI_Core_Backend.xml` into your instance via "Retrieved Update Sets".

## ✅ Verification Matrix

| Requirement | Implementation | Status |
|---|---|---|
| Role-Based Access | ProtectedRoute + Role-Gated Nav | Verified |
| Weighted Agent Scoring | AgentMatchingUtil (Script Include) | Verified |
| Escalation Rules (7) | EscalationManager (Script Include) | Verified |
| NLU Intent Hooks | extractIntent (Chatbot.jsx) | Verified |
| SLA Monitoring | SlaMonitoring.jsx + task_sla query | Verified |
| Notification System | NOTIF-001 to NOTIF-008 templates | Verified |
| CI/CD Pipeline | .github/workflows/ci.yml | Verified |

---
*Built for the ServiceNow Project Space Evaluation.*
