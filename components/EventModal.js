"use client";

import React, { useState, useEffect, useRef } from "react";

export default function EventModal({
  selectedDate,
  events,
  setShowModal,
  addEvent,
  updateEvent,
  deleteEvent,
}) {
  const modalRef = useRef(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      modalElement.style.opacity = "1";
      modalElement.style.transform = "scale(1)";
    }
  }, []);

  const handleClose = () => {
    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.style.opacity = "0";
      modalElement.style.transform = "scale(0.9)";
    }
    setTimeout(() => setShowModal(false), 500);
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/event/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newEventTitle, date: selectedDate }),
      });

      if (response.ok) {
        const newEvent = await response.json();
        addEvent(newEvent);
        setNewEventTitle("");
      } else {
        alert("イベントの追加に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/event/${editingEvent.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingEvent.title,
            date: selectedDate,
          }),
        }
      );
      if (!response.ok) throw new Error("更新に失敗しました");
      const updatedEvent = await response.json();

      updateEvent(updatedEvent);
      setEditingEvent(null);
    } catch (error) {
      alert("エラーが発生しました: " + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/event/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteEvent(id);
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className='bg-white p-6 rounded-lg shadow-lg w-96'
        style={{ opacity: 0, transform: "scale(0.9)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-bold mb-4'>{selectedDate} のイベント</h2>
        <ul className='space-y-4'>
          {events.map((event) => (
            <li key={event.id} className='border p-2 rounded-lg'>
              {editingEvent?.id === event.id ? (
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={editingEvent.title}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        title: e.target.value,
                      })
                    }
                    className='flex-grow border rounded-lg p-2'
                  />
                  <button
                    onClick={handleUpdateEvent}
                    className='bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition'
                  >
                    更新
                  </button>
                </div>
              ) : (
                <div className='flex justify-between items-center'>
                  <span>{event.title}</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setEditingEvent(event)}
                      className='bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition'
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className='bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition'
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className='mt-4'>
          <h3 className='font-semibold'>新しいイベントを追加:</h3>
          <div className='flex gap-2 mt-2'>
            <input
              type='text'
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className='flex-grow border rounded-lg p-2'
              placeholder='イベント名を入力'
            />
            <button
              onClick={handleAddEvent}
              className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition'
            >
              追加
            </button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className='mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition'
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
