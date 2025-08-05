import { Notification } from './notification.types';

export const mockNotifications: Notification[] = [
	{
		id: '1',
		title: 'New sign in to your account',
		message: 'You recently signed into your account.',
		timestamp: 'now',
		isRead: false,
		type: 'sign_in',
		user: {
			name: 'Gabriel Davidson',
		},
	},
	{
		id: '2',
		title: 'New sign in to your account',
		message: 'You recently signed into your account.',
		timestamp: '5 mins ago',
		isRead: false,
		type: 'sign_in',
		user: {
			name: 'Gabriel Davidson',
		},
	},
	{
		id: '3',
		title: 'New sign in to your account',
		message: 'You recently signed into your account.',
		timestamp: '5 mins ago',
		isRead: true,
		type: 'sign_in',
		user: {
			name: 'Gabriel Davidson',
		},
	},
	{
		id: '4',
		title: 'File uploaded',
		message: 'uploaded a new file',
		timestamp: '2 days ago',
		isRead: true,
		type: 'file_upload',
		user: {
			name: 'Mr Joe',
		},
		metadata: {
			fileName: 'Biology',
		},
	},
	{
		id: '5',
		title: 'File uploaded',
		message: 'uploaded a new file',
		timestamp: '2 days ago',
		isRead: true,
		type: 'file_upload',
		user: {
			name: 'Mr Joe',
		},
		metadata: {
			fileName: 'Biology',
		},
	},
];

export const getRecentNotifications = (): Notification[] => {
	return mockNotifications.slice(0, 2);
};

export const getUnreadCount = (): number => {
	return mockNotifications.filter(n => !n.isRead).length;
};