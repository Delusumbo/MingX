import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import { ArrowLeft, Heart, MessageCircle, Send, Trash2, X } from "lucide-react";
import Header from "../../components/Header";
import {
	addComment,
	addPost,
	deletePost as deletePostRequest,
	getComments,
	getPost,
	getPosts,
	likePost as likePostRequest,
	unlikePost as unlikePostRequest,
} from "../../services/postService";

type PostComment = {
	id: string | number;
	author: string;
	initials: string;
	content: string;
	replies: PostComment[];
};

type Post = {
	id: string | number;
	author: string;
	initials: string;
	content: string;
	category: string | null;
	createdAt: string;
	file: string | null;
	likes: number;
	likedByYou: boolean;
	comments: PostComment[];
	commentCount: number | null;
	isMine: boolean;
};

type PostOption = {
	label: string;
	icon: string;
};

type Section = "posts" | "compose";
type Toast = { message: string; kind: "success" | "error" };

const postOptions: PostOption[] = [
	{ label: "Music", icon: "boxicons:music" },
	{ label: "People", icon: "boxicons:group" },
	{ label: "Location", icon: "boxicons:map" },
	{ label: "Feelings", icon: "boxicons:happy" },
];

function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function firstValue(record: Record<string, unknown>, ...keys: string[]): unknown {
	for (const key of keys) {
		if (record[key] !== undefined && record[key] !== null) return record[key];
	}
	return undefined;
}

function textValue(value: unknown, fallback = ""): string {
	return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function booleanValue(value: unknown): boolean {
	return (
		value === true ||
		value === 1 ||
		(typeof value === "string" && ["true", "1", "yes"].includes(value.toLowerCase()))
	);
}

function unwrapResponse(value: unknown): unknown {
	let current = value;
	for (let depth = 0; depth < 2; depth++) {
		const record = asRecord(current);
		if (!record || record.data === undefined) break;
		current = record.data;
	}
	return current;
}

function responseItems(value: unknown, ...keys: string[]): unknown[] {
	const unwrapped = unwrapResponse(value);
	if (Array.isArray(unwrapped)) return unwrapped;
	const record = asRecord(unwrapped);
	if (!record) throw new Error("The posts API returned an unexpected response.");
	for (const key of keys) {
		const items = record[key];
		if (Array.isArray(items)) return items;
		if (asRecord(items)) return [items];
	}
	return [unwrapped];
}

function initials(name: string): string {
	return (
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0].toUpperCase())
			.join("") || "?"
	);
}

function normalizeComment(value: unknown, fallbackId: string | number): PostComment {
	const record = asRecord(value) ?? {};
	const authorRecord = asRecord(firstValue(record, "user", "author"));
	const author =
		textValue(firstValue(record, "author_name", "name", "author")) ||
		textValue(firstValue(authorRecord ?? {}, "name", "username"), "Member");
	const childComments = firstValue(record, "replies", "children", "comments");
	const commentId = firstValue(record, "id", "comment_id");

	return {
		id: typeof commentId === "string" || typeof commentId === "number" ? commentId : fallbackId,
		author,
		initials: initials(author),
		content: textValue(firstValue(record, "content", "comment")),
		replies: Array.isArray(childComments)
			? childComments.map((reply, index) => normalizeComment(reply, `${fallbackId}-${index}`))
			: [],
	};
}

function normalizeComments(value: unknown): PostComment[] {
	const records = responseItems(value, "comments", "comment", "items");
	const comments = records.map((comment, index) => normalizeComment(comment, index));
	const commentsById = new Map(comments.map((comment) => [String(comment.id), comment]));
	const roots: PostComment[] = [];

	records.forEach((rawComment, index) => {
		const record = asRecord(rawComment);
		const parentId = record && firstValue(record, "parent_id", "parentId");
		const comment = comments[index];
		const parent = parentId === undefined ? undefined : commentsById.get(String(parentId));

		if (parent && parent !== comment) {
			parent.replies.push(comment);
		} else {
			roots.push(comment);
		}
	});

	return roots;
}

function getCurrentUserId(): string | null {
	try {
		const user = localStorage.getItem("user");
		if (!user) return null;
		const record = asRecord(JSON.parse(user));
		const id = record && firstValue(record, "id", "user_id");
		return id === undefined ? null : String(id);
	} catch {
		return null;
	}
}

