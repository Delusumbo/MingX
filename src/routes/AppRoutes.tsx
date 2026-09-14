import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Register";
import Layout from "../components/Layout";

import Discover from "../pages/Discover/Discover";
import Connections from "../pages/Connections/Connections";
import Matches from "../pages/Matches/Matches";
import Profile from "../pages/Profile/Profile";
import Verify from "../pages/Verify/Verify";
import Premium from "../pages/Premium/Premium";
import Communities from "../pages/Communities/Communities";



export const AppRoutes = () => {
  return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Signup />} />
			<Route element={<Layout />}>
				<Route path="/discover" element={<Discover />} />

				<Route path="/connections" element={<Connections />} />

				<Route path="/matches" element={<Matches />} />

				<Route path="/messages" element={<Matches />} />

				<Route path="/profile" element={<Profile />} />

				<Route path="/verify" element={<Verify />} />

				<Route path="/communities" element={<Communities />} />

				<Route path="/premium" element={<Premium />} />

				<Route path="*" element={<Navigate to="/discover" replace />} />
			</Route>
		</Routes>
	);
}
