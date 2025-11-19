import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ScanReceiptScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useUser();
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to scan receipts"
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const processReceipt = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a photo of the receipt first");
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Integrate with Google Vision API
      // For now, show a placeholder alert
      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert(
          "Coming Soon",
          "OCR processing will be available after Google Vision API integration. Check INSTALL_DEPENDENCIES.md for setup instructions.",
          [
            {
              text: "OK",
              onPress: () => {
                // Mock extracted data
                router.push({
                  pathname: "/create",
                  params: {
                    title: "Receipt Purchase",
                    amount: "25.99",
                    category: "Shopping",
                  },
                });
              },
            },
          ]
        );
      }, 2000);

      /*
      // Real implementation would look like this:
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "receipt.jpg",
      });
      formData.append("userId", user.id);

      const response = await fetch(`${API_URL}/ocr/process`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      // Navigate to create transaction with pre-filled data
      router.push({
        pathname: "/create",
        params: {
          title: data.merchant || "Receipt Purchase",
          amount: data.total || "",
          category: data.category || "Shopping",
        },
      });
      */
    } catch (error) {
      console.error("Error processing receipt:", error);
      Alert.alert("Error", "Failed to process receipt");
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Scan Receipt
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={[styles.retakeButton, { backgroundColor: colors.card }]}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.placeholderContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="camera-outline" size={64} color={colors.textLight} />
            <Text style={[styles.placeholderText, { color: colors.textLight }]}>
              No receipt image selected
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={24} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={pickImage}
          >
            <Ionicons name="images" size={24} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {image && (
          <TouchableOpacity
            style={[styles.processButton, { backgroundColor: colors.primary }]}
            onPress={processReceipt}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="scan" size={24} color={colors.white} />
                <Text style={[styles.processButtonText, { color: colors.white }]}>
                  Process Receipt
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              How it works
            </Text>
            <Text style={[styles.infoText, { color: colors.textLight }]}>
              1. Take a photo or select an image of your receipt{"\n"}
              2. Our AI will extract the merchant, amount, and date{"\n"}
              3. Review and save the transaction
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  retakeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 20,
  },
  placeholderContainer: {
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  processButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
