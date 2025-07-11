"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Email atau password salah");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Masuk ke Akun</h2>
        <p className="text-sm text-gray-500">
          Pantau pengeluaranmu dengan mudah
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center bg-red-50 py-2 px-3 rounded-md">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Email</label>
        <input
          type="email"
          placeholder="contoh@email.com"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-md"
      >
        Masuk
      </button>

      <p className="text-sm text-center text-gray-600">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
