import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import { useContractKit } from "@celo-tools/use-contractkit";
import { truncateAddress, getWindowDimensions } from "@/utils";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useThemeContext } from "@/contexts/userTheme";
import CircularProgress from '@mui/material/CircularProgress';

export function Header() {
  const { address, network, connect, destroy } = useContractKit();
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const { theme, setTheme } = useThemeContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" >
        <Toolbar sx={{ gap: { md: 2, xs: 0.5 } } }>

<img src="logo.jpeg" alt="TaxDao logo" width='50px' height="50px"/>

          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          TaxDAOn
          </Typography>
          {network && <Chip label={network.name} color="secondary" />}
          {address && (
            <>
              <Chip
                label={truncateAddress(address)}
                color="info"
                onDelete={destroy}
                sx={{ mx: 1 }}
              />
              {windowDimensions.width >= 600 ? (
                <Button variant="outlined" color="inherit" onClick={destroy}>
                  Disconnect
                </Button>
              ) : (
                ""
              )}
            </>
          )}
          {!address && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => connect().catch(e => console.log(e))}
            >
              Connect wallet
            </Button>
          )}
          {/* <ThemeSwitcher
            sx={{ m: 1 }}
            onChange={e => setTheme(e.target.checked)}
            checked={theme}
          /> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
