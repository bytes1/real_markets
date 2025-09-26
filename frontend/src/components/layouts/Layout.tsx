import type { FC } from "react";

export const Layout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="">{children}</div>;
};
