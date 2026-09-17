import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RoadBlockage'>;

const ROUTES = [
  {id: 'alternate', title: 'Try alternate route', subtitle: '1.4 km longer · +9 min'},
  {id: 'wait', title: 'Wait for road to clear', subtitle: 'Estimated 15 min'},
];

export function RoadBlockageScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selected, setSelected] = useState('alternate');
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="alert-triangle" size={44} color={colors.white} />
        <Text style={styles.headerTitle}>Road Blockage</Text>
        <Text style={styles.headerSubtitle}>Unable to reach delivery location.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CURRENT STATUS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>#{orderId}, HSR Layout</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Your location</Text>
            <Text style={styles.rowValue}>0.8 km from destination</Text>
          </View>
          <View style={styles.issueRow}>
            <Text style={styles.issueText}>Issue: Road closed — protest/construction</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Route alternatives</Text>
        <View style={styles.optionsList}>
          {ROUTES.map(r => {
            const isSelected = r.id === selected;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.routeRow, isSelected && styles.routeRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(r.id)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioDot} />}</View>
                <View>
                  <Text style={styles.routeTitle}>{r.title}</Text>
                  <Text style={styles.routeSubtitle}>{r.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.fallbackLabel}>If neither option works</Text>
        <Button label="Escalate to Support" onPress={() => navigation.navigate('CannotComplete', {orderId})} />
        <Button label="Request Reassignment" variant="secondary" onPress={goHome} />

        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Delays due to road issues are recorded. Your <Text style={styles.infoBold}>on-time score will not be affected</Text>.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.warning, alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: colors.warningSurface, textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xxs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  issueRow: {borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs},
  issueText: {...typography.label, fontSize: 13, color: colors.danger},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionsList: {gap: spacing.sm},
  routeRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  routeRowSelected: {borderColor: colors.primary},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  routeTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  routeSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  fallbackLabel: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  infoBanner: {backgroundColor: colors.infoSurface, borderWidth: 1, borderColor: '#BFDBFE', borderRadius: radius.md, padding: spacing.md},
  infoText: {...typography.label, fontSize: 13, color: '#1D4ED8'},
  infoBold: {fontWeight: '700'},
});
