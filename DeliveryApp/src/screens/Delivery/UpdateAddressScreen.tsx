import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateAddress'>;

export function UpdateAddressScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [address, setAddress] = useState('Apt 4B, Tower C, HSR Layout Sector 2, Bengaluru 560102');

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Update Delivery Address</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId} · Priya Mehta</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.incorrectCard}>
          <Text style={styles.incorrectLabel}>INCORRECT ADDRESS</Text>
          <Text style={styles.incorrectText}>Apt 4B, Tower C, HSR Layout Sector 1, Bengaluru 560102</Text>
        </View>

        <Text style={styles.fieldLabel}>New Address</Text>
        <TextInput style={styles.addressInput} value={address} onChangeText={setAddress} multiline textAlignVertical="top" />
        <TouchableOpacity style={styles.verifyLink} activeOpacity={0.8}>
          <Icon name="map-pin" size={14} color={colors.primary} />
          <Text style={styles.verifyLinkText}>Verify on map</Text>
        </TouchableOpacity>

        <View style={styles.mapPreview}>
          <View style={styles.mapPin}>
            <Icon name="map-pin" size={28} color={colors.primary} filled />
          </View>
          <Text style={styles.mapCaption}>HSR Layout Sector 2, Bengaluru</Text>
        </View>

        <View style={styles.distanceRow}>
          <Text style={styles.distanceOld}>3.6 km</Text>
          <Icon name="arrow-right" size={16} color={colors.textSecondary} />
          <Text style={styles.distanceNew}>3.8 km</Text>
          <View style={styles.updatedTag}>
            <Text style={styles.updatedTagText}>updated</Text>
          </View>
        </View>

        <View style={styles.compensationBanner}>
          <Icon name="check" size={14} color={colors.primary} />
          <Text style={styles.compensationText}>Additional distance will be compensated</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Confirm New Address" onPress={() => navigation.navigate('NearCustomer', {orderId})} />
        <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 16, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  incorrectCard: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.md, padding: spacing.md},
  incorrectLabel: {...typography.captionSemibold, fontSize: 11, color: colors.danger, letterSpacing: 0.55, textTransform: 'uppercase'},
  incorrectText: {...typography.body, color: colors.textMuted, textDecorationLine: 'line-through', marginTop: spacing.xs},
  fieldLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  addressInput: {
    height: 96,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    marginTop: -spacing.sm,
  },
  verifyLink: {flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: -spacing.xs},
  verifyLinkText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  mapPreview: {height: 120, backgroundColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  mapPin: {marginBottom: spacing.xs},
  mapCaption: {position: 'absolute', left: spacing.sm, bottom: spacing.xs, ...typography.captionMedium, fontSize: 10, color: colors.textSecondary},
  distanceRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md},
  distanceOld: {...typography.label, color: colors.textSecondary, textDecorationLine: 'line-through'},
  distanceNew: {...typography.labelSemibold, color: colors.textPrimary},
  updatedTag: {backgroundColor: colors.primarySurface, borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 2, marginLeft: 'auto'},
  updatedTagText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  compensationBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.sm, padding: spacing.md},
  compensationText: {...typography.label, color: colors.primary},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
