"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";

export type IMenu = {
  id: number;
  title: string;
  url: string;
  dropdown?: boolean;
  mega?: boolean;
  description?: string;
  imageSrc?: string;
  items?: IMenu[];
};

type MenuProps = {
  list: IMenu[];
};

const Menu = ({ list }: MenuProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <MotionConfig transition={{ bounce: 0, type: "tween" }}>
      <nav className="relative" aria-label="Main navigation">
        <ul className="flex items-center">
          {list?.map((item) => (
            <li key={item.id} className="relative" onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}>
              <Link
                className={`relative flex items-center justify-center rounded px-4 py-2.5 text-xs font-medium transition-all hover:bg-foreground/10 md:px-6 md:py-3 md:text-sm ${hovered === item.id ? "bg-foreground/10" : ""}`}
                href={item.url}
              >
                {item.title}
              </Link>
              {hovered === item.id && !item.dropdown && (
                <motion.div layout layoutId="cursor" className="absolute h-0.5 w-full bg-foreground" />
              )}
              {item.dropdown && hovered === item.id && (
                <div
                  className={`absolute top-full ${item.mega ? "left-1/2 -translate-x-1/2" : "left-0"}`}
                >
                  <motion.div
                    layout
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    exit={{ y: 10 }}
                    style={{ borderRadius: "8px" }}
                    className={`mt-3 overflow-hidden rounded border border-black/10 bg-white text-black shadow-xl ${item.mega ? "grid w-[min(720px,calc(100vw-24px))] grid-cols-2 gap-px bg-black/10 p-px md:grid-cols-4" : "flex w-52 flex-col"}`}
                    layoutId="cursor"
                  >
                    {item.items?.map((nav) => (
                      <Link key={`link-${nav.id}`} href={nav.url} className={item.mega ? "group bg-white p-2.5 transition-colors hover:bg-neutral-50" : "w-full p-3 text-sm hover:bg-black/[.05]"}>
                        {item.mega && nav.imageSrc && <Image src={nav.imageSrc} alt="" width={160} height={80} className="mb-2 h-14 w-full rounded object-cover grayscale transition-all group-hover:grayscale-0" />}
                        <span className={item.mega ? "block text-[11px] font-semibold" : ""}>{nav.title}</span>
                        {item.mega && <span className="mt-1 block text-[10px] leading-snug text-black/55">{nav.description}</span>}
                      </Link>
                    ))}
                  </motion.div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </MotionConfig>
  );
};

export default Menu;
