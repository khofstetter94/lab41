import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Linking, Button, Image, Platform } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import { NativeBaseProvider, Box } from "native-base";
// import { Button } from 'native-base';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      const { data } = await Contacts.getContactsAsync();
      // console.log(data);
      setContacts(data);
    };
    getContacts();
  }, []);

  const call = (contact) => {
    let phoneNumber = contact.phoneNumbers[0].number
    console.log(phoneNumber)

    const link = `tel: ${phoneNumber}`;
    Linking.canOpenURL(link).then(supported => Linking.openURL(link)).catch(err => console.error(err));
  };

  const renderItem = ({ item }) => (
    <Button title={item.name} onPress={() => call(item)} mb="2.5" />
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text>Contacts</Text>
          </View>
          <View>
            <FlatList
              data={contacts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
          <StatusBar style="auto" />
        </SafeAreaView>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 100,
  }
});
