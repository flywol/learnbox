import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Play, CheckCircle } from 'lucide-react';
import { useClassroomStore } from '../store/classroomStore';
import { LessonContentItem } from '../types/classroom.types';

export default function LessonContentPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'notes'>('overview');

  const { getLessonsBySubject, forumMessages, addForumMessage, markContentItemComplete } =
    useClassroomStore();

  const lessons = subjectId ? getLessonsBySubject(subjectId) : [];
  const lesson = lessons.find((l) => l.id === lessonId);
  const messages = lessonId ? forumMessages[lessonId] || [] : [];

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lesson not found</p>
      </div>
    );
  }

  const handleSendMessage = (message: string) => {
    if (lessonId) {
      addForumMessage(lessonId, {
        senderId: 'current-student',
        senderName: 'You',
        senderRole: 'STUDENT',
        message,
      });
    }
  };

  const handleContentItemClick = (item: LessonContentItem) => {
    if (!item.isCompleted && subjectId) {
      markContentItemComplete(lesson.id, subjectId, item.id);
    }
  };



  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <button
          onClick={() => navigate(`/student/classroom/subject/${subjectId}`)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-sm text-gray-500">Lesson {lesson.number}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video & Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          {/* Video Player Area */}
          <div className="aspect-video bg-black rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
               </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="h-1 bg-gray-600 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-orange-500 w-1/3 relative">
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm scale-0 group-hover:scale-100 transition-transform" />
                  </div>
               </div>
               <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                     <button><Play className="w-5 h-5 text-white" fill="currentColor" /></button>
                     <span className="text-sm font-medium">12:45 / 45:00</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[400px]">
             <div className="flex gap-2 border-b border-gray-100 pb-4 mb-6">
                {(['overview', 'qa', 'notes'] as const).map((tab) => (
                   <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                         activeTab === tab
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                   >
                      {tab === 'qa' ? 'Q&A' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                   </button>
                ))}
             </div>

             {activeTab === 'overview' && (
                <div className="space-y-6">
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">About this lesson</h3>
                      <p className="text-gray-600 leading-relaxed">
                         {lesson.description || "In this lesson, we will explore the fundamental concepts..."}
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                         <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Duration</p>
                         <p className="text-lg font-bold text-gray-900">45 mins</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                         <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Resources</p>
                         <p className="text-lg font-bold text-gray-900">{lesson.contentItems.length} items</p>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'qa' && (
                <div className="h-full flex flex-col">
                   <div className="flex-1 space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                      {messages.length === 0 ? (
                         <div className="text-center py-8 text-gray-500">
                            No questions yet. Be the first to ask!
                         </div>
                      ) : (
                         messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.senderRole === 'STUDENT' ? 'flex-row-reverse' : ''}`}>
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  msg.senderRole === 'TEACHER' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                               }`}>
                                  {msg.senderName[0]}
                               </div>
                               <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                                  msg.senderRole === 'STUDENT' 
                                     ? 'bg-orange-500 text-white rounded-tr-none' 
                                     : 'bg-gray-100 text-gray-700 rounded-tl-none'
                               }`}>
                                  {msg.message}
                               </div>
                            </div>
                         ))
                      )}
                   </div>
                   <div className="relative">
                      <input 
                         type="text" 
                         placeholder="Ask a question..."
                         className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                         onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                               handleSendMessage(e.currentTarget.value);
                               e.currentTarget.value = '';
                            }
                         }}
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                         <MessageCircle className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             )}

             {activeTab === 'notes' && (
                <div className="h-full">
                   <textarea 
                      className="w-full h-[300px] p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all resize-none placeholder:text-yellow-700/30 text-gray-700"
                      placeholder="Take notes for this lesson..."
                   />
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Playlist */}
        <div className="lg:col-span-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Course Content</h3>
              <p className="text-xs text-gray-500 mt-1">
                {lessons.length} Lessons • {Math.round(lesson.contentItems && lesson.contentItems.length > 0 ? (lesson.contentItems.filter(i => i.isCompleted).length / lesson.contentItems.length) * 100 : 0)}% Completed
              </p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {lesson.contentItems.map((item, index) => (
                 <div
                    key={item.id}
                    onClick={() => handleContentItemClick(item)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all group ${
                       item.isCompleted ? 'bg-green-50/50 hover:bg-green-50' : 'hover:bg-gray-50'
                    }`}
                 >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                       item.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                       {item.isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className={`text-sm font-medium truncate ${item.isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
                          {item.title}
                       </p>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                             {item.type === 'video' ? '📺 Video' : item.type === 'quiz' ? '📝 Quiz' : '📄 File'}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">10 mins</span>
                       </div>
                    </div>
                    {item.type === 'video' && (
                       <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-3 h-3" fill="currentColor" />
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
