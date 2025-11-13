"use client"

import { useState } from "react"
import { adminService } from "../services/admin"
import { useNavigate } from "react-router-dom"

const QUESTION_TYPES = [
  { value: "TEXT", label: "Text Response" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "RATING", label: "Rating (1-5)" },
  { value: "BOOLEAN", label: "Yes/No" },
]

const PROGRAMS = [
  "Ingeniería de Software",
  "Ingeniería en Tecnologías de Internet",
  "Maestría en Tecnologías de Internet",
  "Maestría en Transformación Digital",
]

export default function CreateSurveyPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    program: "",
    year: "",
  })
  const [questions, setQuestions] = useState([{ text: "", type: "TEXT", options: [] }])

  function handleAddQuestion() {
    setQuestions([...questions, { text: "", type: "TEXT", options: [] }])
  }

  function handleRemoveQuestion(index) {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  function handleQuestionChange(index, field, value) {
    const updated = [...questions]
    updated[index][field] = value
    if (field === "type" && value !== "MULTIPLE_CHOICE") {
      updated[index].options = []
    }
    setQuestions(updated)
  }

  function handleOptionChange(qIndex, optIndex, value) {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  function handleAddOption(qIndex) {
    const updated = [...questions]
    updated[qIndex].options.push("")
    setQuestions(updated)
  }

  function handleRemoveOption(qIndex, optIndex) {
    const updated = [...questions]
    updated[qIndex].options.splice(optIndex, 1)
    setQuestions(updated)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }
    if (questions.length === 0) {
      setError("At least one question is required")
      return
    }
    for (const q of questions) {
      if (!q.text.trim()) {
        setError("All questions must have text")
        return
      }
      if (q.type === "MULTIPLE_CHOICE" && q.options.length < 2) {
        setError("Multiple choice questions need at least 2 options")
        return
      }
    }

    try {
      setLoading(true)
      const payload = {
        title: formData.title,
        description: formData.description || null,
        program: formData.program || null,
        year: formData.year ? Number(formData.year) : null,
        questions: questions.map((q) => ({
          text: q.text,
          type: q.type,
          options: q.type === "MULTIPLE_CHOICE" ? q.options : [],
        })),
      }
      await adminService.createSurvey(payload)
      alert("Survey created successfully!")
      navigate("/admin")
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create survey")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Create New Survey</h1>
          <button onClick={() => navigate("/admin")} className="text-gray-600 hover:text-gray-800">
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Survey Title *</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Alumni Satisfaction Survey 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border p-2 rounded"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose of this survey"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Program (optional)</label>
                <select
                  className="w-full border p-2 rounded"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                >
                  <option value="">All Programs</option>
                  {PROGRAMS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Graduation Year (optional)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 2024"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Questions</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                + Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border p-4 rounded bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Question {qIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Question Text *</label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={q.text}
                        onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Question Type</label>
                      <select
                        className="w-full border p-2 rounded"
                        value={q.type}
                        onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                      >
                        {QUESTION_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Options for Multiple Choice */}
                    {q.type === "MULTIPLE_CHOICE" && (
                      <div>
                        <label className="block text-sm mb-2">Options</label>
                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <input
                                type="text"
                                className="flex-1 border p-2 rounded"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(qIndex, optIndex)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                -
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIndex)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Survey"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
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
