"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-60 -right-40 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Glowing particles */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: "0 0 10px 2px rgba(255,255,255,0.5)",
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 relative z-10 h-screen flex flex-col justify-between">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">
          <div className="space-y-8 text-left">
            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 neon-text">
              Kelola Keuanganmu dengan Mudah
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
              Budget Tracker membantu kamu mencatat pemasukan dan pengeluaran
              dengan cepat, mudah, dan aman.
            </p>
            <div className="flex gap-6 mt-6">
              <Button
                onClick={() => router.push("/register")}
                className="px-8 py-3 text-base bg-gradient-to-r from-cyan-500 to-purple-600 border-none shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                Daftar Sekarang
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="px-8 py-3 text-base border-2 border-cyan-400 text-cyan-300 bg-transparent hover:bg-cyan-400/10 backdrop-blur-md transition-all duration-300 hover:scale-105 neon-border"
              >
                Masuk
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="w-80 h-80 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-400/20 neon-glow p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-400/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                  Visual Dashboard
                </h3>
                <p className="text-gray-300 text-sm">
                  Pantau keuanganmu dengan antarmuka visual yang intuitif
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Catat Transaksi",
              desc: "Tambah pemasukan dan pengeluaran dengan beberapa klik saja.",
              icon: "📝",
            },
            {
              title: "Pantau Sisa Dana",
              desc: "Lihat saldo tersisa secara real-time di dashboard kamu.",
              icon: "📊",
            },
            {
              title: "Statistik Ringkas",
              desc: "Fitur grafik dan rekap harian yang memudahkan analisa.",
              icon: "📈",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 neon-glow-hover"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-cyan-300">
                {f.title}
              </h3>
              <p className="text-sm text-gray-300">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 border-t border-gray-800 pt-6 pb-4">
          &copy; {new Date().getFullYear()} Budget Tracker by XzawDev. All
          rights reserved.
        </footer>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 5px rgba(103, 232, 249, 0.5),
            0 0 10px rgba(103, 232, 249, 0.3), 0 0 15px rgba(103, 232, 249, 0.2);
        }
        .neon-border {
          box-shadow: 0 0 5px rgba(103, 232, 249, 0.5),
            inset 0 0 5px rgba(103, 232, 249, 0.1);
        }
        .neon-glow {
          box-shadow: 0 0 15px rgba(103, 232, 249, 0.3),
            0 0 30px rgba(103, 232, 249, 0.2);
        }
        .neon-glow-hover:hover {
          box-shadow: 0 0 15px rgba(103, 232, 249, 0.4),
            0 0 30px rgba(103, 232, 249, 0.3);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
