import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const fetchReports = async () => {
    try {
      let url = `${API_BASE_URL}/reports/`;
      let params: any = {
        limit,
        skip: (currentPage - 1) * limit,
      };

      if (startDate || endDate) {
        url = `${API_BASE_URL}/reports/get_filtered_reports/`;

        if (startDate) params.start_date = new Date(startDate).toISOString().slice(0, 10);
        if (endDate) params.end_date = new Date(endDate).toISOString().slice(0, 10);
      }

      const token = localStorage.getItem("token");

      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data.reports || [];
      const totalCount = response.data.total || data.length;

      setReports(data);
      setTotalPages(Math.ceil(totalCount / limit));
      setError("");
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to filter reports.");
    }
  };

  const handleViewReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedReport(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load report by ID", err);
      alert("Failed to load detailed report.");
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Failed to download report.");
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
            onClick={() => {
              setCurrentPage(1);
              fetchReports();
            }}
            className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm md:text-base"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setCurrentPage(1);
              fetchReports();
            }}
            className="px-3 py-1 md:px-4 md:py-2 bg-zinc-700 text-white rounded-md text-sm md:text-base"
          >
            Reset Filters
          </button>
        </div>

        {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}

        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">No reports found.</p>
        ) : (
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
                  <h3 className="text-base md:text-lg font-semibold text-white">
                    Report Date: {report.generated_at?.split("T")[0]}
                  </h3>
                  <p className="text-base md:text-lg text-gray-300 font-semibold">Session ID: {report.session_id}</p>
                  <p className="text-gray-300 text-sm md:text-base font-semibold">
                    Dominant Emotion:{" "}
                    {Object.entries(report.emotion_summary || {})
                      .reduce((a: any, b: any) => (b[1] > a[1] ? b : a), ["None", 0])[0]
                      .toUpperCase()}
                  </p>
                  <p className="text-base md:text-lg text-gray-300 font-semibold">
                    Export Status: {report.export_status.toUpperCase()}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPDF(report.id);
                    }}
                    className="mt-2 md:mt-3 inline-flex items-center bg-blue-600 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-blue-700 transition text-sm md:text-base"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Download PDF
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {reports.length > 0 && (
          <div className="flex justify-between items-center mt-4 md:mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 md:px-4 md:py-2 bg-zinc-700 rounded text-white disabled:opacity-50 text-sm md:text-base"
            >
              Previous
            </button>
            <span className="text-gray-400 text-sm md:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 md:px-4 md:py-2 bg-zinc-700 rounded text-white disabled:opacity-50 text-sm md:text-base"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 rounded-xl shadow-xl p-4 md:p-6 lg:p-8 w-full max-w-md md:max-w-xl relative border border-zinc-700 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-white transition duration-200 text-xl md:text-2xl"
              aria-label="Close Modal"
            >
              ✕
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 border-b border-zinc-700 pb-2 md:pb-3">
              Report Details — <span className="text-indigo-400">{selectedReport.created_at?.split("T")[0]}</span>
            </h2>

            <div className="mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wide mb-1">Session ID</p>
              <p className="text-gray-300 break-words text-sm md:text-base">{selectedReport.session_id}</p>
            </div>

            <div className="mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wide mb-1">Dominant Emotion</p>
              <p className="text-base md:text-lg font-semibold text-indigo-400">
                {
                  Object.entries(selectedReport.emotion_summary || {}).reduce(
                    (a: any, b: any) => (b[1] > a[1] ? b : a),
                    ["None", 0]
                  )[0].toUpperCase()
                }
              </p>
            </div>

            <div className="mb-2">
              <p className="text-xs md:text-sm text-gray-400 font-semibold uppercase tracking-wide mb-1 md:mb-2">Emotion Summary</p>
              <ul className="space-y-1">
                {Object.entries(selectedReport.emotion_summary || {}).map(([emotion, value]: any) => (
                  <li key={emotion} className="text-gray-300 text-xs md:text-sm">
                    <span className="text-indigo-400 font-medium">{emotion.toUpperCase()}</span>: {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;