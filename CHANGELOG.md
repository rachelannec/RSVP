# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial release of RSVP (Rapid Serial Visual Presentation) reading application
- Core RSVP functionality with word-by-word display
- Speed selector component with preset WPM options (200-900 WPM)
- Text input area with syntax highlighting
- Real-time word highlighting during playback
- Countdown timer (3 seconds) before reading starts
- Red letter anchor in center of each word for improved focus
- Play/Pause/Restart controls
- Light/Dark theme toggle with persistent storage
- Responsive design for desktop, tablet, and mobile devices
- Pre-loaded educational text about RSVP methodology
- Visual feedback with highlighted active word during reading
- Auto-scroll to keep active word visible during reading

### Features
- **Speed Control**: Adjustable reading speed from 200 to 900 WPM
- **Theme System**: Light and dark mode with smooth transitions
- **Smart Controls**: Automatic restart when reading completes
- **Edit Mode**: Click-to-edit functionality while reading
- **Accessibility**: Keyboard-friendly interface with proper focus states

### Technical
- Built with React 18 and TypeScript
- Vite as build tool
- CSS custom properties for theming
- Font Awesome icons integration
- Google Fonts (Goblin One, Metrophobic)
- LocalStorage for theme persistence

---

## Future Considerations
- Additional WPM speed options
- Text import from files
- Reading progress indicator
- Bookmarking/save position
- Font size customization
- Statistics tracking (words read, time spent)