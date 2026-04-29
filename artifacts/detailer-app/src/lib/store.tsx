import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ServiceType = "Polimento" | "Vitrificação" | "Lavagem Detalhada" | "Higienização Interna" | "Revitalização de Plásticos";

export interface User {
  id: string;
  nome: string;
  telefone: string;
  senha?: string;
  role: "admin" | "cliente";
}

export interface CurrentUser extends Omit<User, "senha"> {}

export interface Appointment {
  time: string;
  status: "Disponível" | "Reservado";
  clientName?: string;
  service?: ServiceType;
  bookedByUserId?: string;
  isWalkIn?: boolean;
}

const defaultSlots: Appointment[] = [
  { time: "08:00", status: "Disponível" },
  { time: "09:00", status: "Disponível" },
  { time: "10:00", status: "Disponível" },
  { time: "11:00", status: "Disponível" },
  { time: "13:00", status: "Disponível" },
  { time: "14:00", status: "Disponível" },
  { time: "15:00", status: "Disponível" },
  { time: "16:00", status: "Disponível" },
];

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: CurrentUser | null;
  users: User[];
  appointments: Appointment[];
  login: (telefoneOrUser: string, senha: string) => { success: boolean; error?: string };
  register: (data: Omit<User, "id" | "role">) => { success: boolean; error?: string };
  logout: () => void;
  bookAppointment: (time: string, clientName: string, service: ServiceType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("detailer:users");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem("detailer:session");
    return saved ? JSON.parse(saved) : null;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("detailer:appointments");
    return saved ? JSON.parse(saved) : defaultSlots;
  });

  useEffect(() => {
    localStorage.setItem("detailer:users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("detailer:session", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("detailer:appointments", JSON.stringify(appointments));
  }, [appointments]);

  const login = (telefoneOrUser: string, senha: string) => {
    if (telefoneOrUser === "admin" && senha === "1234") {
      setCurrentUser({ id: "admin", nome: "Administrador", telefone: "", role: "admin" });
      return { success: true };
    }
    
    const user = users.find(u => u.telefone === telefoneOrUser && u.senha === senha);
    if (user) {
      setCurrentUser({ id: user.id, nome: user.nome, telefone: user.telefone, role: "cliente" });
      return { success: true };
    }
    
    return { success: false, error: "Credenciais inválidas. Tente novamente." };
  };

  const register = (data: Omit<User, "id" | "role">) => {
    if (users.some(u => u.telefone === data.telefone)) {
      return { success: false, error: "Telefone já cadastrado" };
    }
    
    const newUser: User = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      role: "cliente"
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser({ id: newUser.id, nome: newUser.nome, telefone: newUser.telefone, role: "cliente" });
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const bookAppointment = (time: string, clientName: string, service: ServiceType) => {
    setAppointments(prev => prev.map(slot => 
      slot.time === time 
        ? { 
            ...slot, 
            status: "Reservado", 
            clientName, 
            service, 
            bookedByUserId: currentUser?.id,
            isWalkIn: currentUser?.role === "admin"
          } 
        : slot
    ));
  };

  return (
    <AppContext.Provider value={{ 
      isAuthenticated: !!currentUser, 
      currentUser,
      users,
      appointments,
      login, 
      register,
      logout, 
      bookAppointment 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}