import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Drawer from "@mui/joy/Drawer";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import { IconButton, ListItemDecorator, Typography } from "@mui/joy";

import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

import OrderSelector, { OrderSelectorProps } from "./OrderSelector";

import CircleIcon from "@mui/icons-material/Circle";
import { useDialogContext } from "./DialogContext";

export type FilterSettings = {
  selectedCategories: string[];
  includeMinor: boolean;
  startDate?: Date;
  endDate?: Date;
};

export type FiltersProps = OrderSelectorProps & {
  categories: string[];
  categoryColors: Record<string, string>;
  filterSettings: FilterSettings;
  onChangeFilterSettings: (filterSettings: FilterSettings) => void;
};

export default function Filters(props: FiltersProps) {
  const { setShowAddEventDialog } = useDialogContext();

  const [open, setOpen] = React.useState(false);
  return (
    <Stack
      useFlexGap
      direction="row"
      spacing={{ xs: 0, sm: 2 }}
      justifyContent={{ xs: "space-between" }}
      flexWrap="wrap"
      sx={{ minWidth: 0 }}
    >
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<FilterAltOutlined />}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<AddIcon />}
        onClick={() => setShowAddEventDialog(true)}
      >
        Add...
      </Button>
      <OrderSelector {...props} />
      <Drawer open={open} onClose={() => setOpen(false)} hideBackdrop={true}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 0,
            right: 0,
            gap: 0.5,
            ml: "auto",
            mr: 1.5,
            mt: 1.5,
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            fontSize="sm"
            fontWeight="lg"
            sx={{ cursor: "pointer" }}
          >
            Close
          </Typography>
          <ModalClose id="close-icon" sx={{ position: "initial" }} />
        </Box>
        <Stack useFlexGap spacing={3} sx={{ p: 2 }}>
          <DialogTitle>Filters</DialogTitle>
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <Input
              id="filters-start-date"
              type="date"
              aria-label="Date"
              value={
                props.filterSettings.startDate
                  ?.toISOString()
                  .substring(0, 10) || ""
              }
              onChange={(e) => {
                props.onChangeFilterSettings({
                  ...props.filterSettings,
                  startDate: new Date(e.target.value),
                });
              }}
              endDecorator={
                <IconButton
                  variant="plain"
                  size="sm"
                  onClick={() => {
                    props.onChangeFilterSettings({
                      ...props.filterSettings,
                      startDate: undefined,
                    });
                  }}
                >
                  <ClearIcon />
                </IconButton>
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <Input
              id="filters-end-date"
              type="date"
              aria-label="Date"
              value={
                props.filterSettings.endDate?.toISOString().substring(0, 10) ||
                ""
              }
              onChange={(e) => {
                props.onChangeFilterSettings({
                  ...props.filterSettings,
                  endDate: new Date(e.target.value),
                });
              }}
              endDecorator={
                <IconButton
                  variant="plain"
                  size="sm"
                  onClick={() => {
                    props.onChangeFilterSettings({
                      ...props.filterSettings,
                      endDate: undefined,
                    });
                  }}
                >
                  <ClearIcon />
                </IconButton>
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Events</FormLabel>
            <Checkbox
              label="Show Minor Events"
              checked={props.filterSettings.includeMinor}
              onChange={(event) => {
                props.onChangeFilterSettings({
                  ...props.filterSettings,
                  includeMinor: event.target.checked,
                });
              }}
            />
          </FormControl>
          <FormLabel>Category</FormLabel>
          <List
            orientation="horizontal"
            wrap
            sx={{
              "--List-gap": "8px",
              "--ListItem-radius": "20px",
            }}
          >
            {props.categories.map((category) => {
              const selected =
                props.filterSettings.selectedCategories.find(
                  (c) => c === category,
                ) !== undefined;
              const color = selected
                ? category
                  ? props.categoryColors[category]
                  : "#cecece"
                : "#cecece";
              return (
                <ListItem key={category}>
                  <ListItemDecorator>
                    <CircleIcon
                      fontSize="small"
                      sx={{
                        zIndex: 2,
                        pointerEvents: "none",
                        color: color,
                      }}
                    />
                  </ListItemDecorator>
                  <Checkbox
                    size="sm"
                    overlay
                    disableIcon
                    variant="soft"
                    label={category || "(No Category)"}
                    checked={selected}
                    onChange={(event) => {
                      const newSet = event.target.checked
                        ? new Set([
                            ...props.filterSettings.selectedCategories,
                            category,
                          ])
                        : new Set(
                            props.filterSettings.selectedCategories.filter(
                              (sc) => sc !== category,
                            ),
                          );
                      props.onChangeFilterSettings({
                        ...props.filterSettings,
                        selectedCategories: [...newSet],
                      });
                    }}
                    slotProps={{
                      action: ({ checked }) => ({
                        sx: checked
                          ? {
                              border: "1px solid",
                              borderColor: "primary.500",
                            }
                          : {},
                      }),
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Stack>
      </Drawer>
    </Stack>
  );
}
