import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RejectConfirmSheet'>;

export function RejectConfirmSheetScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <View style={styles.overlay}>
      <View style={styles.scrim} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.orderRow}>
          <View style={styles.orderIcon}>
            <Icon name="bicycle" size={20} color={colors.primary} />
          </View>
          <View style={styles.orderText}>
            <Text style={styles.orderTitle}>Order #{orderId} · Swiggy Instamart</Text>
            <Text style={styles.orderSubtitle}>₹78 · 3.8 km · 3 items</Text>
          </View>
          <View style={styles.countdown}>
            <Text style={styles.countdownText}>9</Text>
          </View>
        </View>

        <Text style={styles.title}>Reject this order?</Text>
        <Text style={styles.subtitle}>Rejecting may affect your acceptance rate. Please select a reason.</Text>

        <View style={styles.warningBanner}>
          <Icon name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.warningText}>
            Your current acceptance rate is <Text style={styles.warningTextStrong}>94%</Text>. Rejecting lowers it. Rate below 80% may
            reduce your bonus eligibility.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button label="Keep Order" variant="secondary" style={styles.keepButton} onPress={() => navigation.goBack()} />
          <Button
            label="Reject Order"
            style={styles.rejectButton}
            onPress={() => navigation.replace('RejectReason', {orderId})}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'flex-end'},
  scrim: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.7)'},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, paddingBottom: spacing.huge},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xl},
  orderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md},
  orderIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  orderText: {flex: 1},
  orderTitle: {...typography.labelSemibold, color: colors.textPrimary},
  orderSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  countdown: {width: 38, height: 38, borderRadius: 19, borderWidth: 2.5, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  countdownText: {...typography.bodyBold, color: colors.danger},
  title: {...typography.title, fontSize: 18, color: colors.textPrimary, marginTop: spacing.xl},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xs},
  warningBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xl},
  warningText: {flex: 1, ...typography.caption, color: colors.dangerText, lineHeight: 18},
  warningTextStrong: {fontWeight: '700'},
  actions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxl},
  keepButton: {flex: 1, height: 54},
  rejectButton: {flex: 1, height: 54, backgroundColor: colors.danger},
});
