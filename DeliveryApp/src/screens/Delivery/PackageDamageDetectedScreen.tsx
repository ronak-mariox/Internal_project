import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageDamageDetected'>;

export function PackageDamageDetectedScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="package" size={30} color={colors.white} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Package Damage Detected</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#{orderId}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagTextMuted}>Priya Mehta</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DAMAGE REPORT</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Detected at</Text>
            <Text style={styles.rowValue}>3:05 PM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Item</Text>
            <Text style={styles.rowValue}>Almonds 500g package</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Damage type</Text>
            <View style={styles.damageTag}>
              <Text style={styles.damageTagText}>Seal broken / Packaging torn</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>PHOTO EVIDENCE</Text>
          <View style={styles.photoRow}>
            <View style={styles.photoThumb}>
              <Icon name="camera" size={24} color={colors.textSecondary} />
              <View style={styles.photoTimeTag}>
                <Text style={styles.photoTimeText}>3:05 PM</Text>
              </View>
            </View>
            <View style={styles.photoThumb}>
              <Icon name="camera" size={24} color={colors.textSecondary} />
            </View>
            <TouchableOpacity style={styles.addPhotoTile} activeOpacity={0.85}>
              <Icon name="plus" size={20} color={colors.textMuted} />
              <Text style={styles.addPhotoText}>Add more</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.protectionBanner}>
          <Icon name="shield" size={14} color={colors.primary} />
          <Text style={styles.protectionText}>Documenting damage protects you from liability claims.</Text>
        </View>

        <TouchableOpacity style={styles.primaryOption} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryOptionTitle}>Report and continue delivery</Text>
          <Text style={styles.primaryOptionSubtitle}>Customer will be informed of damage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <Text style={styles.secondaryOptionTitle}>Contact support — customer may refuse</Text>
          <Text style={styles.optionSubtitle}>Get guidance before proceeding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}>
          <Text style={styles.dangerOptionTitle}>Return order if damage is severe</Text>
          <Text style={styles.optionSubtitle}>Take package back to store</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', height: 100},
  headerIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  tagsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  divider: {height: 1, backgroundColor: '#F3F4F6'},
  damageTag: {backgroundColor: colors.dangerSurface, borderRadius: 4, paddingHorizontal: spacing.sm, paddingVertical: 2},
  damageTagText: {...typography.labelSemibold, fontSize: 13, color: colors.danger},
  photoRow: {flexDirection: 'row', gap: spacing.sm},
  photoThumb: {width: 80, height: 80, borderRadius: radius.sm, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  photoTimeTag: {position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 3, alignItems: 'center'},
  photoTimeText: {...typography.captionMedium, fontSize: 9, color: colors.white},
  addPhotoTile: {width: 80, height: 80, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.borderStrong, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4},
  addPhotoText: {...typography.captionMedium, fontSize: 11, color: colors.textMuted},
  protectionBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.md, padding: spacing.md},
  protectionText: {...typography.label, fontSize: 13, color: colors.primary, flex: 1},
  primaryOption: {backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md},
  primaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  primaryOptionSubtitle: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1},
  secondaryOption: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  secondaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  dangerOption: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.dangerBorder, borderRadius: radius.md, padding: spacing.md},
  dangerOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
});
