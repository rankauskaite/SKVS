import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function SelectDeliveryTimePage({ orderId, onBack, onSuccess }) {
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/AvailableDeliveryTime")
      .then((res) => {
        if (!res.ok) throw new Error("Nepavyko gauti laikų");
        return res.json();
      })
      .then((data) => setTimes(data)) // Naudojam kaip yra
      .catch((err) => {
        console.error("❌ Klaida gaunant laikus:", err);
        setError("Nepavyko gauti laikų");
      });
  }, []);

  const handleSelect = async () => {
    if (!selectedTime) {
      Swal.fire({
        title: "⚠️ Nepasirinktas laikas",
        text: "Prašome pasirinkti laiką iš sąrašo",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await fetch(`/api/transportationorder/${orderId}/setDeliveryTime`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryTimeId: selectedTime.id }),
      });

      if (!response.ok) throw new Error("Nepavyko išsaugoti pasirinkto laiko");

      Swal.fire({
        title: "✅ Pristatymo laikas pasirinktas!",
        html: `
          <p><strong>Data:</strong> ${selectedTime.date.split("T")[0]}</p>
          <p><strong>Laikas:</strong> ${selectedTime.time?.hours}:${selectedTime.time?.minutes}</p>
          <p><strong>Ramp:</strong> ${selectedTime.ramp}</p>
        `,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (typeof onSuccess === "function") {
          onSuccess(selectedTime);
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Klaida siunčiant laiką:", error);
      Swal.fire({
        title: "❌ Klaida",
        text: "Nepavyko išsaugoti laiko. Bandykite dar kartą.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🕒 Pasirinkti pristatymo laiką</h2>

      {error && <p className="text-red-500">{error}</p>}

      {times.length === 0 ? (
        <p>Laikų nėra.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {times.map((t) => (
            <li key={t.id}>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="deliveryTime"
                  value={t.id}
                  onChange={() => setSelectedTime(t)}
                  className="mr-2"
                />
                <span>
                  {t.date.split("T")[0]} {t.time?.hours}:{t.time?.minutes} – Ramp: {t.ramp}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSelect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Pasirinkti
        </button>
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          ⬅️ Atgal
        </button>
      </div>
    </div>
  );
}

export default SelectDeliveryTimePage;
