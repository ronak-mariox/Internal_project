import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, Button, Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupDetails'>;

const ITEMS = [
  {name: 'Almonds 500g', price: '₹299'},
  {name: 'Greek Yogurt', price: '₹89'},
  {name: 'Oats 1kg', price: '₹149'},
];

export function PickupDetailsScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Pickup Details</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.storeName}>Swiggy Instamart</Text>
          <Text style={styles.storeAddress}>Koramangala 6th Block, 560095</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="map-pin" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>1.2 km · ETA: 8 min</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="clock" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Open until 11:00 PM</Text>
            </View>
          </View>
          <View style={styles.actionsRow}>
            <Button
              label="Call Store"
              variant="secondary"
              icon="phone"
              size="md"
              style={styles.actionButton}
              onPress={() => navigation.navigate('ContactStore', {orderId})}
            />
            <Button label="Directions" variant="secondary" icon="map" size="md" style={styles.actionButton} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER SUMMARY</Text>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Order ID:</Text>
            <Text style={styles.orderIdValue}>#{orderId}</Text>
            <Icon name="copy" size={14} color={colors.textSecondary} />
          </View>
          {ITEMS.map((item, index) => (
            <View key={item.name} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total: ₹537</Text>
            <Badge label="Pre-paid" tone="success" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>PICKUP INSTRUCTIONS</Text>
          <Text style={styles.instructionText}>Ask for order at the pharmacy counter</Text>
          <View style={styles.warningBanner}>
            <Icon name="alert-triangle" size={14} color={colors.warning} />
            <Text style={styles.warningText}>Fragile items — handle with care</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Need Help" variant="secondary" icon="headphones" style={styles.helpButton} fullWidth={false} />
        <Button
          label="Navigate"
          icon="navigation"
          style={styles.navigateButton}
          fullWidth={false}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.titleSm, color: colors.textPrimary},
  headerSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  storeName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  storeAddress: {...typography.label, color: colors.textSecondary, marginTop: 2},
  metaRow: {flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md},
  metaItem: {flexDirection: 'row', alignItems: 'center', gap: 5},
  metaText: {...typography.label, color: colors.textSecondary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
  actionButton: {flex: 1, height: 40},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.md},
  orderIdRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.md, marginBottom: spacing.sm},
  orderIdLabel: {...typography.label, color: colors.textSecondary},
  orderIdValue: {...typography.labelSemibold, color: colors.textPrimary, flex: 1},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm},
  itemRowBorder: {},
  itemName: {...typography.body, color: colors.textPrimary},
  itemPrice: {...typography.bodySemibold, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.xs},
  totalLabel: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary},
  instructionText: {...typography.body, color: colors.textPrimary, marginBottom: spacing.md},
  warningBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  warningText: {...typography.labelSemibold, color: colors.warning},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  helpButton: {flex: 1},
  navigateButton: {flex: 2},
});
