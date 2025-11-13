import AlumniProfile from "../components/Alumni/AlumniProfile.jsx"
import MySurveys from "../components/Alumni/MySurveys.jsx"

export default function AlumniDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Alumni Dashboard</h1>
      <AlumniProfile />
      <MySurveys />
    </div>
  )
}
