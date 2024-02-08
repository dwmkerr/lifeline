import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { LifeEvent } from "../lib/LifeEvent";
import { Typography } from "@mui/joy";

interface BasicTimelineProps {
  lifeEvents: LifeEvent[];
}

export default function BasicTimeline(props: BasicTimelineProps) {
  return (
    <Timeline>
      {props.lifeEvents.map((event) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography level="title-sm">{event.title}</Typography>
            <Typography level="body-sm">{event.date.toDateString()}</Typography>
            <Typography level="body-sm">{event.category}</Typography>
            <Typography level="body-sm">{event.notes}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
