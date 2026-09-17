import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button, NavHeader } from '../../components';
import { Icon } from '../../icons/Icon';
import { useProductCatalog } from '../../context/ProductCatalogContext';
import { colors, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'EditImages'>;

const MAX_GALLERY = 4;

const REQUIREMENTS = [
  'Minimum size: 800×800 pixels',
  'Accepted: JPG, PNG, WEBP',
  'Max file size: 5MB per image',
  'Clear product view on white/plain background',
];

export function EditImagesScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const { products, updateProduct } = useProductCatalog();
  const product = products.find(item => item.id === productId);

  const [galleryCount, setGalleryCount] = useState(product?.galleryCount ?? 0);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NavHeader title="Edit Images" onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  function handleSave() {
    updateProduct(productId, { galleryCount });
    navigation.goBack();
  }

  const slots = Array.from({ length: MAX_GALLERY });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <NavHeader title="Edit Images" onBack={() => navigation.goBack()} rightLabel="Save" onRightPress={handleSave} />
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.sectionTitle}>Main Image</Text>
          <View style={styles.mainImage}>
            <Pressable style={styles.replaceButton}>
              <Icon name="image" size={16} color={colors.white} />
              <Text style={styles.replaceText}>Replace Image</Text>
            </Pressable>
            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>MAIN</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.galleryHeaderRow}>
            <Text style={styles.sectionTitle}>
              Gallery ({galleryCount}/{MAX_GALLERY})
            </Text>
            <Pressable
              style={styles.addButton}
              onPress={() => galleryCount < MAX_GALLERY && setGalleryCount(count => count + 1)}
            >
              <Icon name="plus" size={13} color={colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
          <View style={styles.galleryGrid}>
            {slots.map((_, index) => {
              const filled = index < galleryCount;
              return (
                <View
                  key={index}
                  style={[styles.gallerySlot, filled ? styles.gallerySlotFilled : styles.gallerySlotEmpty]}
                >
                  {filled ? (
                    <View style={styles.gallerySlotActions}>
                      <Pressable style={styles.miniButton}>
                        <Icon name="edit" size={11} color={colors.white} />
                      </Pressable>
                      <Pressable
                        style={[styles.miniButton, styles.miniButtonRemove]}
                        onPress={() => setGalleryCount(count => count - 1)}
                      >
                        <Icon name="x" size={11} color={colors.white} />
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.emptySlotButton}
                      onPress={() => galleryCount < MAX_GALLERY && setGalleryCount(count => count + 1)}
                    >
                      <Icon name="plus" size={22} color={colors.textTertiary} />
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Image Requirements</Text>
          {REQUIREMENTS.map(requirement => (
            <View key={requirement} style={styles.requirementRow}>
              <View style={styles.requirementDot} />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button label="Save Images" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  sectionTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
    marginBottom: spacing.md,
  },
  mainImage: {
    height: 180,
    borderRadius: radii.xl,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  replaceText: {
    ...typography.labelSemibold,
    color: colors.white,
  },
  mainBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  mainBadgeText: {
    ...typography.tinyBold,
    color: colors.white,
  },
  galleryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    ...typography.caption,
    color: colors.primary,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gallerySlot: {
    width: 84,
    height: 88,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gallerySlotFilled: {
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gallerySlotEmpty: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  gallerySlotActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  miniButton: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniButtonRemove: {
    backgroundColor: 'rgba(220,38,38,0.8)',
  },
  emptySlotButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementsCard: {
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  requirementsTitle: {
    ...typography.captionSemibold,
    color: colors.primaryDark,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  requirementDot: {
    width: 4,
    height: 4,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  requirementText: {
    ...typography.tiny,
    color: colors.primaryDark,
  },
  footer: {
    paddingTop: spacing.sm,
  },
});
