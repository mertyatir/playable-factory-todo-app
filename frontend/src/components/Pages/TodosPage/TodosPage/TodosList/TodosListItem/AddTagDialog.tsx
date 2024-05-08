import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { AddTagDialogProps } from "@/types/ComponentProps";

export const AddTagDialog: React.FC<AddTagDialogProps> = ({
  todo,
  dialogOpen,
  setDialogOpen,
  setTagsInput,
  handleAddTag,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Add Tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="tag"
          label="Tag"
          type="text"
          fullWidth
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleAddTag(todo._id)} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
