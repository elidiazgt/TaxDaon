import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useInput } from "@/hooks/useInput";
//import { useRef } from "@/hooks/useRef";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { SnackbarAction, useSnackbar } from "notistack";
import { truncateAddress } from "@/utils";
import { Storage } from "@celo-progressive-dapp-starter/hardhat/types/Storage";
import { useQuery, gql } from "@apollo/client";
import TextField from '@mui/material/TextField';
import { Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';

// The Graph query endpoint is defined in ../apollo-client.js

// Example GraphQL query for the Storage contract updates
const QUERY = gql`
  query Updates {
    updates(orderBy: timestamp, orderDirection: desc, first: 5) {
      id
      number
      sender
      timestamp
    }
  }
`;


export function StorageContract({ contractData }) {
  console.log(
    'contractData', contractData
  )
  const { kit, address, network, performActions } = useContractKit();
  const [storageValue, setStorageValue] = useState<string | null>(null);
  const [storageInput, setStorageInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState<string | null>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  var [donation, setDonation] = useState<number | null>(null);
  // Query the Graph endpoint specified in ../apollo-client.js 
  const { data: queryData, error: queryError } = useQuery(QUERY, {
    pollInterval: 2500,
  });
  console.log('The Graph query results', queryData);

  const contract = contractData
    ? (new kit.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as Storage)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  //const valueRef = useRef(null);

  function handleTax(e) {
    //e.preventDefault();
    console.log('handleTax.' + e);
    window.open("https://www.celo.tax");
  }

  function handleContractLink(e){
    console.log('handleContractLink .' + e);
    console.log('handleTax.' + e);
    window.open(contractLink);
  }

  const setStorage = async () => {
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .store(storageInput as string)
          .estimateGas();

        const result = await contract.methods
          .store(storageInput as string)
          //@ts-ignore
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action: SnackbarAction = (key) => (
          <>
            <Link href={url} target="_blank">
              View in Explorer
            </Link>
            <Button
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              X
            </Button>
          </>
        );
        enqueueSnackbar("Transaction sent", {
          variant,
          action,
        });
      });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
      console.log(e);
    }
  };

  const getStorage = async () => {
    try {
      const result = (await contract.methods.retrieve().call()) as string;
      setStorageValue(result);
    } catch (e) {
      console.log(e);
    }
  };


  
  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item sm={6} xs={12} sx={{ m: 2 }}>

      <Typography variant="h5" component="div">
          Step 1
        </Typography>
        <Chip label='Verify your celo taxes'  onClick={handleTax}  >
            
          </Chip>

          <Typography variant="h5" component="div">
          Step 2 
        </Typography>

        {contractData ? (
          <Chip label={'Verify the fundation Contract ' + truncateAddress(contractData?.address)}  onClick={handleContractLink}  >
            
          </Chip>
        ) : (
          <Typography component="div" variant="h1" >
            No contract detected for {network.name}
          </Typography>
        )}

        <Typography variant="h5" component="div">
          Step 3
        </Typography>

        <Divider component="div" sx={{ m: 1 }} />

        <TextField
         //inputRef={donation}
          id="outlined-number"
          label=" Enter you taxable donation"
          type="number"
          defaultValue={donation}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            console.log('donation',donation)
            console.log('e.target.value',e.target.value);
            let taxDonation= parseInt(e.target.value)
            setDonation(taxDonation)
            

          }}
        />

        <Button
         //onClick={manageDonation}
        variant="contained"
        color="secondary"
        startIcon={<Avatar src={'logo.jpeg'} />}
      >
        Donate my taxes
      </Button>

      </Grid>
    </Grid>
  );
}
