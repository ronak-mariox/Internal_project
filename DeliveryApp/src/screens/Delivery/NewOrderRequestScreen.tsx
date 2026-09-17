import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, CountdownRing, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NewOrderRequest'>;

const START_SECONDS = 21;

export function NewOrderRequestScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);

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
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line x1="30%" y1="30%" x2="60%" y2="48%" stroke={colors.primary} strokeWidth={3} strokeDasharray="8,6" />
          <Circle cx="42%" cy="70%" r={22} fill="rgba(28,166,114,0.15)" />
        </Svg>
        <View style={[styles.pin, styles.pinPickup]}>
          <View style={styles.pinTag}>
            <Text style={styles.pinTagText}>PICKUP</Text>
          </View>
          <Icon name="map-pin" size={26} color={colors.primary} filled />
        </View>
        <View style={[styles.pin, styles.pinDrop]}>
          <View style={[styles.pinTag, styles.pinTagDrop]}>
            <Text style={styles.pinTagText}>DROP</Text>
          </View>
          <Icon name="map-pin" size={26} color={colors.danger} filled />
        </View>
        <View style={styles.currentLocationDot} />
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>NEW DELIVERY REQUEST</Text>
            <Text style={styles.headerSubtitle}>Order #{orderId} · 3 items</Text>
          </View>
          <CountdownRing seconds={secondsLeft} />
        </View>

        <TouchableOpacity style={styles.routeCard} activeOpacity={0.85} onPress={() => navigation.navigate('OrderRequestDetails', {orderId, secondsLeft})}>
          <View style={styles.routeLine}>
            <View style={styles.routeDotPickup} />
            <View style={styles.routeConnector} />
            <View style={styles.routeDotDrop} />
          </View>
          <View style={styles.routeText}>
            <Text style={styles.routeTitle}>Swiggy Instamart</Text>
            <Text style={styles.routeSubtitle}>100 Feet Road, Koramangala · 1.2 km away</Text>
            <View style={styles.routeSpacer} />
            <Text style={styles.routeTitle}>HSR Layout, Sector 2</Text>
            <Text style={styles.routeSubtitle}>Customer location · 3.8 km total</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.metricsRow}>
          <View style={[styles.metric, styles.metricHighlighted]}>
            <Text style={styles.metricValueHighlighted}>₹78</Text>
            <Text style={styles.metricLabel}>Earnings</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>3.8 km</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>22 min</Text>
            <Text style={styles.metricLabel}>Est. Time</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label="Reject"
            variant="secondary"
            icon="x"
            style={styles.rejectButton}
            onPress={() => navigation.navigate('RejectConfirmSheet', {orderId})}
          />
          <Button
            label="Accept"
            icon="check"
            style={styles.acceptButton}
            onPress={() => navigation.navigate('AcceptingOrder', {orderId})}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.dark900},
  mapArea: {flex: 1},
  pin: {position: 'absolute', alignItems: 'center'},
  pinPickup: {left: '28%', top: '18%'},
  pinDrop: {left: '58%', top: '24%'},
  pinTag: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3, marginBottom: 2},
  pinTagDrop: {backgroundColor: colors.danger},
  pinTagText: {...typography.overline, fontSize: 10, color: colors.white},
  currentLocationDot: {position: 'absolute', left: '42%', top: '70%', width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.white},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, gap: spacing.md},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center'},
  headerRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  headerLabel: {...typography.overline, fontSize: 11, color: colors.textMuted, letterSpacing: 0.5},
  headerSubtitle: {...typography.labelSemibold, color: colors.textSecondary, marginTop: 2},
  routeCard: {flexDirection: 'row', gap: spacing.md, backgroundColor: colors.background, borderRadius: radius.xl, padding: spacing.md},
  routeLine: {alignItems: 'center', paddingTop: 3},
  routeDotPickup: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white},
  routeConnector: {width: 1.5, flex: 1, backgroundColor: colors.borderStrong, minHeight: 28},
  routeDotDrop: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.white},
  routeText: {flex: 1},
  routeTitle: {...typography.labelSemibold, color: colors.textPrimary},
  routeSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  routeSpacer: {height: spacing.md},
  metricsRow: {flexDirection: 'row', gap: spacing.sm},
  metric: {flex: 1, backgroundColor: colors.background, borderWidth: 1.5, borderColor: '#F3F4F6', borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  metricHighlighted: {backgroundColor: colors.primarySurface, borderColor: colors.primaryBorder},
  metricValue: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  metricValueHighlighted: {...typography.bodyBold, fontSize: 15, color: colors.primary},
  metricLabel: {...typography.micro, fontSize: 10, color: colors.textMuted, marginTop: 2, textTransform: 'uppercase'},
  actions: {flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.xxl},
  rejectButton: {flex: 1, height: 56},
  acceptButton: {flex: 2, height: 56},
});
