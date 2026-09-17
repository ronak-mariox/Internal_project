import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useProfile, DocumentStatus } from '../../context/ProfileContext';
import { Badge, BadgeTone, Button, NavHeader } from '../../components';
import { Icon } from '../../icons/Icon';
import { colors, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileReplaceDocument'>;

const STATUS_LABEL: Record<DocumentStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
};

const STATUS_TONE: Record<DocumentStatus, BadgeTone> = {
  verified: 'success',
  pending: 'warning',
  rejected: 'error',
};

export function ProfileReplaceDocumentScreen({ navigation, route }: Props) {
  const { documentId } = route.params;
  const { getDocument, replaceDocument } = useProfile();
  const document = getDocument(documentId);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!document) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NavHeader title="Replace Document" onBack={() => navigation.goBack()} />
        <View style={styles.notFound}>
          <Icon name="file-text" size={32} color={colors.textTertiary} />
          <Text style={styles.notFoundText}>This document could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  function handlePickFile() {
    setSelectedFile(`${document!.name.replace(/\s+/g, '_')}_new.pdf`);
  }

  function handleSubmit() {
    replaceDocument(documentId);
    Alert.alert('Document Replaced', 'Your new document has been submitted for verification.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <NavHeader title="Replace Document" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCardWrap}>
          <View style={styles.warningCard}>
            <Icon name="alert-triangle" size={14} color={colors.warningDark} />
            <Text style={styles.warningText}>
              Replacing a {document.status === 'verified' ? 'verified' : 'submitted'} document requires
              re-verification (1–3 business days).
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Current Document</Text>
        <View style={styles.currentDocRow}>
          <View style={styles.fileIcon}>
            <Icon name="file-text" size={18} color={colors.primary} />
          </View>
          <View style={styles.currentDocText}>
            <Text style={styles.docName} numberOfLines={1}>
              {document.name}
            </Text>
            <Text style={styles.docMeta} numberOfLines={1}>
              {STATUS_LABEL[document.status]} · {document.uploadedLabel}
            </Text>
          </View>
          <Badge label={STATUS_LABEL[document.status]} tone={STATUS_TONE[document.status]} />
        </View>

        <Text style={styles.sectionHeader}>Step 1: Upload New Document</Text>
        <View style={styles.dropzoneWrap}>
          <Pressable style={styles.dropzone} onPress={handlePickFile}>
            <Icon name="upload" size={32} color={colors.textSecondary} />
            <Text style={styles.dropzoneTitle}>
              {selectedFile ? selectedFile : 'Tap to upload document'}
            </Text>
            <Text style={styles.dropzoneSubtitle}>
              {selectedFile ? 'Tap to choose a different file' : 'PDF, JPG, PNG · Max 5 MB'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoBannerWrap}>
          <View style={styles.infoBanner}>
            <Icon name="info" size={14} color={colors.primaryDark} />
            <Text style={styles.infoBannerText}>Your account continues normally during review.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="Upload & Replace"
            onPress={handleSubmit}
            disabled={!selectedFile}
          />
          <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxxl,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollBody: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  warningCardWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  warningCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.warningSurface,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radii.md,
    padding: spacing.lg + 2,
  },
  warningText: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 20.8,
    color: '#92400E',
    flex: 1,
  },
  sectionHeader: {
    ...typography.tinyBold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  currentDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDocText: {
    flex: 1,
    gap: 2,
  },
  docName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  docMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dropzoneWrap: {
    paddingHorizontal: spacing.xl,
  },
  dropzone: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radii.md,
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  dropzoneTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  dropzoneSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoBannerWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarySurface,
    borderRadius: radii.sm,
    padding: spacing.lg,
  },
  infoBannerText: {
    ...typography.caption,
    color: colors.primaryDark,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
  },
  cancelText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
