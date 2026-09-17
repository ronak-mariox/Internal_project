import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, CountdownRing, Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderRequestDetails'>;

const ITEMS = [
  {name: 'Amul Full Cream Milk 1L', qty: 2, price: '₹60'},
  {name: 'Britannia Whole Wheat Bread', qty: 1, price: '₹42'},
  {name: 'Tropicana Orange Juice 1L', qty: 1, price: '₹120'},
];

export function OrderRequestDetailsScreen({route, navigation}: Props) {
  const {orderId, secondsLeft: initialSeconds} = route.params;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? 18);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigation.reset({index: 0, routes: [{name: 'RequestTimedOut', params: {orderId}}]});
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigation, orderId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Order #{orderId}</Text>
          <Text style={styles.headerSubtitle}>Swiggy Instamart · 3 items</Text>
        </View>
        <CountdownRing seconds={secondsLeft} color={colors.warning} size={48} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.earningsCard}>
          <View>
            <Text style={styles.earningsLabel}>ESTIMATED EARNINGS</Text>
            <Text style={styles.earningsValue}>₹78</Text>
            <Text style={styles.earningsBreakdown}>Base ₹40 + Distance ₹24 + Bonus ₹14</Text>
          </View>
          <View style={styles.earningsRight}>
            <Text style={styles.earningsSubLabel}>3.8 km total</Text>
            <Text style={styles.earningsPerKm}>
              ₹20.5<Text style={styles.earningsPerKmUnit}>/km</Text>
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ROUTE</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeLine}>
              <View style={styles.routeDotPickup}>
                <Icon name="map-pin" size={14} color={colors.primary} />
              </View>
              <View style={styles.routeConnector} />
              <View style={styles.routeDotDrop}>
                <Icon name="map-pin" size={14} color={colors.danger} />
              </View>
            </View>
            <View style={styles.routeText}>
              <Text style={styles.routeTitle}>Swiggy Instamart</Text>
              <Text style={styles.routeSubtitle}>100 Feet Road, Koramangala 6th Block</Text>
              <Text style={styles.routeMetaGreen}>
                1.2 km from you <Text style={styles.routeMetaMuted}>· ~8 min</Text>
              </Text>
              <View style={styles.routeSpacer} />
              <Text style={styles.routeTitle}>Customer Drop-off</Text>
              <Text style={styles.routeSubtitle}>Flat 302, Sunrise Apts, HSR Layout Sector 2</Text>
              <Text style={styles.routeMetaRed}>
                2.6 km from pickup <Text style={styles.routeMetaMuted}>· ~14 min</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER CONTENTS</Text>
          {ITEMS.map((item, index) => (
            <View key={item.name} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <View style={styles.itemDot} />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQty}>×{item.qty}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Order Value</Text>
            <Text style={styles.totalValue}>₹222</Text>
          </View>
        </View>

        <View style={styles.paymentBanner}>
          <Icon name="credit-card" size={16} color={colors.primary} />
          <Text style={styles.paymentText}>
            Payment: <Text style={styles.paymentTextStrong}>Pre-paid · No cash collection required</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Reject"
          variant="secondary"
          style={styles.rejectButton}
          onPress={() => navigation.navigate('RejectConfirmSheet', {orderId})}
        />
        <Button label="Accept Order" style={styles.acceptButton} onPress={() => navigation.navigate('AcceptingOrder', {orderId})} />
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
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 15, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  earningsCard: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primary, borderRadius: radius.xxl, padding: spacing.lg},
  earningsLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5},
  earningsValue: {...typography.display, fontSize: 32, color: colors.white, marginTop: 2},
  earningsBreakdown: {...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2},
  earningsRight: {alignItems: 'flex-end'},
  earningsSubLabel: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.7)'},
  earningsPerKm: {...typography.h4, fontSize: 20, color: colors.white, marginTop: spacing.xs},
  earningsPerKmUnit: {...typography.caption, color: 'rgba(255,255,255,0.7)'},
  card: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardLabel: {...typography.overline, fontSize: 12, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm},
  routeRow: {flexDirection: 'row', gap: spacing.md},
  routeLine: {alignItems: 'center'},
  routeDotPickup: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  routeConnector: {width: 2, flex: 1, backgroundColor: colors.border, minHeight: 32},
  routeDotDrop: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.dangerSurface, borderWidth: 2, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  routeText: {flex: 1},
  routeTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  routeSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  routeMetaGreen: {...typography.captionSemibold, fontSize: 11, color: colors.primary, marginTop: 2},
  routeMetaRed: {...typography.captionSemibold, fontSize: 11, color: colors.danger, marginTop: 2},
  routeMetaMuted: {...typography.caption, fontSize: 11, color: colors.textMuted, fontWeight: '400'},
  routeSpacer: {height: spacing.lg},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm},
  itemRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  itemDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  itemName: {flex: 1, ...typography.label, color: colors.textLabel},
  itemQty: {...typography.caption, color: colors.textMuted, marginRight: spacing.sm},
  itemPrice: {...typography.captionSemibold, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textLabel},
  totalValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  paymentBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.md, padding: spacing.md},
  paymentText: {...typography.label, color: '#13845A'},
  paymentTextStrong: {fontWeight: '700'},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  rejectButton: {flex: 1, height: 56},
  acceptButton: {flex: 2, height: 56},
});
