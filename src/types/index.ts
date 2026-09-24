export interface Person {
	id: number;
	name: string;
	age: number;
	image: string;
	location: string;
	intent: string;
	match?: boolean;
	likedYou?: boolean;
}
