import React, { useState } from "react";
import {
  Box,
  Button,
  debounce,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import RangeComponent from "./RangeComponent";
import SpecificComponent from "./SpecificComponent";

enum BulkRefreshType {
  RANGE = "range",
  SPECIFIC = "specific",
}
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function BulkRefresh() {
  const [selected, setSelected] = useState(BulkRefreshType.RANGE);
  const [rangeTokenId, setRangeTokenId] = useState({
    startTokenId: "0",
    endTokenId: "0",
  });
  // This is the text in the specific token IDs text box
  const [specificTokenIds, setSpecificTokenIds] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [outputLog, setOutputLog] = useState("");
  const [apiKey, setApiKey] = useState("");

  function clearOutputLog() {
    setOutputLog("");
  }

  function updateOutputLog(strToAdd: string) {
    setOutputLog((curr) => {
      return curr + "\n" + strToAdd;
    });
  }

  async function refreshTokenIds(tokenIds: string[]) {
    let successfullyRefreshed = 0;
    const failedToRefresh = [];
    for (const tokenId of tokenIds) {
      const res = await fetch(
        `api/refreshTokenId?contractAddress=${contractAddress}&tokenId=${tokenId}&apiKey=${apiKey}`
      );
      const { output, status } = await res.json();
      updateOutputLog(output);

      if (status === 200) {
        successfullyRefreshed++;
        console.log(`Successfully submitted ${tokenId} for metadata refresh`);
      } else {
        failedToRefresh.push(tokenId);
        console.log(
          `Failed to submit ${tokenId} for metadata refresh; status code ${res.status}`
        );
      }

      // Wait 260ms so we don't get rate limited (4 queries/second allowed but add a 10ms buffer)
      // https://docs.opensea.io/reference/api-overview#:~:text=API%20FAQs,2%2Fsec%20per%20API%20key.
      await sleep(260);
    }

    const finalLog =
      `\nSuccessfully submitted ${successfullyRefreshed} tokens for metadata refresh` +
      "\n" +
      (failedToRefresh.length > 0)
        ? `Failed to submit ${failedToRefresh.length} tokens for metadata refresh. Here are their token IDs: ${failedToRefresh}`
        : "No tokens failed to refresh";
    updateOutputLog(finalLog);
  }

  const refresh = debounce(async () => {
    // Clear output log
    clearOutputLog();

    if (selected === BulkRefreshType.RANGE) {
      try {
        // Validate token IDs using ints
        const startTokenInt = parseInt(rangeTokenId.startTokenId);
        const endTokenInt = parseInt(rangeTokenId.endTokenId);

        if (startTokenInt > endTokenInt) {
          // TODO throw error
          return;
        }

        const tokenIds = [];
        for (let tokenId = startTokenInt; tokenId <= endTokenInt; tokenId++) {
          // Backend expects strings
          tokenIds.push(tokenId + "");
        }
        await refreshTokenIds(tokenIds);
      } catch {
        // TODO show error
      }
    } else if (selected === BulkRefreshType.SPECIFIC) {
      try {
        const lines = specificTokenIds.split("\n");
        await refreshTokenIds(lines);
      } catch {
        // TODO show error
      }
    }
  }, 300);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography>OpenSea API key</Typography>
        <TextField
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Contract address</Typography>
        <TextField
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Box mt={1} />
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          value={selected}
          exclusive
          onChange={(e, v) => setSelected(v)}
        >
          {Object.values(BulkRefreshType).map((refreshType) => (
            <ToggleButton key={refreshType} value={refreshType}>
              {refreshType}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
      {selected === BulkRefreshType.RANGE && (
        <Grid item xs={12}>
          <RangeComponent
            startTokenId={rangeTokenId.startTokenId}
            endTokenId={rangeTokenId.endTokenId}
            onUpdateStartTokenId={(updated) =>
              setRangeTokenId({ ...rangeTokenId, startTokenId: updated })
            }
            onUpdateEndTokenId={(updated) =>
              setRangeTokenId({ ...rangeTokenId, endTokenId: updated })
            }
          />
        </Grid>
      )}
      {selected === BulkRefreshType.SPECIFIC && (
        <Grid item xs={12}>
          <SpecificComponent
            tokenIds={specificTokenIds}
            onUpdateTokenIds={(updated) => setSpecificTokenIds(updated)}
          />
        </Grid>
      )}
      <Button onClick={refresh}>Refresh</Button>
      <Grid item xs={12}>
        <Box mt={4} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled
          value={outputLog}
          fullWidth
          placeholder="Output log of refresh"
          multiline
          maxRows={20}
        />
      </Grid>
    </Grid>
  );
}
