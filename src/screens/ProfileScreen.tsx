import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { taskService } from '../services/taskService';

export const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await taskService.getUser();
    setUser(userData);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: '#6366F1' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#F59E0B' },
    { icon: 'calendar-outline', label: 'Schedule', color: '#10B981' },
    { icon: 'document-text-outline', label: 'Reports', color: '#8B5CF6' },
    { icon: 'settings-outline', label: 'Settings', color: '#6B7280' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#3B82F6' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#6366F1" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Loading...'}</Text>
        <Text style={styles.userRole}>{user?.role}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.tasksCompleted || 0}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.ratingRow}>
            <Text style={styles.statValue}>{user?.rating || 0}</Text>
            <Ionicons name="star" size={18} color="#F59E0B" />
          </View>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>On-Time</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.achievementsScroll}
        >
          <View style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.achievementTitle}>Top Performer</Text>
            <Text style={styles.achievementDesc}>Dec 2024</Text>
          </View>
          <View style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="flash" size={24} color="#10B981" />
            </View>
            <Text style={styles.achievementTitle}>Speed Demon</Text>
            <Text style={styles.achievementDesc}>100+ Quick Fixes</Text>
          </View>
          <View style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="star" size={24} color="#6366F1" />
            </View>
            <Text style={styles.achievementTitle}>5-Star Tech</Text>
            <Text style={styles.achievementDesc}>50+ Reviews</Text>
          </View>
        </ScrollView>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.color}
                />
              </View>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>FieldOps v1.0.0</Text>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 24,
  },
  bottomPadding: {
    height: 100,
  },
});
