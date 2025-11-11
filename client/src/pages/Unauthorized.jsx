export default function Unauthorized() {
  return (
    <div className="max-w-xl mx-auto mt-20 bg-white p-6 rounded shadow text-center">
      <h1 className="text-xl font-semibold">Unauthorized</h1>
      <p className="text-gray-600 mt-2">You don’t have access to this page.</p>
    </div>
  );
}
