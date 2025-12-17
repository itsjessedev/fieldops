import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStatus, TaskPriority } from '../types';

interface StatusBadgeProps {
  status?: TaskStatus;
  priority?: TaskPriority;
}

const statusColors: Record<TaskStatus, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  in_progress: { bg: '#DBEAFE', text: '#1E40AF' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

const priorityColors: Record<TaskPriority, { bg: string; text: string }> = {
  low: { bg: '#E5E7EB', text: '#374151' },
  medium: { bg: '#FEF3C7', text: '#92400E' },
  high: { bg: '#FED7AA', text: '#C2410C' },
  urgent: { bg: '#FEE2E2', text: '#DC2626' },
};

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority }) => {
  if (status) {
    const colors = statusColors[status];
    return (
      <View style={[styles.badge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          {statusLabels[status]}
        </Text>
      </View>
    );
  }

  if (priority) {
    const colors = priorityColors[priority];
    return (
      <View style={[styles.badge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          {priorityLabels[priority]}
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
