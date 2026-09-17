import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ReturnOrder'>;

export function ReturnOrderScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="package" size={44} color={colors.white} />
        <Text style={styles.headerTitle}>Return Order</Text>
        <Text style={styles.headerSubtitle}>Returning order to Swiggy Instamart.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>RETURN REASON</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reason</Text>
            <Text style={styles.rowValueRight}>Customer unreachable after 3 attempts</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>#{orderId}, 3 items</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order value</Text>
            <Text style={styles.rowValue}>₹537</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Return to</Text>
            <Text style={styles.rowValue}>Swiggy Instamart, Koramangala</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>RETURN ROUTE</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeLine}>
              <View style={styles.routeDotGreen} />
              <View style={styles.routeConnector} />
            </View>
            <View>
              <Text style={styles.routeTitle}>Current location</Text>
              <Text style={styles.routeSubtitle}>HSR Layout</Text>
            </View>
          </View>
          <View style={styles.routeRow}>
            <View style={styles.routeDotRed} />
            <View>
              <Text style={styles.routeTitle}>Swiggy Instamart, Koramangala</Text>
              <Text style={styles.routeSubtitle}>4.8 km · ETA 18 min</Text>
            </View>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Earnings (protected)</Text>
          <View style={styles.row}>
            <Text style={styles.earningsRowLabel}>Return bonus</Text>
            <Text style={styles.earningsRowValueGreen}>+ ₹15</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.earningsRowLabel}>Delivery earnings</Text>
            <Text style={styles.earningsRowValue}>₹40</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total earned</Text>
            <Text style={styles.totalValue}>₹55</Text>
          </View>
        </View>

        <Button
          label="Navigate to Store — 4.8 km"
          icon="navigation"
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}
        />
        <Button label="Contact Support" variant="secondary" onPress={() => navigation.navigate('IssueSupportContact', {orderId})} />
        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Store open until 11 PM · Present order ID at counter</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.dark600, alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: '#D1D5DB', textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 3, gap: spacing.md},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  rowValueRight: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'right', flexShrink: 1},
  routeRow: {flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xs},
  routeLine: {alignItems: 'center'},
  routeDotGreen: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 4},
  routeDotRed: {width: 10, height: 10, borderRadius: 2, backgroundColor: colors.danger, marginTop: 4},
  routeConnector: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginTop: 2},
  routeTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  routeSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 1},
  earningsCard: {backgroundColor: colors.primarySurfaceAlt, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg},
  earningsLabel: {...typography.labelSemibold, fontSize: 13, color: colors.primaryDark, marginBottom: spacing.sm},
  earningsRowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  earningsRowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  earningsRowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.primaryBorder, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodySemibold, fontSize: 14, color: colors.primaryDark},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  noteBanner: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
});
