import Navbar from './Components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Repo from './Components/Repo';
import Register from './Components/Register';
import YourRepo from './Components/YourRepo';
import AddRepo from './Components/AddRepo';
import AddBranch from './Components/AddBranch';
import File from './Components/File';
import Search from './Components/Search';
import AddFile from './Components/AddFile';
import DeleteBranch from './Components/DeleteBranch';
import PullReq from './Components/PullReq';
import './App.css';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/yourrepo" element={<YourRepo />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/addrepo" element={<AddRepo />} />
        <Route exact path="/:repoId/addBranch" element={<AddBranch />} />
        <Route exact path={`/repo/:repoId`} element={<Repo />} />
        <Route exact path="/file/:fileId" element={<File />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/repo/:repoId/uploadFile" element={<AddFile />} />
        <Route exact path="/repo/:repoId/deleteBranch" element={<DeleteBranch />} />
        <Route exact path="/repo/:repoId/pull" element={<PullReq/>}/>
      </Routes>
    </>
  );
}

export default App;
