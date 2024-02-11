import { useEffect, useRef, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";

import { LifeEvent } from "../lib/LifeEvent";
import { Autocomplete, Textarea } from "@mui/joy";
import { LifelineRepository } from "../lib/LifelifeRepository";

interface EditEventModalProps {
  open: boolean;
  event: LifeEvent;
  cateories: string[];
  onClose: (saved: boolean) => void;
}

export default function EditEventModal(props: EditEventModalProps) {
  const repository = LifelineRepository.getInstance();

  const [title, setTitle] = useState(props.event.title);
  const [category, setCategory] = useState(props.event.category);
  const [year, setYear] = useState(props.event.year);
  const [month, setMonth] = useState(props.event.month);
  const [day, setDay] = useState(props.event.day);
  const [notes, setNotes] = useState(props.event.notes);

  //  Focus the title on mount.
  //  Kludgy - can't get 'autoFocus' to work and 'useCallback' didn't work either.
  const titleRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      titleRef?.current?.focus();
    }, 100);
  }, []);

  const save = () => {
    repository.save({
      ...props.event,
      title,
      category,
      year,
      month,
      day,
      notes,
    });
  };
  return (
    <Modal open={props.open} onClose={() => props.onClose(false)}>
      <ModalDialog>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>Fill in the details of the event.</DialogContent>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            save();
            props.onClose(true);
          }}
        >
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              slotProps={{ input: { ref: titleRef } }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <Stack spacing={2}>
            <FormLabel>Date</FormLabel>
            <Stack direction="row" spacing={1}>
              <FormControl sx={{ flex: 1, maxWidth: 80 }}>
                <Input
                  placeholder="1995"
                  aria-label="Year"
                  value={year}
                  onChange={(e) => setYear(Number.parseInt(e.target.value))}
                />
              </FormControl>
              <FormControl sx={{ flex: 1, maxWidth: 80 }}>
                <Input
                  placeholder="03"
                  aria-label="Month"
                  value={month || ""}
                  onChange={(e) => setMonth(Number.parseInt(e.target.value))}
                />
              </FormControl>
              <FormControl sx={{ flex: 1, maxWidth: 80 }}>
                <Input
                  placeholder="14"
                  aria-label="Day"
                  value={day || ""}
                  onChange={(e) => setDay(Number.parseInt(e.target.value))}
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Autocomplete
                value={category || ""}
                options={["", ...props.cateories]}
                onChange={(e, value) => setCategory(value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                minRows={2}
                maxRows={4}
                value={notes || ""}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
