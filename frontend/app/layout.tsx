import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { AuthModal } from "./components/AuthModal";

export const metadata: Metadata = {
  title: "Nexus Academia | AI-Powered Student Productivity Dashboard",
  description: "Accelerate your academic workflow with gamified focus sessions, AI active recall flashcards, grade target forecasting, and lo-fi ambient soundscapes.",
  keywords: ["student productivity", "AI study copilot", "active recall", "spaced repetition", "pomodoro timer", "lo-fi soundscapes", "grade calculator"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAFC] text-slate-900 selection:bg-indigo-600 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

