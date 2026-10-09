import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export function getPersonProfileSlug(name: string): string {
	return (
		name
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "") || "person"
	);
}

type PersonProfileLinkProps = {
	personId: string | number;
	personName?: string;
	children: ReactNode;
	className?: string;
	state?: unknown;
	"aria-label"?: string;
};

export default function PersonProfileLink({
	personId,
	personName,
	children,
	className,
	state,
	"aria-label": ariaLabel,
}: PersonProfileLinkProps) {
	const location = useLocation();
	let currentUserId: unknown;
	try {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const currentUser: unknown = JSON.parse(storedUser);
			if (typeof currentUser === "object" && currentUser !== null) {
				const userRecord = currentUser as Record<string, unknown>;
				currentUserId = userRecord.id ?? userRecord.user_id;
			}
		}
	} catch {
		currentUserId = undefined;
	}

	const isCurrentUser =
		currentUserId !== undefined && String(currentUserId) === String(personId);
	const linkState =
		typeof state === "object" && state !== null ? state : {};
	const stateProfileName =
		"profile" in linkState &&
		typeof linkState.profile === "object" &&
		linkState.profile !== null &&
		"name" in linkState.profile &&
		typeof linkState.profile.name === "string"
			? linkState.profile.name
			: undefined;
	const profileName =
		personName ?? stateProfileName ?? (typeof children === "string" ? children : "person");

	return (
		<Link
			to={
				isCurrentUser
					? "/profile"
					: `/people/${getPersonProfileSlug(profileName)}`
			}
			state={
				isCurrentUser
					? state
					: {
							...linkState,
							personId,
							returnTo: `${location.pathname}${location.search}${location.hash}`,
						}
			}
			aria-label={ariaLabel}
			className={className}>
			{children}
		</Link>
	);
}
