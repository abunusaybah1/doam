"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navMenu = [
    { name: "About", href: "/about" },
    { name: "How it works", href: "/how-it-works" },
    { name: "Problems", href: "/problems" },
    { name: "Contact us", href: "/contact-us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0e0e0e] border-b border-[#2a2a2a]">
      <div className="flex items-center justify-between px-5 py-0 md:px-10">
        <Link
          href="/"
          className="font-playfair text-2xl font-black text-[#f5f5dc] tracking-tight"
        >
          <Image
            src="/images/orange-text-trans.png"
            alt="Do&minus;am.ng"
            width={70}
            height={80}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navMenu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[#f5f5dc]/60 hover:text-[#f5f5dc] text-[0.7rem] uppercase tracking-widest transition-opacity"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/signin"
            className="bg-[#cc4e00] text-[#f5f5dc] text-[0.7rem] uppercase tracking-widest px-4 py-2 hover:bg-[#b34400] transition-colors"
          >
            Get Started!
          </Link>
        </nav>

        <button
          className="md:hidden border border-[#cc4e00] border-r-4 text-[#f5f5dc] px-2 py-1 text-2xl leading-none cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <IoMdClose /> : <GiHamburgerMenu />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[#2a2a2a] flex flex-col">
          {navMenu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-[#f5f5dc]/70 hover:text-[#f5f5dc] text-[0.7rem] uppercase tracking-widest px-5 py-4 border-b border-[#2a2a2a]"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="bg-[#cc4e00] text-[#f5f5dc] text-[0.7rem] uppercase tracking-widest px-5 py-4 text-center hover:bg-[#b34400]"
          >
            Get Started!
          </Link>
        </nav>
      )}
    </header>
  );
}
