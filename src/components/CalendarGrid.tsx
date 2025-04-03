import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  eachDayOfInterval,
  isSameWeek,
  isSameDay,
} from "date-fns";
import CalendarCell from "./CalendarCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Event } from "./Calendar";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

type Props = {
  currentDate: Date;
  events: Event[];
  setSelectedDate: (date: Date) => void;
  onPostClick: (event: Event) => void;
  view: "month" | "week";
};

const CalendarGrid = ({
  currentDate,
  events,
  setSelectedDate,
  onPostClick,
  view,
}: Props) => {
  const getDays = () => {
    if (view === "month") {
      const startDate = startOfWeek(startOfMonth(currentDate));
      const endDate = endOfWeek(endOfMonth(currentDate));
      const days: Date[] = [];
      let day = startDate;
      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }
      return days;
    } else {
      const start = startOfWeek(currentDate);
      return eachDayOfInterval({ start, end: endOfWeek(currentDate) });
    }
  };

  const days = getDays();

  const groupByWeeks = (days: Date[]) => {
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  return (
    <>
      {view === "month" ? (
        <>
          {/* Month View: Weekday headers */}
          <Grid container spacing={1} mb={1}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
              <Grid item xs={12 / 7} key={label}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {label}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Month View: Calendar cells */}
          {groupByWeeks(days).map((week, index) => {
            const isCurrentWeek = week.some((day) =>
              isSameWeek(day, new Date(), { weekStartsOn: 0 })
            );

            return (
              <Grid
                container
                columnSpacing={1}
                rowSpacing={0}
                key={`week-${index}`}
                sx={{
                  width: "100%",
                  backgroundColor: isCurrentWeek ? "#f0f8ff" : "transparent", // subtle light blue
                  borderRadius: 2,
                  py: 0.75,
                  mx: 0,
                  transition: "background-color 0.3s ease",
                }}
              >
                {week.map((day) => (
                  <Grid item xs={12 / 7} key={day.toISOString()}>
                    <CalendarCell
                      day={day}
                      events={events}
                      onDateClick={setSelectedDate}
                      onPostClick={onPostClick}
                      currentDate={new Date()}
                    />
                  </Grid>
                ))}
              </Grid>
            );
          })}
        </>
      ) : (
        <>
          {/* Week View: Days stacked vertically */}
          <Box
            sx={{
              maxWidth: 600,
              mx: "auto",
              px: 2,
            }}
          >
            <Stack spacing={2}>
              {days.map((day) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <Box
                    key={day.toISOString()}
                    sx={{
                      backgroundColor: isToday
                        ? "rgba(25, 118, 210, 0.06)"
                        : "transparent",
                      borderRadius: 2,
                      p: 1.5,
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                      {format(day, "EEEE, MMM d")}
                    </Typography>
                    <CalendarCell
                      day={day}
                      events={events}
                      onDateClick={setSelectedDate}
                      onPostClick={onPostClick}
                      currentDate={new Date()}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </>
      )}
    </>
  );
};

export default CalendarGrid;
