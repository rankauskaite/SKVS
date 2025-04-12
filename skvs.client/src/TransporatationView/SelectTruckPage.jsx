import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function SelectTruckPage({ onSelect, onBack }) {
  const [trucks, setTrucks] = useState([]);
  const [selectedPlate, setSelectedPlate] = useState("");

  useEffect(() => {
    fetch("/api/truck")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Gauti vilkikai:", data);
        setTrucks(data);
      })
      .catch((err) => console.error("Klaida gaunant vilkikus:", err));
  }, []);

  const handleSelect = () => {
    console.log("🛻 Pasirinktas plateNumber:", selectedPlate);
    const truck = trucks.find((t) => t.plateNumber === selectedPlate);

    if (truck && onSelect) {
      console.log("🎯 Pasirinktas vilkikas:", truck);
      MySwal.fire({
        title: "✅ Vilkikas pasirinktas sėkmingai!",
        icon: "success",
        confirmButtonText: "Gerai",
        confirmButtonColor: "#60a5fa",
      }).then(() => {
        onSelect(truck);
        onBack();
      });
    } else {
      MySwal.fire({
        title: "⚠️ Nepasirinktas vilkikas",
        text: "Pasirinkite vilkiką prieš tęsiant.",
        icon: "warning",
        confirmButtonText: "Gerai",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🚛 Pasirinkti vilkiką</h2>
      <ul className="space-y-2">
        {trucks.map((truck) => (
          <li key={truck.plateNumber}>
            <label>
              <input
                type="radio"
                name="truck"
                value={truck.plateNumber}
                onChange={() => setSelectedPlate(truck.plateNumber)}
                className="mr-2"
              />
              {truck.plateNumber} ({truck.model})
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
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

export default SelectTruckPage;
