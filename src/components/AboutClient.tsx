"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";

const gear = ["Nikon Z50", "尼克尔 Z DX 16-50mm f/3.5-6.3 VR", "尼克尔 Z DX 50-250mm f/4.5-6.3 VR"];

export default function AboutClient() {
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <motion.div
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-accent text-xs tracking-[0.2em] uppercase mb-4">About</p>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-widest mb-16">关于</h1>

        <div className="flex flex-col sm:flex-row gap-10 items-start mb-20">
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 relative">
            <Image
              src="/photos/avatar.jpg"
              alt="头像"
              fill
              sizes="112px"
              className="object-cover object-[50%_25%]"
            />
          </div>
          <p className="text-base leading-8 text-muted max-w-lg">
            热爱光影，痴迷于捕捉那些转瞬即逝的瞬间。擅长风光与街拍，喜欢用镜头讲述城市与自然的故事。
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-xs tracking-[0.2em] text-muted uppercase mb-6">Gear</h2>
          <ul className="space-y-3">
            {gear.map((item) => (
              <li key={item} className="text-sm text-foreground/80 tracking-wide">{item}</li>
            ))}
          </ul>
        </div>

      </motion.div>
    </div>
  );
}
