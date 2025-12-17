import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../types';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';

interface TasksScreenProps {
  onTaskPress: (task: Task) => void;
}

const statusFilters: { key: TaskStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export const TasksScreen: React.FC<TasksScreenProps> = ({ onTaskPress }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      applyFilters(data, activeFilter, searchQuery);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const applyFilters = (
    taskList: Task[],
    status: TaskStatus | 'all',
    search: string
  ) => {
    let filtered = taskList;

    if (status !== 'all') {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.customerName.toLowerCase().includes(query) ||
          t.location.address.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (filter: TaskStatus | 'all') => {
    setActiveFilter(filter);
    applyFilters(tasks, filter, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(tasks, activeFilter, query);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              activeFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(filter.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.filterTabTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TaskCard task={item} onPress={() => onTaskPress(item)} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try a different search term'
                : 'No tasks match the selected filter'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  titleBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
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
  headerContainer: {
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  filterTabActive: {
    backgroundColor: '#6366F1',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardContainer: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
