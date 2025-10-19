import { AppShell } from "@/components/app-shell";

import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark">
        <AppShell>{children}</AppShell>
    </div>
  );
};

export default layout;