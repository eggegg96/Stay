import { useState } from "react";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hot from "./components/HotAccommodation";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <DefaultLayout>
        <Home />
        <Hot />
      </DefaultLayout>
    </>
  );
}

export default App;
