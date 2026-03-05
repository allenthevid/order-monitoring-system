"use client";

import { useState, useEffect } from "react";
import { Filament } from "@/types";
import FilamentCard from "@/components/FilamentCard";
import FilamentForm from "@/components/FilamentForm";

export default function InventoryPage() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/filaments");
        const data = await response.json();
        
        if (!isMounted) return;
        
        if (Array.isArray(data)) {
          setFilaments(data);
        } else {
          console.error('Filaments API did not return an array:', data);
          setFilaments([]);
        }
      } catch (error) {
        console.error('Error fetching filaments:', error);
        if (isMounted) {
          setFilaments([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchFilaments = async () => {
    try {
      console.log('Refetching filaments...');
      const response = await fetch("/api/filaments");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setFilaments(data);
      } else {
        console.error('Filaments API did not return an array:', data);
        setFilaments([]);
      }
    } catch (error) {
      console.error('Error fetching filaments:', error);
    }
  };

  const handleAddFilament = async (filament: Omit<Filament, "id">) => {
    const response = await fetch("/api/filaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filament),
    });
    const newFilament = await response.json();
    setFilaments([...filaments, newFilament]);
    setShowForm(false);
  };

  const handleUpdateWeight = async (id: string, newWeight: number) => {
    await fetch(`/api/filaments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: newWeight }),
    });
    fetchFilaments();
  };

  const lowStockFilaments = filaments.filter(
    (f) => f.weight < f.lowStockThreshold
  );

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Filament Inventory</h1>
              {lowStockFilaments.length > 0 && (
                <p className="text-red-600 mt-2">
                  ⚠️ {lowStockFilaments.length} filament(s) running low on stock
                </p>
              )}
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {showForm ? "Cancel" : "Add Filament"}
            </button>
          </div>

          {showForm && (
            <div className="mb-6">
              <FilamentForm onSubmit={handleAddFilament} />
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filaments.map((filament) => (
              <FilamentCard
                key={filament.id}
                filament={filament}
                onUpdateWeight={handleUpdateWeight}
              />
            ))}
          </div>

          {filaments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No filaments in inventory. Add your first filament!
            </div>
          )}
        </>
      )}
    </div>
  );
}
