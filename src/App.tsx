import { useEffect, useState } from "react";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { User, onAuthStateChanged } from "@firebase/auth";

import { AlertContextProvider } from "./components/AlertContext";
import { DialogContextProvider } from "./components/DialogContext";
import LifelinePage from "./pages/LifelinePage";
import { LifelineRepository } from "./lib/LifelifeRepository";
import { CircularProgress, Stack } from "@mui/joy";
import WelcomePage from "./pages/WelcomePage";

const materialTheme = materialExtendTheme();

export default function App() {
  const repository = LifelineRepository.getInstance();
  const [waitingForUser, setWaitingForUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  //  On mount, wait for the current user (if any). This waits for firebase
  //  to load based on any cached credentials.
  useEffect(() => {
    //  Initially show the 'wait' loader and see if we have a logged in user...
    const waitForUser = async () => {
      const user = await repository.waitForUser();
      setUser(user);
      setWaitingForUser(false);
    };
    waitForUser();

    //  ...the watch for the auth state changing.
    const unsubscribe = onAuthStateChanged(repository.getAuth(), (user) => {
      setUser(user || null);
    });

    return () => unsubscribe();
  });

  return (
    <AlertContextProvider>
      <DialogContextProvider>
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <CssBaseline />
            {waitingForUser ? (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Stack>
            ) : user ? (
              <LifelinePage user={user} />
            ) : (
              <WelcomePage />
            )}
          </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
      </DialogContextProvider>
    </AlertContextProvider>
  );
}
