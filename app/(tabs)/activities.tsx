import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Text, Button, Chip, Card, useTheme, Snackbar, Switch, Portal, Modal, TextInput, Surface, Divider, Menu } from 'react-native-paper';
import { activities as initialActivities } from '../../constants/mockActivities';
import { useThemeMode } from '@/hooks/theme-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

const BREAKPOINT_MOBILE = 768;
const BREAKPOINT_TABLET = 1024;

const activityTypes = ['All', 'Online Class', 'Assignment', 'Quiz', 'Discussion'];

export default function ActivitiesScreen() {
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState(initialActivities);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<typeof initialActivities[number] | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedType, setSelectedType] = useState('Assignment');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  const theme = useTheme();
  const { mode, toggle } = useThemeMode();

  // Responsive breakpoints that work on all platforms
  const isSmallScreen = screenDimensions.width < BREAKPOINT_MOBILE;
  const isMediumScreen = screenDimensions.width >= BREAKPOINT_MOBILE && screenDimensions.width < BREAKPOINT_TABLET;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const filteredActivities = filter === 'All' ? items : items.filter((a) => a.type === filter);

  function showLorem(msg: string) {
    setSnackbarText(`Lorem ipsum — ${msg}`);
    setSnackbarVisible(true);
  }

  function onActionPress(item: (typeof initialActivities)[number]) {
    setSelectedActivity(item);
    setDetailsModalVisible(true);
  }

  function addActivity() {
    if (!newTitle.trim()) {
      showLorem('Title is required');
      return;
    }

    const id = String(Date.now());
    const newAct = {
      id,
      type: selectedType,
      title: newTitle,
      status: 'Not Started',
      date: new Date().toISOString().slice(0, 10),
      nextAction: 'Start',
    };
    setItems((prev) => [newAct, ...prev]);
    setModalVisible(false);
    setNewTitle('');
    showLorem('Activity added');
  }

  // Helper functions for modern UI
  function getTypeColor(type: string, theme: any) {
    const colors = {
      'Online Class': theme.colors.tertiary,
      'Assignment': theme.colors.secondary,
      'Quiz': theme.colors.error,
      'Discussion': theme.colors.primary,
    };
    return colors[type as keyof typeof colors] || theme.colors.primary;
  }

  function getStatusColor(status: string, theme: any) {
    const colors = {
      'Not Started': theme.colors.surfaceVariant,
      'In Progress': theme.colors.tertiary,
      'Completed': theme.colors.primary,
    };
    return colors[status as keyof typeof colors] || theme.colors.surfaceVariant;
  }

  function getActionColor(action: string, theme: any) {
    const colors = {
      'Start': theme.colors.primary,
      'Continue': theme.colors.tertiary,
      'Review': theme.colors.secondary,
    };
    return colors[action as keyof typeof colors] || theme.colors.primary;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>  
      {/* Header Section */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.elevation.level2 }]} elevation={2}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>My Learning</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              {filteredActivities.length} activities
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            {/* Responsive Hamburger Menu - Shows on small screens (mobile) and medium screens (tablet/small desktop) */}
            {(isSmallScreen || isMediumScreen) && (
              <Menu
                visible={filterMenuVisible}
                onDismiss={() => setFilterMenuVisible(false)}
                anchor={
                  <TouchableOpacity 
                    onPress={() => setFilterMenuVisible(true)}
                    style={[styles.hamburgerButton, { backgroundColor: theme.colors.primaryContainer }]}
                    accessibilityLabel="Filter menu"
                    accessibilityHint="Open filter options menu">
                    <IconSymbol name="line.3.horizontal" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                }
                contentStyle={[styles.filterMenu, { backgroundColor: theme.colors.surface }]}>
                {activityTypes.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setFilter(type);
                      setFilterMenuVisible(false);
                    }}
                    title={type}
                    titleStyle={filter === type ? 
                      { color: theme.colors.primary, fontWeight: '600' } : 
                      { color: theme.colors.onSurface }
                    }
                    style={filter === type ? 
                      { backgroundColor: theme.colors.primaryContainer } : 
                      {}
                    }
                  />
                ))}
              </Menu>
            )}
            
            <View style={styles.themeToggle}>
              <Text style={[styles.themeLabel, { color: theme.colors.onSurface }]}>
                {mode === 'dark' ? '🌙' : '☀️'}
              </Text>
              <Switch 
                value={mode === 'dark'} 
                onValueChange={toggle}
                accessibilityLabel="Toggle dark mode"
                accessibilityHint="Switch between light and dark theme"
              />
            </View>
          </View>
        </View>
        
        {/* Filter Chips - Only show on larger screens (desktop) */}
        {!isSmallScreen && !isMediumScreen && (
          <View style={styles.filterContainer}>
            {activityTypes.map((type) => (
              <Chip
                key={type}
                selected={filter === type}
                onPress={() => setFilter(type)}
                style={[
                  styles.filterChip,
                  filter === type && { backgroundColor: theme.colors.primaryContainer }
                ]}
                textStyle={filter === type ? 
                  { color: theme.colors.onPrimaryContainer, fontWeight: '600' } : 
                  { color: theme.colors.onSurface }
                }
                compact>
                {type}
              </Chip>
            ))}
          </View>
        )}

        {/* Selected Filter Display - Shows on small and medium screens */}
        {(isSmallScreen || isMediumScreen) && filter !== 'All' && (
          <View style={styles.mobileFilterDisplay}>
            <Chip
              style={[styles.selectedFilterChip, { backgroundColor: theme.colors.primaryContainer }]}
              textStyle={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}
              onClose={() => setFilter('All')}
              compact>
              {filter}
            </Chip>
          </View>
        )}
      </Surface>

      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Card style={[styles.activityCard, { marginTop: index === 0 ? 8 : 0 }]} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={[
                styles.cardHeader, 
                isSmallScreen && { flexDirection: 'column', alignItems: 'stretch' }
              ]}>
                <View style={[styles.activityInfo, isSmallScreen && { marginRight: 0 }]}>
                  <Text style={[styles.activityTitle, { color: theme.colors.onSurface }]}>
                    {item.title}
                  </Text>
                  <View style={[
                    styles.activityMeta, 
                    isSmallScreen && { flexDirection: 'column', alignItems: 'flex-start', gap: 8 }
                  ]}>
                    <Chip 
                      style={[styles.typeChip, { backgroundColor: getTypeColor(item.type, theme) }]}
                      textStyle={{ color: theme.colors.onPrimary, fontSize: 12, fontWeight: '600' }}
                      compact>
                      {item.type}
                    </Chip>
                    <Text style={[styles.activityDate, { color: theme.colors.onSurfaceVariant }]}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(item.status, theme) },
                  isSmallScreen && { alignSelf: 'flex-start', marginTop: 8 }
                ]}>
                  <Text style={[styles.statusText, { color: theme.colors.onPrimary }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.cardDivider} />
              
              <View style={[
                styles.cardActions,
                isSmallScreen && { flexDirection: 'column' }
              ]}>
                <Button 
                  mode="contained" 
                  onPress={() => onActionPress(item)}
                  style={[
                    styles.actionButton, 
                    { backgroundColor: getActionColor(item.nextAction, theme) },
                    isSmallScreen && { flex: undefined }
                  ]}
                  labelStyle={styles.actionButtonText}
                  compact={!isSmallScreen}>
                  {item.nextAction}
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => onActionPress(item)}
                  style={[styles.secondaryButton, isSmallScreen && { flex: undefined }]}
                  labelStyle={styles.secondaryButtonText}
                  compact={!isSmallScreen}>
                  Details
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Modern Floating Action Button */}
      <TouchableOpacity 
        style={[styles.modernFab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add new activity"
        accessibilityHint="Opens form to create a new learning activity"
        activeOpacity={0.8}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modernModal, 
            { backgroundColor: theme.colors.surface },
            isSmallScreen && {
              margin: 8,
              maxHeight: screenDimensions.height * 0.9,
              borderRadius: 16,
            }
          ]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenDimensions.height * 0.85 }}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                <IconSymbol name="plus" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.modernModalTitle, { color: theme.colors.onSurface }]}>
                Create New Activity
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Add a new learning activity to your schedule
              </Text>
            </View>
            
            <View style={styles.modalForm}>
              <TextInput
                label="Activity Title"
                value={newTitle}
                onChangeText={setNewTitle}
                style={styles.modernInput}
                mode="outlined"
                placeholder="Enter activity title..."
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                multiline={isSmallScreen}
                numberOfLines={isSmallScreen ? 2 : 1}
              />

              <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                Activity Type
              </Text>
              <View style={styles.modernTypeSelector}>
                {activityTypes.slice(1).map((type) => (
                  <Chip
                    key={type}
                    selected={selectedType === type}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.modernTypeChip,
                      selectedType === type && { 
                        backgroundColor: theme.colors.primaryContainer,
                        borderColor: theme.colors.primary,
                        borderWidth: 2
                      }
                    ]}
                    textStyle={selectedType === type ? 
                      { color: theme.colors.onPrimaryContainer, fontWeight: '600' } : 
                      { color: theme.colors.onSurface }
                    }
                    compact>
                    {type}
                  </Chip>
                ))}
              </View>

              <View style={[
                styles.modernModalActions,
                isSmallScreen && { flexDirection: 'column' }
              ]}>
                <Button 
                  onPress={() => setModalVisible(false)}
                  style={[styles.cancelButton, isSmallScreen && { minHeight: 48, borderRadius: 12 }]}
                  mode="outlined"
                  textColor={theme.colors.onSurfaceVariant}
                  compact={!isSmallScreen}>
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={addActivity}
                  style={[styles.createButton, isSmallScreen && { minHeight: 48, borderRadius: 12 }]}
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.onPrimary}
                  compact={!isSmallScreen}>
                  Create Activity
                </Button>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Activity Details Modal */}
      <Portal>
        <Modal
          visible={detailsModalVisible}
          onDismiss={() => setDetailsModalVisible(false)}
          contentContainerStyle={[
            styles.detailsModal, 
            { backgroundColor: theme.colors.surface },
            isSmallScreen && {
              margin: 8,
              padding: 16,
              maxHeight: screenDimensions.height * 0.85,
              borderRadius: 16,
            }
          ]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            {selectedActivity && (
              <>
                <Text style={[styles.detailsModalTitle, { color: theme.colors.onSurface }]}>
                  {selectedActivity.title}
                </Text>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.onSurface }]}>Type:</Text>
                  <Chip style={[styles.detailChip, { backgroundColor: getTypeColor(selectedActivity.type, theme) }]} compact>
                    {selectedActivity.type}
                  </Chip>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.onSurface }]}>Status:</Text>
                  <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                    {selectedActivity.status}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.onSurface }]}>Date:</Text>
                  <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                    {formatDate(selectedActivity.date)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.onSurface }]}>
                    Description:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua.
                  </Text>
                </View>

                <View style={[
                  styles.detailsModalActions, 
                  isSmallScreen && { flexDirection: 'column', gap: 8 }
                ]}>
                  <Button 
                    onPress={() => setDetailsModalVisible(false)}
                    style={[styles.detailsCancelButton, isSmallScreen && { minHeight: 48, borderRadius: 12 }]}
                    mode="outlined"
                    compact={!isSmallScreen}>
                    Close
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      setDetailsModalVisible(false);
                      showLorem(`${selectedActivity.nextAction} activity: ${selectedActivity.title}`);
                    }}
                    style={[styles.detailsActionButton, isSmallScreen && { minHeight: 48, borderRadius: 12 }]}
                    compact={!isSmallScreen}>
                    {selectedActivity.nextAction}
                  </Button>
                </View>
              </>
            )}
          </ScrollView>
        </Modal>
      </Portal>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1800}>
        {snackbarText}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterMenu: {
    borderRadius: 12,
    marginTop: 8,
  },
  mobileFilterDisplay: {
    marginTop: 8,
    marginBottom: 8,
  },
  selectedFilterChip: {
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  themeLabel: {
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginBottom: 8,
    borderRadius: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  activityCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityInfo: {
    flex: 1,
    marginRight: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeChip: {
    borderRadius: 12,
  },
  activityDate: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDivider: {
    marginVertical: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 2,
    borderRadius: 12,
    minHeight: 40,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 40,
  },
  secondaryButtonText: {
    fontSize: 12,
  },
  modernFab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modernModal: {
    margin: 16,
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
    maxHeight: '85%',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modernModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  modalForm: {
    padding: 24,
    paddingTop: 8,
  },
  modernInput: {
    marginBottom: 20,
    borderRadius: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modernTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  modernTypeChip: {
    borderRadius: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  modernModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  createButton: {
    flex: 1,
    borderRadius: 12,
  },
  detailsModal: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  detailsModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  detailsCancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  detailsActionButton: {
    flex: 1,
    borderRadius: 12,
  },
  detailRow: {
    marginBottom: 16,
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
