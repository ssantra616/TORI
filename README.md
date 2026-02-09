# 🦾 TORI — The AI-Powered VR Tour Companion

Tori is an **AI + VR-powered virtual tour guide** that helps users explore real-world locations through a friendly, immersive experience. Designed for both **individuals and campuses**, Tori combines interactive maps, conversational AI, and a 3D VR assistant to make navigation smarter and more human.

---

## 🚀 Overview

Tori acts as your **virtual companion** — guiding you around new cities, campuses, or events.  
It uses:
- **Google Maps & Expo Location** for real-time positioning
- **Gemini AI (via API)** for conversational assistance
- **Unity (VR layer)** for immersive visuals
- **React Native + Expo** for a seamless cross-platform experience

Tori remembers your context, responds naturally, and can even visualize routes through a 3D mascot that follows your journey.

---

## 🧠 Features

✨ **AI-Powered Interaction**  
Ask Tori questions about your surroundings — cafés, landmarks, or events — and get smart, conversational responses.

🗺️ **Map Integration**  
See your real-time location on the map, with Tori suggesting nearby destinations and routes.

🤖 **VR Mascot Companion**  
Meet Tori — your 3D AI buddy built in Unity — displayed dynamically on-screen as a friendly guide.

🎙️ **Speech Interaction (Coming Soon)**  
Natural voice support using Expo Speech + ElevenLabs for lifelike narration.

📍 **Create Custom Itineraries**  
Save favorite routes or points of interest and plan trips directly in the app.

---
🔍 Design Process & UX Decisions
Customer Problem

Navigating unfamiliar spaces (new campuses, cities, events) is cognitively demanding. Existing map tools are visually dense, non-conversational, and require constant attention switching between the environment and the screen. Users need guidance that is intuitive, contextual, and low-friction.

Target Users

First-time visitors to campuses or large venues

Students and travelers navigating unfamiliar environments

Users who benefit from hands-free or conversational guidance

Design Goals

Reduce cognitive load while navigating unfamiliar spaces

Make guidance feel human and supportive, not transactional

Balance immersive visuals with clear directional clarity

Enable users to understand where they are without constant map interpretation

Early Exploration & Iteration

Initial concepts focused on a traditional 2D navigation interface with overlays. Early testing revealed this required too much visual attention and broke immersion. We explored conversational guidance combined with spatial visualization to reduce on-screen complexity.

We iterated toward:

A conversational AI layer to answer questions naturally

A 3D VR companion to visually reinforce navigation cues

Context awareness to adapt guidance based on user location and intent

Final UX Decisions

Used conversational AI to allow users to ask questions naturally instead of navigating menus

Combined real-time location data with a visual VR assistant to reinforce spatial understanding

Prioritized clarity over visual density by limiting on-screen elements during navigation

Designed for cross-platform usability to support both mobile and immersive experiences

Outcome

The final prototype demonstrates how AI-assisted, immersive navigation can reduce friction, improve orientation, and create a more human-centered navigation experience. TORI serves as a proof-of-concept for how conversational interfaces and spatial design can work together to guide users effectively.

🔗 Implementation

React Native + Expo for cross-platform UX

Unity for immersive VR visualization

Google Maps & Expo Location for real-time positioning

Gemini AI (API) for conversational assistance

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React Native (Expo SDK 51) |
| **Backend / AI** | Google Gemini 1.5 Flash API |
| **VR Engine** | Unity 3D (AR/VR rendering) |
| **Speech** | Expo Speech + ElevenLabs API |
| **Navigation** | React Navigation Stack |
| **Maps** | react-native-maps + Expo Location |
| **Environment Management** | dotenv / Expo Config Plugins |


