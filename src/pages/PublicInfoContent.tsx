import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import PublicInfoPage from "./PublicInfoPage";
import { requestAccountDeletion } from "../auth/authService";
import { getApiMessage } from "../utils/apiMessages";

const SUPPORT_EMAIL = "support@mingxlive.com";

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="space-y-3">
			<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
			{children}
		</section>
	);
}

function BulletList({ children }: { children: ReactNode }) {
	return <ul className="list-disc space-y-2 pl-6">{children}</ul>;
}

function SupportEmail() {
	return (
		<a className="font-medium text-[#C43266] hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
			{SUPPORT_EMAIL}
		</a>
	);
}

export function TermsOfUsePage() {
	return (
		<PublicInfoPage
			title="Terms of Use"
			description="These Terms govern your access to and use of Ming-X."
		>
			<Section title="Welcome to Ming-X">
				<p>
					Ming-X is a community platform built for meaningful connection. We bring together people
					who value shared heritage, culture, and intentional relationships. These Terms of Use
					govern your access to and use of the Ming-X platform, including our website, mobile
					applications, and all related services. By accessing or using Ming-X, you agree to comply
					with these Terms.
				</p>
			</Section>
			<Section title="Our Mission">
				<p>
					Ming-X exists to foster genuine community and connection. We are not a dating app. We are
					a space where people can discover others who share their values, celebrate their culture,
					and build relationships rooted in mutual respect and intentionality. Whether you are
					looking to expand your network, find community, or connect with like-minded individuals,
					Ming-X is designed to support those goals.
				</p>
			</Section>
			<Section title="Eligibility">
				<p>
					You must be at least 18 years old to use Ming-X. By accessing or using our platform, you
					confirm that you meet this requirement and that you have the legal capacity to agree to
					these Terms.
				</p>
			</Section>
			<Section title="Community Conduct">
				<p>
					Ming-X is a community built on respect, authenticity, and shared values. As a member of
					our community, you agree to:
				</p>
				<BulletList>
					<li>Treat all members with respect and dignity, regardless of background, identity, or perspective.</li>
					<li>Engage authentically and honestly in your interactions with others.</li>
					<li>Refrain from harassment, hate speech, discrimination, or any form of abusive behaviour.</li>
					<li>Not use the platform for unlawful purposes, including fraud, impersonation, or the misuse of personal information.</li>
					<li>Respect the privacy and boundaries of other community members.</li>
					<li>Contribute positively to the community by sharing content that is constructive, informative, or supportive.</li>
				</BulletList>
				<p>
					Ming-X is intended to facilitate respectful, culturally aware introductions and
					connections. Users are expected to interact with others in accordance with applicable
					laws and these Terms of Use.
				</p>
			</Section>
			<Section title="Account Responsibility">
				<p>
					You are responsible for maintaining the security and confidentiality of your account and
					login credentials. You are also responsible for all activities carried out through your
					account. If you believe your account has been compromised, please contact us immediately
					at <SupportEmail />.
				</p>
			</Section>
			<Section title="Content and Intellectual Property">
				<p>
					All content available on Ming-X, including logos, trademarks, designs, text, graphics,
					and other platform materials, belongs to Ming-X or its respective licensors.
					Unauthorized reproduction, distribution, modification, or use of our content is strictly
					prohibited.
				</p>
				<p>
					By posting content on Ming-X, you grant us a non-exclusive, royalty-free, worldwide
					license to use, display, and distribute that content in connection with operating and
					promoting the platform. You retain ownership of your content and are responsible for
					ensuring you have the rights to share it.
				</p>
			</Section>
			<Section title="Community Safety">
				<p>
					We are committed to maintaining a safe and welcoming environment for all members. We
					reserve the right to review, moderate, or remove any content that violates these Terms or
					our community standards. We may also suspend or terminate accounts that engage in harmful
					behaviour, including but not limited to harassment, spam, or the distribution of
					malicious content.
				</p>
			</Section>
			<Section title="Termination">
				<p>
					We reserve the right to suspend or terminate an account, restrict access, or take
					appropriate action where we reasonably believe a user has violated these Terms of Use,
					engaged in unlawful conduct, or misused the Ming-X platform. You may also delete your
					account at any time.
				</p>
			</Section>
			<Section title="Changes to Terms">
				<p>
					We may update these Terms of Use periodically to reflect changes to our platform,
					services, or legal requirements. Continued use of Ming-X after changes are published
					constitutes acceptance of the updated Terms. We encourage you to review this page
					regularly.
				</p>
			</Section>
			<Section title="Contact Us">
				<p>
					If you have any questions about these Terms of Use, please contact us at <SupportEmail />.
				</p>
				<p>
					You can also visit our live platform at{" "}
					<a className="font-medium text-[#C43266] hover:underline" href="https://mingxlive.com">
						https://mingxlive.com
					</a>
					.
				</p>
			</Section>
		</PublicInfoPage>
	);
}

