import 'react-native-url-polyfill'; // This is a polyfill ot add something that is missing, React Native doesn't have the browser's build in URL class, but SupaBase uses it internally.

import { registerRootComponent } from 'expo'; // Imports Expo's function that registers the app with the React Native runtime. Also a starting point of the app

import App from './App'; // Imoorts the root "App" component from App.tsx. This is the compoment that contains all the providers and the navigator.

registerRootComponent(App); // This is the most important line. It does two things under the hood:
// 1) calls React Native's AppRegister.registerComponent() - register your component with the native side (iOS / Android).
// 2) Ensures your app renders inside <SafeAreaProvider> automatically on both platforms.
