# 🎶 Spotify-Integrated Dashboard & PLaylist Browser

A modern, responsive web application built with **React**, **Vite**, and **TypeScript** that interfaces directly with the **Spotify Web API**.
This project features secure PKCE authentication, user playlist management, dynamic item and component routing, and a clean layout with swappable color themes.

---
## Key Features

**Secure OAuth 2.0 PKCE Flow:** Handles secure login redirection and token management without exposing client secrets on the client side.
**Axios Interceptors:** Automatically injects Bearer tokens into outgoing requests to the Spotify Web API.
**User Library Access:** Fetches and displays the user's Spotify profile avatar and personal playlists.
**Dynamic Playlist Item Navigation:** Uses React Router's dynamic parameters (`/library/playlist/:playlistId`) and the modern (`/playlists/{id}/items`) endpoint to fetch, parse, and render playlist tracks.

---
## 🛠 Tech Stack

**Frontend Framework:** React (with functional components & hooks)
**Build Tool:** Vite
**Language:** TypeScript
**Styling & UI Components:** Tailwind CSS & DaisyUI
**HTTP Client:** Axios
**Routing:** React Router DOM
**Icons & Notifications:** Lucide React & React Hot Toast

## Getting Started Locally

### Prerequisites
    -Node.js (the latest LTS version available) installed on your machine
    -A Spotify Account (Free or Premium tier)

### 1) Clone the repository
`git clone https://github.com/EAE00-src/CTD_Spotify_App.git` 
Alternatively via GitHub CLI
`gh repo clone EAE00-src/CTD_Spotify_App`

### 2) Install Dependencies
`npm install`

### 3) Configure Spotify Developer Application
    1. Go to the Spotify Developer Dashboard after logging in.
    2. Create new Application
    3. In your app settings, add `http://127.0.0.1:{YOUR_PORT_NUMBER}/callback` as your **Redirect URI** (It's not recommended to use http://localhost:5173 as Spotify will reject this URI itself due to security concerns)
    4. Copy your **Client ID** (be sure to **NOT** copy your **Client Secret**)

### 4) Set Up Environment Variables
    Create a `.env` file in the root directory of your project and add your Spotify Client ID. Consult the .env.test file for an example to reference

### 5) Run the Development Server

    <code>npm run dev</code>
    
    Open your browser and navigate to the port that the application was launched on and test the application. If you're on a localhost connection, this can be modified in `vite.config.ts`
    <code>
        export default defineConfig({
            plugins: [
                react(),
                tailwindcss()
            ],
            server:{
                host: '127.0.0.1',
                port: 5173
            }
        }) 
    </code>
    
