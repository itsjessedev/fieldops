import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, compact = false }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={styles.compactLeft}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={styles.compactCustomer} numberOfLines={1}>
            {task.customerName}
          </Text>
        </View>
        <View style={styles.compactRight}>
          <StatusBadge priority={task.priority} />
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <StatusBadge status={task.status} />
          <StatusBadge priority={task.priority} />
        </View>
        <Text style={styles.time}>{formatTime(task.scheduledDate)}</Text>
      </View>

      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{task.customerName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={1}>
            {task.location.address}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>Est. {task.estimatedDuration} min</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="navigate-outline" size={18} color="#6366F1" />
          <Text style={styles.actionText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call-outline" size={18} color="#6366F1" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  compactLeft: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  compactCustomer: {
    fontSize: 13,
    color: '#6B7280',
  },
  compactRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
