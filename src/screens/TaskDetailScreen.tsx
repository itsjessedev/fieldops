import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { taskService } from '../services/taskService';

interface TaskDetailScreenProps {
  task: Task;
  onBack: () => void;
  onTaskUpdated: (task: Task) => void;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  task: initialTask,
  onBack,
  onTaskUpdated,
}) => {
  const [task, setTask] = useState(initialTask);
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true);
    try {
      const updated = await taskService.updateTaskStatus(task.id, newStatus);
      if (updated) {
        setTask(updated);
        onTaskUpdated(updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const updated = await taskService.addNote(task.id, newNote.trim());
      if (updated) {
        setTask(updated);
        setNewNote('');
        onTaskUpdated(updated);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add note');
    }
  };

  const getStatusActions = () => {
    switch (task.status) {
      case 'pending':
        return [
          { label: 'Start Task', status: 'in_progress' as TaskStatus, color: '#6366F1' },
        ];
      case 'in_progress':
        return [
          { label: 'Complete Task', status: 'completed' as TaskStatus, color: '#10B981' },
          { label: 'Put on Hold', status: 'pending' as TaskStatus, color: '#F59E0B' },
        ];
      case 'completed':
        return [
          { label: 'Reopen Task', status: 'in_progress' as TaskStatus, color: '#6366F1' },
        ];
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status & Priority */}
        <View style={styles.badgesRow}>
          <StatusBadge status={task.status} />
          <StatusBadge priority={task.priority} />
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        {/* Schedule */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6366F1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Scheduled</Text>
              <Text style={styles.infoValue}>{formatDate(task.scheduledDate)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#6366F1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estimated Duration</Text>
              <Text style={styles.infoValue}>{task.estimatedDuration} minutes</Text>
            </View>
          </View>
        </View>

        {/* Customer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <Ionicons name="person-circle-outline" size={40} color="#6366F1" />
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{task.customerName}</Text>
                <Text style={styles.customerPhone}>{task.customerPhone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={24} color="#6366F1" />
              <Text style={styles.locationAddress}>{task.location.address}</Text>
            </View>
            <TouchableOpacity style={styles.navigateButton}>
              <Ionicons name="navigate" size={18} color="#6366F1" />
              <Text style={styles.navigateText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {task.notes.length === 0 ? (
            <Text style={styles.emptyNotes}>No notes yet</Text>
          ) : (
            task.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))
          )}
          <View style={styles.addNoteContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note..."
              placeholderTextColor="#9CA3AF"
              value={newNote}
              onChangeText={setNewNote}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.addNoteButton,
                !newNote.trim() && styles.addNoteButtonDisabled,
              ]}
              onPress={handleAddNote}
              disabled={!newNote.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={newNote.trim() ? '#FFFFFF' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Actions */}
        <View style={styles.actionsSection}>
          {getStatusActions().map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => handleStatusChange(action.status)}
              disabled={isUpdating}
            >
              <Text style={styles.actionButtonText}>
                {isUpdating ? 'Updating...' : action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerDetails: {},
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  customerPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  locationAddress: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  navigateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  emptyNotes: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  noteInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 44,
    maxHeight: 100,
  },
  addNoteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  actionsSection: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 40,
  },
});
