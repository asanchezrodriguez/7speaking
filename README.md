# Intelixs Language Intelligence

A production-ready, minimalistic hero webapp for Intelixs (Official Partner of 7Speaking) targeting LATAM audience. This app provides a guided 12-screen experience to analyze language proficiency and recommend personalized learning paths.

## Features

- 🎙️ **Voice Input**: Record up to 60 seconds using browser microphone
- ⌨️ **Typing Input**: Alternative text input mode
- 🧠 **AI-Powered Analysis**: Heuristic analysis of fluency, vocabulary, and structure
- 📊 **CEFR Level Estimation**: Automatic level mapping (A2, B1, B1+, B2, C1)
- 🎯 **Personalized Insights**: Strength, blocker, and learning style identification
- 📋 **Action Blueprint**: Customized recommendations
- 🔒 **Privacy-First**: All processing happens client-side, no data uploaded
- 📱 **Mobile-First**: Fully responsive design
- ✨ **Premium UX**: Glassmorphism, smooth transitions, ambient animations

## Tech Stack

- **Framework**: Vite + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Voice**: MediaRecorder API + Web Speech API

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm 8+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_STORE_URL=https://store.intelixs.com/7speaking
```

## Project Structure

```
src/
├── components/       # Shared UI components
├── screens/          # 12 screen components
├── store/            # Zustand state management
├── lib/
│   ├── analysis/     # Text analysis & CEFR mapping
│   ├── voice/        # Voice recording & transcription
│   ├── analytics/    # Privacy-friendly tracking
│   └── utils/        # Utilities (UTM, export, etc.)
├── content/          # Spanish copy
└── config/           # App configuration
```

## Flow Overview

1. **Screen 0**: Preload
2. **Screen 1**: Hero (Voice or Typing selection)
3. **Screen 2**: Intent selection
4. **Screen 3**: Psychological safety
5. **Screen 4**: Voice recording OR Typing input
6. **Screen 5**: Processing & analysis
7. **Screen 6**: Insights reveal
8. **Screen 7**: Reframe (alignment message)
9. **Screen 8**: Free blueprint
10. **Screen 9**: 7Speaking introduction
11. **Screen 10**: Conversion (Store CTA)
12. **Screen 11**: Exit with results export
13. **Screen 12**: Footer

## Analysis Engine

The heuristic analysis engine evaluates:

- **Words Per Minute (WPM)**: Fluency indicator
- **Pause Ratio**: Hesitation detection
- **Filler Words**: Spanish-specific (eh, um, este, pues, etc.)
- **Lexical Diversity**: Vocabulary range
- **Sentence Length**: Complexity indicator
- **Connector Usage**: Discourse structure

Results map to CEFR levels using a deterministic scoring algorithm.

## Browser Compatibility

- **Voice Input**: Requires MediaRecorder API and getUserMedia
- **Speech Recognition**: Optional (Web Speech API), falls back gracefully
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 14+, Edge 79+

## Privacy

- No audio uploaded to servers
- All analysis happens client-side
- Results stored in browser localStorage
- Optional email capture (MVP: local only)
- UTM tracking for analytics

## Deployment

### Netlify / Vercel

```bash
npm run build
# Deploy dist/ folder
```

### Custom Server

```bash
npm run build
# Serve dist/ with any static file server
```

## License

Proprietary - Intelixs © 2026

## Support

For issues or questions, contact: support@intelixs.com
