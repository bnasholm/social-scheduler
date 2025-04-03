import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { format, isBefore, startOfDay } from "date-fns";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (caption: string, date: Date, image?: string) => void;
  onDelete: (id: string) => void;
  date: Date | null;
  existingCaption?: string;
  editingId?: string;
  existingImage?: string;
};

const AddEventModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  date,
  existingCaption,
  editingId,
  existingImage,
}: Props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("motivational");

  const isPast = useMemo(() => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const localDate = new Date(year, month - 1, day); // month is 0-based
    return isBefore(startOfDay(new Date(localDate)), startOfDay(new Date()));
  }, [selectedDate]);

  useEffect(() => {
    if (!open) {
      setImage(null);
    }
  }, [open]);

  useEffect(() => {
    if (date) {
      setSelectedDate(format(date, "yyyy-MM-dd"));
    }
    if (existingCaption) {
      setCaption(existingCaption);
    } else {
      setCaption("");
    }
    if (existingImage) {
      setImage(existingImage);
    }
  }, [date, existingCaption, existingImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // stores base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (caption.trim() && selectedDate) {
      const [year, month, day] = selectedDate.split("-").map(Number);
      const localDate = new Date(year, month - 1, day); // month is 0-based
      onSave(caption, localDate, image || undefined);
      setCaption("");
    }
  };

  const themeCaptions: Record<string, string[]> = {
    motivational: [
      "Dream big. Start small. Act now. 💥",
      "Keep going — you're closer than you think 🚀",
      "Believe in your magic ✨",
      "Small steps every day 💫",
    ],
    funny: [
      "Mentally on vacation 🧠✈️",
      "Running on caffeine and chaos ☕😅",
      "I came. I saw. I made it awkward. 😬",
      "Still waiting for my Oscar 🎭",
    ],
    aesthetic: [
      "Golden hour glow ✨",
      "Soft moments & warm tones 🌅",
      "Mood: minimalist serenity 🤍",
      "Sun-drenched daydreams 🌞",
    ],
    lifestyle: [
      "Weekend reset 🧖‍♀️",
      "Farmers market finds 🥬🌸",
      "Books, tea, and cozy corners 📚🍵",
      "My kind of self-care day 💆‍♀️",
    ],
  };

  const generateCaption = async () => {
    setLoading(true);

    const captions = themeCaptions[theme] || [];
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];

    await new Promise((resolve) => setTimeout(resolve, 700)); // simulate delay

    setCaption(randomCaption);
    setLoading(false);
  };

  const handleGenerateCaption = async () => {
    if (existingCaption) {
      setOpenConfirmDialog(true);
      return;
    }

    await generateCaption();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {existingCaption ? "Edit Post" : "Schedule Post"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Post Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={isPast}
            helperText={isPast ? "Cannot schedule in the past" : ""}
          />
          <Stack spacing={1}>
            {!image && (
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
            )}

            {image && (
              <Box
                component="img"
                src={image}
                alt="Preview"
                sx={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )}
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              value={theme}
              label="Theme"
              onChange={(e) => setTheme(e.target.value)}
            >
              <MenuItem value="motivational">Motivational</MenuItem>
              <MenuItem value="funny">Funny</MenuItem>
              <MenuItem value="aesthetic">Aesthetic</MenuItem>
              <MenuItem value="lifestyle">Lifestyle</MenuItem>
            </Select>
          </FormControl>

          <Button
            onClick={handleGenerateCaption}
            variant="outlined"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Generate Caption"}
          </Button>

          <TextField
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Write your post caption..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {editingId && (
          <Button onClick={() => setOpenDeleteDialog(true)} color="error">
            Delete
          </Button>
        )}
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!caption.trim()}
        >
          {existingCaption ? "Update Post" : "Schedule Post"}
        </Button>
      </DialogActions>
      <ConfirmDialog
        open={openDeleteDialog}
        title="Delete Post?"
        message="This will permanently remove this post from your calendar. Are you sure?"
        confirmLabel="Delete"
        onCancel={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          setOpenDeleteDialog(false);
          if (editingId) {
            onDelete(editingId);
          }
        }}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        title="Replace Caption?"
        message="This will overwrite your current caption. Are you sure you want to continue?"
        confirmLabel="Replace"
        onCancel={() => {
          setOpenConfirmDialog(false);
        }}
        onConfirm={async () => {
          setOpenConfirmDialog(false);
          await generateCaption();
        }}
      />
    </Dialog>
  );
};

export default AddEventModal;
