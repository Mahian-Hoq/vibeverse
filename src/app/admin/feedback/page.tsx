'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertCircle, CheckCircle, Eye, X } from 'lucide-react';

interface Feedback {
  id: string;
  user_email: string;
  message_type: string;
  content: string;
  status: string;
  created_at: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);
      setFeedbackList((data || []) as Feedback[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch feedback';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      read: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      resolved: 'bg-green-100 text-green-800 hover:bg-green-200',
    };

    return colors[normalized] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const toggleStatus = async (feedback: Feedback) => {
    try {
      setStatusUpdating(feedback.id);
      const nextStatus = feedback.status.toLowerCase() === 'resolved' ? 'new' : 'resolved';

      const { error: updateError } = await supabase
        .from('feedback')
        .update({ status: nextStatus })
        .eq('id', feedback.id);

      if (updateError) throw new Error(updateError.message);

      setFeedbackList((prev) =>
        prev.map((item) =>
          item.id === feedback.id ? { ...item, status: nextStatus } : item
        )
      );

      setSelectedFeedback((prev) =>
        prev && prev.id === feedback.id ? { ...prev, status: nextStatus } : prev
      );

      showToast('success', `Feedback marked as "${nextStatus}"`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update feedback status';
      showToast('error', errorMessage);
    } finally {
      setStatusUpdating(null);
    }
  };

  const openFeedbackModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const closeFeedbackModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-gray-600 mt-1">View and manage customer feedback messages</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`${
            toast.type === 'success'
              ? 'bg-green-50 border-l-4 border-green-600'
              : 'bg-red-50 border-l-4 border-red-600'
          } p-4 rounded-lg flex gap-3`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={
              toast.type === 'success' ? 'text-green-800 text-sm' : 'text-red-800 text-sm'
            }
          >
            {toast.message}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {feedbackList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No feedback yet</p>
            <p className="text-gray-500 text-sm">Customer feedback will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {feedbackList.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {feedback.user_email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap capitalize">
                      {feedback.message_type}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                      <p className="line-clamp-2" title={feedback.content}>
                        {feedback.content}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(feedback.created_at)}
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleStatus(feedback)}
                        disabled={statusUpdating === feedback.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(
                          feedback.status
                        )}`}
                      >
                        {statusUpdating === feedback.id ? 'Updating...' : feedback.status}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openFeedbackModal(feedback)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors duration-200 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Feedback Details</h2>
                <p className="text-sm text-gray-600 mt-1">Submitted on {formatDate(selectedFeedback.created_at)}</p>
              </div>
              <button
                onClick={closeFeedbackModal}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close feedback details modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{selectedFeedback.user_email}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Message Type</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selectedFeedback.message_type}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-lg p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Full Message</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedFeedback.content}</p>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Status</p>
                  <p className="text-sm text-gray-700">Use the button to mark this feedback as handled.</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(selectedFeedback)}
                  disabled={statusUpdating === selectedFeedback.id}
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(
                    selectedFeedback.status
                  )}`}
                >
                  {statusUpdating === selectedFeedback.id ? 'Updating...' : selectedFeedback.status}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeFeedbackModal}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
