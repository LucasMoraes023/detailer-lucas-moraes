import { motion } from "framer-motion";
import work1 from "@/assets/work-1.png";
import work2 from "@/assets/work-2.png";
import work3 from "@/assets/work-3.png";
import work4 from "@/assets/work-4.png";

const WORKS = [
  { src: work1, title: "Vitrificação Premium", tag: "Polimento" },
  { src: work2, title: "Polimento Técnico", tag: "Pintura" },
  { src: work3, title: "Higienização Interna", tag: "Interior" },
  { src: work4, title: "Restauração de Faróis", tag: "Detalhe" },
];

export function WorksGallery() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-lg tracking-widest text-foreground uppercase">
          Trabalhos Realizados
        </h2>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Galeria
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {WORKS.map((w, idx) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.5 }}
            whileHover={{ y: -3 }}
            className="relative rounded-xl overflow-hidden border border-border group cursor-pointer"
          >
            <img
              src={w.src}
              alt={w.title}
              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                {w.tag}
              </div>
              <div className="text-xs text-foreground font-medium leading-tight">
                {w.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
