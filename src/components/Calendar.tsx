import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import AddEventModal from "./AddEventModal";
import { Button, ToggleButton, ToggleButtonGroup, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export type Event = {
  id: string;
  date: string;
  title: string;
  image?: string;
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<"month" | "week">("month");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleAddEvent = (caption: string, date: Date, image?: string) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                title: caption,
                date: date.toISOString(),
                image,
              }
            : event
        )
      );
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: Math.floor(10000 + Math.random() * 90000).toString(),
          title: caption,
          date: date.toISOString(),
          image,
        },
      ]);
    }

    setEditingEvent(null);
    setSelectedDate(null);
    setModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    setEditingEvent(null);
    setModalOpen(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={2}
        flexWrap="wrap"
      >
        <CalendarHeader
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          view={view}
        />

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingEvent(null); // new post
              setSelectedDate(new Date()); // today
              setModalOpen(true);
            }}
          >
            Create Post
          </Button>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      <CalendarGrid
        currentDate={currentMonth}
        events={events}
        setSelectedDate={(date) => {
          setSelectedDate(date);
          setEditingEvent(null); // new post
          setModalOpen(true);
        }}
        onPostClick={(event) => {
          setEditingEvent(event);
          setSelectedDate(new Date(event.date));
          setModalOpen(true);
        }}
        view={view}
      />

      <AddEventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onDelete={handleDeleteEvent}
        onSave={handleAddEvent}
        date={selectedDate}
        existingCaption={editingEvent?.title}
        editingId={editingEvent?.id}
        existingImage={editingEvent?.image}
      />
    </div>
  );
};

export default Calendar;
