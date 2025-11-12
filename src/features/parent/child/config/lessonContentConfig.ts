// Mock lesson content data
export const mockLessonContent: Record<
	string,
	{
		lessonNumber: number;
		lessonTitle: string;
		contents: Array<{
			id: string;
			title: string;
			subtitle: string;
			type: "video" | "document" | "quiz";
			completed: boolean;
		}>;
	}
> = {
	"1": {
		lessonNumber: 1,
		lessonTitle: "Lesson 1",
		contents: [
			{
				id: "1",
				title: "Beginning of everything",
				subtitle: "Learn about how biology began",
				type: "video",
				completed: false,
			},
			{
				id: "2",
				title: "Introduction",
				subtitle: "Learn about how biology began",
				type: "document",
				completed: false,
			},
			{
				id: "3",
				title: "Life and its characteristics",
				subtitle: "Learn about how biology began",
				type: "video",
				completed: false,
			},
			{
				id: "4",
				title: "Introduction Quiz",
				subtitle: "Lesson 1 quiz",
				type: "quiz",
				completed: true,
			},
			{
				id: "5",
				title: "Introduction",
				subtitle: "Lesson 1 assignment",
				type: "document",
				completed: true,
			},
			{
				id: "6",
				title: "Introduction",
				subtitle: "Take quiz and download the response",
				type: "document",
				completed: false,
			},
		],
	},
};
