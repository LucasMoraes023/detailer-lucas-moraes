import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppStore, Appointment, ServiceType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, LogOut, Clock, User, Wrench } from "lucide-react";

export default function Schedule() {
  const { isAuthenticated, logout, currentUser, appointments, bookAppointment } = useAppStore();
  const [, setLocation] = useLocation();
  
  const [selectedSlot, setSelectedSlot] = useState<Appointment | null>(null);
  const [clientName, setClientName] = useState("");
  const [service, setService] = useState<ServiceType | "">("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const isAdmin = currentUser?.role === "admin";

  const handleSlotClick = (slot: Appointment) => {
    const isMySlot = slot.bookedByUserId === currentUser?.id;
    
    if (!isAdmin && slot.status === "Reservado" && !isMySlot) {
      return; // Cannot click others' slots as client
    }

    setSelectedSlot(slot);
    setClientName(isAdmin ? (slot.clientName || "") : (currentUser?.nome || ""));
    setService(slot.service || "");
  };

  const handleConfirm = () => {
    if (!selectedSlot || !clientName || !service) return;

    bookAppointment(selectedSlot.time, clientName, service as ServiceType);
    
    // Open WhatsApp
    const message = `Olá, novo agendamento:\nNome: ${clientName}\nServiço: ${service}\nHorário: ${selectedSlot.time}`;
    const url = `https://wa.me/5591991984345?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setSelectedSlot(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col p-6">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/menu")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-display text-2xl tracking-widest text-foreground">
          {isAdmin ? "AGENDA COMPLETA" : "AGENDAR HORÁRIO"}
        </h1>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-4 max-w-xl mx-auto w-full"
      >
        {appointments.map((slot) => {
          const isMySlot = slot.bookedByUserId === currentUser?.id;
          const isOthersSlot = !isAdmin && slot.status === "Reservado" && !isMySlot;
          const canClick = isAdmin || slot.status === "Disponível" || isMySlot;
          
          let cardStyle = "";
          let labelText: string = slot.status;
          let labelStyle = "";

          if (slot.status === "Disponível") {
            cardStyle = "bg-card/40 border-border hover:border-primary/50 hover:bg-card cursor-pointer";
            labelStyle = "bg-emerald-900/30 text-emerald-400";
          } else if (isMySlot) {
            cardStyle = "bg-card border-primary/50 shadow-[0_0_15px_rgba(204,0,0,0.15)] cursor-pointer";
            labelText = "Reservado por você";
            labelStyle = "bg-primary/20 text-primary";
          } else if (isOthersSlot) {
            cardStyle = "bg-card/20 border-border/20 opacity-50 cursor-not-allowed";
            labelText = "Indisponível";
            labelStyle = "bg-muted text-muted-foreground";
          } else if (isAdmin) {
            cardStyle = "bg-card border-border/50 opacity-90 cursor-pointer hover:border-primary/30";
            labelStyle = "bg-primary/20 text-primary";
          }

          return (
            <motion.div key={slot.time} variants={item}>
              <Card 
                className={`p-4 transition-all duration-200 border ${cardStyle}`}
                onClick={() => canClick && handleSlotClick(slot)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-foreground font-display text-xl tracking-wider">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${labelStyle}`}>
                    {labelText}
                  </div>
                </div>
                
                {slot.status === "Reservado" && (isAdmin || isMySlot) && (
                  <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {slot.clientName}
                        {isAdmin && slot.isWalkIn && <span className="ml-1 text-xs opacity-70">(walk-in)</span>}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Wrench className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{slot.service}</span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Dialog open={!!selectedSlot} onOpenChange={(open) => !open && setSelectedSlot(null)}>
        <DialogContent className="bg-card border-border sm:max-w-md w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-widest">
              {selectedSlot?.status === "Disponível" ? "NOVO AGENDAMENTO" : "DETALHES DA RESERVA"}
            </DialogTitle>
            <DialogDescription>
              Horário selecionado: <span className="font-bold text-foreground">{selectedSlot?.time}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedSlot?.status === "Disponível" ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-xs uppercase tracking-wider text-muted-foreground">Nome do Cliente</Label>
                <Input 
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={!isAdmin} // Clients can't change their own name
                  className="bg-background border-border focus-visible:ring-primary h-12 disabled:opacity-70"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tipo de Serviço</Label>
                <Select value={service} onValueChange={(val) => setService(val as ServiceType)}>
                  <SelectTrigger className="bg-background border-border h-12">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Polimento">Polimento</SelectItem>
                    <SelectItem value="Vitrificação">Vitrificação</SelectItem>
                    <SelectItem value="Lavagem Detalhada">Lavagem Detalhada</SelectItem>
                    <SelectItem value="Higienização Interna">Higienização Interna</SelectItem>
                    <SelectItem value="Revitalização de Plásticos">Revitalização de Plásticos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="bg-background p-4 rounded-lg border border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cliente</p>
                <p className="text-foreground text-lg">
                  {selectedSlot?.clientName}
                  {isAdmin && selectedSlot?.isWalkIn && <span className="ml-2 text-sm text-muted-foreground">(walk-in)</span>}
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Serviço</p>
                <p className="text-foreground text-lg">{selectedSlot?.service}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedSlot?.status === "Disponível" ? (
              <Button 
                onClick={handleConfirm} 
                disabled={!clientName || !service}
                className="w-full h-14 rounded-xl text-lg font-semibold tracking-wide shadow-[0_0_20px_rgba(204,0,0,0.15)] hover:shadow-[0_0_30px_rgba(204,0,0,0.3)] transition-all duration-300"
              >
                CONFIRMAR AGENDAMENTO
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setSelectedSlot(null)}
                className="w-full h-14 rounded-xl text-lg font-semibold tracking-wide border-border hover:bg-card/50"
              >
                FECHAR
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}