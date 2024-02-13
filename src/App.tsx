import * as React from "react";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/joy/Stack";
import { OrderByDirection } from "firebase/firestore";

import {
  AlertContextProvider,
  useAlertContext,
} from "./components/AlertContext";
import {
  DialogContextProvider,
  useDialogContext,
} from "./components/DialogContext";
import BasicTimeline from "./components/BasicTimeline";
import NavBar from "./components/NavBar";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import AddEditEventModal, {
  AddEditEventMode,
} from "./components/AddEditEventModal";
import { AlertSnackbar } from "./components/AlertSnackbar";
import { LifelineRepository } from "./lib/LifelifeRepository";
import { useEffect, useState } from "react";
import { LifeEvent } from "./lib/LifeEvent";
import { CategoryColor } from "./lib/CategoryColor";
import ImportEventsDialog from "./components/ImportEventsDialog";
import ExportEventsDialog from "./components/ExportEventsDialog";

const materialTheme = materialExtendTheme();

const AppContainer = () => {
  const repository = LifelineRepository.getInstance();
  const { alertInfo, setAlertInfo } = useAlertContext();
  const {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
    showAddEventDialog,
    setShowAddEventDialog,
  } = useDialogContext();
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [filteredLifeEvents, setFilteredLifeEvents] = useState<LifeEvent[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<OrderByDirection>("asc");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {},
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<LifeEvent | null>(null);

  useEffect(() => {
    const unsubscribe = repository.subscribeToLifeEvents((lifeEvents) => {
      setLifeEvents(lifeEvents);
    }, sortDirection);
    return unsubscribe;
  }, [sortDirection]);

  useEffect(() => {
    const allCategories = lifeEvents.map((le) => le.category);
    const validCategories = allCategories.filter(
      (c) => c !== null && c !== "",
    ) as string[];
    const categories = ["", ...new Set(validCategories)];
    setCategoryColors(CategoryColor.getColors(categories));
    setCategories(categories);
    setSelectedCategories(categories);
  }, [lifeEvents]);

  //  Filter the events and apply the search.
  useEffect(() => {
    const matchSearch = (val: string) =>
      val.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    const filter = (event: LifeEvent): boolean => {
      const categoryMatch =
        selectedCategories.indexOf(event.category || "") !== -1;
      const searchMatch =
        searchText === "" ||
        matchSearch(event.title) ||
        matchSearch(event.notes || "");
      return categoryMatch && searchMatch;
    };

    setFilteredLifeEvents(lifeEvents.filter(filter));
  }, [selectedCategories, searchText]);

  return (
    <React.Fragment>
      <NavBar searchText={searchText} onSearchTextChanged={setSearchText} />
      <Stack
        component="main"
        direction="column"
        sx={{
          height: "100%",
        }}
      >
        <Stack direction="column" alignItems="center" flexGrow={1}>
          <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <Filters
              sortDirection={sortDirection}
              onSetSortDirection={(sortDirection) =>
                setSortDirection(sortDirection)
              }
              categories={categories}
              categoryColors={categoryColors}
              selectedCategories={selectedCategories}
              onSelectedCategoriesChanged={(sc) => setSelectedCategories(sc)}
            />
          </Stack>
          <BasicTimeline
            lifeEvents={filteredLifeEvents}
            categoryColors={categoryColors}
            onEditEvent={(event) => {
              setEditEvent(event);
              setEditEventModalOpen(true);
            }}
          />
          <Pagination />
          {alertInfo && (
            <AlertSnackbar
              alertInfo={alertInfo}
              onDismiss={() => setAlertInfo(null)}
            />
          )}
          {editEventModalOpen && editEvent !== null && (
            <AddEditEventModal
              mode={AddEditEventMode.Edit}
              open={editEventModalOpen}
              event={editEvent}
              cateories={categories}
              onClose={() => setEditEventModalOpen(false)}
            />
          )}
          {showImportDialog && (
            <ImportEventsDialog onClose={() => setShowImportDialog(false)} />
          )}
          {showExportDialog && (
            <ExportEventsDialog onClose={() => setShowExportDialog(false)} />
          )}
          {showAddEventDialog && (
            <AddEditEventModal
              mode={AddEditEventMode.Add}
              open={showAddEventDialog}
              cateories={categories}
              onClose={() => setShowAddEventDialog(false)}
            />
          )}
        </Stack>
      </Stack>
    </React.Fragment>
  );
};

export default function App() {
  return (
    <AlertContextProvider>
      <DialogContextProvider>
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <CssBaseline />
            <AppContainer />
          </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
      </DialogContextProvider>
    </AlertContextProvider>
  );
}
