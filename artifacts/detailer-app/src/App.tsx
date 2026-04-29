import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Splash from "@/pages/splash";
import Login from "@/pages/login";
import Menu from "@/pages/menu";
import Schedule from "@/pages/schedule";
import { AppProvider, useAppStore } from "@/lib/store";
import { PageTransition } from "@/components/page-transition";
import { MusicPlayer } from "@/components/music-player";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Switch key={location} location={location}>
        <Route path="/">
          <PageTransition>
            <Splash />
          </PageTransition>
        </Route>
        <Route path="/login">
          <PageTransition>
            <Login />
          </PageTransition>
        </Route>
        <Route path="/menu">
          <PageTransition>
            <Menu />
          </PageTransition>
        </Route>
        <Route path="/schedule">
          <PageTransition>
            <Schedule />
          </PageTransition>
        </Route>
        <Route>
          <PageTransition>
            <NotFound />
          </PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function MusicPlayerGate() {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) return null;
  return <MusicPlayer />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AnimatedRoutes />
            <MusicPlayerGate />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
