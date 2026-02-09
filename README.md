# DESCRIPTION OF PROJECT

## 💬 CLI Chat App – Real-Time Multiplayer Chat

---

<p>
Welcome to a real-time multiplayer CLI chat application built with <strong>Deno</strong> and low-level <strong>TCP sockets</strong>.
This project provides a lightweight, terminal-based chat experience where users can create or join chat rooms and communicate instantly.</p>

<p>
The chat app focuses on simplicity, speed, and learning core networking concepts. It supports multiple users, dynamic room creation, message broadcasting, and clean join/leave notifications — all inside the terminal.</p>

---

## 🎯 Project Highlights

- Real-time communication using TCP sockets
- CLI-based interface (no browser required)
- Create or join chat rooms dynamically
- Broadcast messages to all users in a room
- Join/leave system with system notifications
- User metadata handling (name, terminal size)
- Graceful exit handling using commands (`/exit`)
- Built entirely with **Deno**

---

## 🚀 Purpose

This project was built to explore and understand:

- Low-level networking using **TCP** in Deno
- Asynchronous programming with streams
- Server-side room and connection management
- Encoding and decoding streamed data
- Designing real-time systems without frameworks
- Building interactive CLI applications
- Clean project structure and modular logic

---

## 📜 How It Works (High-Level)

- The server listens for incoming TCP connections
- Clients send metadata (username, terminal size, mode)
- Users can **create** or **join** chat rooms
- Messages are formatted, encoded, and broadcast to the room
- System messages announce joins and exits
- Connections are cleaned up on disconnect or `/exit`

---

## 🔧 Tech Stack

- **Deno**
- **JavaScript (ES Modules)**
- **TCP Networking**

---

## ▶️ How To Run

```bash
- for server : deno run -A  src/server.js
- for agent: deno -A src/agent.js
```
