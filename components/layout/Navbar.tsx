"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navMenu = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "How it works", href: "/how-it-works" },
    { name: "Contact us", href: "/contact-us" },
  ];

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-bark border-b border-border py-2">
      <div className="flex items-center justify-between px-5 md:px-10 h-16">
        {/* logo — left */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logos/orange-text-trans.png"
            alt="Do-am.ng"
            width={70}
            height={80}
            loading="eager"
            className="w-[70%] h-[70%]"
          />
        </Link>

        {/* nav links — center */}
        <nav className="hidden md:flex items-center gap-6 ">
          {navMenu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-parch/60 hover:text-parch text-[0.7rem] uppercase tracking-widest transition-colors hover:underline underline-offset-4"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* right side — desktop */}
        <div className="hidden md:flex items-center shrink-0">
          {!loading && (
            <>
              {user ? (
                // account icon + dropdown
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-orange  hover:opacity-95 cursor-pointer text-parch px-3 py-2 transition-colors"
                    aria-label="Account menu"
                  >
                    <FiUser size={16} />
                    <span className="text-[0.7rem] uppercase tracking-widest">
                      Account
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border flex flex-col z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="text-parch/70 hover:text-parch hover:bg-border text-[0.7rem] uppercase tracking-widest px-4 py-3 border-b border-border transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="text-parch/70 hover:text-parch hover:bg-border text-[0.7rem] uppercase tracking-widest px-4 py-3 border-b border-border transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-parch bg-orange hover:opacity-90 cursor-pointer text-[0.7rem] uppercase tracking-widest px-4 py-3 text-left transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className=" bg-orange text-parch text-[0.7rem] uppercase tracking-widest px-4 py-2 hover:bg-ember transition-colors"
                >
                  Get Started
                </Link>
              )}
            </>
          )}
        </div>
        {/* mobile toggle */}
        <button
          className="md:hidden border border-orange border-r-4 text-parch px-2 py-1 text-2xl leading-none cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <IoMdClose /> : <GiHamburgerMenu />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border flex flex-col">
          {navMenu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-parch/70 hover:text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 border-b border-border transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-parch/70 hover:text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 border-b border-border transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setOpen(false)}
                    className="text-parch/70 hover:text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 border-b border-border transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-orange text-[0.7rem] uppercase tracking-widest px-5 py-4 text-left border-b border-border hover:opacity-90 cursor-pointer transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 text-center hover:bg-ember transition-colors"
                >
                  Get Started
                </Link>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
}
