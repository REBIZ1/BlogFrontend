// src/components/RichTextEditor.js
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Полноценный набор кнопок на тулбаре
const modules = {
  toolbar: [
    // Заголовки
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // Инлайновое форматирование
    ['bold', 'italic', 'underline', 'strike'],
    // Цитата, код-блок
    ['blockquote', 'code-block'],
    // Списки
    [{ list: 'ordered' }, { list: 'bullet' }],
    // Индентация и направление
    [{ indent: '-1' }, { indent: '+1' }, { direction: 'rtl' }],
    // Верхний/нижний индекс
    [{ script: 'sub' }, { script: 'super' }],
    // Размер шрифта
    [{ size: ['small', false, 'large', 'huge'] }],
    // Цвет текста и фон
    [{ color: [] }, { background: [] }],
    // Семейство шрифтов
    [{ font: [] }],
    // Выравнивание
    [{ align: [] }],
    // Вставка
    ['link', 'image', 'video'],
    // Очистка форматирования
    ['clean']
  ],
  clipboard: {
    // Не вставлять лишние стили
    matchVisual: false
  }
};

// Полный перечень разрешённых форматов
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'indent', 'direction',
  'script',
  'size',
  'color', 'background',
  'font',
  'align',
  'link', 'image', 'video'
];

export default function RichTextEditor({ value, onChange, className }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder="Напишите текст статьи..."
      className={className}
    />
  );
}
