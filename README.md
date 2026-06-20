# geminiexe2
# 🌌 Vibe Coding Studio

**Turn screenshots and wireframes into live, production-ready code in seconds.**

Vibe Coding Studio is an AI-powered workspace that leverages multimodal generation to translate visual blueprints into fully functional Next.js/Tailwind components. Built with mobile-first developers in mind, it allows rapid prototyping directly from your phone to a live URL.

## 🚀 The Pitch
Designers and developers often lose hours translating mockups into boilerplate code. Vibe Coding Studio bridges that gap. By uploading a single image of a UI component or describing a vibe, this tool manifests a live, interactive web application right before your eyes. 

### ✨ Key Features
* **Vision-to-Code:** Upload any wireframe, sketch, or screenshot, and the AI recreates it using modern web standards.
* **Live Sandbox:** Instantly preview the generated UI in an isolated, secure iframe container.
* **Source Code Access:** Toggle between the visual canvas and the raw, auto-formatted HTML/Tailwind code.
* **Instant Export:** One-click local download of your generated modules for immediate use in your own projects.
* **Mobile-Optimized:** The entire studio is responsive, allowing you to generate and test code directly from a smartphone.

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **AI Engine:** Google Gemini 2.5 Flash (Multimodal/Vision)
* **Icons:** Lucide React
* **Deployment & CI/CD:** Vercel

## 💻 Live Demo
Check out the live application here: **[https://geminiexe2.vercel.app/]**

## 🚀 Quick Start (Local Development)

Want to run **Vibe Coding Studio** on your own machine? Follow these steps to get your local environment manifested.

### Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** (v18 or higher)
* **npm** (or your preferred package manager)
* A **[Google Gemini API Key](https://aistudio.google.com/)**

---

### 1️⃣ Clone the Repository
Grab the source code and navigate into the project directory.
```bash
git clone [https://github.com/Parth-1701/geminiexe2.git](https://github.com/Parth-1701/geminiexe2.git)
cd geminiexe2
```

### 2️⃣ Install Dependencies
Install the required Next.js, Tailwind CSS, and Gemini SDK packages.
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a local environment file to securely store your API key.
```bash
# Create the file (Mac/Linux) or create it manually on Windows
touch .env.local
```
Open .env.local and add your Gemini API key:
```bash
GEMINI_API_KEY="your_actual_api_key_here"
```
⚠️ Security Note: Never commit your .env.local file to GitHub!

### 4️⃣ Manifest the Application
Fire up the local development server.
```bash
npm run dev
```
✨ Success! Open http://localhost:3000 in your browser to start vibe coding.
