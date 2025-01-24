import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomSheet } from "react-native-sheet";
import { useRouter } from "expo-router";
import { fetchPurchaseHistory, fetchTrackOrder } from "@/utils/order";
import { useAuth } from "@/hooks/AuthContext";
import { formatDateTime } from "@/utils/time";
export default function PurchaseHistory() {
  const [orders, setOrders] = useState();
  const [orderExist, setOrderExist] = useState(false);
  const { user } = useAuth();
  const [details, setDetails] = useState();
  useEffect(() => {
    (async () => {
      const response = await fetchPurchaseHistory(user?.id);
      setOrderExist(response.success);
      if (response.success) {
        setOrders(response.orders);
      }
    })();
  }, []);
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const router = useRouter();
  const bottomSheet = useRef<BottomSheetRef>(null);
  // Example data

  return (
    <>
      <BottomSheet height={300} ref={bottomSheet}>
        {
          <>
            {" "}
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: "OpenSans_400Regular",
                marginLeft: hp(2),
                marginTop: hp(1),
              }}
            >
              Order Data : {formatDateTime(details?.orderDate)}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: hp(2),
                marginTop: hp(1),
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: hp(1.5),
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                Order ID : {details?.orderId}
              </Text>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: "OpenSans_700Bold",
                  marginLeft: hp(2),
                }}
              >
                Amount : {details?.price} Taka
              </Text>
            </View>
            <View
              style={{
                marginLeft: hp(2),
                gap: hp(1),
                marginTop: hp(2),
                flexDirection: "row",
                width: wp(90),
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Items :{" "}
              </Text>{" "}
              {details?.items.map((item) => (
                <Text
                  key={item.id} // Assuming each item has a unique id for React's key prop
                  style={{
                    fontSize: hp(2),
                    fontFamily: "OpenSans_400Regular",
                  }}
                >
                  {item?.title} x{item?.quantity}.{" "}
                </Text>
              ))}
            </View>
            <Text
              style={{
                marginLeft: hp(2),
                fontSize: hp(2),
                marginTop: hp(2),
                fontFamily: "OpenSans_700Bold",
              }}
            >
              Order Status : {details?.status}
            </Text>
          </>
        }
      </BottomSheet>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="arrowleft" size={hp(4)} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.trackText}>Purchasing History</Text>
      <View style={styles.tableHead}>
        <Text style={styles.headText}>Order ID</Text>
        <Text style={styles.headText}>Date</Text>
        <Text style={styles.headText}>Status</Text>
      </View>
      {orderExist &&
        orders.map((order) => (
          <TouchableOpacity
            style={styles.tableRow}
            key={order.orderId}
            onPress={() => {
              setDetails(order);
              bottomSheet.current?.show();
            }}
          >
            <Text style={{ ...styles.data, marginLeft: wp(20) }}>
              {order.orderId}
            </Text>
            <Text style={{ ...styles.data, marginLeft: wp(18), width: wp(25) }}>
              {formatDateTime(order.orderDate)}
            </Text>
            <Text style={{ ...styles.data, marginLeft: wp(9), width: wp(20) }}>
              {order.status}
            </Text>
          </TouchableOpacity>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: hp(4),
    width: wp(100),
    margin: hp(2),
  },
  trackText: {
    fontSize: hp(4),
    fontFamily: "OpenSans_400Regular",
    marginLeft: hp(2),
  },
  tableHead: {
    height: hp(5),
    width: wp(100),
    backgroundColor: "#3c6960",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  headText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_700Bold",
    color: "white",
  },
  tableRow: {
    height: hp(8),
    width: wp(100),

    marginVertical: hp(1),
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    flexDirection: "row",
  },
  data: {
    fontSize: hp(1.6),
    fontFamily: "OpenSans_400Regular",
  },
});
