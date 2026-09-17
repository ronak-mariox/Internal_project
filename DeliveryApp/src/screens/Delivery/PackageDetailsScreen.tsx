import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageDetails'>;

const ITEMS = [
  {name: 'Almonds 500g', price: '₹299', fragile: true},
  {name: 'Greek Yogurt', price: '₹89', fragile: false},
  {name: 'Oats 1kg', price: '₹149', fragile: false},
];

export function PackageDetailsScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [condition, setCondition] = useState<'good' | 'damaged'>('good');

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Package Details</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="package" size={28} color={colors.textSecondary} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>1 Package · 3 Items · ~2.3 kg</Text>
            <Text style={styles.summarySubtitle}>Medium bag (30×20×15 cm)</Text>
          </View>
        </View>

        <View style={styles.itemsCard}>
          <Text style={styles.cardLabel}>ITEMS</Text>
          {ITEMS.map((item, index) => (
            <View key={item.name} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <View style={styles.itemIcon}>
                <Icon name="package" size={20} color={colors.info} />
              </View>
              <View style={styles.itemText}>
                <View style={styles.itemNameRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.fragile && (
                    <View style={styles.fragileTag}>
                      <Text style={styles.fragileTagText}>FRAGILE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
              <Text style={styles.itemQty}>1×</Text>
            </View>
          ))}
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={18} color={colors.warning} />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Handle with care — dairy product inside</Text>
            <Text style={styles.warningSubtitle}>Temperature: Keep upright</Text>
          </View>
        </View>

        <View style={styles.conditionCard}>
          <Text style={styles.conditionTitle}>Package Condition</Text>
          <TouchableOpacity style={styles.conditionRow} activeOpacity={0.8} onPress={() => setCondition('good')}>
            <View style={[styles.radio, condition === 'good' && styles.radioSelected]}>
              {condition === 'good' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.conditionLabel}>Package looks good</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.conditionRow} activeOpacity={0.8} onPress={() => setCondition('damaged')}>
            <View style={[styles.radio, condition === 'damaged' && styles.radioSelected]}>
              {condition === 'damaged' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.conditionLabel}>Package seems damaged</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Confirm Package Details"
          icon="arrow-right"
          iconPosition="right"
          onPress={() => navigation.navigate('CollectOrder', {orderId})}
        />
      </View>
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
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  summaryCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  summaryIcon: {width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  summaryText: {flex: 1},
  summaryTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  summarySubtitle: {...typography.label, color: colors.textSecondary, marginTop: spacing.xxs},
  itemsCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.5, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  itemRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  itemIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.infoSurface, alignItems: 'center', justifyContent: 'center'},
  itemText: {flex: 1},
  itemNameRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  itemName: {...typography.bodyMedium, color: colors.textPrimary},
  fragileTag: {backgroundColor: '#FEF3C7', borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 2},
  fragileTagText: {...typography.overline, fontSize: 11, color: colors.warning},
  itemPrice: {...typography.label, color: colors.textSecondary, marginTop: 2},
  itemQty: {...typography.bodyMedium, color: colors.textSecondary},
  warningBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: radius.lg, padding: spacing.md},
  warningText: {flex: 1},
  warningTitle: {...typography.bodySemibold, fontSize: 14, color: colors.warningText},
  warningSubtitle: {...typography.label, color: '#B45309', marginTop: 2},
  conditionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  conditionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  conditionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  conditionLabel: {...typography.body, color: colors.textPrimary},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
