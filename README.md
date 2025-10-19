# Activity Listing App - Online Learning Platform

A cross-platform mobile and web application for managing learning activities in AI, Machine Learning, and Cloud Computing programs.

## Overview

This app provides learners with a centralized view of their learning activities including online classes, assignments, quizzes, and discussions. Users can filter activities, view details, and take appropriate actions (Start/Continue/Review).

## ✨ Features

- **Activity Management**: View all learning activities in a scrollable list
- **Smart Filtering**: Filter by activity type (Online Class, Assignment, Quiz, Discussion)
- **Action-Oriented UI**: Clear next actions for each activity (Start, Continue, Review)
- **Activity Details**: Modal popups with comprehensive activity information
- **Theme Support**: Light/Dark mode toggle
- **Cross-Platform**: Single codebase for web and mobile
- **Responsive Design**: Optimized for different screen sizes
- **Add Activities**: Plus button to create new activities

## 🛠 Tech Stack

- **Framework**: React Native with Expo Router
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Hooks (useState, useContext)
- **Theming**: Custom theme context with light/dark modes
- **Icons**: Expo Vector Icons with SF Symbols mapping
- **Platform**: Web, iOS, Android

## 🚀 Getting Started

### Prerequisites
- Node.js (16+)
- npm or yarn
- Expo CLI

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run web
   ```

### Running on Different Platforms

#### Web
```bash
npx expo start --web
```
Or press `w` in the terminal after running `npx expo start`

#### Mobile (iOS)
```bash
npx expo start --ios
```
Or press `i` in the terminal (requires Xcode/iOS Simulator)

#### Mobile (Android)
```bash
npx expo start --android
```
Or press `a` in the terminal (requires Android Studio/Emulator)

## Core Features

### Activity Listing
- Displays all learning activities in a scrollable list
- Each activity shows: title, type, status, date, and next action
- Responsive card-based layout

### Filtering System
- Filter by activity type: All, Online Class, Assignment, Quiz, Discussion
- Chip-based filter interface
- Real-time filtering

### Activity Details
- Modal popup with comprehensive activity information
- Shows activity description, type, status, and date
- Action buttons for Start/Continue/Review

### Theme System
- Light/Dark mode toggle
- Persistent theme state
- System theme detection
- Smooth theme transitions

## Design Decisions & Trade-offs

### UI Library: React Native Paper

- Material Design 3 compliance
- Cross-platform support (web + mobile)
- Built-in theming system
- Comprehensive component library



## Future Enhancements

- [ ] API integration
- [ ] User authentication
- [ ] Search functionality
- [ ] Offline support
- [ ] Progress tracking
- [ ] Push notifications


## App Screenshots

Below are the main screens of the app. You can add images to each section later by placing them in the appropriate location.

### Main Page
![Main Page](assets/webuiimages/main-page.png)

### Details Tab
![Details Tab](assets/webuiimages/deatails-tab.png)

###  New Activity
![New Activity](assets/webuiimages/new-activity.png)

### Dark Mode
![Dark Mode](assets/webuiimages/dark-mode.png)

---

