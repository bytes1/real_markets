import { App } from "./App.tsx";
import { Layout } from "./components/layouts/Layout.tsx";
import "./index.css";
import { Home } from "./home.tsx";

export const Root = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};
