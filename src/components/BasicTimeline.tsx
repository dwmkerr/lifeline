import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { LifeEvent } from "../lib/LifeEvent";
import { Typography } from "@mui/joy";

interface BasicTimelineProps {
  lifeEvents: LifeEvent[];
  categoryColors: Record<string, string>;
}

export default function BasicTimeline(props: BasicTimelineProps) {
  return (
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
            <Typography level="title-sm">{event.title}</Typography>
            <Typography level="body-xs">{event.notes}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
