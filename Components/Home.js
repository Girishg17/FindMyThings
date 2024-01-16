import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [whatTextInputValue, setWhatTextInputValue] = useState("");
  const [whereTextInputValue, setWhereTextInputValue] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [storedData, setStoredData] = useState({});

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       await retrieveData();
  //     };

  //     fetchData();
  //   }, []);
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {
        setFile(result.assets[0].uri);
        setError(null);
      }
    }
  };

  const handleButtonPress = async () => {
    try {
      // Retrieve existing data
      const existingData = await AsyncStorage.getItem("stored_data");
      let parsedData = existingData ? JSON.parse(existingData) : [];

      // Add new data to the array
      const newData = {
        image_name: whatTextInputValue,
        where_you_kept: whereTextInputValue,
        image_url: file,
      };

      // Ensure parsedData is an array
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }

      parsedData.push(newData);

      // Save the updated array
      await AsyncStorage.setItem("stored_data", JSON.stringify(parsedData));

      // Update storedData state for immediate display
    //   setStoredData(parsedData);
      setWhatTextInputValue("");
      setWhereTextInputValue("");
      setFile(null);
    // setWhatTextInputValue((prevValue) => "");
    // setWhereTextInputValue((prevValue) => "");
    // setFile((prevValue) => null);
      
      // Optionally, you can display a success message
      Alert.alert("Data Saved", "The data has been successfully saved.");
    } catch (error) {
      // Handle errors
      console.error("Error saving data:", error);
    }
  };

  //   const retrieveData = async () => {
  //     try {
  //       const keys = await AsyncStorage.getAllKeys();
  //       const data = await AsyncStorage.multiGet(keys);

  //       const parsedData = data.map(([key, value]) => JSON.parse(value));

  //       // Update the storedData state with the retrieved data
  //       setStoredData(parsedData);

  //       // Log each object individually
  //       parsedData.forEach((item, index) => {
  //         console.log(`Data ${index + 1}:`, item);
  //       });
  //     } catch (error) {
  //       console.error('Error retrieving data:', error);
  //     }
  //   };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          editable
          placeholder="What"
          onChangeText={(text) => setWhatTextInputValue(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          editable
          placeholder="Where you kept"
          maxLength={40}
          onChangeText={(text) => setWhereTextInputValue(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.imagePickerContainer}>
        <Text style={styles.header}>Add Image:</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
        {file ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: file }} style={styles.image} />
          </View>
        ) : (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity
          onPress={handleButtonPress}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginVertical: 10,
    width: "80%",
  },
  input: {
    padding: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 6,
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imagePickerContainer: {
    alignItems: "center",
  },
  imageContainer: {
    borderRadius: 8,
    marginVertical: 16,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginTop: 16,
  },
  submitButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 6,
    width: 200,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
  },
  searchButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 6,
    width: 200,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "white",
  },
});
