import { useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import { ArrowLeft, Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import Header from "../../components/Header";

type PostComment = {
	id: number;
	author: string;
	initials: string;
	content: string;
	replies: PostComment[];
};

type Post = {
	id: number;
	author: string;
	initials: string;
	content: string;
	category: string | null;
	createdAt: string;
	likes: number;
	likedByYou: boolean;
	comments: PostComment[];
	isMine: boolean;
};

type PostOption = {
	label: string;
	icon: string;
};

type Section = "posts" | "compose";

const postOptions: PostOption[] = [
	{ label: "Music", icon: "boxicons:music" },
	{ label: "People", icon: "boxicons:group" },
	{ label: "Location", icon: "boxicons:map" },
	{ label: "Feelings", icon: "boxicons:happy" },
];

const initialPosts: Post[] = [
	{
		id: 1,
		author: "You",
		initials: "Y",
		content: "A little reminder to make room for the things that make you happy.",
		category: "Feelings",
		createdAt: "2026-09-30T10:30:00.000Z",
		likes: 3,
		likedByYou: false,
		isMine: true,
		comments: [
			{
				id: 11,
				author: "Maya Johnson",
				initials: "MJ",
				content: "Needed this reminder today!",
				replies: [
					{
						id: 12,
						author: "You",
						initials: "Y",
						content: "I'm glad it found you at the right time.",
						replies: [],
					},
				],
			},
		],
	},
	{
		id: 2,
		author: "Daniel Okafor",
		initials: "DO",
		content: "Found a great new playlist for slow Sunday mornings. What have you all been listening to?",
		category: "Music",
		createdAt: "2026-09-29T14:15:00.000Z",
		likes: 8,
		likedByYou: true,
		isMine: false,
		comments: [
			{
				id: 21,
				author: "Amina Bello",
				initials: "AB",
				content: "Afrobeats and a good cup of tea, always.",
				replies: [],
			},
		],
	},
];

function formatPostDate(date: string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(date));
}

function countComments(comments: PostComment[]): number {
	return comments.reduce(
		(total, comment) => total + 1 + countComments(comment.replies),
		0,
	);
}

export default function Share() {
	const [posts, setPosts] = useState<Post[]>(initialPosts);
	const [section, setSection] = useState<Section>("posts");
	const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
	const [content, setContent] = useState("");
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [commentDraft, setCommentDraft] = useState("");
	const [replyDraft, setReplyDraft] = useState("");
	const [replyingTo, setReplyingTo] = useState<number | null>(null);

	const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;

	const updatePost = (postId: number, update: (post: Post) => Post) => {
		setPosts((currentPosts) =>
			currentPosts.map((post) => (post.id === postId ? update(post) : post)),
		);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedContent = content.trim();
		if (!trimmedContent) return;

		setPosts((currentPosts) => [
			{
				id: Date.now(),
				author: "You",
				initials: "Y",
				content: trimmedContent,
				category: selectedOption,
				createdAt: new Date().toISOString(),
				likes: 0,
				likedByYou: false,
				comments: [],
				isMine: true,
			},
			...currentPosts,
		]);
		setContent("");
		setSelectedOption(null);
		setSection("posts");
	};

	const handleDeletePost = (post: Post) => {
		if (!window.confirm("Delete this post? This cannot be undone.")) return;

		setPosts((currentPosts) => currentPosts.filter((currentPost) => currentPost.id !== post.id));
		if (selectedPostId === post.id) setSelectedPostId(null);
	};

	const handleLike = (post: Post) => {
		updatePost(post.id, (currentPost) => ({
			...currentPost,
			likedByYou: !currentPost.likedByYou,
			likes: currentPost.likes + (currentPost.likedByYou ? -1 : 1),
		}));
	};

	const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedContent = commentDraft.trim();
		if (!selectedPost || !trimmedContent) return;

		updatePost(selectedPost.id, (post) => ({
			...post,
			comments: [
				...post.comments,
				{
					id: Date.now(),
					author: "You",
					initials: "Y",
					content: trimmedContent,
					replies: [],
				},
			],
		}));
		setCommentDraft("");
	};

	const handleReply = (event: FormEvent<HTMLFormElement>, commentId: number) => {
		event.preventDefault();
		const trimmedContent = replyDraft.trim();
		if (!selectedPost || !trimmedContent) return;

		const reply: PostComment = {
			id: Date.now(),
			author: "You",
			initials: "Y",
			content: trimmedContent,
			replies: [],
		};
		const appendReply = (comments: PostComment[]): PostComment[] =>
			comments.map((comment) =>
				comment.id === commentId
					? { ...comment, replies: [...comment.replies, reply] }
					: { ...comment, replies: appendReply(comment.replies) },
			);

		updatePost(selectedPost.id, (post) => ({
			...post,
			comments: appendReply(post.comments),
		}));
		setReplyDraft("");
		setReplyingTo(null);
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
									className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#67307d]"
								/>
								<button
									type="submit"
									disabled={!replyDraft.trim()}
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
			<div className="mx-auto min-h-[calc(100vh-76px)] max-w-262 px-5 pb-24 pt-8 md:px-8 lg:px-10 lg:pb-10">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-[#67307d] md:text-[32px]">Share</h1>
					<p className="mt-1 max-w-142.5 text-sm font-medium leading-5 text-gray-700">
						Share moments, join conversations, and connect with your community.
					</p>
				</div>

				{selectedPost ? (
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

						<article>
							<PostHeader post={selectedPost} onDelete={handleDeletePost} />
							<p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
								{selectedPost.content}
							</p>
							<PostActions
								post={selectedPost}
								onLike={handleLike}
								onViewComments={() =>
									document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })
								}
							/>
						</article>

						<div id="comments" className="mt-7 border-t border-gray-100 pt-6">
							<h2 className="text-lg font-bold text-gray-900">
								Comments{" "}
								<span className="text-gray-400">({countComments(selectedPost.comments)})</span>
							</h2>
							{selectedPost.comments.length === 0 ? (
								<p className="py-6 text-sm text-gray-500">No comments yet. Start the conversation.</p>
							) : (
								<div className="divide-y divide-gray-100">{renderComments(selectedPost.comments)}</div>
							)}
							<form onSubmit={handleAddComment} className="mt-5 flex gap-2">
								<input
									value={commentDraft}
									onChange={(event) => setCommentDraft(event.target.value)}
									aria-label="Write a comment"
									placeholder="Write a comment..."
									className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#67307d]"
								/>
								<button
									type="submit"
									disabled={!commentDraft.trim()}
									className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
									<Send size={16} />
									<span className="hidden sm:inline">Comment</span>
								</button>
							</form>
						</div>
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

								<div className="mt-6 flex flex-wrap items-center gap-3">
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
												<Icon icon={option.icon} width="18" height="18" className="text-[#67307d]" />
												<span>{option.label}</span>
											</button>
										);
									})}
								</div>

								<textarea
									value={content}
									onChange={(event) => setContent(event.target.value)}
									placeholder="What’s on your mind?"
									aria-label="Post text"
									className="mt-6 h-46 w-full resize-y rounded-[18px] border-none bg-[#fcf5f8] px-5 py-5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ca2e6b]/20"
								/>
								<div className="mt-5 flex justify-end">
									<button
										type="submit"
										disabled={!content.trim()}
										className="rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
										Post
									</button>
								</div>
							</form>
						) : posts.length === 0 ? (
							<div className="rounded-[20px] bg-white px-6 py-16 text-center shadow-sm">
								<p className="text-lg font-semibold text-gray-800">No posts yet</p>
								<p className="mt-2 text-sm text-gray-500">Be the first to share something with your community.</p>
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
										<PostHeader post={post} onDelete={handleDeletePost} />
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
											onViewComments={() => setSelectedPostId(post.id)}
										/>
										<button
											type="button"
											onClick={() => setSelectedPostId(post.id)}
											className="mt-4 text-sm font-semibold text-[#67307d] hover:text-[#ca2e6b]">
											View post
										</button>
									</article>
								))}
							</div>
						)}
						<p className="mt-6 text-center text-xs text-gray-400">
							Preview mode: changes are saved only while this page is open.
						</p>
					</>
				)}
			</div>
		</main>
	);
}

function PostHeader({ post, onDelete }: { post: Post; onDelete: (post: Post) => void }) {
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
					aria-label="Delete post"
					title="Delete post"
					className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600">
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
}: {
	post: Post;
	onLike: (post: Post) => void;
	onViewComments: () => void;
}) {
	return (
		<div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4">
			<button
				type="button"
				onClick={() => onLike(post)}
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
				className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#67307d]">
				<MessageCircle size={18} />
				<span>Comments</span>
				<span>{countComments(post.comments)}</span>
			</button>
		</div>
	);
}
