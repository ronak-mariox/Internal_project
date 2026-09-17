import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerStartNavigation'>;

const ROUTES = [
  {id: 'orr', label: 'via Outer Ring Road', duration: '18 min'},
  {id: 'hundred-feet', label: 'via 100 Feet Road', duration: '22 min'},
];

const APPS = ['Google Maps', 'Waze', 'Ola Maps'];

export function CustomerStartNavigationScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0].id);
  const [selectedApp, setSelectedApp] = useState(APPS[0]);

  return (
    <Screen backgroundColor={colors.dark900} statusBarStyle="light-content" edges={['top']}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line x1="42%" y1="8%" x2="42%" y2="68%" stroke={colors.primary} strokeWidth={3} strokeDasharray="8,6" />
          <Circle cx="42%" cy="68%" r={10} fill={colors.white} stroke={colors.primary} strokeWidth={3} />
        </Svg>
        <View style={styles.homePin}>
          <Icon name="alert-circle" size={18} color={colors.white} />
        </View>
        <View style={styles.distancePill}>
          <Text style={styles.distancePillText}>4.8 km</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.title}>Navigate to Customer</Text>
        <Text style={styles.subtitle}>Priya Mehta · HSR Layout Sector 2</Text>

        <View style={styles.etaCard}>
          <Icon name="clock" size={20} color={colors.textPrimary} />
          <View style={styles.etaText}>
            <Text style={styles.etaTitle}>18 min · Arriving ~3:02 PM</Text>
            <Text style={styles.etaSubtitle}>via current fastest route</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ROUTE OPTIONS</Text>
        <View style={styles.routeList}>
          {ROUTES.map(r => {
            const selected = r.id === selectedRoute;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.routeOption, selected && styles.routeOptionSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedRoute(r.id)}>
                <Text style={styles.routeOptionLabel}>{r.label}</Text>
                <Text style={styles.routeOptionDuration}>
                  {r.duration} {selected ? '●' : '○'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>OPEN IN</Text>
        <View style={styles.appRow}>
          {APPS.map(app => (
            <TouchableOpacity key={app} style={styles.appOption} activeOpacity={0.8} onPress={() => setSelectedApp(app)}>
              <Text style={[styles.appLabel, app === selectedApp && styles.appLabelSelected]}>{app}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="Start Navigation"
          style={styles.startButton}
          onPress={() => navigation.navigate('CustomerNavigationActive', {orderId})}
        />
        <TouchableOpacity
          style={styles.markArrivedLink}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('NearCustomer', {orderId})}>
          <Text style={styles.markArrivedText}>Already know the way? Mark arrived</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapArea: {flex: 1, backgroundColor: colors.dark900},
  homePin: {
    position: 'absolute',
    left: '58%',
    top: '10%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distancePill: {position: 'absolute', left: spacing.lg, top: spacing.lg, backgroundColor: 'rgba(31,41,55,0.85)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 6},
  distancePillText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, paddingBottom: spacing.huge, gap: spacing.sm},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xs},
  title: {...typography.titleSm, color: colors.textPrimary},
  subtitle: {...typography.label, color: colors.textSecondary, marginTop: -spacing.xxs, marginBottom: spacing.xs},
  etaCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md},
  etaText: {flex: 1},
  etaTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  etaSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  sectionLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.5, marginTop: spacing.sm},
  routeList: {gap: spacing.xs},
  routeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  routeOptionSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  routeOptionLabel: {...typography.bodyMedium, color: colors.textPrimary},
  routeOptionDuration: {...typography.caption, color: colors.textSecondary},
  appRow: {flexDirection: 'row', gap: spacing.sm},
  appOption: {flex: 1, height: 43, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  appLabel: {...typography.captionMedium, color: colors.textPrimary},
  appLabelSelected: {color: colors.primary, fontWeight: '700'},
  startButton: {marginTop: spacing.md},
  markArrivedLink: {alignItems: 'center', paddingVertical: spacing.sm},
  markArrivedText: {...typography.label, color: colors.textSecondary},
});
