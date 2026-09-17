import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../icons/Icon';
import { colors, fontFamilies, radii, spacing, typography } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
};

export function UploadDropzone({ label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon name="upload" size={20} color={colors.textSecondary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radii.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.labelSemibold,
    fontFamily: fontFamilies.medium,
    color: colors.textSecondary,
  },
});
