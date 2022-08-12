import { ThemeProvider } from "@material-ui/core";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Routes from "./view/routes";

import store, { persistor } from "./application/store";
import theme from "./view/theme";
import ConfirmationDialog from "./view/component/ConfirmationDialog";
import UiAlert from "./view/component/UiAlert";
import { PersistGate } from "redux-persist/integration/react";
import "./Styles/inputstyle.css";
import { DENTAL_ADMIN_USER } from "./view/utils/formatDate";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Suspense fallback={<div />}>
              <ConfirmationDialog />
              <UiAlert />
              <Routes />
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
