import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import { OrderByDirection } from "firebase/firestore";

import {
  AlertContextProvider,
  useAlertContext,
} from "./components/AlertContext";
import BasicTimeline from "./components/BasicTimeline";
import NavBar from "./components/NavBar";
import AddLifeEvent from "./components/AddLifeEvent";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import { AlertSnackbar } from "./components/AlertSnackbar";
import { LifelineRepository } from "./lib/LifelifeRepository";
import { useEffect, useState } from "react";
import { LifeEvent } from "./lib/LifeEvent";

const materialTheme = materialExtendTheme();

const AppContainer = () => {
  const repository = LifelineRepository.getInstance();
  const { alertInfo, setAlertInfo } = useAlertContext();
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [sortDirection, setSortDirection] = useState<OrderByDirection>("asc");

  useEffect(() => {
    const unsubscribe = repository.subscribeToLifeEvents((lifeEvents) => {
      setLifeEvents(lifeEvents);
    }, sortDirection);
    return unsubscribe;
  }, [sortDirection]);

  return (
    <Stack direction="column" alignItems="center" flexGrow={1}>
      <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
        <Filters
          sortDirection={sortDirection}
          onSetSortDirection={(sortDirection) =>
            setSortDirection(sortDirection)
          }
        />
      </Stack>
      <Stack spacing={2} sx={{ overflow: "auto", flexGrow: 1 }}>
        <BasicTimeline lifeEvents={lifeEvents} />
      </Stack>
      <Pagination />
      {alertInfo && (
        <AlertSnackbar
          alertInfo={alertInfo}
          onDismiss={() => setAlertInfo(null)}
        />
      )}
    </Stack>
  );
};

export default function RentalDashboard() {
  return (
    <AlertContextProvider>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <CssBaseline />
          <NavBar />
          <Stack
            component="main"
            direction="column"
            sx={{
              height: "100%",
            }}
          >
            <Grid md={12}>
              <AddLifeEvent />
            </Grid>
            <AppContainer />
          </Stack>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </AlertContextProvider>
  );
}
