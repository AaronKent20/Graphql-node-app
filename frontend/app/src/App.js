import { Typography } from '@mui/material';
import './App.css';
import { PostPage } from './layouts/PostPage';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <Typography>
            GraphQL Node App
          </Typography>
          <PostPage/>
        </header>
      </div>
  );
}

export default App;
