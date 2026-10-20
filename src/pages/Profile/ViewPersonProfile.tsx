import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  ChefHat,
  Church,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Mars,
  Music,
  Plane,
  Ruler,
  Sparkles,
  Sun,
  User,
  Venus,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
  Star,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { Header } from "../../components/Layout";
import { getPeople, type ApiPerson } from "../../services/discoverService";
import { getPersonProfileSlug } from "../../components/PersonProfileLink";
import { getApiMessage } from "../../utils/apiMessages";
import { isCurrentUserPremium } from "../../utils/subscription";

type Icon = ComponentType<LucideProps>;

// Optional fields the new design uses. Add them to ApiPerson when the API supports them.
type ProfileExtras = {
  tagline?: string | null;
  ideal_sunday?: string | null;
  get_along?: string | null;
  isverified?: boolean | number | string | null;
};

function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // Interests may also be stored as comma-separated text.
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAge(dob: string): number | null {
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function getPreviousPageName(pathname: string): string {
  const pageNames: Record<string, string> = {
    "/discover": "Discover",
    "/share": "Share",
    "/communities": "Communities",
    "/message": "Messages",
    "/matches": "Matches",
    "/connections": "Connections",
    "/like": "Likes",
    "/swipe": "Swipe",
    "/profile": "Profile",
  };

  if (pageNames[pathname]) return pageNames[pathname];

  const pageSegment = pathname.split("/").filter(Boolean).at(-1);
  return pageSegment
    ? pageSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Previous page";
}

function getInterestIcon(interest: string): Icon {
  const key = interest.toLowerCase();
  if (/photo|camera/.test(key)) return Camera;
  if (/music|afro|beat|concert|dance|sing/.test(key)) return Music;
  if (/cook|food|bak|chef|culinary/.test(key)) return ChefHat;
  if (/travel|trip|flight|adventure/.test(key)) return Plane;
  return Sparkles;
}

function getGenderIcon(gender: string | null | undefined): Icon {
  const key = gender?.toLowerCase();
  if (key === "male") return Mars;
  if (key === "female") return Venus;
  return User;
}

function IconBubble({ icon: IconComponent }: { icon: Icon }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fdebf2] text-[#ca2e6b]">
      <IconComponent size={17} />
    </span>
  );
}

