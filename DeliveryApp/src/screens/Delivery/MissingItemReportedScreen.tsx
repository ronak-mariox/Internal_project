import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MissingItemReported'>;

const ITEMS = [
  {name: 'Almonds 500g', missing: false},
  {name: 'Greek Yogurt', missing: true},
  {name: 'Oats 1kg', missing: false},
];

export function MissingItemReportedScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Missing Item Reported</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId} · Priya Mehta · HSR Layout</Text>
        </View>
      </View>
      <View style={styles.banner}>
        <Icon name="alert-circle" size={16} color={colors.warningText} />
        <Text style={styles.bannerText}>Missing item detected in this order</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER CONTENTS — 3 ITEMS</Text>
          {ITEMS.map((item, index) => (
            <View key={item.name} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <Text style={item.missing ? styles.itemNameMissing : styles.itemName}>{item.name}</Text>
              {item.missing ? (
                <View style={styles.missingTag}>
                  <Icon name="x" size={12} color={colors.danger} />
                  <Text style={styles.missingTagText}>MISSING</Text>
                </View>
              ) : (
                <Icon name="check" size={18} color={colors.primary} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>MISSING ITEM DETAIL</Text>
          <Text style={styles.detailTitle}>
            Greek Yogurt <Text style={styles.detailPrice}>(₹89)</Text>
          </Text>
          <Text style={styles.detailSubtitle}>Not found in package</Text>
          <Text style={styles.detailStore}>Store: Should have been packed by Swiggy Instamart</Text>
          <Text style={styles.detailFault}>This is a store packing error</Text>
        </View>

        <View style={styles.notFaultBanner}>
          <Text style={styles.notFaultTitle}>This is NOT your fault.</Text>
          <Text style={styles.notFaultText}>Report it and continue delivery.</Text>
        </View>

        <TouchableOpacity style={styles.primaryOption} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <View style={styles.primaryOptionIcon}>
            <Icon name="check" size={20} color={colors.white} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.primaryOptionTitle}>Deliver remaining items</Text>
            <Text style={styles.primaryOptionSubtitle}>Customer has been informed</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryOption} activeOpacity={0.85}>
          <View style={styles.secondaryOptionIcon}>
            <Icon name="camera" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.secondaryOptionTitle}>Upload photo of package contents</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <View style={styles.secondaryOptionIcon}>
            <Icon name="alert-circle" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.secondaryOptionTitle}>Report missing item to support</Text>
        </TouchableOpacity>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Support will notify Priya Mehta about the missing item and process the refund automatically.</Text>
        </View>
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
  banner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderBottomWidth: 1, borderBottomColor: colors.warningBorder, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  bannerText: {...typography.label, fontSize: 13, color: colors.warningText},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  itemRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm},
  itemRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  itemName: {...typography.body, color: colors.textPrimary},
  itemNameMissing: {...typography.bodySemibold, color: colors.danger},
  missingTag: {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.dangerSurface, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2},
  missingTagText: {...typography.captionSemibold, fontSize: 11, color: colors.danger},
  detailCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.md},
  detailLabel: {...typography.captionSemibold, fontSize: 12, color: colors.danger, letterSpacing: 0.6, textTransform: 'uppercase'},
  detailTitle: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary, marginTop: spacing.sm},
  detailPrice: {...typography.body, color: colors.textSecondary},
  detailSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 2},
  detailStore: {...typography.caption, color: colors.textLabel, marginTop: spacing.sm},
  detailFault: {...typography.captionSemibold, color: colors.danger, marginTop: 4},
  notFaultBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.md, padding: spacing.md},
  notFaultTitle: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  notFaultText: {...typography.label, fontSize: 13, color: colors.primary, marginTop: 2},
  primaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md},
  primaryOptionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  primaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  primaryOptionSubtitle: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1},
  secondaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  secondaryOptionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  secondaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, flex: 1},
  optionText: {flex: 1},
  noteBanner: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
});
