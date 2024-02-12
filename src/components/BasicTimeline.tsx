import * as React from "react";
import { useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { IconButton, Stack, Typography } from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { LifeEvent } from "../lib/LifeEvent";
import { LifelineRepository } from "../lib/LifelifeRepository";
import DeleteEventModal from "./DeleteEventModal";

interface BasicTimelineProps {
  lifeEvents: LifeEvent[];
  categoryColors: Record<string, string>;
  onEditEvent: (event: LifeEvent) => void;
}

export default function BasicTimeline(props: BasicTimelineProps) {
  const repository = LifelineRepository.getInstance();
  const [deleteModalEvent, setDeleteModalEvent] = useState<LifeEvent | null>(
    null,
  );

  return (
    <React.Fragment>
      <Timeline>
        {props.lifeEvents.map((event) => (
          <TimelineItem key={event.id}>
            <TimelineOppositeContent color="text.secondary">
              <Typography level="body-sm">
                {event.year}
                {event.month ? "-" + `${event.month}`.padStart(2, "0") : ""}
              </Typography>
              <Typography level="body-xs">{event.category}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: event.category
                    ? props.categoryColors[event.category]
                    : "#333333",
                }}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={0}
              >
                <IconButton
                  variant="plain"
                  onClick={() => props.onEditEvent(event)}
                  sx={{
                    "--IconButton-size": "12px",
                  }}
                >
                  <EditIcon
                    sx={{
                      maxWidth: "16px",
                    }}
                  />
                </IconButton>
                <IconButton
                  variant="plain"
                  onClick={() => setDeleteModalEvent(event)}
                  sx={{
                    "--IconButton-size": "12px",
                  }}
                >
                  <DeleteForeverIcon
                    sx={{
                      maxWidth: "16px",
                    }}
                  />
                </IconButton>
                <Typography level="title-sm">{event.title}</Typography>
              </Stack>
              <Typography level="body-xs">{event.notes}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      {deleteModalEvent !== null && (
        <DeleteEventModal
          event={deleteModalEvent}
          onCancel={() => setDeleteModalEvent(null)}
          onDeleteEvent={(event) => {
            repository.delete(event.id);
            setDeleteModalEvent(null);
          }}
        />
      )}
    </React.Fragment>
  );
}
