import { Grid, TextField, Typography } from "@mui/material";

export default function SpecificComponent(props: {
  tokenIds: string;
  onUpdateTokenIds: (updated: string) => void;
}) {
  return (
    <Grid item xs={12}>
      <Typography>Enter each token ID to update on a new line</Typography>
      <TextField
        value={props.tokenIds}
        onChange={(e) => props.onUpdateTokenIds(e.target.value)}
        multiline
        maxRows={6}
      />
    </Grid>
  );
}
