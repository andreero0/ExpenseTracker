import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  switchText: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingsButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
