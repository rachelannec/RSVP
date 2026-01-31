# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Fullscreen Reading Mode**: Automatically enters fullscreen when Start is pressed
  - Immersive reading experience with enlarged text (6rem font size)
  - Floating controls at bottom of screen with backdrop
  - Visual hint showing "Press ESC or Click to Stop" (fades in after 2 seconds)
  - ESC key support to exit fullscreen
  - Click anywhere on screen to pause and exit fullscreen
  - Countdown display in fullscreen (10rem font size)
  - Speed selector dropdown opens upwards in fullscreen mode
  - Mobile-optimized fullscreen layout (3.5rem font size, adjusted controls)
- Enhanced mobile viewport handling with `100dvh` (dynamic viewport height)
- Improved button states with visual feedback
- Better mobile responsiveness for fullscreen controls

### Changed
- Control bar now floats above content in fullscreen mode with semi-transparent backdrop
- Improved centering logic for fullscreen controls across all screen sizes
- Enhanced touch target sizes for mobile devices in fullscreen mode
- Updated fullscreen animations and transitions

### Technical
- Added fullscreen state management with React hooks
- Implemented ESC key event listener for fullscreen exit
- CSS custom properties for consistent theming in fullscreen mode
- Responsive breakpoints for tablet (1023px) and mobile (767px)
- Optimized animations with fade-in effects for hints

## Unreleased (Before 20260131)

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
- Export reading sessions
- Multiple text presets/templates