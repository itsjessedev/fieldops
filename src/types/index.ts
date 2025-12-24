export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  location: Location;
  customerName: string;
  customerPhone: string;
  scheduledDate: string;
  estimatedDuration: number; // minutes
  notes: string[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tasksCompleted: number;
  rating: number;
}

export interface DashboardStats {
  todayTasks: number;
  completedToday: number;
  pendingTasks: number;
  avgCompletionTime: number;
}
