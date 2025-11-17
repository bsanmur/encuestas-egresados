"use client"

import { useState, useEffect } from "react"
import { adminService } from "../../services/admin"
import { useNavigate } from "react-router-dom"

export default function ManageSurveys() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadSurveys()
  }, [])

  async function loadSurveys() {
    try {
      setLoading(true)
      const data = await adminService.listSurveys()
      setSurveys(data)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load surveys")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this survey?")) return
    try {
      await adminService.deleteSurvey(id)
      loadSurveys()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete survey")
    }
  }


  function isSurveyActive(survey) {
    if (!survey.deadline) return true // No deadline means always active
    return new Date(survey.deadline) > new Date()
  }

  function formatDeadline(deadline) {
    if (!deadline) return "No deadline"
    return new Date(deadline).toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) return <div className="p-4">Loading surveys...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Manage Surveys</h2>
        <button
          onClick={() => navigate("/admin/surveys/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Survey
        </button>
      </div>

      {surveys.length === 0 ? (
        <p className="text-gray-500">No surveys yet. Create your first survey!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Program</th>
                <th className="border p-2 text-left">Year</th>
                <th className="border p-2 text-left">Deadline</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 text-center">Questions</th>
                <th className="border p-2 text-center">Assignments</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="border p-2">{survey.title}</td>
                  <td className="border p-2">{survey.program || "All"}</td>
                  <td className="border p-2">{survey.year || "All"}</td>
                  <td className="border p-2 text-sm">{formatDeadline(survey.deadline)}</td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        isSurveyActive(survey) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isSurveyActive(survey) ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="border p-2 text-center">{survey._count?.questions || 0}</td>
                  <td className="border p-2 text-center">{survey._count?.assignments || 0}</td>
                  <td className="border p-2">
                    <div className="flex gap-1 justify-center flex-wrap">
                      <button
                        onClick={() => navigate(`/admin/surveys/${survey.id}/analytics`)}
                        className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => navigate(`/admin/surveys/${survey.id}/edit`)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(survey.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