export function PrivacyPolicyPage() {
	return (
		<PublicInfoPage
			title="Privacy Policy"
			description="This policy explains how Ming-X collects, uses, stores, and shares your personal information."
		>
			<Section title="Welcome to Ming-X">
				<p>
					Your privacy matters to us. This Privacy Policy explains how Ming-X (&quot;we&quot;,
					&quot;us&quot;, or &quot;our&quot;) collects, uses, stores, and shares your personal
					information when you use our platform — including our website at{" "}
					<a className="font-medium text-[#C43266] hover:underline" href="https://mingxlive.com">
						https://mingxlive.com
					</a>
					, our mobile applications, and any related services. By using Ming-X, you agree to the
					practices described in this policy.
				</p>
			</Section>
			<Section title="Our Commitment">
				<p>
					Ming-X is a community platform built for meaningful connection. We are not a dating app.
					We are committed to handling your personal information responsibly, transparently, and
					in a way that respects your privacy and your control over your own data. This policy is
					written to help you understand exactly what we collect, why we collect it, and the
					choices you have.
				</p>
			</Section>
			<Section title="Information We Collect">
				<p>We collect information to provide a safe, functional, and meaningful community experience. The types of information we collect include:</p>
				<BulletList>
					<li><strong>Information you provide:</strong> your name, email address, phone number, date of birth, gender, location, cultural background, interests, and any other details you choose to add to your profile.</li>
					<li><strong>Content you share:</strong> posts, messages, images, community interactions, and any other content you upload or create on the platform.</li>
					<li><strong>Verification data:</strong> information used to verify your identity, such as a live selfie, which is compared against your profile photo to confirm you are a real person.</li>
					<li><strong>Device and usage data:</strong> information about the device you use, your IP address, operating system, app version, and how you interact with the platform.</li>
					<li><strong>Communications:</strong> any messages you send to us, including support requests and feedback.</li>
				</BulletList>
			</Section>
			<Section title="How We Use Your Information">
				<p>We use the information we collect to:</p>
				<BulletList>
					<li>Create and manage your account and provide access to the Ming-X platform.</li>
					<li>Facilitate meaningful, culturally aware connections and community interactions.</li>
					<li>Personalise your experience, including recommendations for people, communities, and content that may be relevant to you.</li>
					<li>Verify your identity and maintain the safety and integrity of our community.</li>
					<li>Detect, prevent, and address fraud, abuse, spam, and other harmful behaviour.</li>
					<li>Provide customer support and respond to your enquiries.</li>
					<li>Send you important service updates, security alerts, and (where permitted) information about features and offers.</li>
					<li>Comply with legal obligations and enforce our Terms of Use.</li>
				</BulletList>
			</Section>
			<Section title="Legal Bases for Processing">
				<p>
					Where required by applicable law, we process your personal information on the following
					legal bases: your consent, the performance of a contract with you, our legitimate
					interests in operating and improving the platform, and compliance with legal obligations.
				</p>
			</Section>
			<Section title="Sharing of Information">
				<p>We do not sell your personal information. We share information only in the following limited circumstances:</p>
				<BulletList>
					<li><strong>With other members:</strong> information you include in your public profile or share publicly (such as posts or community activity) is visible to other users of Ming-X.</li>
					<li><strong>Service providers:</strong> trusted third parties who help us operate the platform, such as hosting, analytics, verification, and customer support providers. These providers are bound by confidentiality obligations.</li>
					<li><strong>Legal and safety reasons:</strong> where we are required to do so by law, or where we believe it is necessary to protect the rights, safety, or property of Ming-X, our members, or the public.</li>
					<li><strong>Business transfers:</strong> in the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to this policy.</li>
				</BulletList>
			</Section>
			<Section title="Verification and Liveness Data">
				<p>
					To keep our community safe, Ming-X offers a verification process that uses liveness
					detection technology. When you verify your profile, a live selfie is captured and
					compared against your profile picture to confirm you are a real person. Verification
					data is used solely for this purpose, is handled securely, and is not shared with other
					members.
				</p>
			</Section>
			<Section title="Data Retention">
				<p>
					We retain your personal information for as long as your account is active or as long as
					necessary to provide our services, comply with legal obligations, resolve disputes, and
					enforce our agreements. When you delete your account, we will delete or anonymise your
					personal information in accordance with applicable laws, except where retention is
					required for legal or legitimate business reasons.
				</p>
			</Section>
			<Section title="Security">
				<p>
					We implement industry-standard technical and organisational security measures designed
					to protect your personal information from unauthorised access, alteration, disclosure,
					or destruction. These measures include encryption in transit, access controls, and
					regular security reviews. While we take reasonable steps to safeguard your information,
					no method of electronic storage or transmission can be guaranteed to be completely secure.
				</p>
			</Section>
			<Section title="Your Rights and Choices">
				<p>Depending on your location, you may have the right to:</p>
				<BulletList>
					<li>Access the personal information we hold about you.</li>
					<li>Request correction or updating of inaccurate information.</li>
					<li>Request deletion of your personal information.</li>
					<li>Object to or restrict certain processing of your information.</li>
					<li>Withdraw consent where processing is based on consent.</li>
					<li>Request a portable copy of your information.</li>
					<li>Lodge a complaint with a data protection authority.</li>
				</BulletList>
				<p>
					You can manage much of your information directly through your account settings. To
					exercise any of these rights, please contact us using the details below.
				</p>
			</Section>
			<Section title="Children's Privacy">
				<p>
					Ming-X is not intended for anyone under the age of 18. We do not knowingly collect
					personal information from children. If we become aware that we have collected
					information from a child, we will take steps to delete it promptly.
				</p>
			</Section>
			<Section title="International Transfers">
				<p>
					Your information may be transferred to, stored, and processed in countries other than
					your own. Where we transfer information internationally, we take steps to ensure that
					appropriate safeguards are in place to protect your information in accordance with this
					policy and applicable law.
				</p>
			</Section>
			<Section title="Changes to This Policy">
				<p>
					We may update this Privacy Policy from time to time to reflect changes to our platform,
					services, or legal requirements. When we make material changes, we will notify you
					through the platform or by other appropriate means. We encourage you to review this page
					periodically.
				</p>
			</Section>
			<Section title="Contact Us">
				<p>
					If you have any questions or concerns about this Privacy Policy or how your information
					is handled, please contact us at <SupportEmail />.
				</p>
				<p>
					You can also visit our live platform at{" "}
					<a className="font-medium text-[#C43266] hover:underline" href="https://mingxlive.com">
						https://mingxlive.com
					</a>
					.
				</p>
			</Section>
		</PublicInfoPage>
	);
}

