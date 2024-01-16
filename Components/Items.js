import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Items({ navigation }) {
  const [storedData, setStoredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const retrieveData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);

      const parsedData = data.map(([_, value]) => JSON.parse(value)).flat();

      setStoredData(parsedData);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  // useEffect is only called when the component mounts
  useEffect(() => {
    retrieveData();
  }, []);

  // useFocusEffect is called every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Your logic to refresh data when the screen is focused
      retrieveData();
    }, [])
  );

  const filteredData = storedData.filter(
    (item) =>
      item.image_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.where_you_kept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (index) => {
    try {
      // Create a copy of the storedData array
      const newData = [...storedData];
      
      // Remove the item at the specified index
      const deletedItem = newData.splice(index, 1)[0];

      // Save the updated array to AsyncStorage
      await AsyncStorage.setItem('stored_data', JSON.stringify(newData));

      // Update the state to trigger a re-render
      setStoredData(newData);

      // Optionally, you can display a success message
      Alert.alert('Item Deleted', `Item "${deletedItem.image_name}" has been deleted.`);
    } catch (error) {
      // Handle errors
      console.error('Error deleting item:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <ScrollView>
        {searchQuery
          ? filteredData.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.title}>{item.image_name}</Text>
                <Text style={styles.subtitle}>{item.where_you_kept}</Text>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          : storedData.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.title}>{item.image_name}</Text>
                <Text style={styles.subtitle}>{item.where_you_kept}</Text>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
      </ScrollView>

      {/* Static button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
  },
});
