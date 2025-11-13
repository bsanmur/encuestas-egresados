import { prisma } from "../lib/prisma.js"

export async function getMyProfile(req, res) {
  const userId = req.user.id
  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
    })
    if (!profile) return res.status(404).json({ message: "Profile not found" })
    res.json(profile)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}

export async function updateMyProfile(req, res) {
  const userId = req.user.id
  const { phone, currentJobTitle, currentCompany, employmentStatus } = req.body
  try {
    const profile = await prisma.alumniProfile.update({
      where: { userId },
      data: {
        phone,
        currentJobTitle,
        currentCompany,
        employmentStatus,
      },
    })
    res.json(profile)
  } catch (e) {
    console.error(e)
    res.status(400).json({ message: "Update failed" })
  }
}

export async function getMySurveys(req, res) {
  const userId = req.user.id
  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
    })
    if (!profile) return res.status(404).json({ message: "Profile not found" })

    const assignments = await prisma.surveyAssignment.findMany({
      where: { alumniId: profile.id },
      include: {
        survey: {
          include: {
            _count: { select: { questions: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json(assignments)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}

export async function getSurveyForAlumni(req, res) {
  const userId = req.user.id
  const { surveyId } = req.params
  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
    })
    if (!profile) return res.status(404).json({ message: "Profile not found" })

    const assignment = await prisma.surveyAssignment.findUnique({
      where: {
        surveyId_alumniId: {
          surveyId,
          alumniId: profile.id,
        },
      },
      include: {
        survey: {
          include: {
            questions: { orderBy: { order: "asc" } },
          },
        },
      },
    })

    if (!assignment) {
      return res.status(404).json({ message: "Survey not assigned to you" })
    }

    res.json(assignment)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}

export async function submitSurveyResponse(req, res) {
  const userId = req.user.id
  const { surveyId } = req.params
  const { responses } = req.body

  if (!responses || !Array.isArray(responses)) {
    return res.status(400).json({ message: "responses array required" })
  }

  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId },
    })
    if (!profile) return res.status(404).json({ message: "Profile not found" })

    const assignment = await prisma.surveyAssignment.findUnique({
      where: {
        surveyId_alumniId: {
          surveyId,
          alumniId: profile.id,
        },
      },
    })

    if (!assignment) {
      return res.status(404).json({ message: "Survey not assigned to you" })
    }

    if (assignment.completed) {
      return res.status(400).json({ message: "Survey already completed" })
    }

    // Delete any existing responses for this assignment
    await prisma.response.deleteMany({
      where: { assignmentId: assignment.id },
    })

    // Create new responses
    const responseData = responses.map((r) => ({
      questionId: r.questionId,
      assignmentId: assignment.id,
      answerText: r.answerText || null,
      answerOption: r.answerOption || null,
      answerRating: r.answerRating ? Number(r.answerRating) : null,
      answerBoolean: r.answerBoolean !== undefined ? r.answerBoolean : null,
    }))

    await prisma.response.createMany({
      data: responseData,
    })

    // Mark assignment as completed
    const updatedAssignment = await prisma.surveyAssignment.update({
      where: { id: assignment.id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })

    res.json({
      success: true,
      message: "Survey submitted successfully",
      assignment: updatedAssignment,
    })
  } catch (e) {
    console.error(e)
    res.status(400).json({ message: "Submit failed" })
  }
}
