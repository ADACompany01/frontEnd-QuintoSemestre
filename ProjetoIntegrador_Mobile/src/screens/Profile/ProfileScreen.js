import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';

export default function ProfileScreen() {
  const { signOut, user } = useContext(AuthContext);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('profile_image_uri');
      if (stored) setImageUri(stored);
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permissão', 'Permita acesso à galeria para escolher imagem.');
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled && res.assets?.length) {
      const uri = res.assets[0].uri;
      setImageUri(uri);
      await AsyncStorage.setItem('profile_image_uri', uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 20, color: theme.colors.primary, fontFamily: theme.fonts.main, marginBottom: theme.spacing.md }}>Perfil</Text>
      <Text style={{ color: theme.colors.secondary, marginBottom: theme.spacing.lg }}>{user?.email}</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: 160, height: 160, borderRadius: 80, marginBottom: theme.spacing.lg, borderWidth: 2, borderColor: theme.colors.primary }} />
      ) : (
        <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: theme.colors.secondary, marginBottom: theme.spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.colors.background }}>Sem imagem</Text>
        </View>
      )}
      <Button title="Alterar foto" onPress={pickImage} color={theme.colors.primary} />
      <View style={{ height: theme.spacing.lg }} />
      <Button title="Sair" onPress={signOut} color={theme.colors.secondary} />
    </View>
  );
}

