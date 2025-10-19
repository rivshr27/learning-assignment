import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, Chip, Card, useTheme } from 'react-native-paper';
import { activities } from '../constants/mockActivities';

const activityTypes = ['All', 'Online Class', 'Assignment', 'Quiz', 'Discussion'];

export default function ActivityListScreen() {
  const [filter, setFilter] = useState('All');
  const theme = useTheme();

  const filteredActivities =
    filter === 'All'
      ? activities
      : activities.filter((a) => a.type === filter);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>  
      <View style={styles.filterRow}>
        {activityTypes.map((type) => (
          <Chip
            key={type}
            selected={filter === type}
            onPress={() => setFilter(type)}
            style={styles.chip}
          >
            {type}
          </Chip>
        ))}
      </View>
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} subtitle={item.type} />
            <Card.Content>
              <Text>Status: {item.status}</Text>
              <Text>Date: {item.date}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained">{item.nextAction}</Button>
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
});
