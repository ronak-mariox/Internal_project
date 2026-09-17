import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NoOrdersInZone'>;

const NEARBY_ZONES = [
  {name: 'Indiranagar', distance: '2.1 km away', demand: 'HIGH' as const},
  {name: 'Whitefield', distance: '4.8 km away', demand: 'MEDIUM' as const},
];

const DEMAND_STYLES = {
  HIGH: {bg: 'rgba(28,166,114,0.09)', color: colors.primary},
  MEDIUM: {bg: 'rgba(247,144,9,0.09)', color: colors.warning},
};

export function NoOrdersInZoneScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineBadgeText}>ONLINE</Text>
        </View>
        <View style={styles.toggleTrack}>
          <View style={styles.toggleThumb} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.iconOuter}>
          <View style={[styles.ring, styles.ringLg]} />
          <View style={[styles.ring, styles.ringMd]} />
          <View style={styles.iconInner}>
            <Icon name="bicycle" size={44} color={colors.textMuted} />
          </View>
        </View>
        <Text style={styles.title}>No Orders in Your Zone</Text>
        <Text style={styles.subtitle}>There are no available deliveries matching your current location right now. Stay online — orders can appear anytime.</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your Current Zone</Text>
            <View style={styles.slowTag}>
              <Text style={styles.slowTagText}>SLOW</Text>
            </View>
          </View>
          <View style={styles.zoneRow}>
            <Icon name="map-pin" size={16} color={colors.textSecondary} />
            <View>
              <Text style={styles.zoneName}>Koramangala 4th Block</Text>
              <Text style={styles.zoneMeta}>7 riders in this zone · Low demand</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>NEARBY HIGH-DEMAND ZONES</Text>
          {NEARBY_ZONES.map((zone, index) => (
            <View key={zone.name} style={[styles.zoneItemRow, index > 0 && styles.zoneItemRowBorder]}>
              <View style={styles.zoneItemIcon}>
                <Icon name="map-pin" size={18} color={colors.textSecondary} />
              </View>
              <View style={styles.zoneItemText}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneMeta}>{zone.distance}</Text>
              </View>
              <View style={[styles.demandTag, {backgroundColor: DEMAND_STYLES[zone.demand].bg}]}>
                <Text style={[styles.demandTagText, {color: DEMAND_STYLES[zone.demand].color}]}>{zone.demand}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footnote}>You're still online — orders will be assigned automatically</Text>
      </View>

      <View style={styles.footer}>
        <Button
          label="Go Offline"
          variant="secondary"
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.lg},
  onlineBadge: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5},
  onlineDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#A7F3D0'},
  onlineBadgeText: {...typography.bodyBold, fontSize: 12, color: colors.white},
  toggleTrack: {width: 52, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center'},
  toggleThumb: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white, marginLeft: 27},
  body: {flex: 1, alignItems: 'center', backgroundColor: colors.background, padding: spacing.xl, gap: spacing.md},
  iconOuter: {width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  ring: {position: 'absolute', borderRadius: 100, borderWidth: 1.5, borderColor: colors.border},
  ringLg: {width: 200, height: 200, opacity: 0.5},
  ringMd: {width: 170, height: 170, opacity: 0.75},
  iconInner: {width: 140, height: 140, borderRadius: 70, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textLabel},
  cardLabel: {...typography.overline, fontSize: 12, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.xs},
  slowTag: {backgroundColor: '#FFFAEB', borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 2},
  slowTagText: {...typography.captionSemibold, fontSize: 11, color: colors.warning},
  zoneRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.md},
  zoneName: {...typography.labelSemibold, color: colors.textPrimary},
  zoneMeta: {...typography.caption, color: colors.textMuted, marginTop: 1},
  zoneItemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm},
  zoneItemRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  zoneItemIcon: {width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  zoneItemText: {flex: 1},
  demandTag: {borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 2},
  demandTagText: {...typography.overline, fontSize: 10, fontWeight: '700'},
  footnote: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
