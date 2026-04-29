import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageCircle, Instagram, LogOut } from "lucide-react";
import { WorksGallery } from "@/components/works-gallery";
import logoImg from "@/assets/logo.png";
import heroVideo from "@/assets/hero-loop.mp4";

export default function Menu() {
  const { isAuthenticated, logout, currentUser } = useAppStore();
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const primeiroNome = currentUser?.nome?.split(" ")[0] || "";

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[hsl(0_0%_4%/0.85)] to-[hsl(0_0%_4%/0.95)]" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0" />

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10 flex-1 flex flex-col p-6 pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-5"
        >
          {currentUser?.role === "cliente" && (
            <div className="text-primary font-medium tracking-widest uppercase text-sm">
              Olá, {primeiroNome}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_40px_rgba(204,0,0,0.4)] bg-card"
          >
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
          </motion.div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl tracking-widest text-foreground">
              DETAILER LUCAS MORAES
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Excelência em cuidado automotivo: acabamento padrão concessionária, polimento e vitrificação com agendamento exclusivo.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => setLocation("/schedule")}
              className="w-full h-16 rounded-xl text-lg font-semibold tracking-wide justify-between px-6 shadow-[0_0_15px_rgba(204,0,0,0.1)] hover:shadow-[0_0_25px_rgba(204,0,0,0.35)] transition-all duration-300 backdrop-blur-sm"
            >
              <span>{currentUser?.role === "cliente" ? "Agendar Horário" : "Abrir Agenda"}</span>
              <CalendarDays className="w-5 h-5 opacity-80" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={() => window.open("https://wa.me/5591991984345", "_blank")}
              className="w-full h-16 rounded-xl text-lg font-semibold tracking-wide justify-between px-6 border-border hover:bg-card/50 backdrop-blur-sm bg-background/50"
            >
              <span>Falar no WhatsApp</span>
              <MessageCircle className="w-5 h-5 opacity-80" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              onClick={() => window.open("https://instagram.com/detailerlucasmoraes", "_blank")}
              className="w-full h-16 rounded-xl text-lg font-semibold tracking-wide justify-between px-6 border-border hover:bg-card/50 backdrop-blur-sm bg-background/50"
            >
              <span>Ver Instagram</span>
              <Instagram className="w-5 h-5 opacity-80" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <WorksGallery />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-transparent uppercase tracking-widest text-xs h-12"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Sistema
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
