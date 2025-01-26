import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { WebView } from "react-native-webview";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Init, placeOrder } from "@/utils/payment";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { fetchCart, updateCart } from "@/utils/cart";
import { useAuth } from "@/hooks/AuthContext";
const ShoppingCart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState();
  const [cartUpdated, setCartUpdated] = useState(false); // State to track cart updates
  const [purchase, setPurchase] = useState(false);
  const [showWebView, setShowWebView] = React.useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchCart(user.id);
      setItems(data.cart);

      setTotal(data.totalPrice);
    };
    fetch();
  }, [cartUpdated, purchase]);
  const router = useRouter();

  const getPaymentUrl = async () => {
    const data = await Init(
      user?.id,
      user?.mobile_number,
      user?.location,
      user?.full_name,
      user?.email
    );
    if (!data.success) {
      showMessage({
        message: "Shelf to tales",
        description: data.message,
        type: "danger",
      });
      return;
    }
    setPaymentUrl(data.url);
    setShowWebView(true);
  };

  const cashOnDelivery = async () => {
    const response = await placeOrder(user?.id, user?.location);
    if (items.length == 0) {
      showMessage({
        message: "Shelf to tales",
        description: "Cart Is Empty",
        type: "danger",
      });
      return;
    }
    if (response) {
      showMessage({
        message: "Shelf to tales",
        description: "Order Placed Successfully",
        type: "success",
      });
      setPurchase((e) => !e);
    } else {
      showMessage({
        message: "Shelf to tales",
        description: "Payment Failed",
        type: "danger",
      });
    }
  };

  const onNavigationStateChange = async (navState) => {
    // Check if the current URL is the success URL
    if (navState.url.includes("http://localhost:3030/success")) {
      // Payment successful
      console.log("Payment successful!");
      setShowWebView(false);
      // Handle success (e.g., update UI, navigate to another screen)
      const response = await placeOrder(user?.id, user?.location);
      if (response) {
        showMessage({
          message: "Shelf to tales",
          description: "Payment Successfull",
          type: "success",
        });
        setPurchase((e) => !e);
      } else {
        showMessage({
          message: "Shelf to tales",
          description: "Payment Failed",
          type: "danger",
        });
      }
    } else if (navState.url.includes("http://localhost:3030/fail")) {
      // Payment failed
      console.log("Payment failed.");
      setShowWebView(false);
      // Handle failure (e.g., show failure message)
      showMessage({
        message: "Shelf to tales",
        description: "Payment Failed",
        type: "danger",
      });
    } else if (navState.url.includes("http://localhost:3030/cancel")) {
      // Payment canceled
      console.log("Payment was canceled.");
      setShowWebView(false);
      // Handle cancel (e.g., show cancel message)
      showMessage({
        message: "Shelf to tales",
        description: "Payment Cancelled",
        type: "danger",
      });
    }
  };

  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  if (showWebView) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        style={{ flex: 1 }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          //  console.error("WebView error: ", nativeEvent);
        }}
        onNavigationStateChange={onNavigationStateChange}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Shopping Cart</Text>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="back" size={hp(3)} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.cartId}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.cover }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.itemAuthor}>{item.author}</Text>
              <View style={styles.priceQuantity}>
                <Text style={styles.price}>৳{item.itemTotal.toFixed(2)}</Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() => {
                      updateCart(item.cartId, "minus");
                      setCartUpdated((prev) => !prev);
                    }}
                  >
                    <Text style={styles.quantityButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      updateCart(item.cartId, "plus");
                      setCartUpdated((prev) => !prev);
                    }}
                  >
                    <Text style={styles.quantityButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <Text style={styles.subtotal}>
          Sub total: <Text style={styles.total}>৳ {total}</Text>
        </Text>
        <Text style={styles.note}>(Total does not include shipping)</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={cashOnDelivery}>
        <Text style={styles.checkoutText}>Cash on delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bkashButton} onPress={getPaymentUrl}>
        <Text style={styles.bkashText}>
          {/* Check out with <Text style={styles.paypalBold}>PayPal</Text> */}
          Check out with{" "}
        </Text>
        <Image
          style={{ height: hp(3), width: wp(20) }}
          source={require("@/assets/images/ssl.png")}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/screens/App");
        }}
      >
        <Text style={styles.continueShopping}>Continue shopping</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: wp("5%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
    alignItems: "center",
  },
  headerText: {
    fontSize: wp("5%"),
    fontFamily: "OpenSans_700Bold",
    color: "rgba(60, 105, 96, 1)",
  },
  editText: {
    fontSize: wp("4%"),
    fontFamily: "OpenSans_400Regular",
    color: "rgba(60, 105, 96, 1)",
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: hp("2%"),
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: wp("3%"),
    alignItems: "center",
  },
  image: {
    width: wp("20%"),
    height: hp("18%"),
    marginRight: wp("4%"),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: wp("3.5%"),
    fontFamily: "OpenSans_700Bold",
    color: "#333",
  },
  itemAuthor: {
    fontSize: wp("2.5%"),
    fontFamily: "OpenSans_400Regular",
    color: "#666",
    marginVertical: hp("0.5%"),
  },
  priceQuantity: {
    marginTop: hp(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: wp("4%"),
    fontFamily: "OpenSans_700Bold",
    color: "rgba(60, 105, 96, 1)",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: wp("4%"),
    color: "rgba(60, 105, 96, 1)",
    paddingHorizontal: wp("2%"),
  },
  quantityText: {
    fontSize: wp("4%"),
    fontFamily: "OpenSans_400Regular",
    marginHorizontal: wp("2%"),
  },
  summary: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  subtotal: {
    fontSize: wp("4%"),
    fontFamily: "OpenSans_700Bold",
  },
  total: {
    color: "rgba(60, 105, 96, 1)",
  },
  note: {
    fontSize: wp("2.5%"),
    fontFamily: "OpenSans_400Regular",
    color: "#666",
  },
  checkoutButton: {
    backgroundColor: "rgba(60, 105, 96, 1)",
    paddingVertical: hp("2%"),
    borderRadius: 10,
    alignItems: "center",
    marginTop: hp("2%"),

    elevation: 5,
  },
  checkoutText: {
    fontSize: wp("4%"),
    fontFamily: "OpenSans_700Bold",
    color: "#fff",
  },
  bkashButton: {
    backgroundColor: "white",
    paddingVertical: hp("2%"),
    borderRadius: 10,
    alignItems: "center",
    marginTop: hp("1%"),
    justifyContent: "center",
    flexDirection: "row",

    elevation: 5,
  },
  bkashText: {
    fontSize: wp("4%"),
    fontFamily: "OpenSans_400Regular",
  },
  paypalBold: {
    fontFamily: "OpenSans_700Bold",
  },
  continueShopping: {
    textAlign: "center",
    color: "rgba(60, 105, 96, 1)",
    fontSize: wp("4%"),
    marginTop: hp("2%"),
  },
});

export default ShoppingCart;
