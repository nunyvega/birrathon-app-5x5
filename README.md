# 5x5 - Workout Tracking App

A beautifully designed React Native workout tracking app implementing the popular **5x5 workout** program with Apple's Human Interface Guidelines.

## 📱 Screenshots
<div align="center">
  <table>
    <tr>
        <td align="center">
            <img src="https://github.com/user-attachments/assets/744b6386-a9e3-4b17-9961-fec8a868bb97" alt="Progress Analytics" width="250"/>
          </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/39eb9797-acbb-4bb5-9fe8-5a589a9c2d05" alt="Exercise Progress" width="250"/>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/c3632fe1-f2d8-4aa5-a795-ba514455ad12" alt="History Screen" width="250"/>    
      </td>
        <td align="center">
        <img src="https://github.com/user-attachments/assets/82ba6e5c-6fd4-40a8-8e8e-c653356a7a09" alt="Workout Screen" width="250"/>
      </td>
    </tr>
  </table>
</div>


## ✨ Features

### 🏋️ Complete 5x5 Workout Program

-   **Workout A**: Squat, Bench Press, Barbell Row
-   **Workout B**: Squat, Overhead Press, Deadlift
-   Automatic workout alternation (A → B → A → B...)
-   Smart progression logic with automatic weight increases

### 📊 Progress Tracking

-   Detailed exercise statistics and analytics
-   Visual progress charts with trend indicators
-   Success rate tracking and streak counters
-   Personal records and weight progression history

### 🍎 Apple-Style Design System

-   Beautiful iOS-inspired interface with SF Pro typography
-   Smooth animations and haptic feedback simulation
-   Consistent color palette following Apple's design guidelines
-   Responsive design that works on all screen sizes

### 🔧 Smart Features

-   **Automatic Weight Progression**: +2.5kg for upper body, +5kg for lower body
-   **Failure Tracking**: Automatic deload after 2 consecutive failures
-   **Cross-Platform Weight Editing**: Works on mobile and web
-   **Session Management**: Complete workout history with AsyncStorage
-   **Rest Timer**: Clean, minimal timer interface

## 🛠 Technical Stack

-   **React Native** with Expo
-   **TypeScript** for type safety
-   **React Native Gifted Charts** for beautiful visualizations
-   **AsyncStorage** for local data persistence
-   **Expo Linear Gradient** for modern UI effects

## 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/nunyvega/birrathon-app-5x5.git
    cd birrathon-app-5x5
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm start
    ```

4. **Run on your device**
    - Install the Expo Go app on your mobile device
    - Scan the QR code displayed in the terminal
    - Or run on simulators: `npm run ios` or `npm run android`

## 🚀 Usage

### Starting a Workout

1. Open the app and tap "Start Workout"
2. Complete your sets by tapping the set buttons
3. Use the built-in rest timer between sets
4. Edit weights by tapping the weight display
5. Finish your workout to save progress

### Tracking Progress

-   Visit the **History** screen to view detailed statistics
-   Select different exercises to see individual progress
-   View success rates, streaks, and weight progression
-   Analyze trends with beautiful charts

### Weight Progression

-   **Successful session** (all sets completed): Weight increases automatically
-   **Failed session**: Repeat the same weight
-   **Second consecutive failure**: Automatic 10% deload

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── ExerciseSetCard.tsx
│   ├── ProgressLineChart.tsx
│   └── RestTimer.tsx
├── screens/            # Main app screens
│   ├── WorkoutScreen.tsx
│   └── HistoryScreen.tsx
├── context/            # React Context for state management
│   └── WorkoutContext.tsx
├── services/           # Business logic and data services
│   ├── progression.ts
│   └── storage.ts
├── styles/             # Design system and styling
│   └── AppleDesignSystem.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## 🎨 Design System

The app implements a comprehensive Apple-inspired design system:

-   **Colors**: iOS system colors with semantic naming
-   **Typography**: SF Pro Display and SF Pro Text font families
-   **Spacing**: Consistent 8-point grid system
-   **Shadows**: iOS-style elevation levels
-   **Animations**: Smooth, purposeful transitions

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Tests cover:

-   Progression logic and weight calculations
-   Storage operations and data persistence
-   Core workout functionality

## 🔄 Workout Program Logic

The app implements the official 5x5 program progression:

1. **Start**: Begin with light weights (empty barbell or comfortable weight)
2. **Progress**: Add weight every successful workout
3. **Plateau**: Repeat weight if you can't complete all sets
4. **Deload**: Reduce weight by 10% after 2 consecutive failures
5. **Restart**: Continue progression from deloaded weight

## 📈 Future Enhancements

-   [ ] Exercise instruction videos and form tips
-   [ ] Workout scheduling and reminders
-   [ ] Data export/import functionality
-   [ ] Social features and workout sharing
-   [ ] Apple Health integration
-   [ ] Custom workout programs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   **Weight lift 5x5** program, greatly popular online
-   **Apple Human Interface Guidelines** for design inspiration
-   **React Native** and **Expo** teams for the amazing development platform

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/nunyvega">@nunyvega</a>
</p>
