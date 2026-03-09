# Chinese Learning App 🐼

A fun, interactive web application to help kids learn Chinese characters through drawing, AI-generated illustrations, and conversations with Bao Bao Panda!

## Features

- **Handwriting Recognition**: Draw Chinese characters on your tablet and get instant feedback
- **Dictionary Lookup**: Get pinyin, translations, and example usage
- **Animated Stroke Order**: Learn the correct way to write each character
- **AI Illustrations**: Fun, child-friendly images generated for each word
- **Bao Bao Panda Friend**: A chat companion that gradually introduces Chinese words as you learn
- **Gamification**: Track progress, earn badges, and level up!

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Go + Gin
- **Database**: PostgreSQL
- **AI Images**: Pollinations.ai
- **Hosting**: Railway (auto-deploy from GitHub)

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- Docker & Docker Compose (for local development)
- Railway account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sohWenMing/chinese-learning-app.git
   cd chinese-learning-app
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

### Manual Setup

#### Backend

```bash
cd backend
go mod download
go run main.go
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment to Railway

1. Connect your GitHub repo to Railway
2. Add a PostgreSQL database
3. Set environment variables:
   - `DATABASE_URL` (automatically provided by Railway)
   - `PORT=8080`
4. Deploy!

## How It Works

### Drawing → Learning Flow

1. Child draws a character on the canvas
2. Backend processes the drawing
3. Dictionary API returns pinyin and translation
4. Pollinations.ai generates a fun illustration
5. Stroke order data shows how to write it correctly
6. Child marks the word as learned
7. Bao Bao Panda celebrates and updates conversation style

### Bao Bao Panda's Language Progression

- **Level 1-2**: All English, introduces the Chinese word
- **Level 3-4**: Mixes in learned Chinese words
- **Level 5+**: Full Chinese sentences with learned vocabulary

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/handwriting` | POST | Recognize handwritten character |
| `/api/dictionary/:character` | GET | Get dictionary entry |
| `/api/strokes/:character` | GET | Get stroke order animation |
| `/api/image/:word` | GET | Get AI-generated image |
| `/api/progress/learn` | POST | Mark word as learned |
| `/api/progress` | GET | Get user progress |
| `/api/bao-bao/chat` | POST | Chat with Bao Bao Panda |

## Future Improvements

- [ ] Better handwriting recognition (Google Input Tools API)
- [ ] Audio pronunciation
- [ ] Spaced repetition system
- [ ] More gamification (daily challenges, leaderboards)
- [ ] Multiple user profiles
- [ ] Offline support with PWA

## License

MIT

---

Made with ❤️ for Hailey
