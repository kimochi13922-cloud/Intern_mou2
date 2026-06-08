import React, { createContext, useState, useEffect, useContext } from 'react';

const SqlContext = createContext();

// เปลี่ยน URL เป็น API ของ Backend (Node.js/PHP/Python) ที่เชื่อมต่อกับ SQL Database
const API_URL = "http://localhost:5000/api/mou_data"; 

export const SqlProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก Backend API (SELECT * FROM mou_data)
  const fetchRows = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching SQL data via API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  // เพิ่มข้อมูลใหม่ส่งไปที่ Backend API (INSERT INTO mou_data)
  const addRow = async (newRowData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRowData),
      });
      if (response.ok) {
        // รีเฟรชข้อมูลเมื่อเพิ่มสำเร็จ
        fetchRows(); 
      }
    } catch (error) {
      console.error("Error adding row to SQL via API:", error);
    }
  };

  // ลบแถวออกจากตาราง mou_data (DELETE)
  const removeMou = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchRows(); // รีเฟรชข้อมูลเมื่อลบสำเร็จ
      } else {
        console.error("Failed to delete mou_data row, status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting mou_data row via API:", error);
    }
  };

  return (
    <SqlContext.Provider value={{ sqlData: data, loading, addRow, removeMou, refreshData: fetchRows }}>
      {children}
    </SqlContext.Provider>
  );
};

export const useSql = () => useContext(SqlContext);

// ================================================================
// ==== activity_data Context ====
// ================================================================

const ACTIVITY_API_URL = "http://localhost:5000/api/activity_data";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activityData, setActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // ดึงข้อมูลจาก Backend API (SELECT * FROM activity_data)
  const fetchActivities = async () => {
    try {
      setActivityLoading(true);
      const response = await fetch(ACTIVITY_API_URL);
      const result = await response.json();
      setActivityData(result);
    } catch (error) {
      console.error("Error fetching activity_data via API:", error);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // เพิ่มข้อมูลใหม่ส่งไปที่ Backend API (INSERT INTO activity_data)
  const addActivity = async (newActivityData) => {
    try {
      const response = await fetch(ACTIVITY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivityData),
      });
      if (response.ok) {
        fetchActivities(); // รีเฟรชข้อมูลเมื่อเพิ่มสำเร็จ
      }
    } catch (error) {
      console.error("Error adding row to activity_data via API:", error);
    }
  };

  // ลบแถวออกจากตาราง activity_data (DELETE)
  const removeActivity = async (mouid) => {
    try {
      const response = await fetch(`${ACTIVITY_API_URL}/${mouid}`, { method: "DELETE" });
      if (response.ok) {
        fetchActivities(); // รีเฟรชข้อมูลเมื่อลบสำเร็จ
      } else {
        console.error("Failed to delete activity_data row, status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting activity_data row via API:", error);
    }
  };

  return (
    <ActivityContext.Provider value={{ activityData, activityLoading, addActivity, removeActivity, refreshActivities: fetchActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
