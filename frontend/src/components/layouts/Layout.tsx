import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import React from "react"; // <-- 1. Import React

// 2. Define the props, including 'children'
type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  // <-- 3. Accept 'children' as a prop
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* 4. Render children if they exist, otherwise fallback to Outlet */}
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};