export default function ViewPersonProfile() {
  const { personSlug } = useParams();
  const location = useLocation();
  const navigationState = location.state as {
    profile?: ApiPerson;
    personId?: unknown;
    returnTo?: unknown;
  } | null;
  const passedProfile = navigationState?.profile;
  const returnTo =
    typeof navigationState?.returnTo === "string" &&
    navigationState.returnTo.startsWith("/") &&
    !navigationState.returnTo.startsWith("/people/")
      ? navigationState.returnTo
      : "/discover";
  const previousPageName = getPreviousPageName(returnTo.split(/[?#]/, 1)[0]);
  const requiresPremiumToMessage = returnTo.split(/[?#]/, 1)[0] === "/discover";
  const canMessage = !requiresPremiumToMessage || isCurrentUserPremium();
  const parsedPersonId =
    typeof navigationState?.personId === "number" ||
    (typeof navigationState?.personId === "string" &&
      navigationState.personId.trim() !== "")
      ? Number(navigationState.personId)
      : null;
  const [profile, setProfile] = useState<ApiPerson | null>(
    passedProfile &&
      (parsedPersonId === null || passedProfile.id === parsedPersonId)
      ? passedProfile
      : null,
  );
  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (profile) return;

    let active = true;
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const people = await getPeople();
        const matchingProfile = people.find(
          (person): person is ApiPerson =>
            !("isblur" in person) &&
            (parsedPersonId !== null
              ? person.id === parsedPersonId
              : getPersonProfileSlug(person.name) === personSlug),
        );

        if (!matchingProfile) {
          throw new Error("This profile could not be found.");
        }
        if (active) setProfile(matchingProfile);
      } catch (loadError) {
        if (active) setError(getApiMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, [parsedPersonId, personSlug, profile]);

  const extras = (profile ?? {}) as ProfileExtras;
  const images = parseList(profile?.images);
  const gallery = [
    ...new Set(
      [profile?.profilepicture, ...images].filter((src): src is string =>
        Boolean(src),
      ),
    ),
  ];
  const currentImage = gallery[activePhoto] ?? gallery[0];
  const showPhoto = (index: number) =>
    setActivePhoto((index + gallery.length) % gallery.length);
  const interests = parseList(profile?.yourinterest);
  const age = profile ? getAge(profile.dob) : null;
  const isVerified = Boolean(extras.isverified) && extras.isverified !== "0";
  const location_ = profile
    ? [profile.state, profile.country].filter(Boolean).join(", ")
    : "";
  const messageState = profile
    ? { person: { id: profile.id, name: profile.name, image: gallery[0] } }
    : undefined;

  const aboutItems: {
    icon: Icon;
    value: string | null | undefined;
    label: string;
  }[] = profile
    ? [
        {
          icon: getGenderIcon(profile.gender),
          value: profile.gender,
          label: "Gender",
        },
        { icon: Ruler, value: profile.height, label: "Height" },
        { icon: Church, value: profile.belief, label: "Religion" },
        {
          icon: GraduationCap,
          value: profile.education_level,
          label: "Education",
        },
        { icon: Heart, value: profile.maritalstatus, label: "Marital status" },
        { icon: Star, value: profile.zodiac_sign, label: "Zodiac sign" },
      ]
    : [];

  const promptCards: {
    icon: Icon;
    title: string;
    body: string | null | undefined;
  }[] = [
    { icon: Sun, title: "My ideal Sunday", body: extras.ideal_sunday },
    { icon: Heart, title: "We’ll get along if…", body: extras.get_along },
  ].filter((card) => Boolean(card.body));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-8">
        <Link
          to={returnTo}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#ca2e6b]"
        >
          <ArrowLeft size={16} />
          Back to {previousPageName.toLowerCase()}
        </Link>

        {loading && (
          <p className="py-16 text-center text-gray-500">Loading profile...</p>
        )}
        {!loading && error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-5 py-4 text-center text-red-600"
          >
            {error}
          </p>
        )}

        {!loading && !error && profile && (
          <>
            <section className="grid gap-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-10">
              {/* Gallery */}
              <div className="min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-gray-400">
                      No profile photo
                    </div>
                  )}

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => showPhoto(activePhoto - 1)}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => showPhoto(activePhoto + 1)}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {gallery.length > 0 && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
                      {Math.min(activePhoto, gallery.length - 1) + 1} /{" "}
                      {gallery.length}
                    </span>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-3 p-1">
                    {gallery.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActivePhoto(index)}
                        aria-label={`Show photo ${index + 1}`}
                        aria-current={index === activePhoto}
                        className={`aspect-square overflow-hidden rounded-xl bg-gray-100 transition ${
                          index === activePhoto
                            ? "ring-2 ring-[#ca2e6b] ring-offset-2"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Intro */}
              <div className="flex flex-col items-start">
                <div className="flex flex-wrap items-center gap-2">
                  {(profile.goal || profile.lookingfor) && (
                    <span className="rounded-full bg-[#fdebf2] px-3.5 py-1.5 text-xs font-medium text-[#ca2e6b]">
                      {profile.goal}
                    </span>
                  )}
                  {profile.sexual_orientation && (
                    <span className="rounded-full bg-[#fdebf2] px-3.5 py-1.5 text-xs font-medium text-[#ca2e6b]">
                      {profile.sexual_orientation}
                    </span>
                  )}
                  {profile.lookingfor && (
                    <span className="rounded-full bg-[#fdebf2] px-3.5 py-1.5 text-xs font-medium text-[#ca2e6b]">
                      {`Looking for ${profile.lookingfor}`}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 flex items-center gap-2 text-4xl font-bold text-gray-900">
                  {profile.name}
                  {age !== null && <span>, {age}</span>}
                  {isVerified && (
                    <BadgeCheck
                      size={24}
                      className="fill-blue-500 text-white"
                      aria-label="Verified"
                    />
                  )}
                </h1>

                <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={15} />
                  {location_ || "Location not provided"}
                </p>

                {extras.tagline && (
                  <p className="mt-7 max-w-md font-serif text-3xl font-bold leading-tight text-[#3b0f2a]">
                    {extras.tagline}
                  </p>
                )}

                <p className="mt-5 max-w-xl whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {profile.bio || "No introduction provided."}
                </p>

                {interests.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {interests.map((interest) => {
                      const InterestIcon = getInterestIcon(interest);
                      return (
                        <li
                          key={interest}
                          className="inline-flex items-center gap-2 rounded-full bg-[#fdebf2] px-4 py-2 text-xs font-medium text-[#ca2e6b]"
                        >
                          <InterestIcon size={14} />
                          {interest}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to={canMessage ? "/message" : "/premium"}
                    state={messageState}
                    className="inline-flex min-w-56 items-center justify-center gap-2 rounded-full bg-[#c4185a] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#ab1450]"
                  >
                    <MessageCircle size={16} />
                    {canMessage ? "Say hello" : "Upgrade to message"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLiked((value) => !value)}
                    aria-pressed={liked}
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition ${
                      liked
                        ? "border-[#c4185a] bg-[#c4185a] text-white"
                        : "border-[#c4185a] bg-white text-[#c4185a] hover:bg-[#fdebf2]"
                    }`}
                  >
                    <Heart size={16} className={liked ? "fill-current" : ""} />
                    {liked ? "Liked" : "Like"}
                  </button>
                </div>
              </div>
            </section>

            {promptCards.length > 0 && (
              <section className="mt-10 grid gap-5 md:grid-cols-2">
                {promptCards.map(({ icon, title, body }) => (
                  <article
                    key={title}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <IconBubble icon={icon} />
                      <div>
                        <h2 className="font-semibold text-gray-900">{title}</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {body}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <Link
                        to={canMessage ? "/message" : "/premium"}
                        state={messageState}
                        className="inline-flex items-center gap-2 text-xs font-medium text-[#ca2e6b]"
                      >
                        <MessageCircle size={14} />
                        Ask about this
                      </Link>
                    </div>
                  </article>
                ))}
              </section>
            )}

            <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">A little about me</h2>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
                {aboutItems.map(({ icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <IconBubble icon={icon} />
                    <div className="min-w-0">
                      <dt className="sr-only">{label}</dt>
                      <dd className="truncate text-sm font-semibold capitalize text-gray-900">
                        {value || "Not provided"}
                      </dd>
                      <dd className="text-xs text-gray-400">{label}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          </>
        )}
      </main>
    </>
  );
}
