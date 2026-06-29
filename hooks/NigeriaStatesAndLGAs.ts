import { useState, useEffect } from "react";

type Ward = { name: string; latitude: number; longitude: number };
type LGA = { name: string; wards: Ward[] };
type StateData = { state: string; lgas: LGA[] };

export function NigeriaStatesAndLGAs() {
  const [data, setData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://temikeezy.github.io/nigeria-geojson-data/data/full.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { data, loading };
}
