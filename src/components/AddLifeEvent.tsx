import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import { LifelineRepository } from "../lib/LifelifeRepository";
import { useAlertContext } from "./AlertContext";
import { LifelineError } from "../lib/Errors";

export default function AddLifeEvent() {
  const repository = LifelineRepository.getInstance();
  const { setAlertFromError } = useAlertContext();

  // const [date, setDate] = useState("");
  const [year, setYear] = useState<number>(2000);
  const [month, setMonth] = useState<number | null>();
  const [day, setDay] = useState<number | null>();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const add = async () => {
    try {
      await repository.create({
        category,
        date: new Date(Date.parse(`${year}-${month || 1}-${day || 1}`)),
        year: year,
        month: month || null,
        day: day || null,
        title,
        notes: null,
      });
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Create Event Error", err));
    }
  };

  return (
    <Stack
      sx={{
        backgroundColor: "background.surface",
        px: { xs: 2, md: 4 },
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack sx={{ mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography level="h4">Add Events</Typography>
        </Stack>
        <Typography level="body-md" color="neutral">
          Visualise and track key life events.
        </Typography>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
        {/*<FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="1995-03-23"
            aria-label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormControl>*/}
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="1995"
            aria-label="Year"
            value={year}
            onChange={(e) => setYear(Number.parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="03"
            aria-label="Month"
            value={month || ""}
            onChange={(e) => setMonth(Number.parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="14"
            aria-label="Day"
            value={day || ""}
            onChange={(e) => setDay(Number.parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="Event"
            aria-label="Event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="Category"
            aria-label="Category"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
          />
        </FormControl>
        <Button variant="solid" color="primary" onClick={add}>
          Add
        </Button>
      </Stack>
    </Stack>
  );
}
