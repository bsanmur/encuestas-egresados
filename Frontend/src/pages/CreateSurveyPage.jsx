import { useState } from "react";
import { adminService } from "../services/admin";

export default function CreateSurveyPage() {
  const [program, setProgram] = useState("");
  const [year, setYear] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Basic validation: allow empty program/year to mean "all"
    const payload = {};
    if (program.trim()) payload.program = program.trim();
    if (year.trim()) {
      const parsed = Number(year);
      if (Number.isNaN(parsed)) {
        setError("Año inválido");
        return;
      }
      payload.year = parsed;
    }

    try {
      setSending(true);
      const res = await adminService.sendNewsletter(payload);
      setMessage(res?.message || "Correo(s) enviado(s)");
    } catch (err) {
      setError(err?.response?.data?.message || "Fallo al enviar el correo");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* form */}
      {/* Send survey button */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-2">Create Survey</h1>
        <p className="text-gray-600 mb-4">
          (Enviar correo a egresados - sin encuesta por ahora)
        </p>

        <form
          onSubmit={handleSend}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="border p-2 rounded"
            placeholder="Programa (dejar vacío = todos)"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Año de egreso (opcional)"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm col-span-full">{error}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm col-span-full">{message}</p>
          )}

          <button
            className="bg-blue-600 text-white p-2 rounded col-span-full hover:bg-blue-700 disabled:opacity-50"
            type="submit"
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar encuesta (correo)"}
          </button>
        </form>
      </div>
    </>
  );
}
