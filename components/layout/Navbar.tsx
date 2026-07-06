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
import { navMenuUser, navMenuNonUser } from "@/lib/data";
import ProblemsNavDropdown from "@/components/problems/ProblemsNavDropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      // getUser() hits the Auth server for real — catches deleted/banned
      // accounts immediately, unlike getSession() which only reads the
      // local JWT and can't tell if the account behind it still exists
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        // Account is gone (or session invalid) but this client instance
        // still thinks it's logged in — explicitly sign out so
        // onAuthStateChange fires and the UI actually updates
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);
      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  
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

  const navLinks = user ? navMenuUser : navMenuNonUser;

  return (
    <header className="sticky top-0 z-50 bg-bark border-b border-border py-2">
      <div className="flex items-center justify-between px-5 h-16 md:px-10 lg:px-16">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logos/orange-text-trans.png"
            alt="Do-am.ng"
            width={65}
            height={80}
            loading="eager"
            className="w-[70%] h-[70%]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((item) =>
            item.name === "Problems" ? (
              <ProblemsNavDropdown key={item.name} />
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="text-parch/60 hover:text-parch text-[0.7rem] uppercase tracking-widest transition-colors hover:underline underline-offset-4"
              >
                {item.name}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center shrink-0 min-w-27.5 justify-end">
          {loading ? (
            <div className="w-27.5 h-8 bg-surface animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-orange hover:bg-ember cursor-pointer text-parch px-3 py-2 transition-colors"
                aria-label="Account menu"
              >
                <FiUser size={16} />
                <span className="text-[0.7rem] uppercase tracking-widest">
                  Account
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-6 w-48 bg-surface border border-border flex flex-col z-50">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="text-parch/70 hover:text-parch hover:bg-border text-[0.7rem] uppercase tracking-widest px-4 py-3 border-b border-border transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-parch bg-orange hover:bg-ember cursor-pointer text-[0.7rem] uppercase tracking-widest px-4 py-3 text-left transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest px-4 py-2 hover:bg-ember transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>

        <button
          className="md:hidden border border-orange border-r-4 text-parch px-2 py-1 text-2xl leading-none cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <IoMdClose /> : <GiHamburgerMenu />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border flex flex-col">
          {navLinks.map((item) =>
            item.name === "Problems" ? (
              <div key={item.name} className="border-b border-border">
                <p className="text-parch/70 text-[0.7rem] uppercase tracking-widest px-5 py-4">
                  Problems
                </p>
                <div className="flex flex-col ml-5 border-l border-border pb-2">
                  <Link
                    href="/problems"
                    onClick={() => setOpen(false)}
                    className="text-parch/50 hover:text-parch text-[0.68rem] uppercase tracking-widest pl-4 pr-5 py-2.5 block"
                  >
                    All problems
                  </Link>
                  <Link
                    href="/problems?filter=in_progress"
                    onClick={() => setOpen(false)}
                    className="text-parch/50 hover:text-parch text-[0.68rem] uppercase tracking-widest pl-4 pr-5 py-2.5 block"
                  >
                    In progress
                  </Link>
                  <Link
                    href="/problems?filter=completed"
                    onClick={() => setOpen(false)}
                    className="text-parch/50 hover:text-parch text-[0.68rem] uppercase tracking-widest pl-4 pr-5 py-2.5 block"
                  >
                    Completed
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-parch/70 hover:text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 border-b border-border transition-colors"
              >
                {item.name}
              </Link>
            ),
          )}

          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="text-parch/70 hover:text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 border-b border-border transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest px-5 py-4 text-left border-b border-border hover:bg-ember cursor-pointer transition-colors"
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
        </nav>
      )}
    </header>
  );
}
