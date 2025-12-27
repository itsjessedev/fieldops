import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { TaskDetailScreen } from './src/screens/TaskDetailScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { Task } from './src/types';

type Screen = 'dashboard' | 'tasks' | 'taskDetail' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setCurrentScreen('taskDetail');
  };

  const handleTaskUpdated = (task: Task) => {
    setSelectedTask(task);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            onTaskPress={handleTaskPress}
            onViewAllTasks={() => setCurrentScreen('tasks')}
          />
        );
      case 'tasks':
        return <TasksScreen onTaskPress={handleTaskPress} />;
      case 'taskDetail':
        return selectedTask ? (
          <TaskDetailScreen
            task={selectedTask}
            onBack={() => setCurrentScreen('tasks')}
            onTaskUpdated={handleTaskUpdated}
          />
        ) : (
          <TasksScreen onTaskPress={handleTaskPress} />
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return (
          <DashboardScreen
            onTaskPress={handleTaskPress}
            onViewAllTasks={() => setCurrentScreen('tasks')}
          />
        );
    }
  };

  const tabItems: { screen: Screen; icon: string; activeIcon: string }[] = [
    { screen: 'dashboard', icon: 'home-outline', activeIcon: 'home' },
    { screen: 'tasks', icon: 'clipboard-outline', activeIcon: 'clipboard' },
    { screen: 'profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {renderScreen()}

      {/* Bottom Navigation - Hide on task detail */}
      {currentScreen !== 'taskDetail' && (
        <View style={styles.tabBar}>
          {tabItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <TouchableOpacity
                key={item.screen}
                style={styles.tabItem}
                onPress={() => setCurrentScreen(item.screen)}
              >
                <Ionicons
                  name={(isActive ? item.activeIcon : item.icon) as any}
                  size={24}
                  color={isActive ? '#6366F1' : '#9CA3AF'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
