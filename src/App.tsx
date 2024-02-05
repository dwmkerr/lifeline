import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";

import { AlertContextProvider } from "./components/AlertContext";
import BasicTimeline from "./components/BasicTimeline";
import NavBar from "./components/NavBar";
import HeaderSection from "./components/HeaderSection";
import Search from "./components/Search";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

const materialTheme = materialExtendTheme();

export default function RentalDashboard() {
  return (
    <AlertContextProvider>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <CssBaseline />
          <NavBar />
          <Grid
            component="main"
            container
            sx={{
              height: "calc(100vh - 55px)", // 55px is the height of the NavBar
              gridTemplateRows: "auto 1fr auto",
            }}
          >
            <Grid md={12}>
              <Stack
                sx={{
                  backgroundColor: "background.surface",
                  px: { xs: 2, md: 4 },
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <HeaderSection />
                <Search />
              </Stack>
            </Grid>
            <Grid md={12}>
              <Stack
                spacing={2}
                sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}
              >
                <Filters />
                <Stack spacing={2} sx={{ overflow: "auto" }}>
                  <BasicTimeline />
                </Stack>
              </Stack>
            </Grid>
            <Pagination />
          </Grid>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </AlertContextProvider>
  );
}
