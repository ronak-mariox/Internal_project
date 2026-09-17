import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderNotReady'>;

export function OrderNotReadyScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert-triangle" size={32} color={colors.warning} />
      </View>
      <Text style={styles.title}>Order Not Ready</Text>
      <Text style={styles.subtitle}>Swiggy Instamart needs more time to prepare your order.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>WAIT ESTIMATE</Text>
        <View style={styles.estimateRow}>
          <Text style={styles.estimateLabel}>Preparation time</Text>
          <Text style={styles.estimateValue}>~12 minutes</Text>
        </View>
        <ProgressBar progress={0.4} height={8} trackColor={colors.border} fillColor={colors.warning} style={styles.progressBar} />
        <Text style={styles.readyByText}>
          Estimated ready by <Text style={styles.readyByValue}>2:41 PM</Text>
        </Text>
      </View>

      <View style={styles.tilesRow}>
        <TouchableOpacity
          style={styles.tile}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('WaitingForOrder', {orderId})}>
          <Icon name="user" size={24} color={colors.textPrimary} />
          <Text style={styles.tileTitle}>Wait Here</Text>
          <Text style={styles.tileSubtitle}>Stay and collect when ready</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tile}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('WaitingForOrder', {orderId})}>
          <Icon name="bell" size={24} color={colors.textPrimary} />
          <Text style={styles.tileTitle}>Notify Store</Text>
          <Text style={styles.tileSubtitle}>Send reminder to speed up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipBanner}>
        <Icon name="info" size={16} color={colors.info} />
        <Text style={styles.tipText}>
          <Text style={styles.tipStrong}>Tip:</Text> Use this time to check your navigation route to the customer.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.reportRow}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ReportStoreIssue', {orderId})}>
        <Text style={styles.reportPrefix}>Order taking too long? </Text>
        <Text style={styles.reportLink}>Report Issue</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xxxl, gap: spacing.md},
  iconWrap: {width: 72, height: 72, borderRadius: 36, backgroundColor: colors.warningSurface, borderWidth: 2, borderColor: colors.warningBorder, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: -spacing.xs},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.sm},
  estimateRow: {flexDirection: 'row', justifyContent: 'space-between'},
  estimateLabel: {...typography.body, color: colors.textPrimary},
  estimateValue: {...typography.bodyBold, color: colors.warning},
  progressBar: {marginTop: spacing.sm},
  readyByText: {...typography.label, color: colors.textSecondary, marginTop: spacing.sm},
  readyByValue: {...typography.labelSemibold, color: colors.textPrimary},
  tilesRow: {flexDirection: 'row', gap: spacing.sm, width: '100%'},
  tile: {flex: 1, alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.md},
  tileTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  tileSubtitle: {...typography.caption, fontSize: 11, color: colors.textSecondary, textAlign: 'center'},
  tipBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, width: '100%', backgroundColor: colors.infoSurface, borderWidth: 1, borderColor: '#BFDBFE', borderRadius: radius.xl, padding: spacing.md},
  tipText: {...typography.label, color: '#1D4ED8', flex: 1},
  tipStrong: {fontWeight: '700'},
  reportRow: {flexDirection: 'row', paddingTop: spacing.sm},
  reportPrefix: {...typography.label, color: colors.textSecondary},
  reportLink: {...typography.labelSemibold, color: colors.danger},
});
