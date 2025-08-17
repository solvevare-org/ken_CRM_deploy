import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'showing' | 'listing' | 'consultation' | 'closing' | 'inspection' | 'meeting' | 'reminder';
  date: Date;
  time: string;
  duration: string;
  location?: string;
  client?: string;
  property?: string;
  description?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Property Showing - Downtown Condo',
      type: 'showing',
      date: new Date(2024, 0, 25),
      time: '10:00 AM',
      duration: '1 hour',
      location: '123 Main Street, Suite 4B',
      client: 'Jennifer Martinez',
      property: 'Modern Downtown Condo',
      description: 'First-time buyer interested in 2-bedroom condo',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Listing Consultation',
      type: 'consultation',
      date: new Date(2024, 0, 26),
      time: '2:00 PM',
      duration: '2 hours',
      location: '456 Oak Avenue',
      client: 'Robert Smith',
      property: 'Family Home with Garden',
      description: 'Initial consultation for listing family home',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Home Inspection',
      type: 'inspection',
      date: new Date(2024, 0, 27),
      time: '9:00 AM',
      duration: '3 hours',
      location: '789 Beach Road',
      client: 'Sarah Johnson',
      property: 'Luxury Waterfront Villa',
      description: 'Professional home inspection',
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'Closing Meeting',
      type: 'closing',
      date: new Date(2024, 0, 28),
      time: '11:00 AM',
      duration: '2 hours',
      location: 'Law Office Downtown',
      client: 'Michael Chen',
      property: 'Modern Downtown Condo',
      description: 'Final closing documents and key handover',
      status: 'confirmed'
    },
    {
      id: '5',
      title: 'Follow-up Call - Lisa Chen',
      type: 'reminder',
      date: new Date(2024, 0, 29),
      time: '3:00 PM',
      duration: '30 minutes',
      client: 'Lisa Chen',
      description: 'Follow up on luxury property requirements',
      status: 'scheduled'
    },
    {
      id: '6',
      title: 'Team Meeting',
      type: 'meeting',
      date: new Date(2024, 0, 30),
      time: '9:00 AM',
      duration: '1 hour',
      location: 'Office Conference Room',
      description: 'Weekly team sync and pipeline review',
      status: 'scheduled'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'showing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'listing':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'consultation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inspection':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'meeting':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'reminder':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-emerald-600';
      case 'scheduled':
        return 'text-blue-600';
      case 'completed':
        return 'text-gray-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 lg:h-32"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 lg:h-32 p-1 lg:p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
            isToday ? 'bg-blue-50 border-blue-200' : ''
          } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
                title={`${event.title} - ${event.time}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage appointments and schedule events</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {getEventsForDate(new Date()).length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Clock className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Showings</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.type === 'showing').length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'confirmed').length}
              </p>
            </div>
            <User className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 lg:p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {renderCalendarGrid()}
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Selected Date Events */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time} ({event.duration})
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                      {event.client && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {event.client}
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-500 mt-2">{event.description}</p>
                    )}
                    <div className={`text-xs font-medium mt-2 ${getStatusColor(event.status)}`}>
                      Status: {event.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {selectedDate ? 'No events scheduled for this date.' : 'Click on a date to view events.'}
              </p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events
                .filter(event => event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      event.type === 'showing' ? 'bg-blue-500' :
                      event.type === 'consultation' ? 'bg-purple-500' :
                      event.type === 'closing' ? 'bg-orange-500' :
                      event.type === 'inspection' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {event.date.toLocaleDateString()} at {event.time}
                      </p>
                      {event.client && (
                        <p className="text-xs text-gray-500">with {event.client}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;