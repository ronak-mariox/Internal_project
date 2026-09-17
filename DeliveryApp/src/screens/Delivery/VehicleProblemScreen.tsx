import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleProblem'>;

const ISSUES = ['Flat tyre', 'Engine / battery issue', 'Brake problem', 'Accident'];

export function VehicleProblemScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selected, setSelected] = useState(ISSUES[0]);
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="bicycle" size={48} color={colors.white} />
        <Text style={styles.headerTitle}>Vehicle Problem</Text>
        <Text style={styles.headerSubtitle}>Cannot continue delivery due to vehicle issue.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.riskCard}>
          <Text style={styles.riskLabel}>ORDER AT RISK</Text>
          <Text style={styles.riskOrder}>
            #{orderId} · Priya Mehta
          </Text>
          <View style={styles.riskMetaRow}>
            <Text style={styles.riskAmount}>₹82 at risk</Text>
            <Text style={styles.riskDistance}>3.4 km remaining</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select vehicle issue</Text>
        <View style={styles.optionsList}>
          {ISSUES.map(issue => {
            const isSelected = issue === selected;
            return (
              <TouchableOpacity
                key={issue}
                style={[styles.issueRow, isSelected && styles.issueRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(issue)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioDot} />}</View>
                <Text style={[styles.issueText, isSelected && styles.issueTextSelected]}>{issue}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            Your delivery may be reassigned. You will receive <Text style={styles.noteBold}>partial earnings</Text>.
          </Text>
        </View>

        <Button label="Request reassignment — Save order" icon="shield" onPress={goHome} />
        <Button label="Report vehicle issue to support" variant="secondary" icon="alert-circle" onPress={() => navigation.navigate('CannotComplete', {orderId})} />
        <Button label="Call support for help" variant="secondary" icon="phone" onPress={goHome} />

        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyText}>If you were in an accident, tap Emergency Assist.</Text>
          <Button label="Emergency Assist" style={styles.emergencyButton} onPress={goHome} />
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
  riskCard: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.md},
  riskLabel: {...typography.captionSemibold, fontSize: 12, color: colors.warning, letterSpacing: 0.5, textTransform: 'uppercase'},
  riskOrder: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs},
  riskMetaRow: {flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xs},
  riskAmount: {...typography.labelSemibold, fontSize: 13, color: colors.danger},
  riskDistance: {...typography.label, fontSize: 13, color: colors.textSecondary},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionsList: {gap: spacing.sm},
  issueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  issueRowSelected: {borderColor: colors.warning},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.warning},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.warning},
  issueText: {...typography.bodyLg, color: colors.textPrimary},
  issueTextSelected: {...typography.bodyLgMedium, color: colors.textPrimary},
  noteBanner: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  noteBold: {fontWeight: '700', color: colors.textPrimary},
  emergencyBanner: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm},
  emergencyText: {...typography.label, fontSize: 13, color: colors.danger},
  emergencyButton: {backgroundColor: colors.danger},
});
