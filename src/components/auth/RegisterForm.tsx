"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Pendaftaran gagal. Coba lagi.");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Buat Akun Baru</h2>
        <p className="text-sm text-gray-500">
          Mulai pantau keuanganmu hari ini
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
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Minimal 6 karakter"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-md"
      >
        Daftar
      </button>

      <p className="text-sm text-center text-gray-600">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-green-600 hover:underline font-medium"
        >
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
