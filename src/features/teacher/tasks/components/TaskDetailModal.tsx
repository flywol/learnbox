import { useState } from 'react';
import Modal from '@/common/components/Modal';
import { Calendar, Clock, Repeat, CheckCircle2, Circle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Task } from '../types/task.types';
import { useToggleTaskCompletion, useDeleteTask } from '../hooks/useTeacherTasks';
import { getRepeatLabel } from '../utils/taskHelpers';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export default function TaskDetailModal({ isOpen, onClose, task, onEdit }: TaskDetailModalProps) {
  const { toast } = useToast();
  const toggleCompletionMutation = useToggleTaskCompletion();
  const deleteTaskMutation = useDeleteTask();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const handleToggleCompletion = async () => {
    setIsToggling(true);
    try {
      await toggleCompletionMutation.mutateAsync(task.id);

      toast({
        title: task.isCompleted ? "Task marked as incomplete" : "Task completed!",
        description: `"${task.title}" has been ${task.isCompleted ? 'marked as incomplete' : 'marked as completed'}.`,
      });

      // Close modal after successful toggle
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update task status.";

      toast({
        title: "Error updating task",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteTaskMutation.mutateAsync(task.id);

      toast({
        title: "Task deleted successfully",
        description: `"${task.title}" has been removed.`,
      });

      // Close modal after successful delete
      onClose();
      setShowDeleteConfirm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete task.";

      toast({
        title: "Error deleting task",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Format date for display
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (isoDateTime: string) => {
    const date = new Date(isoDateTime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Task Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
          <div className="flex items-center gap-2">
            {task.isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                <Circle className="w-4 h-4" />
                Pending
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {task.taskType}
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-900 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {task.description}
          </p>
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Start Date</p>
              <p className="text-base font-semibold text-gray-900">{formatDate(task.startDate)}</p>
            </div>
          </div>

          {/* Schedule Time */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Schedule Time</p>
              <p className="text-base font-semibold text-gray-900">{formatTime(task.scheduleTime)}</p>
            </div>
          </div>

          {/* Repeat */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Repeat className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Repeat</p>
              <p className="text-base font-semibold text-gray-900">{getRepeatLabel(task.repeat)}</p>
            </div>
          </div>
        </div>

        {/* Created/Updated Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Created: {formatDate(task.createdAt)}</span>
            <span>Updated: {formatDate(task.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {!showDeleteConfirm ? (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {/* Left side - Edit and Delete */}
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            {/* Right side - Close and Complete */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={handleToggleCompletion}
                disabled={isToggling}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  task.isCompleted
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isToggling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    {task.isCompleted ? (
                      <>
                        <Circle className="w-4 h-4" />
                        Mark as Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Complete
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Delete Confirmation
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Delete Task?</h4>
                  <p className="text-sm text-red-700">
                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Task
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
