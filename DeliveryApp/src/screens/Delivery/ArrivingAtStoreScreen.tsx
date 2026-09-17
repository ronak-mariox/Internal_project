import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ArrivingAtStore'>;

export function ArrivingAtStoreScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconOuter}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={styles.iconInner}>
          <Icon name="store" size={22} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>0.3 km away</Text>
      <Text style={styles.subtitle}>You are almost there</Text>

      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.storeName}>Swiggy Instamart</Text>
          <Badge label="Verified" tone="success" />
        </View>
        <View style={styles.addressRow}>
          <Icon name="map-pin" size={14} color={colors.textSecondary} />
          <Text style={styles.addressText}>Koramangala 6th Block, 560095</Text>
        </View>
        <Text style={styles.etaText}>
          Estimated arrival: <Text style={styles.etaValue}>2 min</Text>
        </Text>
      </View>

      <View style={styles.infoBanner}>
        <View style={styles.infoIcon}>
          <Icon name="check" size={12} color={colors.white} />
        </View>
        <Text style={styles.infoText}>Store has been notified of your arrival. Order is being prepared.</Text>
      </View>

      <View style={styles.spacer} />

      <View style={styles.actionsRow}>
        <Button
          label="Call Store"
          variant="outline"
          icon="phone"
          style={styles.callButton}
          fullWidth={false}
          onPress={() => navigation.navigate('ContactStore', {orderId})}
        />
        <Button
          label="Arrived"
          icon="map-pin"
          style={styles.arrivedButton}
          fullWidth={false}
          onPress={() => navigation.navigate('ConfirmingArrival', {orderId})}
        />
      </View>
      <TouchableOpacity style={styles.troubleLink} activeOpacity={0.7}>
        <Text style={styles.troubleLinkText}>Having trouble finding the store?</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.huge},
  iconOuter: {width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  ring: {position: 'absolute', borderRadius: 100, backgroundColor: 'rgba(28,166,114,0.08)'},
  ringOuter: {width: 180, height: 180},
  ringMid: {width: 132, height: 132, backgroundColor: 'rgba(28,166,114,0.14)'},
  iconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {...typography.h1, fontSize: 28, color: colors.primary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xxs, marginBottom: spacing.lg},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, marginBottom: spacing.md},
  cardTopRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  storeName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  addressRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm},
  addressText: {...typography.label, color: colors.textSecondary},
  etaText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm},
  etaValue: {color: colors.primary},
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    width: '100%',
    backgroundColor: colors.primarySurfaceAlt,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  infoIcon: {width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 1},
  infoText: {...typography.label, color: colors.primaryDark, flex: 1},
  spacer: {flex: 1},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, width: '100%'},
  callButton: {flex: 1, height: 52},
  arrivedButton: {flex: 2, height: 52},
  troubleLink: {paddingVertical: spacing.md},
  troubleLinkText: {...typography.label, color: colors.textSecondary, textDecorationLine: 'underline'},
});
