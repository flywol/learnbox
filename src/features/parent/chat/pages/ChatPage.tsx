import { useState } from "react";
import { Search, Send, Mic, Paperclip } from "lucide-react";

interface Contact {
	id: string;
	name: string;
	avatar: string;
	lastMessage: string;
	timestamp: string;
	unread: boolean;
}

interface Message {
	id: string;
	sender: "me" | "them";
	text?: string;
	image?: string;
	timestamp: string;
}

const mockContacts: Contact[] = [
	{
		id: "1",
		name: "Mr Akinola",
		avatar: "👨‍🏫",
		lastMessage: "You have uploaded a new document",
		timestamp: "5 mins ago",
		unread: true,
	},
	{
		id: "2",
		name: "Mr Akinola",
		avatar: "👨‍🏫",
		lastMessage: "There will be a new chapter",
		timestamp: "9 mins ago",
		unread: false,
	},
	{
		id: "3",
		name: "Mr Akinola",
		avatar: "👨‍🏫",
		lastMessage: "There will be a new chapter",
		timestamp: "9 mins ago",
		unread: false,
	},
	{
		id: "4",
		name: "Mr Akinola",
		avatar: "👨‍🏫",
		lastMessage: "It is time to start the test",
		timestamp: "9 mins ago",
		unread: false,
	},
	{
		id: "5",
		name: "Mr Akinola",
		avatar: "👨‍🏫",
		lastMessage: "Biology",
		timestamp: "9 mins ago",
		unread: false,
	},
];

const mockMessages: Message[] = [
	{
		id: "1",
		sender: "them",
		text: "Lorem ipsum dolor sit amet consectetur adipiscing elit, Purus habitasse dui ac eget conse ctetur gravida duis commodo psuere odio tincidunt.",
		timestamp: "Friday 11:30am",
	},
	{
		id: "2",
		sender: "me",
		text: "Lorem ipsum dolor sit amet",
		timestamp: "Friday 11:32am",
	},
	{
		id: "3",
		sender: "them",
		text: "Lorem ipsum dolor sit amet consectetur adipiscing",
		timestamp: "Friday 11:35am",
	},
	{
		id: "4",
		sender: "me",
		image: "🖼️",
		timestamp: "Friday 11:40am",
	},
	{
		id: "5",
		sender: "them",
		text: "Lorem ipsum dolor sit amet consectetur adipiscing elit purus habitasse.",
		timestamp: "Friday 11:42am",
	},
];

export default function ChatPage() {
	const [selectedContact, setSelectedContact] = useState<Contact>(
		mockContacts[0]
	);
	const [message, setMessage] = useState("");

	return (
		<div className="flex h-[calc(100vh-200px)] gap-4">
			{/* Contacts Sidebar */}
			<div className="w-80 bg-white rounded-lg border border-gray-200 flex flex-col">
				{/* Search */}
				<div className="p-4 border-b border-gray-200">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search"
							className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
						/>
					</div>
				</div>

				{/* Filter Tabs */}
				<div className="flex gap-2 px-4 py-3 border-b border-gray-200">
					<button className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium">
						All messages
					</button>
					<button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
						Unread
					</button>
					<button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
						Teachers
					</button>
					<button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
						Students
					</button>
				</div>

				{/* Contacts List */}
				<div className="flex-1 overflow-y-auto">
					{mockContacts.map((contact) => (
						<button
							key={contact.id}
							onClick={() => setSelectedContact(contact)}
							className={`w-full flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
								selectedContact.id === contact.id ? "bg-orange-50" : ""
							}`}>
							{/* Avatar */}
							<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
								{contact.avatar}
							</div>

							{/* Content */}
							<div className="flex-1 text-left min-w-0">
								<div className="flex items-center justify-between mb-1">
									<h3 className="text-sm font-semibold text-gray-900">
										{contact.name}
									</h3>
									<span className="text-xs text-gray-500">
										{contact.timestamp}
									</span>
								</div>
								<p className="text-xs text-gray-600 truncate">
									{contact.lastMessage}
								</p>
							</div>

							{/* Unread Badge */}
							{contact.unread && (
								<div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
							)}
						</button>
					))}
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
				{/* Chat Header */}
				<div className="p-4 border-b border-gray-200 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
							{selectedContact.avatar}
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-900">
								{selectedContact.name}
							</h3>
							<p className="text-xs text-gray-600">Biology teacher</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button className="p-2 hover:bg-gray-100 rounded-lg">
							<Search className="w-5 h-5 text-gray-600" />
						</button>
						<button className="p-2 hover:bg-gray-100 rounded-lg">
							<svg
								className="w-5 h-5 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{mockMessages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								msg.sender === "me" ? "justify-end" : "justify-start"
							}`}>
							<div
								className={`max-w-md ${
									msg.sender === "me"
										? "bg-orange-500 text-white"
										: "bg-blue-50 text-gray-900"
								} rounded-2xl p-3`}>
								{msg.image ? (
									<div className="w-48 h-32 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg flex items-center justify-center text-4xl">
										{msg.image}
									</div>
								) : (
									<p className="text-sm">{msg.text}</p>
								)}
								<p
									className={`text-xs mt-1 ${
										msg.sender === "me" ? "text-white/70" : "text-gray-500"
									}`}>
									{msg.timestamp}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Message Input */}
				<div className="p-4 border-t border-gray-200">
					<div className="flex items-center gap-2">
						<button className="p-2 hover:bg-gray-100 rounded-lg">
							<Paperclip className="w-5 h-5 text-gray-600" />
						</button>
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Message"
							className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
						/>
						<button className="p-2 hover:bg-gray-100 rounded-lg">
							<Mic className="w-5 h-5 text-gray-600" />
						</button>
						<button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
							<Send className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