function normalizePost(value: unknown, previousPost?: Post): Post {
	const record = asRecord(value);
	if (!record) throw new Error("The posts API returned an invalid post.");

	const id = firstValue(record, "id", "post_id");
	if (typeof id !== "string" && typeof id !== "number") {
		throw new Error("A post returned by the API is missing its ID.");
	}
	const authorRecord = asRecord(firstValue(record, "user", "author"));
	const author =
		textValue(firstValue(record, "author_name", "name", "author")) ||
		textValue(firstValue(authorRecord ?? {}, "name", "username"), "Member");
	const ownerId =
		firstValue(record, "user_id", "author_id") ?? firstValue(authorRecord ?? {}, "id");
	const currentUserId = getCurrentUserId();
	const rawLikes = firstValue(record, "likes_count", "like_count", "likes");
	const likeStatus = firstValue(record, "liked_by_user", "is_liked", "liked");
	const likeCount =
		rawLikes === undefined
			? (previousPost?.likes ?? 0)
			: Array.isArray(rawLikes)
				? rawLikes.length
				: Number(rawLikes);
	const likedByYou =
		likeStatus !== undefined
			? booleanValue(likeStatus)
			: Array.isArray(rawLikes) && currentUserId !== null
				? rawLikes.some((like) => {
						const likeRecord = asRecord(like);
						return (
							likeRecord !== null &&
							String(firstValue(likeRecord, "user_id", "userId")) === currentUserId
						);
					})
				: (previousPost?.likedByYou ?? false);
	const image = firstValue(record, "file_url", "file", "image", "image_url");
	const fileUrl =
		textValue(image) || textValue(firstValue(asRecord(image) ?? {}, "url", "path", "file_url"));
	const rawComments = firstValue(record, "comments");
	const rawCommentCount = firstValue(
		record,
		"comments_count",
		"comment_count",
		"total_comments",
		"commentsCount",
	);
	const parsedCommentCount =
		typeof rawCommentCount === "number" ||
		(typeof rawCommentCount === "string" && rawCommentCount.trim() !== "")
			? Number(rawCommentCount)
			: null;
	const commentCount =
		parsedCommentCount !== null && Number.isFinite(parsedCommentCount)
			? parsedCommentCount
			: Array.isArray(rawComments)
				? countComments(normalizeComments(rawComments))
				: (previousPost?.commentCount ?? null);

	return {
		id,
		author,
		initials: initials(author),
		content: textValue(firstValue(record, "content", "post")),
		category: textValue(firstValue(record, "Thought", "thought", "category")) || null,
		createdAt: textValue(firstValue(record, "created_at", "createdAt"), new Date().toISOString()),
		file: fileUrl || null,
		likes: Number.isFinite(likeCount) ? likeCount : 0,
		likedByYou,
		comments: normalizeComments(rawComments ?? []),
		commentCount,
		isMine:
			record.is_mine === true ||
			(currentUserId !== null && ownerId !== undefined && String(ownerId) === currentUserId),
	};
}

function formatPostDate(date: string) {
	const parsedDate = new Date(date);
	if (Number.isNaN(parsedDate.getTime())) return "Recently";

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(parsedDate);
}

function countComments(comments: PostComment[]): number {
	return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0);
}

