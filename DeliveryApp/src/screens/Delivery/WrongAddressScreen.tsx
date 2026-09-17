import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WrongAddress'>;

export function WrongAddressScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="map-pin-off" size={30} color={colors.white} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Wrong Address</Text>
        <Text style={styles.subtitle}>Delivery location does not match.</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#{orderId}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagTextMuted}>Priya Mehta</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.mismatchCard}>
          <Text style={styles.mismatchLabel}>ADDRESS MISMATCH</Text>
          <Text style={styles.mismatchFieldLabel}>Order address</Text>
          <Text style={styles.mismatchFieldValue}>Apt 4B, Tower C, HSR Layout Sector 2</Text>
          <View style={styles.mismatchDivider} />
          <Text style={styles.mismatchFieldLabel}>Your location</Text>
          <Text style={styles.mismatchFieldValueDanger}>HSR Layout Sector 1 — 1.2 km away</Text>
          <View style={styles.differentSectorTag}>
            <Icon name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.differentSectorText}>Different sector</Text>
          </View>
        </View>

        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>Ask Priya Mehta for the correct address</Text>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionRow}>
            <View style={styles.actionIcon}>
              <Icon name="phone" size={20} color={colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Call customer for correct address</Text>
          </View>
          <Button label="Call Now" style={styles.callButton} onPress={() => navigation.navigate('CallCustomer', {orderId})} />
        </View>

        <View style={styles.smallActionCard}>
          <View style={styles.actionIconSmall}>
            <Icon name="map-pin" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.smallActionTitle}>Update address in app</Text>
          <TouchableOpacity
            style={styles.smallActionButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('UpdateAddress', {orderId})}>
            <Text style={styles.smallActionButtonText}>Update Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.smallActionCard}>
          <View style={styles.actionIconSmall}>
            <Icon name="navigation" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.smallActionTitleFlex}>Navigate to registered address</Text>
          <TouchableOpacity
            style={styles.smallActionButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CustomerStartNavigation', {orderId})}>
            <Text style={styles.smallActionButtonText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('UpdateAddress', {orderId})}>
          <Text style={styles.footerLink}>Report Address Issue</Text>
        </TouchableOpacity>
        <Text style={styles.footerSupportLink}>Support</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', height: 100},
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary},
  tagsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  mismatchCard: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.lg, padding: spacing.md},
  mismatchLabel: {...typography.captionSemibold, fontSize: 12, color: colors.danger, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  mismatchFieldLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  mismatchFieldValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  mismatchFieldValueDanger: {...typography.labelSemibold, fontSize: 13, color: colors.danger, marginTop: 2},
  mismatchDivider: {height: 1, backgroundColor: colors.dangerBorder, marginVertical: spacing.sm},
  differentSectorTag: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 6, marginTop: spacing.sm},
  differentSectorText: {...typography.labelSemibold, fontSize: 13, color: colors.danger},
  hintBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.sm, padding: spacing.md},
  hintText: {...typography.label, color: colors.warningText},
  actionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  actionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  actionIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  actionTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, flex: 1},
  callButton: {height: 43},
  smallActionCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  actionIconSmall: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  smallActionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, flex: 1},
  smallActionTitleFlex: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, flex: 1},
  smallActionButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  smallActionButtonText: {...typography.labelSemibold, fontSize: 13, color: colors.textLabel},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  footerLink: {...typography.bodyMedium, color: colors.textSecondary},
  footerSupportLink: {...typography.bodySemibold, color: colors.primary, textDecorationLine: 'underline'},
});
