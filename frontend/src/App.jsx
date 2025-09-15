import { useState } from "react";
import "./App.css";
import "./index.css";

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
