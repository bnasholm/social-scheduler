import { Box, Paper, Typography, Stack } from "@mui/material";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { Event } from "./Calendar";

type Props = {
  day: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onPostClick: (event: Event) => void;
  currentDate: Date;
};

const CalendarCell = ({
  day,
  events,
  onDateClick,
  onPostClick,
  currentDate,
}: Props) => {
  const dayEvents = events.filter((e) => isSameDay(new Date(e.date), day));
  const isPast = isBefore(startOfDay(day), startOfDay(currentDate));
  const isToday = isSameDay(day, currentDate);

  return (
    <Paper
      variant="outlined"
      onClick={() => onDateClick(day)}
      sx={{
        position: "relative",
        height: 120,
        p: 1.5,
        borderRadius: 2, // rounded corners
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // soft shadow
        border: "1px solid #e0e0e0", // subtle border
        overflow: "hidden",
        transition: "0.2s ease",
        "&:hover": {
          backgroundColor: "#f9f9f9",
        },
        opacity: isPast ? 0.5 : 1,
        pointerEvents: isPast ? "none" : "auto",
        cursor: isPast ? "default" : "pointer",
      }}
    >
      {/* Date number */}
      <Typography variant="caption" fontWeight="medium" color="text.secondary">
        {format(day, "d")}
      </Typography>

      {/* Today badge */}
      {isToday && (
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            backgroundColor: "primary.main",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "0.625rem",
            px: 1,
            py: "2px",
            lineHeight: 1,
            fontWeight: 600,
          }}
        >
          Today
        </Box>
      )}

      {/* Events */}
      <Stack spacing={0.5} mt={1}>
        {dayEvents.map((dayEvent, i) => (
          <Typography
            key={i}
            variant="caption"
            color="primary"
            noWrap
            sx={{
              cursor: "pointer",
              fontSize: "0.75rem",
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              borderRadius: 1,
              px: 0.5,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isPast) onPostClick(dayEvent);
            }}
          >
            {dayEvent.title}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
};

export default CalendarCell;
