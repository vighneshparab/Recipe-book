import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes.jsx";

function App() {
  return (
    // Added return statement
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
