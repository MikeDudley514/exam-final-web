import React, { useEffect } from "react";
import googleLogo from "./assets/Google.png";
import { auth, db } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique si déjà connecté
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

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

  const loginWithProvider = async (providerName) => {
    const provider =
      providerName === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user);
    } catch (error) {
      console.error("Erreur Auth:", error);
      alert("Erreur lors de la connexion : " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-500">VisionAI</h1>
        <p className="text-slate-400 mb-8 text-sm">
          Connexion (Mode test sans captcha)
        </p>

        {/* Bouton Google toujours actif */}
        <button
          onClick={() => loginWithProvider("google")}
          className="w-full py-3 mb-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all bg-white text-slate-900 hover:bg-slate-200"
        >
          <img src={googleLogo} alt="G" className="w-6 h-6" />
          Continuer avec Google
        </button>

        {/* Bouton GitHub toujours actif */}
        <button
          onClick={() => loginWithProvider("github")}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-3 font-bold transition-all bg-slate-700 text-white hover:bg-slate-600"
        >
          Continuer avec GitHub
        </button>
      </div>
    </div>
  );
}
