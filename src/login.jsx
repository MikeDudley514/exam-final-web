import React, { useState, useEffect } from "react";
import googleLogo from "./assets/Google.png";
import { auth, db } from "../firebase";
import {
    GoogoleAuthProvider,
    GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  RecaptchaVerifier,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [isHuman, setIsHuman] = useState(false); // État pour la case reCAPTCHA


    // 2. Écouteur de session (Redirection si déjà connecté)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    });


    
    
    
    
    
    
    return () => unsubscribe();
  }, [navigate]);

  const handleAuthSuccess = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "user",
        createdAt: new Date(),
      });
    }
  };





  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-500">VisionAI</h1>
        <p className="text-slate-400 mb-8 text-sm">
          Sécurisez votre accès pour continuer
        </p>

        {/* CONTENEUR RECAPTCHA (La Boîte) */}
        <div id="recaptcha-container" className="mb-8"></div>

        {/* BOUTON GOOGLE */}
        <button
          onClick={() => loginWithProvider("google")}
          disabled={!isHuman}
          className={`w-full py-3 mb-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
            isHuman
              ? "bg-white text-slate-900 hover:bg-slate-200"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          <img src={googleLogo} alt="G" className="w-6 h-6" />
          Continuer avec Google
        </button>

        {/* BOUTON GITHUB */}
        <button
          onClick={() => loginWithProvider("github")}
          disabled={!isHuman}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
            isHuman
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          Continuer avec GitHub
        </button>

        {!isHuman && (
          <p className="mt-4 text-xs text-red-400 animate-pulse">
            Vérification de sécurité requise
          </p>
        )}
      </div>
    </div>
  );
}
