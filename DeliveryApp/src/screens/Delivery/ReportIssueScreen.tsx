import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportIssue'>;

const CATEGORIES = [
  'Customer unreachable',
  'Wrong address',
  'Package damaged',
  'Missing items',
  'Vehicle problem',
  'Safety concern',
  'Store error',
  'Other',
];

export function ReportIssueScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selected, setSelected] = useState(CATEGORIES[0]);
  const [details, setDetails] = useState('Customer did not respond after 3 calls and 2 messages. Waited 10 minutes at location.');

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Report Delivery Issue</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Issue category</Text>
        <View style={styles.categoryList}>
          {CATEGORIES.map(category => {
            const isSelected = category === selected;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryRow, isSelected && styles.categoryRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(category)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.categoryText}>{category}</Text>
                {isSelected && <Icon name="check" size={18} color={colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Store</Text>
            <Text style={styles.summaryValue}>Swiggy Instamart</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer</Text>
            <Text style={styles.summaryValue}>Priya Mehta</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Earnings</Text>
            <Text style={styles.summaryValueGreen}>₹82 at stake</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Additional details</Text>
        <TextInput style={styles.textArea} value={details} onChangeText={setDetails} multiline textAlignVertical="top" />

        <Text style={styles.sectionLabel}>Evidence (optional)</Text>
        <TouchableOpacity style={styles.evidenceButton} activeOpacity={0.85}>
          <Icon name="camera" size={22} color={colors.textSecondary} />
          <Text style={styles.evidenceButtonText}>Add photo (optional)</Text>
        </TouchableOpacity>

        <Button label="Submit Report" onPress={() => navigation.navigate('SelectIssueReason', {orderId})} />
        <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
        <Text style={styles.footnote}>Support will review within 2 minutes.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  categoryList: {gap: spacing.sm},
  categoryRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  categoryRowSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  categoryText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1},
  summaryCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: 4},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.label, fontWeight: '500', fontSize: 13, color: colors.textPrimary},
  summaryValueGreen: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  textArea: {
    height: 100,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  evidenceButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.md, paddingVertical: spacing.xl},
  evidenceButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
  footnote: {...typography.labelSemibold, fontSize: 13, color: colors.primary, textAlign: 'center'},
});
