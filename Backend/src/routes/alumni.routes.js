import { Router } from "express"
import { authMiddleware, requireRole } from "../middleware/auth.js"
import {
  getMyProfile,
  updateMyProfile,
  getMySurveys,
  getSurveyForAlumni,
  submitSurveyResponse,
} from "../controllers/alumni.controller.js"

const router = Router()

router.use(authMiddleware, requireRole("ALUMNI"))

router.get("/profile/me", getMyProfile)
router.put("/profile/me", updateMyProfile)

router.get("/surveys", getMySurveys)
router.get("/surveys/:surveyId", getSurveyForAlumni)
router.post("/surveys/:surveyId/submit", submitSurveyResponse)

export default router
