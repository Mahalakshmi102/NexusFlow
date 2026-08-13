# NexusFlow: Visual IoT Telemetry & Rule Engine

NexusFlow is an advanced, full-stack application designed to ingest high-frequency IoT machine data and process it in real-time using a dynamic, user-defined rule engine.

## Status

**Week 1 Implementation: COMPLETELY FINISHED** 🚀
- [x] **Time-Series Database Setup**: MongoDB collections highly optimized for IoT telemetry ingest and querying.
- [x] **High-Speed Ingestion Endpoints**: Express REST API endpoints engineered to handle incoming hardware data.
- [x] **Canvas Scaffolding**: React and Vite frontend fully initialized.
- [x] **React Flow Integration**: Interactive, drag-and-drop node canvas built for users to construct visual logic pipelines.
- [x] **Architecture Overhaul**: Codebase cleanly separated into strict `frontend/` and `backend/` monorepo architectures.

## Project Structure

This project uses a standard dual-directory setup:
- `/frontend` - Contains the Vite + React application (Visual Canvas and UI).
- `/backend` - Contains the Node.js + Express + MongoDB backend (Telemetry Ingestion and Rule Engine).

## How to Run

Open two separate terminals from the project root:

**Terminal 1 (Backend Engine):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm install
npm run dev
```

## Technologies
* **Frontend**: React, React Flow, Recharts, Vite
* **Backend**: Node.js, Express, MongoDB, Socket.io, RxJS
