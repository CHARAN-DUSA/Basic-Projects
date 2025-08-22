import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
        setFormData({ name: "", email: "", rollNo: "" });
      } else {
        setMessage(result.message || "Registration failed...");
      }
    } catch (error) {
      setMessage("Error connecting to the server...");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 w-[400px] mx-auto bg-white shadow-lg rounded-2xl">
        <h2 className="font-bold text-black text-2xl mb-4 text-center">
          Student Registration
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border p-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}   
            placeholder="Email"
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleInputChange}
            placeholder="Roll No"
            className="border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        {/* ✅ Message output */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
