import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle, Polyline} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigationActive'>;

export function NavigationActiveScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('ArrivingAtStore', {orderId}), 4000);
    return () => clearTimeout(timer);
  }, [navigation, orderId]);

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Polyline points="50%,20% 30%,45% 50%,80%" fill="none" stroke={colors.primary} strokeWidth={4} strokeDasharray="10,7" strokeLinecap="round" />
          <Circle cx="50%" cy="20%" r={9} fill={colors.white} stroke={colors.primary} strokeWidth={3} />
        </Svg>
        <View style={styles.speedPill}>
          <Text style={styles.speedValue}>32</Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>
      </View>

      <View style={styles.instructionCard}>
        <View style={styles.instructionIcon}>
          <Icon name="turn-left" size={28} color={colors.white} />
        </View>
        <View style={styles.instructionText}>
          <Text style={styles.instructionTitle}>Turn left in 200m</Text>
          <Text style={styles.instructionSubtitle}>Intermediate Road</Text>
        </View>
        <View style={styles.instructionMeta}>
          <Text style={styles.instructionDistance}>0.9 km</Text>
          <Text style={styles.instructionEta}>6 min</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.orderRow}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>#{orderId}</Text>
            <Text style={styles.storeName}>Swiggy Instamart, Koramangala</Text>
          </View>
          <View style={styles.arrivalInfo}>
            <Text style={styles.arrivalLabel}>Arriving at</Text>
            <Text style={styles.arrivalValue}>2:34 PM</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Icon name="volume-off" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Icon name="grid" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Icon name="x" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Exit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.callButton} activeOpacity={0.85} onPress={() => navigation.navigate('ContactStore', {orderId})}>
          <Icon name="phone" size={16} color={colors.primary} />
          <Text style={styles.callButtonText}>Call Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.dark900},
  mapArea: {flex: 1},
  speedPill: {
    position: 'absolute',
    right: spacing.lg,
    bottom: '30%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  speedValue: {...typography.h4, fontSize: 18, color: colors.white},
  speedUnit: {...typography.micro, fontSize: 10, color: 'rgba(255,255,255,0.7)'},
  instructionCard: {
    position: 'absolute',
    top: 44,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(17,24,39,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  instructionIcon: {width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  instructionText: {flex: 1},
  instructionTitle: {...typography.h4, fontSize: 18, color: colors.white},
  instructionSubtitle: {...typography.label, color: 'rgba(255,255,255,0.65)', marginTop: 2},
  instructionMeta: {alignItems: 'flex-end'},
  instructionDistance: {...typography.bodyBold, fontSize: 16, color: colors.white},
  instructionEta: {...typography.caption, color: 'rgba(255,255,255,0.65)'},
  sheet: {backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, paddingBottom: spacing.huge, gap: spacing.md},
  grabber: {width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center'},
  orderRow: {flexDirection: 'row', justifyContent: 'space-between'},
  orderInfo: {flex: 1},
  orderId: {...typography.caption, color: colors.textSecondary},
  storeName: {...typography.title, fontSize: 15, color: colors.textPrimary, marginTop: 1},
  arrivalInfo: {alignItems: 'flex-end'},
  arrivalLabel: {...typography.caption, color: colors.textSecondary},
  arrivalValue: {...typography.title, fontSize: 15, color: colors.textPrimary, marginTop: 1},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  actionLabel: {...typography.micro, fontSize: 10, color: colors.textSecondary},
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 40,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  callButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
});
