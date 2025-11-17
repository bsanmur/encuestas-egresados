import { prisma } from "../lib/prisma.js" // Import prisma client

/* ------------------- ALUMNI ------------------- */
export async function listAlumni(req, res) {
  try {
    const alumni = await prisma.alumniProfile.findMany({
      include: {
        user: { select: { id: true, email: true, role: true } },
        school: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(alumni);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateAlumni(req, res) {
  const { id } = req.params;
  const {
    fullName,
    phone,
    graduationYear,
    program,
    studentId,
    currentJobTitle,
    currentCompany,
    employmentStatus,
    schoolId,
    isApproved,
  } = req.body;
  try {
    const updated = await prisma.alumniProfile.update({
      where: { id },
      data: {
        fullName,
        phone,
        graduationYear:
          graduationYear !== undefined ? Number(graduationYear) : undefined,
        program,
        studentId,
        currentJobTitle,
        currentCompany,
        employmentStatus,
        schoolId,
        isApproved,
      },
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Update failed" });
  }
}

export async function deleteAlumni(req, res) {
  const { id } = req.params;
  try {
    const profile = await prisma.alumniProfile.delete({ where: { id } });
    res.json({ success: true, deletedId: profile.id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Delete failed" });
  }
}

export async function approveAlumni(req, res) {
  const { id } = req.params;
  try {
    const updated = await prisma.alumniProfile.update({
      where: { id },
      data: { isApproved: true },
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Approve failed" });
  }
}

/* ------------------- SCHOOLS ------------------- */
export async function listSchools(req, res) {
  try {
    const schools = await prisma.school.findMany({ orderBy: { name: "asc" } });
    res.json(schools);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createSchool(req, res) {
  const { name, description, contactPerson } = req.body;
  try {
    const school = await prisma.school.create({
      data: { name, description, contactPerson },
    });
    res.status(201).json(school);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Create failed" });
  }
}

export async function updateSchool(req, res) {
  const { id } = req.params;
  const { name, description, contactPerson } = req.body;
  try {
    const school = await prisma.school.update({
      where: { id },
      data: { name, description, contactPerson },
    });
    res.json(school);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Update failed" });
  }
}

export async function deleteSchool(req, res) {
  const { id } = req.params;
  try {
    const school = await prisma.school.delete({ where: { id } });
    res.json({ success: true, deletedId: school.id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Delete failed" });
  }
}

export async function assignUserToSchool(req, res) {
  const { userId, schoolId } = req.body;
  if (!userId || !schoolId)
    return res.status(400).json({ message: "userId and schoolId required" });
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: "SCHOOL", schoolId },
    });
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Assign failed" });
  }
}

/* ------------------- ANALYTICS ------------------- */
export async function globalAnalytics(req, res) {
  try {
    const total = await prisma.alumniProfile.count();
    const employed = await prisma.alumniProfile.count({
      where: { employmentStatus: "EMPLOYED" },
    });
    const employmentRate = total > 0 ? Math.round((employed / total) * 100) : 0;

    let topSectors = [];
    if (total > 0) {
      const programs = await prisma.alumniProfile.groupBy({
        by: ["program"],
        _count: { _all: true },
        orderBy: { _count: { _all: "desc" } },
        take: 5,
      });
      topSectors = programs.map((m) => ({
        name: m.program || "Unknown",
        count: m._count._all,
      }));
    }

    res.json({ totalAlumni: total, employmentRate, topSectors });
  } catch (e) {
    console.error("Global analytics error:", e);
    res.status(500).json({ message: "Server error" });
  }
}

/* ------------------- SURVEYS ------------------- */
export async function createSurvey(req, res) {
  const adminUserId = req.user.id
  const { title, description, program, year, deadline, questions } = req.body
  if (!title) return res.status(400).json({ message: "title required" })
  try {
    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        program,
        year: year ? Number(year) : null,
        deadline: deadline ? new Date(deadline) : null,
        createdById: adminUserId,
        questions: {
          create:
            questions?.map((q, idx) => ({
              text: q.text,
              type: q.type,
              options: q.options || [],
              order: idx,
            })) || [],
        },
      },
      include: { questions: true },
    })

    // Auto-assign to matching alumni
    const whereClause = { isApproved: true }
    if (program) whereClause.program = program
    if (year) whereClause.graduationYear = Number(year)

    const matchingAlumni = await prisma.alumniProfile.findMany({
      where: whereClause,
      select: { id: true },
    })

    if (matchingAlumni.length > 0) {
      await prisma.surveyAssignment.createMany({
        data: matchingAlumni.map((alumni) => ({
          surveyId: survey.id,
          alumniId: alumni.id,
        })),
      })
    }

    res.status(201).json(survey)
  } catch (e) {
    console.error(e)
    res.status(400).json({ message: "Create failed", error: e.message })
  }
}

export async function listSurveys(req, res) {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        createdBy: { select: { email: true } },
        _count: {
          select: {
            assignments: true,
            questions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(surveys)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}

export async function getSurvey(req, res) {
  const { id } = req.params
  try {
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: {
          select: {
            assignments: true,
          },
        },
      },
    })
    if (!survey) return res.status(404).json({ message: "Survey not found" })
    res.json(survey)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}

export async function updateSurvey(req, res) {
  const { id } = req.params
  const { title, description, program, year, deadline, questions } = req.body
  try {
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (program !== undefined) updateData.program = program
    if (year !== undefined) updateData.year = year ? Number(year) : null
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null

    if (questions) {
      // Delete existing questions and create new ones
      await prisma.question.deleteMany({ where: { surveyId: id } })
      updateData.questions = {
        create: questions.map((q, idx) => ({
          text: q.text,
          type: q.type,
          options: q.options || [],
          order: idx,
        })),
      }
    }

    const updated = await prisma.survey.update({
      where: { id },
      data: updateData,
      include: { questions: { orderBy: { order: "asc" } } },
    })
    res.json(updated)
  } catch (e) {
    console.error(e)
    res.status(400).json({ message: "Update failed", error: e.message })
  }
}

export async function deleteSurvey(req, res) {
  const { id } = req.params
  try {
    await prisma.survey.delete({ where: { id } })
    res.json({ success: true, deletedId: id })
  } catch (e) {
    console.error(e)
    res.status(400).json({ message: "Delete failed" })
  }
}

export async function getSurveyAnalytics(req, res) {
  const { id } = req.params
  try {
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            responses: true,
          },
          orderBy: { order: "asc" },
        },
        assignments: true,
      },
    })

    if (!survey) return res.status(404).json({ message: "Survey not found" })

    const totalAssignments = survey.assignments.length
    const completedAssignments = survey.assignments.filter((a) => a.completed).length
    const participationRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0

    const questionAnalytics = survey.questions.map((q) => {
      const responses = q.responses
      const analytics = {
        id: q.id,
        text: q.text,
        type: q.type,
        totalResponses: responses.length,
      }

      if (q.type === "RATING") {
        const ratings = responses.map((r) => r.answerRating).filter((r) => r !== null)
        const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0
        analytics.averageRating = Number.parseFloat(avg)
      } else if (q.type === "MULTIPLE_CHOICE") {
        const optionCounts = {}
        q.options.forEach((opt) => (optionCounts[opt] = 0))
        responses.forEach((r) => {
          if (r.answerOption && optionCounts[r.answerOption] !== undefined) {
            optionCounts[r.answerOption]++
          }
        })
        analytics.distribution = Object.entries(optionCounts).map(([option, count]) => ({
          option,
          count,
          percentage: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
        }))
      } else if (q.type === "BOOLEAN") {
        const trueCount = responses.filter((r) => r.answerBoolean === true).length
        const falseCount = responses.filter((r) => r.answerBoolean === false).length
        analytics.distribution = [
          { option: "Yes", count: trueCount },
          { option: "No", count: falseCount },
        ]
      } else if (q.type === "TEXT") {
        analytics.responses = responses.map((r) => ({
          text: r.answerText,
          createdAt: r.createdAt,
        }))
      }

      return analytics
    })

    res.json({
      surveyId: survey.id,
      title: survey.title,
      totalAssignments,
      completedAssignments,
      participationRate,
      questions: questionAnalytics,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}
