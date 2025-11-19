import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { styles } from "@/assets/styles/biometric.styles";

export default function BiometricSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    loadBiometricPreference();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("Face ID");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("Touch ID / Fingerprint");
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType("Iris");
        } else {
          setBiometricType("Biometric");
        }
      }
    } catch (error) {
      console.error("Error checking biometric support:", error);
    }
  };

  const loadBiometricPreference = async () => {
    try {
      const enabled = await AsyncStorage.getItem("@biometricEnabled");
      if (enabled !== null) {
        setBiometricEnabled(enabled === "true");
      }
    } catch (error) {
      console.error("Failed to load biometric preference:", error);
    }
  };

  const saveBiometricPreference = async (enabled) => {
    try {
      await AsyncStorage.setItem("@biometricEnabled", enabled.toString());
    } catch (error) {
      console.error("Failed to save biometric preference:", error);
    }
  };

  const handleToggleBiometric = async () => {
    if (!isSupported) {
      Alert.alert(
        "Not Supported",
        "Your device does not support biometric authentication."
      );
      return;
    }

    if (!isEnrolled) {
      Alert.alert(
        "Not Enrolled",
        `Please set up ${biometricType} in your device settings first.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => LocalAuthentication.openSettingsAsync() },
        ]
      );
      return;
    }

    if (!biometricEnabled) {
      // Enable biometric - test authentication first
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${biometricType}`,
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricEnabled(true);
        saveBiometricPreference(true);
        Alert.alert(
          "Success",
          `${biometricType} has been enabled for your account.`
        );
      } else {
        Alert.alert(
          "Authentication Failed",
          "Please try again or use your device passcode."
        );
      }
    } else {
      // Disable biometric
      setBiometricEnabled(false);
      saveBiometricPreference(false);
      Alert.alert(
        "Disabled",
        `${biometricType} has been disabled for your account.`
      );
    }
  };

  const testBiometric = async () => {
    if (!isSupported || !isEnrolled) {
      Alert.alert("Not Available", "Biometric authentication is not available.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `Test ${biometricType}`,
      fallbackLabel: "Use passcode",
      disableDeviceFallback: false,
    });

    if (result.success) {
      Alert.alert("Success", "Biometric authentication successful!");
    } else {
      Alert.alert("Failed", "Biometric authentication failed.");
    }
  };

  const getBiometricIcon = () => {
    if (biometricType?.includes("Face")) {
      return "scan-outline";
    } else if (biometricType?.includes("Fingerprint") || biometricType?.includes("Touch")) {
      return "finger-print-outline";
    } else {
      return "eye-outline";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Biometric Authentication
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Ionicons
            name={getBiometricIcon()}
            size={80}
            color={isSupported && isEnrolled ? colors.primary : colors.textLight}
          />
        </View>

        {/* Status */}
        <Text style={[styles.title, { color: colors.text }]}>
          {biometricType || "Biometric Authentication"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          {isSupported && isEnrolled
            ? `Secure your account with ${biometricType}`
            : isSupported
            ? "Please enroll biometric authentication in your device settings"
            : "Biometric authentication is not supported on this device"}
        </Text>

        {/* Enable/Disable Switch */}
        {isSupported && isEnrolled && (
          <View
            style={[
              styles.switchContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.switchLeft}>
              <Ionicons
                name={biometricEnabled ? "shield-checkmark" : "shield-outline"}
                size={24}
                color={colors.primary}
              />
              <View style={styles.switchText}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  Enable {biometricType}
                </Text>
                <Text style={[styles.switchDescription, { color: colors.textLight }]}>
                  Use {biometricType?.toLowerCase()} to unlock the app
                </Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        )}

        {/* Test Button */}
        {isSupported && isEnrolled && (
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={testBiometric}
          >
            <Ionicons name="play-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.testButtonText, { color: colors.text }]}>
              Test {biometricType}
            </Text>
          </TouchableOpacity>
        )}

        {/* Info Cards */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.infoIcon, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="lock-closed" size={20} color={colors.primary} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Secure & Private
            </Text>
            <Text style={[styles.infoDescription, { color: colors.textLight }]}>
              Your biometric data never leaves your device and is not stored in the cloud
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.infoIcon, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="flash" size={20} color={colors.primary} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Quick Access
            </Text>
            <Text style={[styles.infoDescription, { color: colors.textLight }]}>
              Unlock the app instantly without entering your password
            </Text>
          </View>
        </View>

        {/* Settings Button */}
        {!isEnrolled && isSupported && (
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.primary }]}
            onPress={() => LocalAuthentication.openSettingsAsync()}
          >
            <Text style={[styles.settingsButtonText, { color: colors.white }]}>
              Open Device Settings
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
