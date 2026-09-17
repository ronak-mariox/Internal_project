import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadEvidence'>;

const EVIDENCE_TYPES = ['Location', 'Package', 'Customer comms', 'Screen'];

export function UploadEvidenceScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [optionalChecked, setOptionalChecked] = useState(false);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Upload Evidence</Text>
          <Text style={styles.headerSubtitle}>Required for issue resolution.</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            Please upload <Text style={styles.warningBold}>1–3 photos</Text> to support your report.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Photos</Text>
        <View style={styles.photoGrid}>
          <View style={styles.photoTile}>
            <View style={styles.photoThumb}>
              <Icon name="camera" size={28} color={colors.textSecondary} />
              <View style={styles.checkBadge}>
                <Icon name="check" size={12} color={colors.white} />
              </View>
            </View>
            <Text style={styles.photoCaption}>Location photo</Text>
          </View>
          <View style={styles.photoTile}>
            <View style={styles.photoThumb}>
              <Icon name="camera" size={28} color={colors.textSecondary} />
              <View style={styles.checkBadge}>
                <Icon name="check" size={12} color={colors.white} />
              </View>
            </View>
            <Text style={styles.photoCaption}>Package/door photo</Text>
          </View>
          <TouchableOpacity style={styles.addPhotoTile} activeOpacity={0.85}>
            <Icon name="plus" size={24} color={colors.textMuted} />
            <Text style={styles.addPhotoText}>Add photo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>Accepted evidence types</Text>
        <View style={styles.chipsRow}>
          {EVIDENCE_TYPES.map(type => (
            <View key={type} style={styles.chip}>
              <Text style={styles.chipText}>{type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
            <Icon name="camera" size={18} color={colors.textPrimary} />
            <Text style={styles.actionButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
            <Icon name="image" size={18} color={colors.textPrimary} />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.videoNote}>Short video also accepted (max 30 sec)</Text>

        <View style={styles.checklistCard}>
          <Text style={styles.checklistLabel}>Checklist</Text>
          <View style={styles.checklistRow}>
            <View style={styles.checklistCheckDone}>
              <Icon name="check" size={11} color={colors.primary} />
            </View>
            <Text style={styles.checklistText}>Photo at delivery location</Text>
          </View>
          <View style={styles.checklistRow}>
            <View style={styles.checklistCheckDone}>
              <Icon name="check" size={11} color={colors.primary} />
            </View>
            <Text style={styles.checklistText}>Package condition</Text>
          </View>
          <TouchableOpacity style={styles.checklistRow} activeOpacity={0.8} onPress={() => setOptionalChecked(c => !c)}>
            <View style={[styles.checklistCheck, optionalChecked && styles.checklistCheckDone]}>
              {optionalChecked && <Icon name="check" size={11} color={colors.primary} />}
            </View>
            <Text style={styles.checklistTextMuted}>Customer unreachability proof (optional)</Text>
          </TouchableOpacity>
        </View>

        <Button label="Submit Evidence" onPress={() => navigation.navigate('IssueSupportContact', {orderId})} />
        <TouchableOpacity onPress={() => navigation.navigate('IssueSupportContact', {orderId})}>
          <Text style={styles.skipLink}>Skip — Not Required</Text>
        </TouchableOpacity>
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
  warningBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  warningBold: {fontWeight: '700'},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  photoGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  photoTile: {gap: 6},
  photoThumb: {width: 100, height: 100, borderRadius: radius.md, backgroundColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  checkBadge: {position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  photoCaption: {...typography.caption, fontSize: 12, color: colors.textSecondary, textAlign: 'center'},
  addPhotoTile: {width: 100, height: 100, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6},
  addPhotoText: {...typography.caption, fontSize: 12, color: colors.textMuted},
  fieldLabel: {...typography.label, color: colors.textSecondary},
  chipsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  chipText: {...typography.caption, color: colors.textSecondary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md},
  actionButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  videoNote: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
  checklistCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm},
  checklistLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  checklistRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  checklistCheck: {width: 20, height: 20, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  checklistCheckDone: {width: 20, height: 20, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  checklistText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  checklistTextMuted: {...typography.label, fontSize: 13, color: colors.textSecondary},
  skipLink: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary, textAlign: 'center'},
});
