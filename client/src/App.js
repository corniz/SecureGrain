import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/Auth";
import MainLayout from "./layouts/Main"

import Register from './views/Register'
import Login from './views/Login'
import Home from "./views/Home";
import System from "./views/System";
import Storages from "./views/Storages";
import StorageInfo from "./views/StorageInfo";
import StorageCreate from "./views/StorageCreate";
import SectorManagement from "./views/Sectors";
import Reservations from "./views/Reservations";
import LoadingTimes from "./views/LoadingTimes";
import UserManagement from "./views/Users";
import UserInfo from "./views/UserInfo";

import { useNavigate } from "react-router-dom";
import { logout } from "./classes/Auth";
import axios from "axios";
import ReservationsCreate from "./views/ReservationsCreate";


export default function App() {
  const navigate = useNavigate();

  axios.interceptors.response.use((response) => response, (error) => {
    const status = error.response.status
    if (status == 401) {
      logout()
      navigate('/login')
    }
    throw error;
  });

  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/system" element={<System />} />
          <Route path="/storages" element={<Storages/>} />
          <Route path="/sectors" element={<SectorManagement/>} />
          <Route path="/storages/:storageId" element={<StorageInfo />} />
          <Route path="/storages/create" element={<StorageCreate />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/create" element={<ReservationsCreate />} />
          <Route path="/loadingtimes" element={<LoadingTimes />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/user/:userId" element={<UserInfo />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

      </Routes>
  );
}