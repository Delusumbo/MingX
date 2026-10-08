import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Header } from "../../components/Layout";
import {
	completeFaceVerification,
	getFaceVerificationStatus,
	startFaceVerification,
} from "../../services/verificationService";
import { getApiMessage } from "../../utils/apiMessages";

type StatusRecord = Record<string, unknown>;

function asRecord(value: unknown): StatusRecord | null {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value as StatusRecord;
}

function getVerificationDetails(value: unknown): StatusRecord {
	const record = asRecord(value);
	if (!record) return {};
	return asRecord(record.data) ?? record;
}

export default function Verify() {
	const [sessionReference, setSessionReference] = useState("");
	const [selfie, setSelfie] = useState<File | null>(null);
	const [status, setStatus] = useState<unknown>(null);
	const [loadingStatus, setLoadingStatus] = useState(true);
	const [starting, setStarting] = useState(false);
	const [completing, setCompleting] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const refreshStatus = useCallback(async () => {
		setLoadingStatus(true);
		setError("");
		try {
			const response = await getFaceVerificationStatus();
			setStatus(response);
			const details = getVerificationDetails(response);
			const reference = details.session_reference ?? details.sessionReference;
			if (typeof reference === "string") setSessionReference(reference);
		} catch (statusError) {
			setError(getApiMessage(statusError));
		} finally {
			setLoadingStatus(false);
		}
	}, []);

	useEffect(() => {
		void refreshStatus();
	}, [refreshStatus]);

	const handleStart = async () => {
		setStarting(true);
		setError("");
		setMessage("");
		try {
			const result = await startFaceVerification();
			setSessionReference(result.sessionReference);
			setMessage(getApiMessage(result.response, "Verification session started."));
		} catch (startError) {
			setError(getApiMessage(startError));
		} finally {
			setStarting(false);
		}
	};

	const handleComplete = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!sessionReference || !selfie) return;

		setCompleting(true);
		setError("");
		setMessage("");
		try {
			const response = await completeFaceVerification(sessionReference, selfie);
			setMessage(getApiMessage(response, "Verification request completed."));
			await refreshStatus();
		} catch (completeError) {
			setError(getApiMessage(completeError));
		} finally {
			setCompleting(false);
		}
	};

	const statusDetails = getVerificationDetails(status);
	const visibleStatus = statusDetails.status ?? statusDetails.verification_status;

	return (
		<>
			<Header />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<h1 className="text-3xl font-bold text-[#67307d]">Face Verification</h1>
				<p className="mt-2 font-medium">Start a verification session, then submit a clear selfie.</p>

				<div className="mt-8 max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h2 className="font-semibold text-gray-900">Verification status</h2>
							{loadingStatus ? (
								<p className="mt-1 text-sm text-gray-500">Loading status...</p>
							) : (
								<p className="mt-1 text-sm text-gray-600">
									{typeof visibleStatus === "string" || typeof visibleStatus === "number"
										? String(visibleStatus)
										: getApiMessage(status, "Status received.")}
								</p>
							)}
						</div>
						<button
							type="button"
							onClick={() => void refreshStatus()}
							disabled={loadingStatus}
							className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">
							Refresh status
						</button>
					</div>

					<button
						type="button"
						onClick={() => void handleStart()}
						disabled={starting}
						className="mt-6 rounded-xl bg-[#C43266] px-5 py-3 font-medium text-white transition hover:bg-[#652F7B] disabled:cursor-not-allowed disabled:opacity-60">
						{starting ? "Starting..." : "Start verification"}
					</button>

					{sessionReference && (
						<form onSubmit={(event) => void handleComplete(event)} className="mt-8 space-y-5">
							<div className="space-y-2">
								<label htmlFor="verification-selfie" className="block text-sm font-medium text-gray-900">
									Choose a selfie
								</label>
								<input
									id="verification-selfie"
									type="file"
									accept="image/*"
									capture="user"
									required
									onChange={(event) => setSelfie(event.target.files?.[0] ?? null)}
									className="block w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#f8edf3] file:px-4 file:py-2 file:font-medium file:text-[#67307d]"
								/>
							</div>
							<button
								type="submit"
								disabled={!selfie || completing}
								className="rounded-xl bg-[#67307d] px-5 py-3 font-medium text-white transition hover:bg-[#512563] disabled:cursor-not-allowed disabled:opacity-60">
								{completing ? "Submitting..." : "Submit selfie"}
							</button>
						</form>
					)}

					{message && (
						<p role="status" className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
							{message}
						</p>
					)}
					{error && (
						<p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
							{error}
						</p>
					)}
				</div>
			</section>
		</>
	);
}
