import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, DashboardStats, User } from '../types';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';

interface DashboardScreenProps {
  onTaskPress: (task: Task) => void;
  onViewAllTasks: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onTaskPress,
  onViewAllTasks,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, userData, tasksData] = await Promise.all([
        taskService.getDashboardStats(),
        taskService.getUser(),
        taskService.getTasks(),
      ]);
      setStats(statsData);
      setUser(userData);
      // Show pending/in_progress tasks first
      const upcoming = tasksData
        .filter((t) => t.status !== 'completed' && t.status !== 'cancelled')
        .slice(0, 3);
      setUpcomingTasks(upcoming);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user?.name || 'Technician'}</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#6366F1" />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.primaryStatCard]}>
          <Ionicons name="today-outline" size={28} color="#FFFFFF" />
          <Text style={styles.statNumber}>{stats?.todayTasks || 0}</Text>
          <Text style={styles.statLabel}>Today's Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={28} color="#10B981" />
          <Text style={[styles.statNumber, { color: '#10B981' }]}>
            {stats?.completedToday || 0}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="hourglass-outline" size={28} color="#F59E0B" />
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
            {stats?.pendingTasks || 0}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="scan-outline" size={24} color="#6366F1" />
            </View>
            <Text style={styles.quickActionText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="camera-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.quickActionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="document-text-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.quickActionText}>New Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.quickActionText}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={onViewAllTasks}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {upcomingTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={48} color="#10B981" />
            <Text style={styles.emptyStateText}>All caught up!</Text>
          </View>
        ) : (
          upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskPress(task)}
            />
          ))
        )}
      </View>

      {/* Performance Card */}
      <View style={styles.performanceCard}>
        <Text style={styles.performanceTitle}>Your Performance</Text>
        <View style={styles.performanceStats}>
          <View style={styles.performanceStat}>
            <Text style={styles.performanceNumber}>{user?.tasksCompleted || 0}</Text>
            <Text style={styles.performanceLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.performanceDivider} />
          <View style={styles.performanceStat}>
            <View style={styles.ratingContainer}>
              <Text style={styles.performanceNumber}>{user?.rating || 0}</Text>
              <Ionicons name="star" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.performanceLabel}>Rating</Text>
          </View>
          <View style={styles.performanceDivider} />
          <View style={styles.performanceStat}>
            <Text style={styles.performanceNumber}>{stats?.avgCompletionTime || 0}m</Text>
            <Text style={styles.performanceLabel}>Avg Time</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryStatCard: {
    backgroundColor: '#6366F1',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  performanceCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  performanceDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomPadding: {
    height: 100,
  },
});
