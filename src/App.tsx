import { useState } from 'react';
import './App.css';
import { TypedDocumentNode, useQuery } from '@apollo/client';
import { List, ListItemButton, ListItemText, TextField } from '@mui/material';
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { gql } from '../src/__generated__/gql';
import { Exact, GetItemsQuery } from './__generated__/graphql';

const GET_ITEMS: TypedDocumentNode<
  GetItemsQuery,
  Exact<{
    name: string;
  }>
> = gql(`
  query getItems($name: String!) { 
    items(name: $name) {
      id
      name
      wikiLink
      usedInTasks {
        id
        name
      }
    }
  }
`);

const Data = ({ name }: { name: string }) => {
  if (name === '') return <p>Please Enter Item's name.</p>;

  const { loading, error, data } = useQuery(GET_ITEMS, {
    variables: { name },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return <p>No item found</p>;

  return (
    <List>
      {data.items.map((item) => (
        <ListItemButton divider key={item?.name} href={item?.wikiLink || ''} target="_blank" >
          <ListItemText
            primary={item?.name}
            secondary={item?.usedInTasks?.map((task) => task?.name).join(', ')}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

function App() {
  const [name, setName] = useState('');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <TextField
          onKeyPress={e => {
            // e.keyCodeは常に0になる
            if (e.key === 'Enter') {
              setName((e.target as HTMLInputElement).value);
            }
          }}
        />
        <Data name={name} />
      </div>
    </ThemeProvider>
  );
}

export default App;
