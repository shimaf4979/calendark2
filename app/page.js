"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./../components/EventModal";
import RecentEvents from "./../components/RecentEvent";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // 編集中のイベント

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/event/");
        const json = await response.json();
        setEvents(
          json.map((item) => ({
            id: item.id,
            title: item.title,
            date: item.date,
          }))
        );
      } catch (error) {
        alert("データが取得できませんでした");
      }
    };
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    const dateEvents = events.filter((event) => event.date === arg.dateStr);
    setSelectedDate(arg.dateStr);
    setSelectedEvents(dateEvents);
    setShowModal(true);
  };

  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    if (newEvent.date === selectedDate) {
      setSelectedEvents((prev) => [...prev, newEvent]);
    }
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setSelectedEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    setSelectedEvents((prev) => prev.filter((event) => event.id !== id));
  };

  // 近い予定を取得する関数
  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter((event) => new Date(event.date) >= today) // 今日以降のイベントをフィルタリング
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // 日付でソート
      .slice(0, 5); // 最初の5つを取得
  };

  // 近い予定のイベントがクリックされたときの処理
  const handleEventClick = (event) => {
    setEditingEvent(event); // 編集中のイベントを設定
    setSelectedDate(event.date); // 選択された日付を設定
    setSelectedEvents([event]); // 選択されたイベントを設定
    setShowModal(true); // モーダルを表示
  };

  return (
    <div className='relative p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6'>
        イベントカレンダー
      </h1>
      <div className='bg-white rounded-lg shadow-lg p-6 relative z-0'>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          dateClick={handleDateClick}
          initialView='dayGridMonth'
          weekends={true}
          locale='ja'
          events={events}
          height='auto'
          className='rounded-lg border'
        />
      </div>
      {showModal && (
        <EventModal
          selectedDate={selectedDate}
          events={selectedEvents}
          setShowModal={setShowModal}
          addEvent={addEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          editingEvent={editingEvent} // 編集中のイベントを渡す
          setEditingEvent={setEditingEvent} // 編集中のイベントを設定する関数を渡す
        />
      )}
      <RecentEvents
        events={getUpcomingEvents()}
        onEventClick={handleEventClick}
      />{" "}
      {/* 近い予定を表示 */}
    </div>
  );
}
