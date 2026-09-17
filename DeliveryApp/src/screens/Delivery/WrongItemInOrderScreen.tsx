import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WrongItemInOrder'>;

const EXPECTED = [
  {name: 'Almonds 500g', ok: true},
  {name: 'Greek Yogurt', ok: false},
  {name: 'Oats 1kg', ok: true},
];
const FOUND = [
  {name: 'Almonds 500g', ok: true},
  {name: 'Cashews 200g', ok: false},
  {name: 'Oats 1kg', ok: true},
];

export function WrongItemInOrderScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Wrong Item in Order</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId} · Priya Mehta · HSR Layout</Text>
        </View>
      </View>
      <View style={styles.banner}>
        <Icon name="alert-circle" size={16} color={colors.danger} />
        <Text style={styles.bannerText}>Wrong item found — store substitution error</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER VS. PACKAGE CONTENTS</Text>
          <View style={styles.compareRow}>
            <View style={styles.compareCol}>
              <Text style={styles.compareColLabel}>EXPECTED</Text>
              {EXPECTED.map(item => (
                <View key={item.name} style={styles.compareItemRow}>
                  <Icon name={item.ok ? 'check' : 'x'} size={13} color={item.ok ? colors.primary : colors.danger} />
                  <Text style={item.ok ? styles.compareItemText : styles.compareItemTextBad}>{item.name}</Text>
                </View>
              ))}
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareCol}>
              <Text style={styles.compareColLabel}>FOUND</Text>
              {FOUND.map(item => (
                <View key={item.name} style={styles.compareItemRow}>
                  <Icon name={item.ok ? 'check' : 'x'} size={13} color={item.ok ? colors.primary : colors.danger} />
                  <Text style={item.ok ? styles.compareItemText : styles.compareItemTextBad}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>WRONG ITEM DETECTED</Text>
          <Text style={styles.detailTitle}>Cashews 200g found instead of Greek Yogurt</Text>
          <Text style={styles.detailSubtitle}>This is a store substitution error</Text>
        </View>

        <TouchableOpacity style={[styles.optionRow, styles.optionRowWarning]} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.optionTitleWarning}>Deliver anyway — Customer may accept</Text>
          <Text style={styles.optionSubtitle}>Customer will be notified of substitution</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowDanger]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}>
          <Text style={styles.optionTitleDanger}>Return order — Customer refuses wrong item</Text>
          <Text style={styles.optionSubtitle}>Take package back to store</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <View style={styles.primaryOptionRow}>
            <View style={styles.optionText}>
              <Text style={styles.primaryOptionTitle}>Contact support for resolution</Text>
              <Text style={styles.primaryOptionSubtitle}>Get guidance on how to proceed</Text>
            </View>
            <View style={styles.recommendedTag}>
              <Text style={styles.recommendedTagText}>Recommended</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Document with photo before proceeding.</Text>
        </View>

        <TouchableOpacity style={styles.photoButton} activeOpacity={0.85}>
          <Icon name="camera" size={20} color={colors.textSecondary} />
          <Text style={styles.photoButtonText}>Take photo of wrong item</Text>
        </TouchableOpacity>
      </ScrollView>
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
  banner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderBottomWidth: 1, borderBottomColor: colors.dangerBorder, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  bannerText: {...typography.label, fontSize: 13, color: '#991B1B'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  compareRow: {flexDirection: 'row', gap: spacing.sm},
  compareCol: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, padding: spacing.sm, gap: spacing.xs},
  compareColLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary},
  compareDivider: {width: 1, backgroundColor: colors.border},
  compareItemRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  compareItemText: {...typography.caption, fontSize: 12, color: colors.textPrimary},
  compareItemTextBad: {...typography.captionSemibold, fontSize: 12, color: colors.danger},
  detailCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.md},
  detailLabel: {...typography.captionSemibold, fontSize: 12, color: colors.danger},
  detailTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginTop: spacing.xs},
  detailSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  optionRow: {backgroundColor: colors.surface, borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md},
  optionRowWarning: {borderColor: colors.warning},
  optionRowDanger: {borderColor: colors.dangerBorder},
  optionTitleWarning: {...typography.bodySemibold, fontSize: 14, color: colors.warningText},
  optionTitleDanger: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  primaryOption: {backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md},
  primaryOptionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  primaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  primaryOptionSubtitle: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1},
  optionText: {flex: 1},
  recommendedTag: {backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2},
  recommendedTagText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  noteBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.captionMedium, fontSize: 12, color: colors.warningText},
  photoButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderStrong, borderStyle: 'dashed', borderRadius: radius.md, padding: spacing.lg},
  photoButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
});
