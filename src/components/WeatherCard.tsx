"use client";

import type { WeatherDay } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WeatherCardProps {
  day: WeatherDay;
}

export default function WeatherCard({ day }: WeatherCardProps) {
  const date = new Date(day.date);
  const dayName = format(date, "EEEE", { locale: ptBR });
  const dayNumber = format(date, "dd/MM");

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-4 ${
        day.is_good_for_cycling
          ? "border-green-500 dark:border-green-400"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white capitalize">
            {dayName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{dayNumber}</p>
        </div>
        {day.is_good_for_cycling && (
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">
            Bom para pedalar
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <img
          src={getWeatherIcon(day.icon)}
          alt={day.description}
          className="w-16 h-16"
        />
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {day.temperature}°C
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {day.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium">Min:</span> {day.min_temp}°C
        </div>
        <div>
          <span className="font-medium">Max:</span> {day.max_temp}°C
        </div>
        <div>
          <span className="font-medium">Vento:</span> {day.wind_speed} km/h
        </div>
        <div>
          <span className="font-medium">Chuva:</span> {day.precipitation}mm
        </div>
      </div>
    </div>
  );
}

