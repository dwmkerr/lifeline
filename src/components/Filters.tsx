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
import Slider, { sliderClasses } from "@mui/joy/Slider";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import CountrySelector from "./CountrySelector";
import OrderSelector, { OrderSelectorProps } from "./OrderSelector";
import { ListItemDecorator, Typography } from "@mui/joy";

import CircleIcon from "@mui/icons-material/Circle";

function valueText(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export type FiltersProps = OrderSelectorProps & {
  categories: string[];
  categoryColors: Record<string, string>;
  selectedCategories: string[];
  onSelectedCategoriesChanged: (selectedCategories: string[]) => void;
};

export default function Filters(props: FiltersProps) {
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
          <CountrySelector />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gridTemplateRows: "auto auto",
              gap: 1,
            }}
          >
            <FormLabel htmlFor="filters-start-date">Start date</FormLabel>
            <div />
            <FormLabel htmlFor="filters-end-date">End date</FormLabel>

            <Input
              id="filters-start-date"
              type="date"
              placeholder="Jan 6 - Jan 13"
              aria-label="Date"
            />
            <Box sx={{ alignSelf: "center" }}>-</Box>
            <Input
              id="filters-end-date"
              type="date"
              placeholder="Jan 6 - Jan 13"
              aria-label="Date"
            />
          </Box>
          <FormControl>
            <FormLabel>Price range</FormLabel>
            <Slider
              defaultValue={[2000, 4900]}
              step={100}
              min={0}
              max={10000}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              valueLabelFormat={valueText}
              marks={[
                { value: 0, label: "$0" },
                { value: 5000, label: "$5,000" },
                { value: 10000, label: "$10,000" },
              ]}
              sx={{
                [`& .${sliderClasses.markLabel}[data-index="0"]`]: {
                  transform: "none",
                },
                [`& .${sliderClasses.markLabel}[data-index="2"]`]: {
                  transform: "translateX(-100%)",
                },
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
                props.selectedCategories.find((c) => c === category) !==
                undefined;
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
                    label={category}
                    checked={selected}
                    onChange={(event) => {
                      const newSet = event.target.checked
                        ? new Set([...props.selectedCategories, category])
                        : new Set(
                            props.selectedCategories.filter(
                              (sc) => sc !== category,
                            ),
                          );
                      props.onSelectedCategoriesChanged([...newSet]);
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
