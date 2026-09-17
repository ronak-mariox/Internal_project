import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactStore'>;

const QUICK_MESSAGES = ['I\'ve arrived at the store', 'Where is my order?', 'Order seems wrong'];

export function ContactStoreScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Contact Store</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.storeCard}>
          <Avatar initials="SI" size={48} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>Swiggy Instamart, Koramangala</Text>
            <Text style={styles.storeAddress}>Koramangala 6th Block, 560095</Text>
            <View style={styles.openBadge}>
              <View style={styles.openDot} />
              <Text style={styles.openText}>Open · Until 11 PM</Text>
            </View>
          </View>
        </View>

        <View style={styles.optionsList}>
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="phone" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Call Store</Text>
              <Text style={styles.optionSubtitle}>Direct line to store manager</Text>
            </View>
            <TouchableOpacity style={styles.primaryChip} activeOpacity={0.85}>
              <Text style={styles.primaryChipText}>Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="message-circle" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>In-app Message</Text>
              <Text style={styles.optionSubtitle}>Send a text message</Text>
            </View>
            <TouchableOpacity style={styles.outlineChip} activeOpacity={0.85}>
              <Text style={styles.outlineChipText}>Message</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="headphones" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Contact Support</Text>
              <Text style={styles.optionSubtitle}>Escalate to Verdant support team</Text>
            </View>
            <TouchableOpacity style={styles.neutralChip} activeOpacity={0.85}>
              <Text style={styles.neutralChipText}>Escalate</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.quickLabel}>QUICK MESSAGES</Text>
        <View style={styles.quickRow}>
          {QUICK_MESSAGES.map(message => (
            <TouchableOpacity key={message} style={styles.quickChip} activeOpacity={0.8}>
              <Text style={styles.quickChipText}>{message}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerCard}>
          <View>
            <Text style={styles.footerLabel}>ORDER ID</Text>
            <Text style={styles.footerValue}>#{orderId}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>EST. WAIT TIME</Text>
            <Text style={styles.footerValueGreen}>~8 min</Text>
          </View>
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
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  storeCard: {flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  storeInfo: {flex: 1, gap: 2},
  storeName: {...typography.bodySemibold, fontSize: 16, color: colors.textPrimary},
  storeAddress: {...typography.label, color: colors.textSecondary},
  openBadge: {flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: '#ECFDF5', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3, marginTop: spacing.xs},
  openDot: {width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary},
  openText: {...typography.captionMedium, color: colors.primary},
  optionsList: {gap: spacing.md},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionIcon: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  primaryChip: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  primaryChipText: {...typography.labelSemibold, color: colors.white},
  outlineChip: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  outlineChipText: {...typography.labelSemibold, color: colors.primary},
  neutralChip: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  neutralChipText: {...typography.labelSemibold, color: colors.textSecondary},
  quickLabel: {...typography.labelSemibold, color: colors.textSecondary},
  quickRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  quickChip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  quickChipText: {...typography.labelSemibold, color: colors.textPrimary},
  footerCard: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  footerRight: {alignItems: 'flex-end'},
  footerLabel: {...typography.caption, color: colors.textSecondary},
  footerValue: {...typography.bodyBold, color: colors.textPrimary, marginTop: 2},
  footerValueGreen: {...typography.bodyBold, color: colors.primary, marginTop: 2},
});
