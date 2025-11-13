"use client"

import { useState, useEffect } from "react"
import { alumniService } from "../../services/alumni"
import { useNavigate } from "react-router-dom"

export default function MySurveys() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadSurveys()
  }, [])

  async function loadSurveys() {
    try {
      setLoading(true)
      const data = await alumniService.getMySurveys()
      setAssignments(data)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load surveys")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="bg-white p-6 rounded shadow">Loading surveys...</div>
  if (error) return <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>

  const activeSurveys = assignments.filter((a) => a.survey.isActive && !a.completed)
  const completedSurveys = assignments.filter((a) => a.completed)
  const inactiveSurveys = assignments.filter((a) => !a.survey.isActive && !a.completed)

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">My Surveys</h2>

      {/* Active Surveys */}
      {activeSurveys.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-green-700">Active Surveys</h3>
          <div className="space-y-3">
            {activeSurveys.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-green-200 bg-green-50 p-4 rounded flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium">{assignment.survey.title}</h4>
                  {assignment.survey.description && (
                    <p className="text-sm text-gray-600">{assignment.survey.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{assignment.survey._count.questions} questions</p>
                </div>
                <button
                  onClick={() => navigate(`/alumni/surveys/${assignment.survey.id}`)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Answer Survey
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Surveys */}
      {completedSurveys.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-blue-700">Completed Surveys</h3>
          <div className="space-y-3">
            {completedSurveys.map((assignment) => (
              <div key={assignment.id} className="border border-blue-200 bg-blue-50 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{assignment.survey.title}</h4>
                    <p className="text-xs text-gray-500">
                      Completed on {new Date(assignment.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Surveys */}
      {inactiveSurveys.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700">Inactive Surveys</h3>
          <div className="space-y-3">
            {inactiveSurveys.map((assignment) => (
              <div key={assignment.id} className="border border-gray-200 bg-gray-50 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-600">{assignment.survey.title}</h4>
                    <p className="text-xs text-gray-500">This survey is no longer active</p>
                  </div>
                  <span className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Inactive</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {assignments.length === 0 && <p className="text-gray-500 text-center py-8">No surveys assigned to you yet.</p>}
    </div>
  )
}
