"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { alumniService } from "../services/alumni"

export default function TakeSurveyPage() {
  const { surveyId } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSurvey()
  }, [surveyId])

  async function loadSurvey() {
    try {
      setLoading(true)
      const data = await alumniService.getSurvey(surveyId)
      setAssignment(data)
      // Initialize responses object
      const initialResponses = {}
      data.survey.questions.forEach((q) => {
        initialResponses[q.id] = {
          questionId: q.id,
          type: q.type,
          value: q.type === "BOOLEAN" ? null : "",
        }
      })
      setResponses(initialResponses)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load survey")
    } finally {
      setLoading(false)
    }
  }

  function handleResponseChange(questionId, value) {
    setResponses({
      ...responses,
      [questionId]: { ...responses[questionId], value },
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validate all questions are answered
    const unanswered = assignment.survey.questions.filter((q) => {
      const resp = responses[q.id]
      if (q.type === "BOOLEAN") {
        return resp.value === null
      }
      return !resp.value || (typeof resp.value === "string" && !resp.value.trim())
    })

    if (unanswered.length > 0) {
      setError("Please answer all questions before submitting")
      return
    }

    try {
      setSubmitting(true)
      // Format responses for API
      const formattedResponses = Object.values(responses).map((r) => {
        const payload = { questionId: r.questionId }
        if (r.type === "TEXT") payload.answerText = r.value
        else if (r.type === "MULTIPLE_CHOICE") payload.answerOption = r.value
        else if (r.type === "RATING") payload.answerRating = Number(r.value)
        else if (r.type === "BOOLEAN") payload.answerBoolean = r.value
        return payload
      })

      await alumniService.submitSurvey(surveyId, formattedResponses)
      alert("Survey submitted successfully!")
      navigate("/alumni")
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit survey")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6">Loading survey...</div>
  if (error && !assignment) return <div className="p-6 text-red-600">{error}</div>
  if (!assignment) return null

  if (assignment.completed) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded text-center">
          <h2 className="text-xl font-semibold mb-2">Survey Already Completed</h2>
          <p className="text-gray-600 mb-4">You have already submitted your responses to this survey.</p>
          <button
            onClick={() => navigate("/alumni")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isExpired = assignment.survey.deadline && new Date(assignment.survey.deadline) < new Date()
  
  if (isExpired) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 p-6 rounded text-center">
          <h2 className="text-xl font-semibold mb-2">Survey Not Active</h2>
          <p className="text-gray-600 mb-4">This survey is no longer accepting responses.</p>
          <button
            onClick={() => navigate("/alumni")}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{assignment.survey.title}</h1>
          {assignment.survey.description && <p className="text-gray-600 mt-2">{assignment.survey.description}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {assignment.survey.questions.map((question, idx) => (
            <div key={question.id} className="border p-4 rounded">
              <label className="block font-medium mb-3">
                {idx + 1}. {question.text}
              </label>

              {question.type === "TEXT" && (
                <textarea
                  className="w-full border p-3 rounded"
                  rows="4"
                  value={responses[question.id]?.value || ""}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  placeholder="Enter your response..."
                />
              )}

              {question.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={responses[question.id]?.value === option}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "RATING" && (
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={rating}
                        checked={responses[question.id]?.value === rating}
                        onChange={(e) => handleResponseChange(question.id, Number(e.target.value))}
                        className="w-5 h-5 mb-1"
                      />
                      <span className="text-sm">{rating}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "BOOLEAN" && (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value="true"
                      checked={responses[question.id]?.value === true}
                      onChange={() => handleResponseChange(question.id, true)}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value="false"
                      checked={responses[question.id]?.value === false}
                      onChange={() => handleResponseChange(question.id, false)}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
              )}
            </div>
          ))}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/alumni")}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
