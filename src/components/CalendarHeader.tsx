import { Button, Typography, Stack } from "@mui/material";
import { format, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

type Props = {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  view: "month" | "week";
};

const CalendarHeader = ({ currentMonth, setCurrentMonth, view }: Props) => {
  const handlePrev = () => {
    setCurrentMonth(
      view === "month"
        ? subMonths(currentMonth, 1)
        : new Date(currentMonth.setDate(currentMonth.getDate() - 7))
    );
  };

  const handleNext = () => {
    setCurrentMonth(
      view === "month"
        ? addMonths(currentMonth, 1)
        : new Date(currentMonth.setDate(currentMonth.getDate() + 7))
    );
  };

  let title = "";
  if (view === "month") {
    title = format(currentMonth, "MMMM yyyy");
  } else {
    const start = startOfWeek(currentMonth);
    const end = endOfWeek(currentMonth);
    title = `Week of ${format(start, "MMM d")} – ${format(end, "MMM d")}`;
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button onClick={handlePrev}>Prev</Button>
      <Typography variant="h5" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      <Button onClick={handleNext}>Next</Button>
    </Stack>
  );
};

export default CalendarHeader;
