"use client";

import { useState } from "react";

type WeatherData = {
  temperature: number;
  windspeed: number;
  weathercode: number;
};

function weatherDescription(code: number) {
  if (code === 0) return "Cer senin";
  if (code <= 3) return "Parțial noros";
  if (code <= 48) return "Ceață";
  if (code <= 67) return "Ploaie";
  if (code <= 77) return "Ninsoare";
  if (code <= 82) return "Averse";
  if (code >= 95) return "Furtună";
  return "Vreme variabilă";
}

function weatherEmoji(code: number) {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}

export default function Home() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchWeather(cityName: string) {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cityName
        )}&count=1&language=ro&format=json`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Localitatea nu a fost găsită.");
      }

      const location = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,windspeed_10m,weathercode&timezone=auto`
      );

      const weatherData = await weatherResponse.json();

      setWeather({
        temperature: weatherData.current.temperature_2m,
        windspeed: weatherData.current.windspeed_10m,
        weathercode: weatherData.current.weathercode,
      });

      setSearchedCity(location.name);
    } catch {
      setError("Nu am putut găsi vremea pentru această localitate.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    searchWeather(city);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #dff3ff 0%, #f7fbff 45%, #ffffff 100%)",
        fontFamily: "Arial, sans-serif",
        padding: "24px 16px 50px",
        color: "#172033",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <header style={{ textAlign: "center", padding: "20px 0 30px" }}>
          <div style={{ fontSize: "48px" }}>🌤️</div>

          <h1
            style={{
              fontSize: "42px",
              margin: "8px 0",
              fontWeight: 800,
            }}
          >
            Vremea
          </h1>

          <p
            style={{
              fontSize: "18px",
              margin: 0,
              color: "#536174",
            }}
          >
            Prognoza meteo pentru localități din România
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              background: "white",
              padding: "10px",
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
            }}
          >
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Caută o localitate..."
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                fontSize: "17px",
                padding: "12px",
              }}
            />

            <button
              type="submit"
              style={{
                border: "none",
                borderRadius: "12px",
                background: "#1677ff",
                color: "white",
                padding: "0 20px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Caută
            </button>
          </div>
        </form>

        {loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
              fontSize: "17px",
            }}
          >
            Se caută vremea...
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fff1f1",
              color: "#c62828",
              padding: "16px",
              borderRadius: "14px",
              marginTop: "25px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {weather && !loading && (
          <section
            style={{
              background: "white",
              marginTop: "25px",
              borderRadius: "24px",
              padding: "28px 22px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                margin: "0 0 12px",
              }}
            >
              {searchedCity}
            </h2>

            <div style={{ fontSize: "65px", margin: "5px 0" }}>
              {weatherEmoji(weather.weathercode)}
            </div>

            <div
              style={{
                fontSize: "54px",
                fontWeight: 800,
                margin: "5px 0",
              }}
            >
              {Math.round(weather.temperature)}°C
            </div>

            <div
              style={{
                fontSize: "18px",
                color: "#536174",
                marginBottom: "20px",
              }}
            >
              {weatherDescription(weather.weathercode)}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "#f4f8fc",
                  borderRadius: "14px",
                  padding: "15px",
                }}
              >
                <div style={{ fontSize: "24px" }}>🌡️</div>
                <strong>Temperatură</strong>
                <div>{weather.temperature}°C</div>
              </div>

              <div
                style={{
                  background: "#f4f8fc",
                  borderRadius: "14px",
                  padding: "15px",
                }}
              >
                <div style={{ fontSize: "24px" }}>💨</div>
                <strong>Vânt</strong>
                <div>{weather.windspeed} km/h</div>
              </div>
            </div>
          </section>
        )}

        <section style={{ marginTop: "35px" }}>
          <h2 style={{ fontSize: "24px" }}>Localități populare</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {[
              "București",
              "Cluj-Napoca",
              "Iași",
              "Timișoara",
              "Constanța",
              "Brașov",
            ].map((name) => (
              <button
                key={name}
                onClick={() => {
                  setCity(name);
                  searchWeather(name);
                }}
                style={{
                  background: "white",
                  border: "1px solid #e1e7ef",
                  borderRadius: "14px",
                  padding: "15px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📍 {name}
              </button>
            ))}
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            marginTop: "50px",
            color: "#718096",
            fontSize: "13px",
          }}
        >
          Date meteo furnizate de Open-Meteo
        </footer>
      </div>
    </main>
  );
        }
