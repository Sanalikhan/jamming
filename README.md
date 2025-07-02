


# 🎧 Jamming

A React single-page application that integrates with the Spotify Web API, allowing users to:

- **Search** Spotify’s music library
- **Create & modify** playlists
- **Authenticate** via Spotify OAuth
- **Save** custom playlists to their Spotify account

---

## 💡 Features

- **Search Songs**: Query track names in real time
- **Build Playlists**: Add/remove tracks from your custom playlist
- **Save to Spotify**: Use OAuth to authenticate and save playlists directly
- **Playlist Editing**: Rename playlists and update content before saving

---

## 🛠️ Tech Stack

- **React** – component-based UI
- **Spotify Web API** – search, playlists, saving
- **OAuth** – Spotify user authentication
- **CSS / Responsive Design** – clean and user-friendly interface

---

## 📁 Project Structure

public/ # Static assets
src/
├── components/ # Reusable UI components
└── util/ # API logic (search, auth, save)

yaml
Kopyala
Düzenle

---

## 🚀 Getting Started

1. Clone this repo  
   ```bash
   git clone https://github.com/Sanalikhan/jamming.git
   cd jamming
Install dependencies

bash
Kopyala
Düzenle
npm install
Create a Spotify app and set redirect_uri to http://localhost:3000/

Add your credentials in src/util/spotify.js:

js
Kopyala
Düzenle
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = 'http://localhost:3000/';
Run in development mode

bash
Kopyala
Düzenle
npm start
Open http://localhost:3000 in your browser

Authenticate with Spotify and start building your playlist!

✅ How It Works
Authenticate: User logs in via Spotify OAuth flow

Search: User enters track keywords → API fetches results

Modify Playlist: Add/remove tracks locally

Save: Send playlist data to Spotify to create a playlist on user’s account

🔧 Why Jamming?
I built this to explore integrating external APIs, mastering OAuth flows, and practicing state management in React. It’s a fun and interactive way to remix playlists!

📌 Screenshots
(Add screenshots here)

📜 License
This project is licensed under the MIT License.

🙌 Acknowledgments
Inspired by the Codecademy “Jammming” exercise, extended to support full playlist editing and saving 🛠️

