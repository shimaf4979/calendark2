import React from "react";

const RecentEvents = ({ events, onEventClick }) => {
  return (
    <div className='mt-6 p-4 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-center text-primary'>
        近い予定
      </h2>
      <ul className='space-y-4'>
        {events.map((event) => (
          <li
            key={event.id}
            className='recent-event-item p-4 shadow-lg transition-transform from-blue-100 to-blue-200 transform hover:scale-105 cursor-pointer'
            onClick={() => onEventClick(event)} // クリックイベントを追加
          >
            <span className='font-semibold text-lg'>{event.title}</span>
            <div className='text-white-700'>{event.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentEvents;
