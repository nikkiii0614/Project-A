import { useState } from "react";
import { DemoBackgroundPaths } from "./components/DemoBackgroundPaths";
import { StudentIdMaker } from "./components/StudentIdMaker";

function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="w-full min-h-screen bg-[#040811] text-white flex flex-col items-center justify-center">
      {!isStarted ? (
        <DemoBackgroundPaths onStart={() => setIsStarted(true)} />
      ) : (
        <div className="w-full flex-1 pb-12">
          <StudentIdMaker />
        </div>
      )}
    </main>
  );
}

export default App;
