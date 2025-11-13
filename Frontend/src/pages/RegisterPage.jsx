import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth";

const initialState = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  graduationYear: "",
  program: "",
  studentId: "",
  currentJobTitle: "",
  currentCompany: "",
  employmentStatus: "SEARCHING",
  schoolId: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      setLoadingSchools(true);
      const data = await authService.getSchools();
      setSchools(data);
    } catch (err) {
      console.error("Failed to load schools:", err);
      setError("Failed to load schools list. Please contact administrator.");
    } finally {
      setLoadingSchools(false);
    }
  }

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !form.email ||
      !form.password ||
      !form.fullName ||
      !form.graduationYear ||
      !form.program ||
      !form.schoolId ||
      !form.employmentStatus
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...form, graduationYear: Number(form.graduationYear) };
      await authService.register(payload);
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register as Alumni</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={onSubmit}
      >
        <input
          className="border p-2 rounded"
          placeholder="Email *"
          type="email"
          value={form.email}
          onChange={update("email")}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Password *"
          type="password"
          value={form.password}
          onChange={update("password")}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Full Name *"
          value={form.fullName}
          onChange={update("fullName")}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={update("phone")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Graduation Year *"
          type="number"
          value={form.graduationYear}
          onChange={update("graduationYear")}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Program *"
          value={form.program}
          onChange={update("program")}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Student ID (optional)"
          value={form.studentId}
          onChange={update("studentId")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Current Job Title"
          value={form.currentJobTitle}
          onChange={update("currentJobTitle")}
        />
        <input
          className="border p-2 rounded"
          placeholder="Current Company"
          value={form.currentCompany}
          onChange={update("currentCompany")}
        />
        <select
          className="border p-2 rounded"
          value={form.employmentStatus}
          onChange={update("employmentStatus")}
          required
        >
          <option value="">Select Employment Status *</option>
          <option value="EMPLOYED">Employed</option>
          <option value="UNEMPLOYED">Unemployed</option>
          <option value="SEARCHING">Searching</option>
          <option value="FREELANCE">Freelance</option>
        </select>
        <div>
          <select
            className="border p-2 rounded w-full"
            value={form.schoolId}
            onChange={update("schoolId")}
            required
            disabled={loadingSchools}
          >
            <option value="">
              {loadingSchools ? "Loading schools..." : "Select School *"}
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {schools.length === 0 && !loadingSchools && (
            <p className="text-xs text-red-500 mt-1">
              No schools available. Please contact administrator.
            </p>
          )}
        </div>
        {error && <p className="text-red-600 text-sm col-span-full">{error}</p>}
        <button
          className="bg-green-600 text-white p-2 rounded col-span-full hover:bg-green-700 disabled:opacity-50"
          type="submit"
          disabled={submitting || loadingSchools}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="mt-3 text-sm">
        <Link to="/login" className="text-blue-600">
          Back to login
        </Link>
      </div>
    </div>
  );
}
