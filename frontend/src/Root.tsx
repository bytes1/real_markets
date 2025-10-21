// import { App } from "./App.tsx";
import { Layout } from "./components/layouts/Layout.tsx";
import "./index.css";
import Home from "./home.tsx"; // <-- THIS IS THE CORRECTED LINE

export const Root = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};
