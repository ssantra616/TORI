# TORI — The AI-Powered VR Tour Companion

TORI is an AI- and VR-powered virtual tour companion designed to help users navigate unfamiliar real-world environments through a more human, intuitive, and immersive experience. Built for both individual users and campus-scale environments, TORI combines conversational AI, real-time mapping, and a 3D VR assistant to reduce navigation friction and cognitive load.

This project was developed as a prototype to explore how UX-driven design and emerging technologies can improve spatial navigation and user confidence in unfamiliar settings.

---

## Overview

TORI functions as a virtual companion that guides users through new cities, campuses, or events by blending conversational interaction with spatial awareness.

The system integrates:
- Real-time location awareness for contextual guidance
- Conversational AI for natural, question-based interaction
- Immersive VR visualization to reinforce spatial understanding
- Cross-platform mobile support for accessibility and reach

Rather than relying solely on dense 2D maps, TORI focuses on contextual, low-friction guidance that adapts to where the user is and what they need in the moment.

---

## Core Features

### AI-Powered Conversational Guidance
Users can ask TORI natural-language questions about nearby locations, landmarks, or navigation options. The system responds contextually, reducing the need to manually search or interpret complex map interfaces.

### Real-Time Map Integration
TORI displays the user’s live position and suggests nearby destinations, routes, and points of interest using integrated mapping services.

### 3D VR Companion
A Unity-based VR mascot visually accompanies the user, reinforcing navigation cues and improving orientation through spatial visualization rather than text-heavy directions.

### Custom Itineraries
Users can save favorite routes and points of interest, enabling lightweight trip planning directly within the app.

### Voice Interaction (Planned)
Planned speech support using Expo Speech and ElevenLabs aims to enable hands-free interaction and further reduce on-screen attention demands.

---

## Design Process and UX Decisions

### Customer Problem
Navigating unfamiliar environments such as new campuses, cities, or large venues is cognitively demanding. Traditional navigation tools are visually dense, require frequent attention switching, and lack conversational or contextual support. Users need guidance that is intuitive, adaptive, and minimally disruptive.

### Target Users
- First-time visitors to campuses or large venues
- Students and travelers navigating unfamiliar environments
- Users who benefit from conversational or hands-free guidance

### Design Goals
- Reduce cognitive load during navigation
- Make guidance feel human and supportive rather than transactional
- Balance immersive visuals with clear directional clarity
- Enable users to maintain spatial awareness without constant map interpretation

### Exploration and Iteration
Early concepts relied on a traditional 2D navigation interface with layered overlays. Initial testing showed that this approach increased visual complexity and broke immersion. The design evolved toward combining conversational guidance with spatial visualization to reduce on-screen density while maintaining clarity.

Key iterations explored:
- A conversational AI layer to replace menu-driven navigation
- A 3D VR companion to visually reinforce directions
- Context-aware responses based on real-time location and user intent

### Final UX Decisions
- Enabled natural-language interaction to minimize interface complexity
- Combined real-time location data with a visual VR assistant to support spatial understanding
- Prioritized clarity over feature density during active navigation
- Designed the experience to work seamlessly across mobile and immersive platforms

### Outcome
The final prototype demonstrates how AI-assisted, immersive navigation can reduce friction, improve orientation, and create a more human-centered user experience. TORI serves as a proof of concept for integrating conversational interfaces with spatial design to guide users effectively through unfamiliar environments.

---

## Implementation Overview

- Frontend and UX: React Native with Expo for cross-platform consistency
- VR Layer: Unity 3D for immersive visualization and mascot rendering
- Navigation and Location: Google Maps API with Expo Location
- Conversational AI: Google Gemini API for natural-language interaction

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React Native (Expo SDK 51) |
| AI and Backend | Google Gemini 1.5 Flash API |
| VR Engine | Unity 3D |
| Speech (Planned) | Expo Speech, ElevenLabs API |
| Navigation | React Navigation Stack |
| Maps and Location | react-native-maps, Expo Location |
| Environment Management | dotenv, Expo Config Plugins |

---

## Future Exploration

- Usability testing with first-time campus visitors
- Accessibility improvements for low-vision and neurodivergent users
- Adaptive guidance based on movement patterns or user stress indicators
