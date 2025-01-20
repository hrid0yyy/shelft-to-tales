import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function Ebooks() {
  const pageRef = useRef(10);
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
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
      }
      #pdf-container {
        width: 100%;
        height: 85%;
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
        height: 15%;
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
    <div id="pdf-container"></div>
    <div id="progress-bar-container">
      <div id="progress-bar">
        <div id="progress"></div>
      </div>
      <div id="page-info"></div>
    </div>
  
    <script>
      const url = "https://lixgbffpefinudzrltwi.supabase.co/storage/v1/object/public/stt-storage/ebooks/1984.pdf?t=2025-01-18T18%3A24%3A02.392Z";
      let pdfDoc = null,
          pageNum = ${pageRef.current}, // Start at the current page from useState
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
  
          pdfContainer.innerHTML = ''; // Clear previous page
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

          // Update progress bar and page info
          const progress = (num / pageCount) * 100;
          document.getElementById('progress').style.width = progress + '%';
          document.getElementById('page-info').textContent = \`Page \${num} of \${pageCount}\`;

          sendCurrentPageToReact(num); // Notify React of the current page
        });
      };
  
      pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        pageCount = pdf.numPages;
        renderPage(pageNum);
      });
  
      // Handle swipe gestures
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
          // Swipe left to go to the next page
          if (pageNum < pageCount) {
            pageNum++;
            renderPage(pageNum);
          }
        } else if (endX - startX > 50) {
          // Swipe right to go to the previous page
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
