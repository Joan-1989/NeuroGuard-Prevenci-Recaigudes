
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIjNlfgFzT3ytEI3dEmqG5fDfeFuCMONg",
    authDomain: "acencas-prevencio-activa-apa.firebaseapp.com",
    projectId: "acencas-prevencio-activa-apa",
    storageBucket: "acencas-prevencio-activa-apa.firebasestorage.app",
    messagingSenderId: "96053706134",
    appId: "1:96053706134:web:1fcab6e95897b51163b1b7",
    measurementId: "G-3885EB9T7L"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
