import { useState } from "react";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    </>
  );
}

export default App;
