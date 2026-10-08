import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import EditProfile from "../pages/Profile/EditProfile";
import {
	ChildPolicyPage,
	DeleteAccountPage,
	PrivacyPolicyPage,
	SupportPage,
	TermsOfUsePage,
} from "../pages/PublicInfoContent";

const pageTitles: Record<string, string> = {
	"/": "MingX | Connect, Discover & Build Community",
	"/login": "Log In to MingX",
	"/register": "Create Your MingX Account",
	"/otp": "Verify Your Account | MingX",
	"/discover": "Discover People & Communities | MingX",
	"/connections": "My Connections | MingX",
	"/matches": "Your Matches | MingX",
	"/message": "Messages | MingX",
	"/profile": "Your Profile | MingX",
	"/profile/edit": "Edit Profile | MingX",
	"/verify": "Verify Your Account | MingX",
	"/communities": "Communities | MingX",
	"/premium": "MingX Premium | Unlock More Features",
	"/swipe": "Discover People | MingX",
	"/share": "Share MingX",
	"/like": "Your Likes | MingX",
	"/terms-of-use": "Terms of Use | MingX",
	"/privacy-policy": "Privacy Policy | MingX",
	"/support": "Support | MingX",
	"/child-policy": "Child Policy | MingX",
	"/delete-account": "Delete Your Account | MingX",
};

export const AppRoutes = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		document.title = pageTitles[pathname] ?? "MingX";
	}, [pathname]);

	return (
		<Routes>
			{/* Public routes */}
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Signup />} />
			<Route path="/otp" element={<OTP />} />
			<Route path="/terms-of-use" element={<TermsOfUsePage />} />
			<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
			<Route path="/support" element={<SupportPage />} />
			<Route path="/child-policy" element={<ChildPolicyPage />} />
			<Route path="/delete-account" element={<DeleteAccountPage />} />
			{/* Protected routes */}
			<Route element={<ProtectedRoute />}>
				<Route element={<Layout />}>
					<Route path="/discover" element={<Discover />} />
					<Route path="/connections" element={<Connections />} />
					<Route path="/matches" element={<Matches />} />
					<Route path="/message" element={<Matches />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/profile/edit" element={<EditProfile />} />
					<Route path="/verify" element={<Verify />} />
					<Route path="/communities" element={<Communities />} />
					<Route path="/premium" element={<Premium />} />
					<Route path="/swipe" element={<Swipe />} />
					<Route path="/share" element={<Share />} />
					<Route path="/like" element={<Likes />} />

					<Route path="*" element={<Navigate to="/discover" replace />} />
				</Route>
			</Route>

			{/* Fallback */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};
