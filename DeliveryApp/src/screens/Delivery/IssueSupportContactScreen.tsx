import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueSupportContact'>;

export function IssueSupportContactScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Contact Support</Text>
          <Text style={styles.headerSubtitle}>Issue #ISS-29847</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.agentCard}>
          <Avatar initials="VS" size={52} />
          <View style={styles.agentText}>
            <Text style={styles.agentName}>Verdant Support Team</Text>
            <Text style={styles.agentMeta}>Avg response: 2 min · Available 24/7</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ISSUE SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Issue</Text>
            <Text style={styles.summaryRowValue}>Customer Unreachable</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Order</Text>
            <Text style={styles.summaryRowValue}>#{orderId}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Evidence</Text>
            <Text style={styles.summaryRowValueGreen}>2 photos submitted</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowPrimary]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('IssueResolution', {orderId})}>
          <View style={styles.optionIconGreen}>
            <Icon name="message-circle" size={22} color={colors.white} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitlePrimary}>Live Chat</Text>
            <Text style={styles.optionSubtitle}>Currently 1 agent available</Text>
          </View>
          <View style={styles.recTag}>
            <Text style={styles.recTagText}>REC</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} activeOpacity={0.85} onPress={() => navigation.navigate('IssueResolution', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="phone" size={22} color={colors.textPrimary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Call Support</Text>
            <Text style={styles.optionSubtitle}>Press to connect</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} activeOpacity={0.85} onPress={() => navigation.navigate('IssueResolution', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="mail" size={22} color={colors.textPrimary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Email — Non-urgent</Text>
            <Text style={styles.optionSubtitle}>Response in 2 hours</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.messageCard}>
          <Text style={styles.messageLabel}>Recent message</Text>
          <View style={styles.messageRow}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>VS</Text>
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                Hi Ravi, I can see your issue with order #{orderId}. I am connecting you to a specialist now.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.quickLabel}>Quick actions</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickChip}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('IssueResolution', {orderId})}>
            <Text style={styles.quickChipText}>Check issue status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickChip}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DeliveryFailed', {orderId})}>
            <Text style={styles.quickChipText}>Escalate</Text>
          </TouchableOpacity>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  agentCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  agentText: {flex: 1},
  agentName: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary},
  agentMeta: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 1},
  summaryCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  summaryLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  summaryRowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryRowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  summaryRowValueGreen: {...typography.bodyMedium, fontSize: 13, color: colors.primary},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionRowPrimary: {borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  optionIconGreen: {width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  optionIconNeutral: {width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitlePrimary: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  optionTitle: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
  optionSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 1},
  recTag: {backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 4},
  recTagText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  messageCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  messageLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary},
  messageRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  messageAvatar: {width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  messageAvatarText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  messageBubble: {flex: 1, backgroundColor: colors.background, borderTopRightRadius: radius.md, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md, padding: spacing.md},
  messageText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  quickLabel: {...typography.label, color: colors.textSecondary},
  quickRow: {flexDirection: 'row', gap: spacing.sm},
  quickChip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  quickChipText: {...typography.label, fontSize: 13, color: colors.textPrimary},
});
