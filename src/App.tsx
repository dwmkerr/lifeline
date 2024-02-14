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
import Filters, { FilterSettings } from "./components/Filters";
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
import UserSettingsModal from "./components/UserSettingsModal";
import { UserSettings } from "./lib/UserSettings";
import { User } from "firebase/auth";

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
    showUserSettingsDialog,
    setShowUserSettingsDialog,
  } = useDialogContext();
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [filteredLifeEvents, setFilteredLifeEvents] = useState<LifeEvent[]>([]);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    selectedCategories: [],
    includeMinor: true,
    startDate: undefined,
    endDate: undefined,
  });
  const [searchText, setSearchText] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<OrderByDirection>("asc");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {},
  );
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<LifeEvent | null>(null);

  //  On mount, wait for the current user (if any). This waits for firebase
  //  to load based on any cached credentials.
  useEffect(() => {
    const waitForUser = async () => {
      const user = await repository.waitForUser();
      setUser(user);
    };
    waitForUser();
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    return repository.subscribeToUserSettings((userSettings) => {
      setUserSettings(userSettings);
    });
  }, [user]);

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
    setFilterSettings({
      ...filterSettings,
      selectedCategories: categories,
    });
  }, [lifeEvents]);

  //  Filter the events and apply the search.
  useEffect(() => {
    const matchSearch = (val: string) =>
      val.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    const filter = (event: LifeEvent): boolean => {
      const eventDate = new Date(
        event.year,
        event.month ? event.month - 1 : 0,
        event.day ? event.day : 1,
      );
      const categoryMatch =
        filterSettings.selectedCategories.indexOf(event.category || "") !== -1;
      const searchMatch =
        searchText === "" ||
        matchSearch(event.title) ||
        matchSearch(event.notes || "");
      const minorMatch = filterSettings.includeMinor || event.minor === false;
      const matchStartDate = filterSettings.startDate
        ? eventDate.getTime() >= filterSettings.startDate.getTime()
        : true;
      const matchEndDate = filterSettings.endDate
        ? eventDate.getTime() <= filterSettings.endDate.getTime()
        : true;
      return (
        categoryMatch &&
        searchMatch &&
        minorMatch &&
        matchStartDate &&
        matchEndDate
      );
    };

    setFilteredLifeEvents(lifeEvents.filter(filter));
  }, [searchText, filterSettings]);

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
              filterSettings={filterSettings}
              onChangeFilterSettings={setFilterSettings}
              sortDirection={sortDirection}
              onSetSortDirection={(sortDirection) =>
                setSortDirection(sortDirection)
              }
              categories={categories}
              categoryColors={categoryColors}
            />
          </Stack>
          <BasicTimeline
            lifeEvents={filteredLifeEvents}
            categoryColors={categoryColors}
            onEditEvent={(event) => {
              setEditEvent(event);
              setEditEventModalOpen(true);
            }}
            showAgeDOB={
              userSettings?.showAgeOnTimeline && userSettings.dateOfBirth
                ? userSettings.dateOfBirth
                : undefined
            }
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
          {showUserSettingsDialog && userSettings && (
            <UserSettingsModal
              userSettings={userSettings}
              onClose={() => setShowUserSettingsDialog(false)}
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
