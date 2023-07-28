import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import Loader from "./components/parts/Loader";
import routes from "./routes";
import { PocketProvider } from "./context/pocketBaseContext";

function App() {
  return (
    <PocketProvider>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={routes} />
      </Suspense>
    </PocketProvider>
  );
}

export default App;
