import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupSupport'>;

export function PickupSupportScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [message, setMessage] = useState('');
  const [optionsExpanded, setOptionsExpanded] = useState(false);

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Pickup Support</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId} · Swiggy Instamart</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>ISSUE SUMMARY</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Issue type</Text>
            <Text style={styles.rowValueDanger}>Store cannot find order</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reported at</Text>
            <Text style={styles.rowValue}>2:38 PM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order ID</Text>
            <Text style={styles.rowValue}>#{orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Store</Text>
            <Text style={styles.rowValue}>Swiggy Instamart</Text>
          </View>
        </View>

        <View style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <View style={styles.chatDot} />
            <Text style={styles.chatHeaderText}>Live Support Chat</Text>
          </View>
          <View style={styles.chatBody}>
            <Text style={styles.chatSystemText}>Support agent joined · 2:39 PM</Text>
            <View style={styles.chatBubbleRow}>
              <View style={styles.agentAvatar}>
                <Icon name="user" size={14} color={colors.white} />
              </View>
              <View style={styles.chatBubble}>
                <Text style={styles.chatBubbleText}>
                  Hi Ravi, I can see there's an issue with order #{orderId}. I'm checking with the store now.
                </Text>
                <Text style={styles.chatBubbleTime}>2:39 PM</Text>
              </View>
            </View>
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message…"
                placeholderTextColor={colors.textMuted}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.sendButtonSmall} activeOpacity={0.85} onPress={() => setMessage('')}>
                <Icon name="send" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.otherOptions} activeOpacity={0.85} onPress={() => setOptionsExpanded(e => !e)}>
          <Text style={styles.otherOptionsText}>Other options</Text>
          <Icon name="chevron-down" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        {optionsExpanded && (
          <View style={styles.expandedOptions}>
            <TouchableOpacity
              style={styles.expandedOptionRowFirst}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PickupRetry', {orderId})}>
              <Text style={styles.expandedOptionText}>Retry pickup instead</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.expandedOptionRow}
              activeOpacity={0.7}
              onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
              <Text style={styles.expandedOptionTextDanger}>Cancel order</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TextInput
          style={styles.footerInput}
          placeholder="Type your message…"
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.85} onPress={() => setMessage('')}>
          <Icon name="send" size={20} color={colors.white} />
        </TouchableOpacity>
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
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  summaryCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  rowValueDanger: {...typography.labelSemibold, color: colors.danger},
  chatCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  chatHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  chatDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  chatHeaderText: {...typography.labelSemibold, color: colors.textPrimary},
  chatBody: {padding: spacing.md, gap: spacing.md},
  chatSystemText: {...typography.caption, color: colors.textSecondary, textAlign: 'center'},
  chatBubbleRow: {flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm},
  agentAvatar: {width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  chatBubble: {flex: 1, backgroundColor: colors.background, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderBottomRightRadius: radius.lg, padding: spacing.md},
  chatBubbleText: {...typography.label, color: colors.textPrimary},
  chatBubbleTime: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 4},
  chatInputRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  chatInput: {
    flex: 1,
    height: 40,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    ...typography.label,
    color: colors.textPrimary,
  },
  sendButtonSmall: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  otherOptions: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  otherOptionsText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  expandedOptions: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  expandedOptionRowFirst: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  expandedOptionRow: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border},
  expandedOptionText: {...typography.body, color: colors.textPrimary},
  expandedOptionTextDanger: {...typography.body, color: colors.danger},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerInput: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: colors.textPrimary,
  },
  sendButton: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
});
