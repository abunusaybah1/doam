"use client";
import { useEffect } from "react";

export function StaleAuthHashCleanup() {
  useEffect(() => {
    if (window.location.hash.includes("error")) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);
  return null;
}
