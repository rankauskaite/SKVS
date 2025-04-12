import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function SelectDriverPage({ onSelect, onBack }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/driver");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Klaida gaunant vairuotojus:", error);
    }
  };

  const handleSelect = () => {
    if (selectedDriver) {
      MySwal.fire({
        title: "✅ Vairuotojas pasirinktas sėkmingai!",
        icon: "success",
        confirmButtonText: "Gerai",
        confirmButtonColor: "#60a5fa",
      }).then(() => {
        onSelect(selectedDriver);
        onBack(); // Automatinis grįžimas
      });
    } else {
      MySwal.fire({
        title: "⚠️ Nepasirinktas vairuotojas",
        text: "Pasirinkite vairuotoją iš sąrašo prieš tęsdami.",
        icon: "warning",
        confirmButtonText: "Gerai",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👤 Pasirinkti vairuotoją</h2>

      {drivers.length === 0 ? (
        <p>Nėra galimų vairuotojų.</p>
      ) : (
        <ul className="mb-4">
          {drivers.map((driver) => (
            <li key={driver.userId} className="mb-2">
              <label>
                <input
                  type="radio"
                  name="selectedDriver"
                  value={driver.userId}
                  onChange={() => setSelectedDriver(driver)}
                  className="mr-2"
                />
                {driver.name} {driver.surname}
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-4">
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

export default SelectDriverPage;
