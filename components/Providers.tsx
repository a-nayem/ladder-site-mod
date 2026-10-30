"use client";
import React, { useEffect } from "react";
import { hydrate, useStore } from "../lib/model";
import { installBurst } from "../lib/fx";
import { Menu } from "./Menu";

export function Providers({ children }: { children: React.ReactNode }) {
  useStore();
  useEffect(() => { hydrate(); installBurst(); }, []);
  return <>{children}<Menu /></>;
}