export default function Share() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [section, setSection] = useState<Section>("posts");
	const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null);
	const [content, setContent] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [commentDraft, setCommentDraft] = useState("");
	const [replyDraft, setReplyDraft] = useState("");
	const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
	const [loading, setLoading] = useState(true);
	const [detailLoading, setDetailLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [busyPostId, setBusyPostId] = useState<string | number | null>(null);
	const [toast, setToast] = useState<Toast | null>(null);

	const selectedPost = posts.find((post) => String(post.id) === String(selectedPostId)) ?? null;
	const showToast = useCallback(
		(message: string, kind: Toast["kind"]) => setToast({ message, kind }),
		[],
	);

	const loadPosts = useCallback(async () => {
		setLoading(true);
		setError("");

		try {
			const response = await getPosts();
			const loadedPosts = responseItems(response, "posts", "items").map((post) =>
				normalizePost(post),
			);
			setPosts(loadedPosts);
			setLoading(false);

			const postsNeedingCounts = loadedPosts.filter((post) => post.commentCount === null);
			const commentResults = await Promise.allSettled(
				postsNeedingCounts.map(async (post) => ({
					postId: post.id,
					comments: normalizeComments(await getComments(post.id)),
				})),
			);
			let failedCount = false;
			for (const result of commentResults) {
				if (result.status === "rejected") {
					failedCount = true;
					continue;
				}

				const { postId, comments } = result.value;
				setPosts((currentPosts) =>
					currentPosts.map((post) =>
						String(post.id) === String(postId)
							? { ...post, commentCount: countComments(comments) }
							: post,
					),
				);
			}
			if (failedCount) {
				showToast("Unable to load comment counts for some posts.", "error");
			}
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load posts.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadPosts();
	}, [loadPosts]);

	useEffect(() => {
		if (!toast) return;
		const timeout = window.setTimeout(() => setToast(null), 3500);
		return () => window.clearTimeout(timeout);
	}, [toast]);

	const updatePost = (postId: string | number, update: (post: Post) => Post) => {
		setPosts((currentPosts) =>
			currentPosts.map((post) => (String(post.id) === String(postId) ? update(post) : post)),
		);
	};

	const refreshComments = async (postId: string | number) => {
		const response = await getComments(postId);
		const comments = normalizeComments(response);
		setPosts((currentPosts) =>
			currentPosts.map((post) =>
				String(post.id) === String(postId)
					? { ...post, comments, commentCount: countComments(comments) }
					: post,
			),
		);
	};

	const handleOpenPost = async (postId: string | number) => {
		const previousPost = posts.find((post) => String(post.id) === String(postId));
		setSelectedPostId(postId);
		setDetailLoading(true);

		try {
			const [postResponse, commentsResponse] = await Promise.all([
				getPost(postId),
				getComments(postId),
			]);
			const postData = responseItems(postResponse, "post", "posts")[0];
			const post = normalizePost(postData, previousPost);
			post.comments = normalizeComments(commentsResponse);
			post.commentCount = countComments(post.comments);
			setPosts((currentPosts) => [
				post,
				...currentPosts.filter((currentPost) => String(currentPost.id) !== String(post.id)),
			]);
		} catch (loadError) {
			showToast(
				loadError instanceof Error ? loadError.message : "Unable to load this post.",
				"error",
			);
		} finally {
			setDetailLoading(false);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const trimmedContent = content.trim();
		if (!selectedOption || !trimmedContent || !file || saving) return;

		setSaving(true);
		try {
			await addPost(selectedOption, trimmedContent, file);
			setContent("");
			setFile(null);
			form.reset();
			setSelectedOption(null);
			setSection("posts");
			await loadPosts();
			showToast("Post created.", "success");
		} catch (submitError) {
			showToast(
				submitError instanceof Error ? submitError.message : "Unable to create post.",
				"error",
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDeletePost = async (post: Post) => {
		if (!post.isMine || busyPostId !== null) return;

		setBusyPostId(post.id);
		try {
			await deletePostRequest(post.id);
			setPosts((currentPosts) =>
				currentPosts.filter((currentPost) => String(currentPost.id) !== String(post.id)),
			);
			if (String(selectedPostId) === String(post.id)) setSelectedPostId(null);
			showToast("Post deleted.", "success");
		} catch (deleteError) {
			showToast(
				deleteError instanceof Error ? deleteError.message : "Unable to delete post.",
				"error",
			);
		} finally {
			setBusyPostId(null);
		}
	};

	const handleLike = async (post: Post) => {
		setBusyPostId(post.id);
		try {
			if (post.likedByYou) {
				await unlikePostRequest(post.id);
			} else {
				await likePostRequest(post.id);
			}
			updatePost(post.id, (currentPost) => ({
				...currentPost,
				likedByYou: !currentPost.likedByYou,
				likes: Math.max(0, currentPost.likes + (currentPost.likedByYou ? -1 : 1)),
			}));
			showToast(post.likedByYou ? "Like removed." : "Post liked.", "success");
		} catch (likeError) {
			showToast(likeError instanceof Error ? likeError.message : "Unable to update like.", "error");
		} finally {
			setBusyPostId(null);
		}
	};

	const handleAddComment = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedContent = commentDraft.trim();
		if (!selectedPost || !trimmedContent) return;

		setBusyPostId(selectedPost.id);
		try {
			await addComment(selectedPost.id, trimmedContent);
			setCommentDraft("");
		} catch (commentError) {
			showToast(
				commentError instanceof Error ? commentError.message : "Unable to add comment.",
				"error",
			);
			setBusyPostId(null);
			return;
		}

		try {
			await refreshComments(selectedPost.id);
			showToast("Comment added.", "success");
		} catch (refreshError) {
			showToast(
				refreshError instanceof Error
					? `Comment posted, but comments could not be refreshed: ${refreshError.message}`
					: "Comment posted, but comments could not be refreshed.",
				"error",
			);
		} finally {
			setBusyPostId(null);
		}
	};

	const handleReply = async (event: FormEvent<HTMLFormElement>, commentId: string | number) => {
		event.preventDefault();
		const trimmedContent = replyDraft.trim();
		if (!selectedPost || !trimmedContent) return;

		setBusyPostId(selectedPost.id);
		try {
			await addComment(selectedPost.id, trimmedContent, commentId);
			setReplyDraft("");
			setReplyingTo(null);
		} catch (replyError) {
			showToast(replyError instanceof Error ? replyError.message : "Unable to add reply.", "error");
			setBusyPostId(null);
			return;
		}

		try {
			await refreshComments(selectedPost.id);
			showToast("Reply added.", "success");
		} catch (refreshError) {
			showToast(
				refreshError instanceof Error
					? `Reply posted, but comments could not be refreshed: ${refreshError.message}`
					: "Reply posted, but comments could not be refreshed.",
				"error",
			);
		} finally {
			setBusyPostId(null);
		}
	};

	const renderComments = (comments: PostComment[], depth = 0) =>
		comments.map((comment) => (
			<div key={comment.id} className={depth > 0 ? "ml-8 border-l-2 border-[#f3e5ef] pl-4" : ""}>
				<div className="flex gap-3 py-4">
					<div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f7eaf1] text-sm font-bold text-[#67307d]">
						{comment.initials}
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-semibold text-gray-900">{comment.author}</p>
						<p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
							{comment.content}
						</p>
						<button
							type="button"
							onClick={() => {
								setReplyingTo(replyingTo === comment.id ? null : comment.id);
								setReplyDraft("");
							}}
							className="mt-2 text-xs font-semibold text-[#67307d] hover:text-[#ca2e6b]">
							{replyingTo === comment.id ? "Cancel reply" : "Reply"}
						</button>
						{replyingTo === comment.id && (
							<form
								onSubmit={(event) => handleReply(event, comment.id)}
								className="mt-3 flex gap-2">
								<input
									autoFocus
									value={replyDraft}
									onChange={(event) => setReplyDraft(event.target.value)}
									aria-label={`Reply to ${comment.author}`}
									placeholder="Write a reply..."
									disabled={String(busyPostId) === String(selectedPostId)}
									className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#67307d]"
								/>
								<button
									type="submit"
									disabled={!replyDraft.trim() || String(busyPostId) === String(selectedPostId)}
									aria-label="Send reply"
									className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#67307d] text-white disabled:opacity-40">
									<Send size={16} />
								</button>
							</form>
						)}
					</div>
				</div>
				{comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
			</div>
		));

	return (
		<main className="min-h-screen bg-[#f7f7f7]">
			<Header />
			{toast && (
				<div
					role={toast.kind === "error" ? "alert" : "status"}
					className={`fixed right-5 top-20 z-50 flex max-w-sm items-center gap-4 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
						toast.kind === "success" ? "bg-[#45845b]" : "bg-red-600"
					}`}>
					<span>{toast.message}</span>
					<button
						type="button"
						onClick={() => setToast(null)}
						aria-label="Dismiss notification"
						className="ml-auto shrink-0 rounded p-1 hover:bg-white/15">
						<X size={16} />
					</button>
				</div>
			)}
			<div className="mx-auto min-h-[calc(100vh-76px)] max-w-262 px-5 pb-24 pt-8 md:px-8 lg:px-10 lg:pb-10">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-[#67307d] md:text-[32px]">Share</h1>
					<p className="mt-1 max-w-142.5 text-sm font-medium leading-5 text-gray-700">
						Share moments, join conversations, and connect with your community.
					</p>
				</div>

				{selectedPostId !== null ? (
					<section className="rounded-[20px] bg-white p-5 shadow-sm md:p-8">
						<button
							type="button"
							onClick={() => {
								setSelectedPostId(null);
								setReplyingTo(null);
							}}
							className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#67307d] hover:text-[#ca2e6b]">
							<ArrowLeft size={17} />
							All posts
						</button>

						{detailLoading && !selectedPost && (
							<p className="py-12 text-center text-sm text-gray-500">Loading post...</p>
						)}
						{!detailLoading && !selectedPost && (
							<p className="py-8 text-center text-sm text-gray-500">
								This post could not be loaded.
							</p>
						)}

						{selectedPost && (
							<>
								<article>
									<PostHeader
										post={selectedPost}
										onDelete={handleDeletePost}
										busy={String(busyPostId) === String(selectedPost.id)}
									/>
									{selectedPost.file && (
										<img
											src={selectedPost.file}
											alt=""
											className="mt-5 max-h-120 w-full rounded-xl object-cover"
										/>
									)}
									<p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
										{selectedPost.content}
									</p>
									<PostActions
										post={selectedPost}
										onLike={handleLike}
										onViewComments={() =>
											document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })
										}
										busy={String(busyPostId) === String(selectedPost.id)}
									/>
								</article>

								<div id="comments" className="mt-7 border-t border-gray-100 pt-6">
									<h2 className="text-lg font-bold text-gray-900">
										Comments{" "}
										<span className="text-gray-400">({countComments(selectedPost.comments)})</span>
									</h2>
									{selectedPost.comments.length === 0 ? (
										<p className="py-6 text-sm text-gray-500">
											No comments yet. Start the conversation.
										</p>
									) : (
										<div className="divide-y divide-gray-100">
											{renderComments(selectedPost.comments)}
										</div>
									)}
									<form onSubmit={handleAddComment} className="mt-5 flex gap-2">
										<input
											value={commentDraft}
											onChange={(event) => setCommentDraft(event.target.value)}
											aria-label="Write a comment"
											placeholder="Write a comment..."
											disabled={String(busyPostId) === String(selectedPost.id)}
											className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#67307d]"
										/>
										<button
											type="submit"
											disabled={
												!commentDraft.trim() || String(busyPostId) === String(selectedPost.id)
											}
											className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
											<Send size={16} />
											<span className="hidden sm:inline">Comment</span>
										</button>
									</form>
								</div>
							</>
						)}
					</section>
				) : (
					<>
						<div className="mb-6 flex flex-wrap items-center gap-3 border-b border-gray-200">
							<button
								type="button"
								onClick={() => setSection("posts")}
								className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
									section === "posts"
										? "border-[#ca2e6b] text-[#ca2e6b]"
										: "border-transparent text-gray-500 hover:text-gray-800"
								}`}>
								All posts
							</button>
							<button
								type="button"
								onClick={() => setSection("compose")}
								className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
									section === "compose"
										? "border-[#ca2e6b] text-[#ca2e6b]"
										: "border-transparent text-gray-500 hover:text-gray-800"
								}`}>
								Create post
							</button>
							{section === "posts" && (
								<button
									type="button"
									onClick={() => setSection("compose")}
									className="ml-auto inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
									<Icon icon="boxicons:plus" width="20" height="20" />
									New post
								</button>
							)}
						</div>

						{section === "compose" ? (
							<form
								onSubmit={handleSubmit}
								className="rounded-[20px] bg-white px-6 py-8 shadow-sm md:px-9 md:py-10">
								<h2 className="text-xl font-bold text-gray-900">Create a post</h2>
								<p className="mt-1 text-sm text-gray-500">
									Turn your ideas into conversations and moments that matter.
								</p>

								<fieldset className="mt-6">
									<legend className="mb-3 text-sm font-medium text-gray-700">
										Thought <span className="text-[#ca2e6b]">*</span>
									</legend>
									<div className="flex flex-wrap items-center gap-3">
										{postOptions.map((option) => {
											const isSelected = selectedOption === option.label;
											return (
												<button
													key={option.label}
													type="button"
													onClick={() => setSelectedOption(isSelected ? null : option.label)}
													aria-pressed={isSelected}
													className={`flex h-10 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition-all ${
														isSelected
															? "border-[#67307d] text-[#67307d]"
															: "border-[#ca2e6b] text-gray-500 hover:border-[#67307d]"
													}`}>
													<Icon
														icon={option.icon}
														width="18"
														height="18"
														className="text-[#67307d]"
													/>
													<span>{option.label}</span>
												</button>
											);
										})}
									</div>
									{!selectedOption && (
										<p className="mt-2 text-xs text-gray-500">Select a thought to continue.</p>
									)}
								</fieldset>

								<textarea
									value={content}
									onChange={(event) => setContent(event.target.value)}
									placeholder="What’s on your mind?"
									aria-label="Post text"
									className="mt-6 h-46 w-full resize-y rounded-[18px] border-none bg-[#fcf5f8] px-5 py-5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ca2e6b]/20"
								/>
								<label className="mt-5 block text-sm font-medium text-gray-700">
									Post image or file <span className="text-[#ca2e6b]">*</span>
									<input
										type="file"
										required
										onChange={(event) => setFile(event.target.files?.[0] ?? null)}
										className="mt-2 block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#f9e8ef] file:px-4 file:py-2 file:font-semibold file:text-[#67307d]"
									/>
								</label>
								<div className="mt-5 flex justify-end">
									<button
										type="submit"
										disabled={!selectedOption || !content.trim() || !file || saving}
										className="rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
										{saving ? "Posting..." : "Post"}
									</button>
								</div>
							</form>
						) : loading ? (
							<div className="rounded-[20px] bg-white px-6 py-16 text-center text-sm text-gray-500 shadow-sm">
								Loading posts...
							</div>
						) : error ? (
							<div
								role="alert"
								className="rounded-xl bg-red-50 px-5 py-4 text-center text-sm text-red-700">
								<p>{error}</p>
								<button
									type="button"
									onClick={() => void loadPosts()}
									className="mt-3 font-semibold underline">
									Try again
								</button>
							</div>
						) : posts.length === 0 ? (
							<div className="rounded-[20px] bg-white px-6 py-16 text-center shadow-sm">
								<p className="text-lg font-semibold text-gray-800">No posts yet</p>
								<p className="mt-2 text-sm text-gray-500">
									Be the first to share something with your community.
								</p>
								<button
									type="button"
									onClick={() => setSection("compose")}
									className="mt-5 rounded-xl bg-[#67307d] px-5 py-3 text-sm font-semibold text-white">
									Create a post
								</button>
							</div>
						) : (
							<div className="space-y-5">
								{posts.map((post) => (
									<article key={post.id} className="rounded-[20px] bg-white p-5 shadow-sm md:p-7">
										<PostHeader
											post={post}
											onDelete={handleDeletePost}
											busy={String(busyPostId) === String(post.id)}
										/>
										{post.file && (
											<img
												src={post.file}
												alt=""
												className="mt-5 max-h-120 w-full rounded-xl object-cover"
											/>
										)}
										<p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
											{post.content}
										</p>
										{post.category && (
											<span className="mt-4 inline-flex rounded-full bg-[#f9e8ef] px-3 py-1 text-xs font-semibold text-[#67307d]">
												{post.category}
											</span>
										)}
										<PostActions
											post={post}
											onLike={handleLike}
											onViewComments={() => void handleOpenPost(post.id)}
											busy={String(busyPostId) === String(post.id)}
										/>
										<button
											type="button"
											onClick={() => void handleOpenPost(post.id)}
											className="mt-4 text-sm font-semibold text-[#67307d] hover:text-[#ca2e6b]">
											View post
										</button>
									</article>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</main>
	);
}

function PostHeader({
	post,
	onDelete,
	busy = false,
}: {
	post: Post;
	onDelete: (post: Post) => void;
	busy?: boolean;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#ca2e6b] to-[#67307d] text-sm font-bold text-white">
				{post.initials}
			</div>
			<div className="min-w-0 flex-1">
				<p className="font-semibold text-gray-900">{post.author}</p>
				<p className="mt-0.5 text-xs text-gray-500">{formatPostDate(post.createdAt)}</p>
			</div>
			{post.isMine && (
				<button
					type="button"
					onClick={() => onDelete(post)}
					disabled={busy}
					aria-label="Delete post"
					title="Delete post"
					className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40">
					<Trash2 size={17} />
				</button>
			)}
		</div>
	);
}

function PostActions({
	post,
	onLike,
	onViewComments,
	busy = false,
}: {
	post: Post;
	onLike: (post: Post) => void;
	onViewComments: () => void;
	busy?: boolean;
}) {
	return (
		<div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4">
			<button
				type="button"
				onClick={() => onLike(post)}
				disabled={busy}
				aria-pressed={post.likedByYou}
				className={`inline-flex items-center gap-2 text-sm font-medium transition ${
					post.likedByYou ? "text-[#ca2e6b]" : "text-gray-500 hover:text-[#ca2e6b]"
				}`}>
				<Heart size={18} fill={post.likedByYou ? "currentColor" : "none"} />
				<span>{post.likedByYou ? "Unlike" : "Like"}</span>
				<span>{post.likes}</span>
			</button>
			<button
				type="button"
				onClick={onViewComments}
				disabled={busy}
				className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#67307d]">
				<MessageCircle size={18} />
				<span>Comments</span>
				<span>{post.commentCount ?? "..."}</span>
			</button>
		</div>
	);
}
