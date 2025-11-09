export default {
  expo: {
    name: "TORI",
    slug: "TORI",
    scheme: "tori",
    version: "0.0.1",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    icon: "./assets/icon.png",

    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Tori uses your location to guide you through nearby landmarks and tours.",
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
      package: "com.tori.app",
    },

    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },

    extra: {
      // Your Gemini API key — referenced as process.env.EXPO_PUBLIC_GEMINI_API_KEY
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    },
  },
};
