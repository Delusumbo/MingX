import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Register";

import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoutes";

import Swipe from "../pages/Swipe/Swipe";
import Discover from "../pages/Discover/Discover";
import Connections from "../pages/Connections/Connections";
import Matches from "../pages/Matches/Matches";
import Profile from "../pages/Profile/Profile";
import Verify from "../pages/Verify/Verify";
import Premium from "../pages/Premium/Premium";
import Communities from "../pages/Communities/Communities";
import Share from "../pages/Share/Share";
import Likes from "../pages/Likes/Likes";
import OTP from "../pages/verificationCode/verificationCode";

export const AppRoutes = () => {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Signup />} />

			{/* Protected routes */}
			<Route element={<ProtectedRoute />}>
				<Route element={<Layout />}>
					<Route path="/discover" element={<Discover />} />
					<Route path="/connections" element={<Connections />} />
					<Route path="/matches" element={<Matches />} />
					<Route path="/message" element={<Matches />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/verify" element={<Verify />} />
					<Route path="/communities" element={<Communities />} />
					<Route path="/premium" element={<Premium />} />
					<Route path="/swipe" element={<Swipe />} />
					<Route path="/share" element={<Share />} />
					<Route path="/like" element={<Likes />} />

					<Route path="*" element={<Navigate to="/discover" replace />} />
				</Route>
					<Route path="/otp" element={<OTP />} />
			</Route>

			{/* Fallback */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};
