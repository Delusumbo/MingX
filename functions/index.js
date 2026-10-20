const admin = require("firebase-admin");
const functions = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");

admin.initializeApp();

exports.sendIncomingCallPush = functions.database
	.ref("/call_notifications/{receiverId}")
	.onWrite(async (change, context) => {
		const call = change.after.val();
		const previousCall = change.before.val();

		if (
			!call ||
			call.status !== "ringing" ||
			!call.call_id ||
			previousCall?.call_id === call.call_id
		) {
			return null;
		}

		const { receiverId } = context.params;
		const tokenRef = admin.database().ref(`users/${receiverId}/fcm_token`);
		const tokenSnapshot = await tokenRef.get();
		const token = tokenSnapshot.val();

		if (typeof token !== "string" || !token.trim()) {
			logger.error("Cannot send incoming-call push: receiver has no FCM token.", {
				receiverId,
				callId: call.call_id,
			});
			return null;
		}

		const callerName =
			typeof call.caller_name === "string" && call.caller_name.trim()
				? call.caller_name.trim()
				: "MingX user";
		const data = {
			type: "incoming_call",
			status: "ringing",
			call_id: String(call.call_id),
			caller_id: String(call.caller_id ?? ""),
			caller_name: callerName,
			receiver_id: String(receiverId),
			channel_name: String(call.channel_name ?? ""),
		};

		try {
			await admin.messaging().send({
				token,
				notification: {
					title: `${callerName} is calling`,
					body: "Incoming video call",
				},
				data,
				android: {
					priority: "high",
					notification: {
						tag: String(call.call_id),
					},
				},
				apns: {
					headers: {
						"apns-priority": "10",
					},
					payload: {
						aps: {
							sound: "default",
						},
					},
				},
			});
		} catch (error) {
			if (error.code === "messaging/registration-token-not-registered") {
				const currentTokenSnapshot = await tokenRef.get();
				if (currentTokenSnapshot.val() === token) {
					await tokenRef.remove();
				}
				logger.warn("Removed an expired receiver FCM token.", {
					receiverId,
					callId: call.call_id,
				});
				return null;
			}

			logger.error("Failed to send incoming-call FCM push.", {
				receiverId,
				callId: call.call_id,
				error,
			});
			throw error;
		}

		return null;
	});
