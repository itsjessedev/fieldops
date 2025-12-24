import { Task, User, DashboardStats, TaskStatus } from '../types';

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'HVAC Maintenance',
    description: 'Quarterly maintenance check for commercial HVAC system. Inspect filters, coils, and refrigerant levels.',
    status: 'pending',
    priority: 'high',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business Center Dr, New York, NY 10001',
    },
    customerName: 'Metro Office Complex',
    customerPhone: '(555) 123-4567',
    scheduledDate: new Date().toISOString(),
    estimatedDuration: 90,
    notes: ['Bring extra filters', 'Access code: 4521'],
    photos: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Electrical Panel Inspection',
    description: 'Annual safety inspection of main electrical panel and circuit breakers.',
    status: 'in_progress',
    priority: 'medium',
    location: {
      latitude: 40.758,
      longitude: -73.9855,
      address: '456 Industrial Way, Brooklyn, NY 11201',
    },
    customerName: 'Brooklyn Manufacturing',
    customerPhone: '(555) 234-5678',
    scheduledDate: new Date().toISOString(),
    estimatedDuration: 60,
    notes: ['Contact site manager on arrival'],
    photos: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Plumbing Repair',
    description: 'Fix leaking pipe under sink in break room. Customer reports water damage.',
    status: 'pending',
    priority: 'urgent',
    location: {
      latitude: 40.7484,
      longitude: -73.9857,
      address: '789 Corporate Plaza, Manhattan, NY 10016',
    },
    customerName: 'Tech Startup Inc',
    customerPhone: '(555) 345-6789',
    scheduledDate: new Date().toISOString(),
    estimatedDuration: 45,
    notes: ['Emergency call - priority service'],
    photos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Security System Setup',
    description: 'Install new security cameras and configure NVR system for retail store.',
    status: 'completed',
    priority: 'medium',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '321 Retail Row, Queens, NY 11101',
    },
    customerName: 'Fashion Boutique',
    customerPhone: '(555) 456-7890',
    scheduledDate: new Date(Date.now() - 86400000).toISOString(),
    estimatedDuration: 180,
    notes: ['4 cameras installed', 'Customer trained on app'],
    photos: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    title: 'Generator Maintenance',
    description: 'Monthly check and oil change for backup generator.',
    status: 'pending',
    priority: 'low',
    location: {
      latitude: 40.6892,
      longitude: -74.0445,
      address: '555 Harbor View, Staten Island, NY 10301',
    },
    customerName: 'Waterfront Restaurant',
    customerPhone: '(555) 567-8901',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    estimatedDuration: 60,
    notes: [],
    photos: [],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockUser: User = {
  id: 'tech-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@fieldops.demo',
  role: 'Senior Field Technician',
  tasksCompleted: 247,
  rating: 4.9,
};

class TaskService {
  private tasks: Task[] = [...mockTasks];

  async getTasks(): Promise<Task[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.tasks;
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.tasks.find((t) => t.id === id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
    }
    return task;
  }

  async addNote(id: string, note: string): Promise<Task | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.notes.push(note);
      task.updatedAt = new Date().toISOString();
    }
    return task;
  }

  async getUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUser;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const today = new Date().toDateString();
    const todayTasks = this.tasks.filter(
      (t) => new Date(t.scheduledDate).toDateString() === today
    );
    const completedToday = todayTasks.filter((t) => t.status === 'completed').length;

    return {
      todayTasks: todayTasks.length,
      completedToday,
      pendingTasks: this.tasks.filter((t) => t.status === 'pending').length,
      avgCompletionTime: 67,
    };
  }
}

export const taskService = new TaskService();
