import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { useNotification } from "@/hooks/NotificationContext";
import { OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import { useAuth } from "@/hooks/AuthContext";
import { formatDateTime } from "@/utils/time";

export default function Notification() {
  const {
    totalNotification,
    notification,
    totalRequests,
    requests,
    messages,
    totalUnseenMessage,
  } = useNotification();
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Inbox"); // Default to Inbox
  const [unreadCounts, setUnreadCounts] = useState({
    Inbox: totalUnseenMessage,
    ExchangeRequests: totalRequests,
    TrackOrders: 1,
    Notifications: totalNotification,
  });

  // Dummy Data
  const inboxData = [
    { id: 1, name: "John Doe", message: "Hey, how are you?" },
    {
      id: 2,
      name: "Jane Smith",
      message: "Don't forget the meeting tomorrow.",
    },
    { id: 3, name: "Alice Johnson", message: "Can you send me the details?" },
  ];

  const exchangeRequestsData = [
    { id: 1, request: "Request to exchange 'Book A' with 'Book B'." },
    { id: 2, request: "Request to exchange 'Book C' with 'Book D'." },
  ];

  const trackOrdersData = [
    { id: 1, status: "Order #12345 is out for delivery." },
    { id: 2, status: "Order #67890 has been delivered." },
  ];

  const notificationsData = [
    { id: 1, notification: "Your subscription is about to expire." },
    { id: 2, notification: "You have a new friend request." },
    { id: 3, notification: "Your order has been shipped." },
    { id: 4, notification: "You received a 20% discount coupon." },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Inbox":
        return (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity
                  onPress={() => {
                    router.push(
                      `/screens/ChatBox?receiverId=${item.receiverInfo.id}`
                    );
                  }}
                >
                  <Text style={styles.itemTitle}>
                    {item.receiverInfo.username}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.itemText}>
                  {item.senderId == user?.id ? "You : " : ""} {item.message}
                </Text>
                <Text style={styles.itemText}>{formatDateTime(item.time)}</Text>
              </View>
            )}
          />
        );
      case "ExchangeRequests":
        return (
          <>
            <TouchableOpacity
              style={{
                width: wp(62),
                flexDirection: "row-reverse",
                marginBottom: hp(1),
              }}
              onPress={() => {
                router.push("/screens/ExchangeBooks");
              }}
            >
              <Text
                style={{ fontSize: hp(1.5), fontFamily: "OpenSans_400Regular" }}
              >
                Give your response
              </Text>
            </TouchableOpacity>
            <FlatList
              data={requests}
              keyExtractor={(item) => item.reqid}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemText}>
                    {item.sender} wants to exchange their "{item.sender_book}"
                    with your "{item.receiver_book}"
                  </Text>
                </View>
              )}
            />
          </>
        );
      case "TrackOrders":
        return (
          <FlatList
            data={trackOrdersData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.status}</Text>
              </View>
            )}
          />
        );
      case "Notifications":
        return (
          <>
            <TouchableOpacity
              style={{
                width: wp(62),
                flexDirection: "row-reverse",
                marginBottom: hp(1),
              }}
            >
              <Text
                style={{ fontSize: hp(1.5), fontFamily: "OpenSans_400Regular" }}
              >
                Mark all as unread
              </Text>
            </TouchableOpacity>

            <FlatList
              data={notification}
              keyExtractor={notification.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemText}>{item.message}</Text>
                </View>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderBadge = (count) => {
    if (count > 0) {
      return (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/screens/App");
          }}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>All Notifications</Text>
      </View>

      {/* Main Section */}
      <View style={styles.main}>
        {/* Sidebar */}
        <View style={styles.sideBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Inbox" && styles.activeTab]}
            onPress={() => setActiveTab("Inbox")}
          >
            <View style={styles.tabContent}>
              <AntDesign
                name="inbox"
                size={24}
                color={activeTab === "Inbox" ? "rgba(60, 105, 96, 1)" : "#333"}
              />
              {renderBadge(unreadCounts.Inbox)}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "ExchangeRequests" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("ExchangeRequests")}
          >
            <View style={styles.tabContent}>
              <FontAwesome5
                name="exchange-alt"
                size={24}
                color={
                  activeTab === "ExchangeRequests"
                    ? "rgba(60, 105, 96, 1)"
                    : "#333"
                }
              />
              {renderBadge(unreadCounts.ExchangeRequests)}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "TrackOrders" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("TrackOrders")}
          >
            <View style={styles.tabContent}>
              <MaterialIcons
                name="local-shipping"
                size={24}
                color={
                  activeTab === "TrackOrders" ? "rgba(60, 105, 96, 1)" : "#333"
                }
              />
              {renderBadge(unreadCounts.TrackOrders)}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Notifications" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Notifications")}
          >
            <View style={styles.tabContent}>
              <AntDesign
                name="bells"
                size={24}
                color={
                  activeTab === "Notifications"
                    ? "rgba(60, 105, 96, 1)"
                    : "#333"
                }
              />
              {renderBadge(unreadCounts.Notifications)}
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainBar}>{renderContent()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    height: hp(8),
    width: wp(100),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(60, 105, 96, 1)",
    elevation: 5,
  },
  topBarTitle: {
    marginLeft: wp(3),
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "OpenSans_400Regular",
  },
  main: {
    flex: 1,
    flexDirection: "row",
  },
  sideBar: {
    width: wp(30),
    backgroundColor: "#ffffff",
    elevation: 5,
    paddingVertical: hp(2),
    alignItems: "center",
  },
  tab: {
    paddingVertical: hp(2),
    marginBottom: hp(1),
  },
  activeTab: {
    backgroundColor: "rgba(60, 105, 96, 0.1)",
    borderRadius: 8,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "80%",
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "OpenSans_400Regular",
  },
  mainBar: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: wp(4),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 3,
  },
  item: {
    padding: hp(2),
    marginBottom: hp(1),
    backgroundColor: "#e7f5e4",
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(60, 105, 96, 1)",
    fontFamily: "OpenSans_400Regular",
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "OpenSans_400Regular",
  },
});
