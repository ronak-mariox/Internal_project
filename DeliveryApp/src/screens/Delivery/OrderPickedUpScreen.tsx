import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderPickedUp'>;

export function OrderPickedUpScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkRing}>
          <Icon name="check" size={28} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>Order Picked Up!</Text>
        <Text style={styles.headerSubtitle}>Great job, Ravi! Time to deliver.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PICKUP SUMMARY</Text>
          <Row label="Pickup time" value="2:41 PM" />
          <Row label="Wait time at store" value="8 minutes" />
          <Row label="Verification" value="Completed" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>DELIVERY DETAILS</Text>
          <Row label="Customer area" value="HSR Layout Sector 2" />
          <Row label="Distance" value="3.6 km" />
          <Row label="Estimated delivery" value="3:02 PM" />
          <Row label="Earnings on delivery" value="₹82 (on completion)" valueColor={colors.primary} />
        </View>

        <View style={styles.bonusBanner}>
          <Icon name="bar-chart" size={18} color={colors.primary} />
          <Text style={styles.bonusText}>
            <Text style={styles.bonusStrong}>On-time pickup! </Text>
            +2 performance points
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Navigate to Customer"
          icon="arrow-right"
          iconPosition="right"
          onPress={() => navigation.navigate('CustomerDeliveryDetails', {orderId})}
        />
      </View>
    </Screen>
  );
}

function Row({label, value, valueColor}: {label: string; value: string; valueColor?: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor && {color: valueColor}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingBottom: spacing.xxl},
  checkRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: spacing.xxs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  bonusBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.successSurface, borderWidth: 1, borderColor: '#A7F3D0', borderRadius: radius.lg, padding: spacing.md},
  bonusText: {...typography.label, color: colors.primary, flex: 1},
  bonusStrong: {...typography.labelSemibold, color: colors.primary},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
