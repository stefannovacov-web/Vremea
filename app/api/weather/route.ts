
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city || !city.trim()) {
    return NextResponse.json(
      { error: "Introdu numele unei localități." },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHERAPI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Cheia WeatherAPI nu este configurată." },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://api.weatherapi.com/v1/forecast.json");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("q", city.trim());
    url.searchParams.set("days", "7");
    url.searchParams.set("lang", "ro");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Eroare WeatherAPI." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Nu am putut obține datele meteo." },
      { status: 500 }
    );
  }
}

