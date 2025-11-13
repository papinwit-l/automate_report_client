import React, { Fragment } from "react";
import AppRoute from "./routes/AppRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <Fragment>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <AppRoute />
    </Fragment>
  );
}

export default App;
