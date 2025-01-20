import Loading from "@/components/Loading";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  OpenSans_400Regular,
  useFonts,
  OpenSans_700Bold,
  OpenSans_300Light_Italic,
} from "@expo-google-fonts/open-sans";
import { updatePage } from "@/utils/ebook";
import { useAuth } from "@/hooks/AuthContext";
export default function Ebooks() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_300Light_Italic,
  });

  const router = useRouter();
  const { user } = useAuth();
  const pageRef = useRef("");
  const { bookId, url, pageAt, title } = useLocalSearchParams();
  useEffect(() => {
    pageRef.current = pageAt;
  }, []);
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swipe PDF Viewer</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.min.js"></script>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background-color: #ffffff;
      color: #333333;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      height: 100vh;
      overflow: hidden;
    }
    #header {
      width: 100%;
      padding: 15px 0;
      background-color: #3c6960;
      color: white;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    #pdf-container {
      width: 100%;
      height: 75%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      touch-action: pan-y;
      background-color: #f4f4f4;
    }
    canvas {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    #progress-bar-container {
      width: 100%;
      height: 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5px;
      background-color: #f4f4f4;
    }
    #progress-bar {
      width: 90%;
      height: 10px;
      background-color: #ddd;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
    }
    #progress {
      height: 100%;
      width: 0%;
      background-color: #007AFF;
      border-radius: 5px;
      transition: width 0.3s ease;
    }
    #page-info {
      font-size: 14px;
      margin-top: 5px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="header"> ${title}</div>
  <div id="pdf-container"></div>
  <div id="progress-bar-container">
    <div id="progress-bar">
      <div id="progress"></div>
    </div>
    <div id="page-info"></div>
  </div>

  <script>
    const url = "${url}";
    let pdfDoc = null,
        pageNum = ${pageAt},
        pageCount = 0,
        scale = 1,
        startX = 0,
        endX = 0;

    const sendCurrentPageToReact = (page) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ currentPage: page }));
      }
    };

    const renderPage = (num) => {
      pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const pdfContainer = document.getElementById('pdf-container');

        pdfContainer.innerHTML = '';
        pdfContainer.appendChild(canvas);

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const containerWidth = pdfContainer.offsetWidth;
        scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        page.render({
          canvasContext: context,
          viewport: scaledViewport,
        });

        const progress = (num / pageCount) * 100;
        document.getElementById('progress').style.width = progress + '%';
        document.getElementById('page-info').textContent = \`Page \${num} of \${pageCount}\`;

        sendCurrentPageToReact(num);
      });
    };

    pdfjsLib.getDocument(url).promise.then(pdf => {
      pdfDoc = pdf;
      pageCount = pdf.numPages;
      renderPage(pageNum);
    });

    const pdfContainer = document.getElementById('pdf-container');

    pdfContainer.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    });

    pdfContainer.addEventListener('touchend', (event) => {
      endX = event.changedTouches[0].clientX;
      handleSwipe();
    });

    const handleSwipe = () => {
      if (startX - endX > 50) {
        if (pageNum < pageCount) {
          pageNum++;
          renderPage(pageNum);
        }
      } else if (endX - startX > 50) {
        if (pageNum > 1) {
          pageNum--;
          renderPage(pageNum);
        }
      }
    };
  </script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.currentPage) {
            pageRef.current = data.currentPage;
            console.log(pageRef.current);
            updatePage(user?.id, bookId, pageRef.current);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
