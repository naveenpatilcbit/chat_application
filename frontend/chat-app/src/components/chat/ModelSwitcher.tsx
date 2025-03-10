import React, { useState } from "react";
import {
  Button,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

interface ModelOption {
  value: string;
  label: string;
}

const models: ModelOption[] = [
  { value: "gpt-3.5", label: "GPT-3.5" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "custom", label: "Custom Model" },
];

export default function ModelSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModel, setSelectedModel] = useState<string>(models[0].value);

  // Opens popover when the button is clicked
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handles selection and closes the popover
  const handleSelectModel = (modelValue: string) => {
    setSelectedModel(modelValue);
    // Optionally, notify the parent or update a global state here.
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "model-switcher-popover" : undefined;

  return (
    <Box>
      {/* The switcher button displaying the currently selected model */}
      <Button
        variant="outlined"
        onClick={handleButtonClick}
        sx={{
          textTransform: "none",
          borderRadius: "20px",
          paddingX: 2,
        }}
      >
        {models.find((m) => m.value === selectedModel)?.label || "Select Model"}
      </Button>

      {/* Popover with a list of models */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List sx={{ width: "200px" }}>
          {models.map((model) => (
            <ListItemButton
              key={model.value}
              onClick={() => handleSelectModel(model.value)}
            >
              <ListItemText primary={model.label} />
              {selectedModel === model.value && (
                <Typography variant="caption" color="primary">
                  Selected
                </Typography>
              )}
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </Box>
  );
}
