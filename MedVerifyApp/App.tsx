import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Text, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LanguageProvider } from "./src/contexts/LanguageContext";
import { VerificationResult } from "./src/types";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AboutScreen from "./src/screens/AboutScreen";

import { NavigatorScreenParams } from "@react-navigation/native";

// ==========================================
// NAVIGATION TYPES
// ==========================================
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Results: { result: VerificationResult };
};

export type TabParamList = {
  Home: undefined;
  Scan: undefined;
  History: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// ==========================================
// TAB ICONS
// ==========================================
function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 4 }}>
      <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          marginTop: 2,
          fontWeight: focused ? "700" : "500",
          color: focused ? "#3b82f6" : "#475569",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ==========================================
// BOTTOM TAB NAVIGATOR
// ==========================================
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "rgba(59,130,246,0.15)",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 6,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: focused ? "#3b82f6" : "#1e3a5f",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: Platform.OS === "ios" ? 20 : 10,
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.5 : 0.2,
                shadowRadius: 10,
                elevation: 8,
                borderWidth: 2,
                borderColor: focused ? "#60a5fa" : "rgba(59,130,246,0.3)",
              }}
            >
              <Text style={{ fontSize: 24 }}>📸</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🗂️" label="History" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛡️" label="About" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ==========================================
// ROOT STACK NAVIGATOR
// ==========================================
function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f172a" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}

// ==========================================
// APP ROOT
// ==========================================
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#0f172a" />
            <RootNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}