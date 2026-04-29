import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 2400);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[140px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center relative z-10"
      >
        <motion.div
          className="w-36 h-36 rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_60px_rgba(204,0,0,0.35)] mb-8 bg-card flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 30px rgba(204,0,0,0.25)",
              "0 0 80px rgba(204,0,0,0.5)",
              "0 0 30px rgba(204,0,0,0.25)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={logoImg}
            alt="Detailer Lucas Moraes Logo"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-4xl tracking-widest text-foreground text-center"
        >
          LUCAS MORAES
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-muted-foreground text-xs uppercase tracking-[0.3em] mt-2"
        >
          Auto Detailing Premium
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
          className="w-20 h-[2px] bg-primary mt-6 rounded-full"
        />
      </motion.div>
    </div>
  );
}
