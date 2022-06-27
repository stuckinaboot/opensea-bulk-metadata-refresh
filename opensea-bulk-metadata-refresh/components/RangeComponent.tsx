import { Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function RangeComponent(props: {
  startTokenId: string;
  endTokenId: string;
  onUpdateStartTokenId: (updated: string) => void;
  onUpdateEndTokenId: (updated: string) => void;
}) {
  return (
    <Grid item xs={12}>
      <Typography>Enter start token id and end token id, inclusive</Typography>
      <TextField
        value={props.startTokenId}
        onChange={(e) => {
          // Only allow number inputs
          // https://stackoverflow.com/questions/43067719/how-to-allow-only-numbers-in-textbox-in-reactjs
          const re = /^[0-9\b]+$/;

          // if value is not blank, then test the regex

          if (e.target.value === "" || re.test(e.target.value)) {
            const value = e.target.value;
            props.onUpdateStartTokenId(value);
          }
        }}
      />
      <TextField
        value={props.endTokenId}
        onChange={(e) => {
          // Only allow number inputs
          // https://stackoverflow.com/questions/43067719/how-to-allow-only-numbers-in-textbox-in-reactjs
          const re = /^[0-9\b]+$/;

          // if value is not blank, then test the regex

          if (e.target.value === "" || re.test(e.target.value)) {
            const value = e.target.value;
            props.onUpdateEndTokenId(value);
          }
        }}
      />
    </Grid>
  );
}
