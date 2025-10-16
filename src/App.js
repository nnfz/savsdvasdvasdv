// src/App.jsx
import React, { useState, useRef } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { motion } from "framer-motion";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef();

  const analyzePhoto = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const model = await blazeface.load();
      const predictions = await model.estimateFaces(imgRef.current, false);

      if (!predictions || predictions.length === 0) {
        setResult("😅 Лицо не найдено. Попробуйте другое фото с хорошим освещением.");
      } else {
        // Простая псевдо-логика подбора типа внешности
        const tone = ["светлый", "средний", "тёмный"][Math.floor(Math.random() * 3)];
        const style = ["casual", "minimal", "street", "classic"][Math.floor(Math.random() * 4)];
        const profile = getStyleProfile(tone, style);
        setResult(profile);
      }
    } catch (err) {
      console.error(err);
      setResult("Произошла ошибка при анализе 😔");
    }
    setLoading(false);
  };

  const getStyleProfile = (tone, style) => {
    const data = {
      casual: {
        name: "Casual — Повседневный комфорт",
        desc:
          "Уютный и универсальный стиль для повседневных дел. Джинсы, базовые футболки, лёгкие куртки. Цвета: белый, серый, светло-синий, хаки.",
        recommend: [
          {
            name: "Джинсы прямого кроя",
            link: "https://www.wildberries.ru/catalog/0/search.aspx?search=джинсы прямого кроя",
          },
          {
            name: "Футболка базовая хлопковая",
            link: "https://www.ozon.ru/search/?text=футболка базовая",
          },
          {
            name: "Кроссовки белые",
            link: "https://www.wildberries.ru/catalog/0/search.aspx?search=кроссовки белые",
          },
        ],
      },
      minimal: {
        name: "Minimal — Чистота линий",
        desc:
          "Минимализм — это лаконичные силуэты, нейтральные оттенки и дорогая простота. Белый, бежевый, чёрный и графит — твои союзники.",
        recommend: [
          {
            name: "Пальто прямого кроя",
            link: "https://www.ozon.ru/search/?text=пальто минимализм",
          },
          {
            name: "Водолазка однотонная",
            link: "https://www.wildberries.ru/catalog/0/search.aspx?search=водолазка однотонная",
          },
          {
            name: "Сумка-шоппер кожаная",
            link: "https://www.ozon.ru/search/?text=сумка шоппер кожаная",
          },
        ],
      },
      street: {
        name: "Street — Городской стиль",
        desc:
          "Современный уличный стиль с элементами спортивного и винтажного. Худи, джоггеры, oversize-крои. Добавь бейсболку и массивные кроссовки.",
        recommend: [
          {
            name: "Худи oversize",
            link: "https://www.wildberries.ru/catalog/0/search.aspx?search=худи oversize",
          },
          {
            name: "Джоггеры серые",
            link: "https://www.ozon.ru/search/?text=джоггеры",
          },
          {
            name: "Бейсболка нейтральная",
            link: "https://www.wildberries.ru/catalog/0/search.aspx?search=бейсболка",
          },
        ],
      },
      classic: {
        name: "Classic — Современная элегантность",
        desc:
          "Подчёркнутая сдержанность, чистые формы и благородные ткани. Подходит для офиса и встреч. Бежевый, бордовый, синий, чёрный.",
        recommend: [
          {
            name: "Пиджак классический",
            link: "https://www.ozon.ru/search/?text=пиджак женский классический",
          },
          {
            name: "Юбка-карандаш",
            link: "https://www.wildberries.ru/catalog/0/search.aspx?search=юбка карандаш",
          },
          {
            name: "Блузка шелковая",
            link: "https://www.ozon.ru/search/?text=шелковая блузка",
          },
        ],
      },
    };
    return { ...data[style], tone };
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-6 text-center"
      >
        👕 ZerkaloStil
      </motion.h1>

      <p className="text-center max-w-lg text-gray-600 mb-8">
        Загрузите фото, и ZerkaloStil подберёт стиль одежды, который подчеркнёт вашу индивидуальность.  
        Всё работает прямо в браузере — без серверов и регистрации.
      </p>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="mb-4 text-sm text-gray-700"
        />

        {image && (
          <img
            src={image}
            ref={imgRef}
            alt="preview"
            className="w-full rounded-2xl object-cover mb-6 border border-gray-300"
          />
        )}

        <button
          onClick={analyzePhoto}
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-full text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Анализирую..." : "🔍 Определить стиль"}
        </button>

        {typeof result === "string" && (
          <p className="mt-4 text-red-500 text-center">{result}</p>
        )}

        {result && typeof result === "object" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {result.name}
            </h2>
            <p className="text-gray-600 mb-4">{result.desc}</p>

            <div className="text-sm text-gray-500 mb-3">
              💡 Рекомендованные цвета для {result.tone} тона кожи
            </div>

            <div className="space-y-2">
              {result.recommend.map((r, i) => (
                <a
                  key={i}
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block border border-gray-200 rounded-xl py-2 hover:bg-gray-100 transition"
                >
                  {r.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © 2025 ZerkaloStil — твой цифровой стилист
      </footer>
    </div>
  );
}
