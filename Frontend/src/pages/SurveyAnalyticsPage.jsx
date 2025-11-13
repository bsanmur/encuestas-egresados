"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { adminService } from "../services/admin"

export default function SurveyAnalyticsPage() {
  const { surveyId } = useParams()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [surveyId])

  async function loadAnalytics() {
    try {
      setLoading(true)
      const data = await adminService.getSurveyAnalytics(surveyId)
      setAnalytics(data)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading analytics...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!analytics) return null

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{analytics.title}</h1>
            <p className="text-gray-500">Survey Analytics</p>
          </div>
          <button onClick={() => navigate("/admin")} className="text-gray-600 hover:text-gray-800">
            Back to Dashboard
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-700">{analytics.totalAssignments}</div>
            <div className="text-sm text-gray-600">Total Assigned</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-700">{analytics.completedAssignments}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-2xl font-bold text-purple-700">{analytics.participationRate}%</div>
            <div className="text-sm text-gray-600">Participation Rate</div>
          </div>
        </div>

        {/* Question Analytics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Question Breakdown</h2>
          {analytics.questions.map((q, idx) => (
            <div key={q.id} className="border p-4 rounded">
              <div className="mb-3">
                <h3 className="font-medium">
                  {idx + 1}. {q.text}
                </h3>
                <p className="text-sm text-gray-500">
                  Type: {q.type} | Responses: {q.totalResponses}
                </p>
              </div>

              {/* Rating Analytics */}
              {q.type === "RATING" && (
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-lg font-semibold">Average Rating: {q.averageRating} / 5</div>
                </div>
              )}

              {/* Multiple Choice / Boolean Distribution */}
              {(q.type === "MULTIPLE_CHOICE" || q.type === "BOOLEAN") && (
                <div className="space-y-2">
                  {q.distribution.map((dist) => (
                    <div key={dist.option} className="flex items-center gap-3">
                      <div className="w-32 text-sm">{dist.option}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div className="bg-blue-600 h-6 rounded-full" style={{ width: `${dist.percentage || 0}%` }} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {dist.count} ({dist.percentage || 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Text Responses */}
              {q.type === "TEXT" && (
                <div className="space-y-2">
                  {q.responses && q.responses.length > 0 ? (
                    q.responses.slice(0, 5).map((resp, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded text-sm">
                        "{resp.text}"
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No responses yet</p>
                  )}
                  {q.responses && q.responses.length > 5 && (
                    <p className="text-sm text-gray-500">...and {q.responses.length - 5} more responses</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
