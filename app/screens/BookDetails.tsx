import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
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
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import Dialog from "react-native-dialog";
import { addRating, details, fetchReviews, toggleWishlist } from "@/utils/book";
import { addToCart } from "@/utils/cart";
import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/AuthContext";
export default function BookDetails() {
  const [toggleModal, setToggleModal] = useState(false);
  const { bookId } = useLocalSearchParams();
  const [rating, setRating] = useState(0); // State to track the rating
  const { user } = useAuth();
  const [wish, setWish] = useState(false);
  const [review, setReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totalRatings, setTotalRatings] = useState();
  const [totalReviews, setTotalReviews] = useState();
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });
  const [book, setBook] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await details(bookId, user.id);
        const reviewData = await fetchReviews(bookId);
        setReviews(reviewData.reviews);
        setTotalReviews(reviewData.totalRatings);
        setTotalRatings(reviewData.avgRatings);
        setBook(data);
        if (data.wishlist) {
          setWish(true);
        }
      } catch (error) {
        console.error("Error fetching book details:", error.message);
      }
    };

    fetchDetails(); // Call the async function
  }, [bookId, rating]); // Dependency array to ensure it runs when bookId changes
  const formatEndDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle invalid or missing dates

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const router = useRouter();

  // Track active tab
  const [activeTab, setActiveTab] = useState("Description");

  const [visible, setVisible] = useState(false);

  const addCart = async () => {
    const { success } = await addToCart(user.id, bookId);
    if (success) {
      alert("Added to cart");
    } else {
      alert("Already exist in the cart");
    }
  };

  const showDialog = async () => {
    setVisible(true);
    await addRating(book.bookId, user.id, rating, review);
    setRating(undefined);
    setReview("");
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpload = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setVisible(false);
    setToggleModal(false);
  };

  if (!book) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View
        style={{
          height: hp(5),
          width: wp(100),
          justifyContent: "center",
          backgroundColor: "rgba(60, 105, 96, 0.9)",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{ marginLeft: hp(2), marginTop: hp(2) }}
        >
          <AntDesign name="arrowleft" size={hp(3)} color="white" />
        </TouchableOpacity>
      </View>

      {/* Product Section */}
      <View style={styles.header}>
        <View style={styles.productContainer}>
          {book.discount && (
            <View style={styles.saleTag}>
              <Text style={styles.saleText}>
                Sale 30% Off Till {formatEndDate(book.endDate)}
              </Text>
            </View>
          )}
          {!book.discount && (
            <View style={styles.saleTag}>
              <Text style={styles.saleText}>No Sale</Text>
            </View>
          )}
          <Image
            style={{ height: hp(25), width: wp(35) }}
            source={{
              uri: book.cover,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              toggleWishlist(book.bookId, user.id);
              setWish(!wish);
            }}
          >
            {wish ? (
              <AntDesign name="heart" size={hp(3)} color="red" />
            ) : (
              <EvilIcons name="heart" size={hp(3)} color="white" />
            )}
          </TouchableOpacity>
        </View>

        {/* Title and Rating */}
        <View style={styles.titleContainer}>
          <View
            style={{
              width: wp(65),
              marginLeft: hp(4),
            }}
          >
            <Text style={styles.titleText}>{book.title}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={hp(3)} color="gold" />
            <Text style={styles.ratingText}>{totalRatings}</Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.details}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={{ alignItems: "center", gap: 5 }}
            onPress={() => setActiveTab("Description")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Description" && styles.activeTabText,
              ]}
            >
              Description
            </Text>
            {activeTab === "Description" && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: "center", gap: 5 }}
            onPress={() => setActiveTab("Review")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Review" && styles.activeTabText,
              ]}
            >
              Review
            </Text>
            {activeTab === "Review" && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.info}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "Description" ? (
            <View style={styles.description}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: "OpenSans_700Bold",
                }}
              >
                Author: {book.author}
              </Text>

              <View style={styles.genres}>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    fontFamily: "OpenSans_700Bold",
                  }}
                >
                  Genre: {book.genres}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: hp(1.5),
                  fontFamily: "OpenSans_400Regular",
                  marginTop: hp(1),
                }}
              >
                {book.description}
              </Text>
              <Text
                style={{
                  fontSize: hp(1.5),
                  fontFamily: "OpenSans_400Regular",
                  marginTop: hp(2),
                  color: "grey",
                }}
              >
                Publisher: {book.publisher}
              </Text>
              <Text
                style={{
                  fontSize: hp(1.5),
                  fontFamily: "OpenSans_400Regular",
                  color: "grey",
                }}
              >
                Published Date: {book.pubDate}
              </Text>
              <Text
                style={{
                  fontSize: hp(1.5),
                  fontFamily: "OpenSans_400Regular",
                  color: "grey",
                }}
              >
                Language: {book.language}
              </Text>
            </View>
          ) : (
            <View style={styles.review}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  width: wp(77),
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: hp(2), fontFamily: "OpenSans_400Regular" }}
                >
                  Comments
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.5),
                    fontFamily: "OpenSans_400Regular",
                    color: "rgba(60, 105, 96, 1)",
                  }}
                >
                  {totalReviews} Reviews
                </Text>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* review modal opener button */}
                <TouchableOpacity
                  onPress={() => {
                    setToggleModal(!toggleModal);
                  }}
                >
                  <View
                    style={{
                      width: wp(80),
                      backgroundColor: "red",
                      borderRadius: hp(3),
                      height: hp(5),
                      marginTop: hp(2),
                      backgroundColor: "rgba(0,0,0,0.1)",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      padding: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "OpenSans_400Regular",
                        fontSize: hp(1.5),
                        color: "grey",
                      }}
                    >
                      What do you think?
                    </Text>
                    <FontAwesome name="send-o" size={hp(2)} color="grey" />
                  </View>
                </TouchableOpacity>
                {/* Modal */}
                <Modal
                  transparent={true}
                  visible={toggleModal}
                  animationType="fade"
                  onRequestClose={() => setToggleModal(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.8)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: wp(80),

                        justifyContent: "center",
                        alignItems: "center",
                        gap: hp(2),
                      }}
                    >
                      <View
                        style={{ flexDirection: "row-reverse", width: wp(80) }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setToggleModal(false);
                          }}
                        >
                          <Entypo name="cross" size={hp(3)} color="white" />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          height: hp(6),
                          width: wp(80),

                          justifyContent: "center",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: hp(1.5),
                            color: "white",
                            fontFamily: "OpenSans_400Regular",
                          }}
                        >
                          How was your experience?
                        </Text>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                setRating(index + 1);
                              }}
                            >
                              <View>
                                {index < rating ? (
                                  <AntDesign
                                    name="star"
                                    size={hp(3)}
                                    color="gold"
                                  />
                                ) : (
                                  <AntDesign
                                    name="staro"
                                    size={hp(3)}
                                    color="gold"
                                  />
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <TextInput
                        placeholder="write your review ..."
                        style={{
                          height: hp(20),
                          width: wp(80),
                          backgroundColor: "white",
                          borderRadius: hp(2),
                          padding: hp(2),
                        }}
                        onChangeText={(e) => setReview(e)} // Update the state variable when text changes
                      />
                      <TouchableOpacity onPress={showDialog}>
                        <View
                          style={{
                            height: hp(7),
                            width: wp(60),
                            borderRadius: hp(1),
                            backgroundColor: "rgba(60, 105, 96, 1)",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: hp(2),
                              fontFamily: "OpenSans_400Regular",
                            }}
                          >
                            Submit
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <Dialog.Container visible={visible}>
                  <Dialog.Description>
                    Thank you for your review!
                  </Dialog.Description>

                  <Dialog.Button label="OK" onPress={handleUpload} />
                </Dialog.Container>
                {/* Review Box */}
                <ScrollView>
                  {/* review card */}
                  {reviews.map((review) => (
                    <View
                      key={review.ratingId}
                      style={{
                        marginTop: hp(2),
                        borderRadius: hp(1.5),
                        padding: 8,
                        width: wp(80),
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          style={{
                            height: hp(6),
                            width: hp(6),
                            borderRadius: 50,
                            marginRight: hp(2),
                          }}
                          source={{
                            uri:
                              review.users?.profile_url ||
                              "https://via.placeholder.com/150",
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              fontSize: hp(1.5),
                              fontFamily: "OpenSans_400Regular",
                            }}
                          >
                            {review.users?.full_name || "Anonymous"}
                          </Text>
                          <View style={{ flexDirection: "row", gap: 1 }}>
                            {Array.from({ length: review.star }).map(
                              (_, index) => (
                                <AntDesign
                                  key={index}
                                  name="star"
                                  size={hp(2)}
                                  color="gold"
                                />
                              )
                            )}
                          </View>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: hp(1.5),
                          fontFamily: "OpenSans_400Regular",
                          marginRight: hp(1),
                        }}
                      >
                        {review.review}
                      </Text>

                      <View
                        style={{
                          justifyContent: "space-between",
                          flexDirection: "row",
                          marginTop: hp(1),
                          marginRight: hp(1),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: hp(1.35),
                            fontFamily: "OpenSans_400Regular",
                            color: "grey",
                          }}
                        >
                          {new Date(review.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.price}>
            {book.discount && (
              <>
                <Text style={[styles.priceText]}>৳ </Text>
                <Text
                  style={[
                    styles.priceText,
                    { textDecorationLine: "line-through" },
                  ]}
                >
                  {book.price}
                </Text>
                <Text style={[styles.priceText]}> {book.discountedPrice}</Text>
              </>
            )}
            {!book.discount && (
              <>
                <Text style={[styles.priceText]}>৳ </Text>
                <Text style={[styles.priceText]}>{book.price}</Text>
              </>
            )}
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={addCart}>
            <Text style={styles.cartBtnText}>+ Add To Cart</Text>
          </TouchableOpacity>
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
    height: hp(43),
    width: wp(100),
    backgroundColor: "rgba(60, 105, 96, 0.9)",
    alignItems: "center",
  },
  productContainer: {
    height: hp(28),
    width: wp(70),
    justifyContent: "space-between",
    flexDirection: "row",
  },
  saleTag: {
    width: wp(15),
    borderRadius: hp(1),

    alignItems: "center",
  },
  saleText: {
    color: "white",
    fontSize: hp(1.5),
    fontFamily: "OpenSans_400Regular",
  },
  titleContainer: {
    height: hp(10),
    width: wp(100),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_700Bold",
    color: "white",
  },
  ratingContainer: {
    marginRight: hp(2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(2),
  },
  ratingText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_700Bold",
    color: "white",
  },
  details: {
    height: hp(56),
    width: wp(100),
    borderTopLeftRadius: hp(7),
    borderTopRightRadius: hp(7),
    transform: [{ translateY: -hp(4) }],
    backgroundColor: "#F2FDEF",
    position: "relative",
    paddingBottom: hp(10),
  },
  tabContainer: {
    height: hp(5),
    width: wp(100),
    marginTop: hp(1),
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  tabText: {
    fontSize: hp(2),
    fontFamily: "OpenSans_400Regular",
    color: "gray",
  },
  activeTabText: {
    fontFamily: "OpenSans_700Bold",
    color: "rgba(60, 105, 96, 1)",
  },
  activeIndicator: {
    height: hp(0.5),
    width: wp(15),
    backgroundColor: "rgba(60, 105, 96, 1)",
  },
  footer: {
    height: hp(10),
    width: wp(100),
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: hp(4),
    paddingRight: hp(4),
    backgroundColor: "#F2FDEF",
  },
  price: {
    height: hp(7),
    width: wp(40),
    borderRadius: hp(2),
    borderWidth: 2,
    borderColor: "rgba(60, 105, 96, 1)",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    color: "rgba(60, 105, 96, 1)",
    fontFamily: "OpenSans_400Regular",
  },
  cartBtn: {
    height: hp(7),
    width: wp(40),
    backgroundColor: "rgba(60, 105, 96, 1)",
    borderRadius: hp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  cartBtnText: {
    color: "white",
    fontFamily: "OpenSans_400Regular",
  },
  info: {
    flex: 1,
    width: wp(100),
  },
  scrollContent: {
    paddingHorizontal: hp(3),
    paddingBottom: hp(2),
  },
  description: {
    marginLeft: hp(3),
    marginRight: hp(3),
    marginTop: hp(2),
  },
  review: {
    marginLeft: hp(3),
    marginRight: hp(3),
    marginTop: hp(2),
  },
  genres: {
    width: wp(75),
    gap: hp(1),
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
