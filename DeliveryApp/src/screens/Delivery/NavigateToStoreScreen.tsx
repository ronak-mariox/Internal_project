import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import StorePinIcon from '../../assets/brand/store-pin.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigateToStore'>;

const ROUTES = [
  {id: 'intermediate', label: 'via Intermediate Road', duration: '8 min', distance: '1.2 km'},
  {id: 'eighty-feet', label: 'via 80 Feet Road', duration: '11 min', distance: '1.5 km'},
];

const APPS = [
  {id: 'google', label: 'Google Maps', source: require('../../assets/images/google-maps-icon.png')},
  {id: 'waze', label: 'Waze', source: require('../../assets/images/waze-icon.png')},
  {id: 'ola', label: 'Ola Maps', source: require('../../assets/images/ola-maps-icon.png')},
];

export function NavigateToStoreScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0].id);
  const [selectedApp, setSelectedApp] = useState(APPS[0].id);

  return (
    <Screen backgroundColor={colors.dark900} statusBarStyle="light-content" edges={['top']}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line x1="20%" y1="12%" x2="20%" y2="52%" stroke={colors.primary} strokeWidth={3} strokeDasharray="8,6" />
          <Circle cx="20%" cy="52%" r={10} fill={colors.white} stroke={colors.primary} strokeWidth={3} />
        </Svg>
        <View style={styles.storePinWrap}>
          <StorePinIcon width={28} height={36} />
        </View>
        <View style={styles.distancePill}>
          <Text style={styles.distancePillText}>1.2 km</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.title}>Navigate to Store</Text>
        <Text style={styles.subtitle}>Koramangala 6th Block</Text>

        <View style={styles.routeList}>
          {ROUTES.map(r => {
            const selected = r.id === selectedRoute;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.routeOption, selected && styles.routeOptionSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedRoute(r.id)}>
                <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
                <Text style={styles.routeOptionLabel}>{r.label}</Text>
                <View style={styles.routeOptionMeta}>
                  <Text style={styles.routeOptionDuration}>{r.duration}</Text>
                  <Text style={styles.routeOptionDistance}>{r.distance}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.openWithLabel}>OPEN WITH</Text>
        <View style={styles.appRow}>
          {APPS.map(app => {
            const selected = app.id === selectedApp;
            return (
              <TouchableOpacity
                key={app.id}
                style={[styles.appOption, selected && styles.appOptionSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedApp(app.id)}>
                <Image source={app.source} style={styles.appIcon} resizeMode="contain" />
                <Text style={[styles.appLabel, selected && styles.appLabelSelected]}>{app.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          label="Start Navigation"
          icon="navigation"
          style={styles.startButton}
          onPress={() => navigation.navigate('NavigationActive', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapArea: {flex: 1, backgroundColor: colors.dark900},
  storePinWrap: {position: 'absolute', left: '38%', top: '10%'},
  distancePill: {position: 'absolute', left: '10%', top: '30%', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  distancePillText: {...typography.captionSemibold, color: colors.white},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, paddingBottom: spacing.huge, gap: spacing.md},
  grabber: {width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center'},
  title: {...typography.titleSm, color: colors.textPrimary},
  subtitle: {...typography.label, color: colors.textSecondary, marginTop: -spacing.sm},
  routeList: {gap: spacing.sm},
  routeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  routeOptionSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  radio: {width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary},
  radioDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  routeOptionLabel: {...typography.labelSemibold, color: colors.textPrimary, flex: 1},
  routeOptionMeta: {alignItems: 'flex-end'},
  routeOptionDuration: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  routeOptionDistance: {...typography.caption, color: colors.textSecondary},
  openWithLabel: {...typography.labelSemibold, color: colors.textSecondary, fontSize: 12},
  appRow: {flexDirection: 'row', gap: spacing.sm},
  appOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 36,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  appOptionSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  appIcon: {width: 17, height: 16},
  appLabel: {...typography.captionSemibold, color: colors.textSecondary},
  appLabelSelected: {color: colors.primary},
  startButton: {marginTop: spacing.sm},
});
