import { useState } from 'react'
import './App.css'
import { gql, useQuery } from '@apollo/client';
import { List, ListItem, ListItemText, TextField } from '@mui/material';
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const GET_ITEMS = gql`
  query getItems($name: String!) { 
    items(name: $name) {
      id
      name
      usedInTasks {
        id
        name
      }
    }
  }
`;

const Data = ({ name }: { name: string }) => {
  if (name === '') return <p>Please Enter Item's name.</p>;

  const { loading, error, data } = useQuery(GET_ITEMS, { variables: { name } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <List>
      {data.items.map((item) => (
        <ListItem>
          <ListItemText
            primary={item.name}
            secondary={item.usedInTasks.map((task) => (task.name)).join(', ')}
          />
        </ListItem>
      ))}
    </List>
  );
}

function App() {
  const [name, setName] = useState('')

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <TextField onChange={(e) => { setName(e.target.value) }} />
        <Data name={name} />
      </div>
    </ThemeProvider>
  );

}

export default App
