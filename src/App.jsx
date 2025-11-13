import React, { Fragment } from "react";
import AppRoute from "./routes/AppRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <Fragment>
      <Toaster closeButton position="top-right" richColors expand={true} />
      <AppRoute />
    </Fragment>
  );
}

export default App;
