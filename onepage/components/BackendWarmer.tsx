"use client";

import { useEffect } from "react";
import { backendUrl } from "../lib/services/apiService";

export function BackendWarmer() {
  useEffect(() => {
    // Fire and forget ping to wake up backend
    fetch(`${backendUrl}/health`).catch(() => {
      // Ignore errors, this is just a warmer
    });
  }, []);

  return null;
}