export function SupportPage() {
	return (
		<PublicInfoPage
			title="Ming-X Support"
			description="We're here to help with your account, community, safety, verification, or using the app. Browse the topics below, or reach out to us directly — a real person will get back to you."
		>
			<p>
				<a
					className="inline-flex rounded-xl bg-[#C43266] px-5 py-3 font-medium text-white transition hover:bg-[#652F7B]"
					href={`mailto:${SUPPORT_EMAIL}`}
				>
					Email Support
				</a>
			</p>
			<Section title="Contact Support">
				<p>The fastest way to reach us is by email at <SupportEmail />.</p>
				<p>To help us resolve your issue quickly, please include:</p>
				<BulletList>
					<li>The email address linked to your Ming-X account.</li>
					<li>A clear description of the issue you're experiencing.</li>
					<li>Screenshots or screen recordings, if applicable.</li>
					<li>The device and app version you're using (found in Settings).</li>
				</BulletList>
			</Section>
			<Section title="Account & Login Issues">
				<p>If you're having trouble signing in, resetting your password, verifying your email, or accessing your account, we can help. Common issues we resolve include:</p>
				<BulletList>
					<li>Password reset emails not arriving (check your spam folder first).</li>
					<li>Account locked or temporarily suspended.</li>
					<li>Difficulty updating your email or phone number.</li>
					<li>Needing to delete or deactivate your account.</li>
				</BulletList>
			</Section>
			<Section title="Verification Help">
				<p>Ming-X uses a liveness check to confirm you are a real person. This helps keep our community safe and trustworthy. If your verification failed, here are the most common reasons:</p>
				<BulletList>
					<li>Your face was not clearly visible or was partially out of frame.</li>
					<li>Lighting was too dim, too bright, or backlit.</li>
					<li>You were wearing sunglasses, a hat, or a mask.</li>
					<li>More than one face appeared in the frame.</li>
					<li>Your profile picture does not clearly show your face.</li>
				</BulletList>
				<p>If verification keeps failing, update your profile picture to a recent, clear photo of your face, then try again. If the issue persists, contact us and we'll look into it.</p>
			</Section>
			<Section title="Safety & Reporting">
				<p>Your safety is our priority. If you experience or witness any of the following, please report it to us immediately:</p>
				<BulletList>
					<li>Harassment, threats, or abusive behaviour.</li>
					<li>Fake profiles, impersonation, or catfishing.</li>
					<li>Spam, scams, or suspicious links.</li>
					<li>Hate speech or discriminatory content.</li>
					<li>Any other behaviour that makes you feel unsafe.</li>
				</BulletList>
				<p>
					You can also report or block a user directly from their profile or a post. Reports are
					reviewed by our team, and we take appropriate action in line with our{" "}
					<Link className="font-medium text-[#C43266] hover:underline" to="/terms-of-use">
						Terms of Use
					</Link>
					.
				</p>
			</Section>
			<Section title="Communities & Connections">
				<p>
					Ming-X is a community platform for meaningful connection — not a dating app. If you have
					questions about joining communities, connecting with others, posting, messaging, or
					discovering people who share your interests, we're happy to guide you.
				</p>
				<p>Please note: messaging and some community features may require an active subscription.</p>
			</Section>
			<Section title="Subscriptions & Billing">
				<p>For questions about your subscription, payments, renewals, or refunds, contact us with the email address linked to your account. Common requests include:</p>
				<BulletList>
					<li>Cancelling or managing a subscription.</li>
					<li>Subscription not activating after payment.</li>
					<li>Requesting a refund (subject to the applicable store's policy).</li>
					<li>Billing questions or unexpected charges.</li>
				</BulletList>
				<p>If you subscribed through the Apple App Store or Google Play, you can also manage or cancel your subscription directly from your store account settings.</p>
			</Section>
			<Section title="Technical Issues">
				<p>If the app is crashing, freezing, or not loading properly, try these steps first:</p>
				<BulletList>
					<li>Force-close the app and reopen it.</li>
					<li>Check that you're on the latest version of Ming-X.</li>
					<li>Restart your device.</li>
					<li>Check your internet connection.</li>
					<li>Clear the app cache (Android) or reinstall the app.</li>
				</BulletList>
				<p>If the problem continues, send us the details and we'll investigate.</p>
			</Section>
			<Section title="Data & Privacy Requests">
				<p>
					You may request access to, correction of, or deletion of your personal information at any
					time. For full details on how we handle your data, please see our{" "}
					<Link className="font-medium text-[#C43266] hover:underline" to="/privacy-policy">
						Privacy Policy
					</Link>
					.
				</p>
				<p>To submit a data request, email us at <SupportEmail /> from the email address linked to your account.</p>
			</Section>
			<Section title="Feedback & Suggestions">
				<p>We're building Ming-X with our community. If you have ideas for features, improvements, or new communities you'd like to see, we'd love to hear from you. Send your thoughts to <SupportEmail />.</p>
			</Section>
			<Section title="Response Time">
				<p>We typically respond within 24–48 hours. Safety-related reports are prioritised and reviewed as quickly as possible. If you don't hear back within 48 hours, please check your spam folder before sending a follow-up.</p>
			</Section>
		</PublicInfoPage>
	);
}

export function ChildPolicyPage() {
	return (
		<PublicInfoPage
			title="Child Policy Declaration"
			description="Ming-X is strictly intended for users aged 18 and above."
		>
			<Section title="Purpose">
				<p>
					At Ming-X, we are committed to ensuring the safety, rights, and well-being of
					individuals. Our platform is strictly intended for users aged 18 and above. We do not
					permit anyone under the age of 18 to create an account or use our services under any
					circumstances.
				</p>
			</Section>
			<Section title="Scope">
				<p>
					This policy applies to all content, features, and services provided by Ming-X. We
					enforce strict measures to prevent underage individuals from accessing our platform.
				</p>
			</Section>
			<Section title="Protection Measures">
				<p>To maintain a safe environment, Ming-X implements:</p>
				<BulletList>
					<li><strong>Age Verification:</strong> Mandatory age checks during account registration.</li>
					<li><strong>Content Moderation:</strong> Continuous monitoring to detect and remove any inappropriate content or underage accounts.</li>
					<li><strong>Secure Data Handling:</strong> Robust systems to safeguard user information and prevent unauthorized access.</li>
				</BulletList>
			</Section>
			<Section title="Zero Tolerance for Underage Use">
				<p>
					Ming-X does not allow users under 18 years old. Parental or guardian consent is not
					accepted as a means to bypass this restriction. Any account found to belong to a minor
					will be promptly suspended and removed.
				</p>
			</Section>
			<Section title="Reporting Concerns">
				<p>
					If you encounter or suspect an underage user on our platform, please report it
					immediately to our support team. We take all reports seriously and act swiftly to
					investigate and address any violations.
				</p>
			</Section>
			<Section title="Contact Information">
				<p>
					For questions or more details about this declaration, reach out to us at{" "}
					<a className="font-medium text-[#C43266] hover:underline" href="mailto:support@mingxdating.com">
						support@mingxdating.com
					</a>
					.
				</p>
			</Section>
		</PublicInfoPage>
	);
}

export function DeleteAccountPage() {
	const [email, setEmail] = useState("");
	const [sending, setSending] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSending(true);
		setMessage("");
		setError("");

		try {
			const response = await requestAccountDeletion(email.trim());
			setMessage(getApiMessage(response, "Request completed."));
		} catch (requestError) {
			setError(getApiMessage(requestError));
		} finally {
			setSending(false);
		}
	};

	return (
		<PublicInfoPage
			title="Delete Account"
			description="Request an authorization code to begin deleting your Ming-X account."
		>
			<p>
				Enter the email address associated with your account. If it is registered with Ming-X, we
				will send an authorization code to that address.
			</p>
			<form onSubmit={(event) => void handleSubmit(event)} className="max-w-xl space-y-5">
				<div className="space-y-2">
					<label htmlFor="delete-request-email" className="block font-medium text-gray-900">
						Email
					</label>
					<input
						id="delete-request-email"
						name="email"
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="Enter your email"
						className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C43266] focus:ring-2 focus:ring-[#C43266]/20"
					/>
				</div>
				<button
					type="submit"
					disabled={sending}
					className="rounded-xl bg-[#C43266] px-5 py-3 font-medium text-white transition hover:bg-[#652F7B] disabled:cursor-not-allowed disabled:opacity-60">
					{sending ? "Sending..." : "Send Authorization Code"}
				</button>
				{message && (
					<p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
						{message}
					</p>
				)}
				{error && (
					<p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
						{error}
					</p>
				)}
			</form>
			<p>
				For help with the request, contact <SupportEmail />. Account deletion is permanent and
				cannot be undone.
			</p>
		</PublicInfoPage>
	);
}
