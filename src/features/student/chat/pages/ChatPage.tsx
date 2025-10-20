import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";

export default function ChatPage() {
	return (
		<div className="h-[calc(100vh-140px)]">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
				{/* Chat List */}
				<div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
					<ChatList />
				</div>

				{/* Chat View */}
				<div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
					<ChatView />
				</div>
			</div>
		</div>
	);
}
