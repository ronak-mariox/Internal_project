import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useProfile } from '../../context/ProfileContext';
import { Button, Input, NavHeader, ScreenContainer } from '../../components';
import { Icon } from '../../icons/Icon';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileAddressDetails'>;

export function ProfileAddressDetailsScreen({ navigation, route }: Props) {
  const { addressId } = route.params;
  const { getAddress, updateAddress } = useProfile();
  const address = getAddress(addressId);

  if (!address) {
    return (
      <ScreenContainer scrollable={false}>
        <NavHeader title="Address Details" onBack={() => navigation.goBack()} />
        <View style={styles.notFoundWrapper}>
          <Text style={styles.notFoundText}>Address not found.</Text>
          <Button label="Go Back" variant="outline" onPress={() => navigation.goBack()} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <AddressDetailsForm
      addressId={addressId}
      initialLabel={address.label}
      initialLine1={address.line1}
      initialLine2={address.line2}
      onSave={async (value) => {
        try {
          await updateAddress(addressId, value);
          navigation.goBack();
        } catch {
          Alert.alert('Could not save address', 'Please check your connection and try again.');
        }
      }}
      onBack={() => navigation.goBack()}
    />
  );
}

function AddressDetailsForm({
  initialLabel,
  initialLine1,
  initialLine2,
  onSave,
  onBack,
}: {
  addressId: string;
  initialLabel: string;
  initialLine1: string;
  initialLine2: string;
  onSave: (value: { label: string; line1: string; line2: string }) => void | Promise<void>;
  onBack: () => void;
}) {
  const [label, setLabel] = useState(initialLabel);
  const [line1, setLine1] = useState(initialLine1);
  const [line2, setLine2] = useState(initialLine2);

  function handleVerifyOnMap() {
    Alert.alert('Verify on Map', 'Coming soon.');
  }

  function handleSave() {
    onSave({ label, line1, line2 });
  }

  return (
    <ScreenContainer scrollable={false}>
      <NavHeader title="Address Details" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Input label="Address Label" value={label} onChangeText={setLabel} placeholder="Store Address" />
          <Input label="Address Line 1" value={line1} onChangeText={setLine1} placeholder="Shop 12, Laxmi Market" />
          <Input label="Address Line 2" value={line2} onChangeText={setLine2} placeholder="Andheri West" />
        </View>

        <View style={styles.mapPreview}>
          <Icon name="pin" size={40} color={colors.primary} />
        </View>

        <View style={styles.buttonGroup}>
          <Button label="Verify on Map" variant="outline" onPress={handleVerifyOnMap} />
          <Button label="Save Address" onPress={handleSave} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  mapPreview: {
    height: 180,
    width: '100%',
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroup: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  notFoundWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.xxxl,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
