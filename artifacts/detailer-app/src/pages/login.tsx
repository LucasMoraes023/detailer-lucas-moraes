import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoImg from "@/assets/logo.png";

export default function Login() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [regNome, setRegNome] = useState("");
  const [regTelefone, setRegTelefone] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regConfirmar, setRegConfirmar] = useState("");
  const [regError, setRegError] = useState("");

  const [, setLocation] = useLocation();
  const { login, register } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const { success, error } = login(loginUsername, loginPassword);
    if (success) {
      setLocation("/menu");
    } else {
      setLoginError(error || "Erro ao fazer login");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regNome.length < 2) {
      setRegError("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    if (regTelefone.length < 10) {
      setRegError("Telefone inválido");
      return;
    }
    if (regSenha !== regConfirmar) {
      setRegError("As senhas não coincidem");
      return;
    }
    if (!regSenha) {
      setRegError("A senha é obrigatória");
      return;
    }

    const { success, error } = register({ nome: regNome, telefone: regTelefone, senha: regSenha });
    if (success) {
      setLocation("/menu");
    } else {
      setRegError(error || "Erro ao registrar");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm space-y-6 relative z-10"
      >
        <div className="flex flex-col items-center space-y-3">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_40px_rgba(204,0,0,0.35)] bg-card"
          >
            <img src={logoImg} alt="Detailer Lucas Moraes" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="font-display text-3xl tracking-widest text-foreground">DETAILER LUCAS</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">Acesso ao Sistema</p>
        </div>

        <Tabs defaultValue="entrar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-border h-12 rounded-xl mb-6">
            <TabsTrigger value="entrar" className="rounded-lg text-sm tracking-wider uppercase font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Entrar</TabsTrigger>
            <TabsTrigger value="cadastrar" className="rounded-lg text-sm tracking-wider uppercase font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entrar" className="space-y-6 mt-0">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginUsername" className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</Label>
                  <Input 
                    id="loginUsername"
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="bg-card/50 border-border focus-visible:ring-primary h-12"
                    placeholder="Seu telefone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                  <Input 
                    id="loginPassword"
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-card/50 border-border focus-visible:ring-primary h-12"
                    placeholder="••••"
                  />
                </div>
                {loginError && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-primary text-sm text-center font-medium"
                  >
                    {loginError}
                  </motion.p>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-lg font-semibold tracking-wide shadow-[0_0_20px_rgba(204,0,0,0.15)] hover:shadow-[0_0_30px_rgba(204,0,0,0.4)] transition-all duration-300"
                >
                  ENTRAR
                </Button>
              </motion.div>
            </form>
          </TabsContent>

          <TabsContent value="cadastrar" className="space-y-6 mt-0">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regNome" className="text-xs uppercase tracking-wider text-muted-foreground">Nome Completo</Label>
                  <Input 
                    id="regNome"
                    type="text" 
                    value={regNome}
                    onChange={(e) => setRegNome(e.target.value)}
                    className="bg-card/50 border-border focus-visible:ring-primary h-12"
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regTelefone" className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</Label>
                  <Input 
                    id="regTelefone"
                    type="tel" 
                    value={regTelefone}
                    onChange={(e) => setRegTelefone(e.target.value)}
                    className="bg-card/50 border-border focus-visible:ring-primary h-12"
                    placeholder="(99) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regSenha" className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                  <Input 
                    id="regSenha"
                    type="password" 
                    value={regSenha}
                    onChange={(e) => setRegSenha(e.target.value)}
                    className="bg-card/50 border-border focus-visible:ring-primary h-12"
                    placeholder="••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regConfirmar" className="text-xs uppercase tracking-wider text-muted-foreground">Confirmar Senha</Label>
                  <Input 
                    id="regConfirmar"
                    type="password" 
                    value={regConfirmar}
                    onChange={(e) => setRegConfirmar(e.target.value)}
                    className="bg-card/50 border-border focus-visible:ring-primary h-12"
                    placeholder="••••"
                  />
                </div>
                {regError && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-primary text-sm text-center font-medium"
                  >
                    {regError}
                  </motion.p>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-lg font-semibold tracking-wide shadow-[0_0_20px_rgba(204,0,0,0.15)] hover:shadow-[0_0_30px_rgba(204,0,0,0.4)] transition-all duration-300"
                >
                  CADASTRAR
                </Button>
              </motion.div>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}