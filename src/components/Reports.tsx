import React, { useEffect, useState } from "react";
import { Download, User } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Reports: React.FC = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const validateDates = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date");
      return false;
    }
    return true;
  };

  const fetchReports = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const params = new URLSearchParams({});

      if (startDate) {
        params.append('start_date', new Date(startDate).toISOString().split('T')[0]);
      }

      if (endDate) {
        params.append('end_date', new Date(endDate).toISOString().split('T')[0]);
      }

      const url = startDate || endDate
        ? `${API_BASE_URL}/reports/get_filtered_reports`
        : `${API_BASE_URL}/reports/`;

      const response = await axios.get(url, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(params)

      const data = response.data.reports || [];
      const totalCount = response.data.total || data.length;

      setReports(data);
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.response?.data?.detail || "Failed to load reports"); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if (!validateDates()) return;
    setCurrentPage(1);
    fetchReports();
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchReports();
  };

  const handleViewReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/reports/${reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedReport(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load report:", err);
      setError("Failed to load report details");
    }
  };

  const handleDownloadPDF = async (reportId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/reports/export/pdf/emotion`,
        {
          params: { report_id: reportId },
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `emotion_report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  return (
    <div className="p-4 md:p-6 md:ml-64 min-h-screen bg-black text-white space-y-6 md:space-y-8">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 md:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold text-white">Emotion Reports</h2>
        <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">
          Review your emotion analysis reports and download them as PDF.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 md:mb-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-zinc-800 border border-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base flex-1 min-w-[150px]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-zinc-800 border border-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base flex-1 min-w-[150px]"
          />
          <button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm md:text-base disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Apply Filters"}
          </button>
          <button
            onClick={handleResetFilters}
            disabled={isLoading}
            className="px-3 py-1 md:px-4 md:py-2 bg-zinc-700 text-white rounded-md text-sm md:text-base disabled:opacity-50"
          >
            Reset Filters
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
            <p className="text-red-400 text-sm md:text-base">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No reports found for the selected criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <AnimatePresence>
                {reports.map((report: any) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={() => handleViewReport(report.id)}
                    className="cursor-pointer bg-zinc-900 border border-zinc-700 p-3 md:p-4 rounded-lg shadow hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-white">
                          {new Date(report.generated_at).toISOString().split('T')[0]}
                        </h3>
                        <p className="text-gray-300 text-sm">Session: {report.session_id}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-300">
                        {report.export_status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{
                        backgroundColor: emotionColors[Object.entries(report.emotion_summary || {})
                          .reduce((a: any, b: any) => (b[1] > a[1] ? b : a), ["neutral", 0])[0]]
                      }}></div>
                      <p className="text-gray-300 text-sm md:text-base">
                        Dominant: {Object.entries(report.emotion_summary || {})
                          .reduce((a: any, b: any) => (b[1] > a[1] ? b : a), ["None", 0])[0]
                          .toUpperCase()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPDF(report.id);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="px-3 py-1 md:px-4 md:py-2 bg-zinc-700 rounded text-white disabled:opacity-50 text-sm md:text-base"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm md:text-base">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-3 py-1 md:px-4 md:py-2 bg-zinc-700 rounded text-white disabled:opacity-50 text-sm md:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 rounded-xl shadow-xl p-4 md:p-6 w-full max-w-md md:max-w-xl relative border border-zinc-700 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-white transition duration-200 text-xl md:text-2xl"
              aria-label="Close Modal"
            >
              ✕
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-b border-zinc-700 pb-2">
              Report Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Date</p>
                <p className="text-gray-300">
                  {new Date(selectedReport.generated_at).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Session ID</p>
                <p className="text-gray-300 break-all">{selectedReport.session_id}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Emotion Distribution</p>
                <ul className="space-y-2">
                  {Object.entries(selectedReport.emotion_summary || {})
                    .sort((a: any, b: any) => b[1] - a[1])
                    .map(([emotion, value]: any) => (
                      <li key={emotion} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{
                          backgroundColor: emotionColors[emotion] || '#607d8b'
                        }}></div>
                        <span className="text-gray-300 flex-1">
                          {emotion.toUpperCase()}
                        </span>
                        <span className="text-blue-400 font-medium">
                          {value}%
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const emotionColors: Record<string, string> = {
  happy: '#4caf50',
  sad: '#2196f3',
  angry: '#f44336',
  surprise: '#ff9800',
  fear: '#9c27b0',
  disgust: '#795548',
  neutral: '#607d8b'
};

export default Reports;