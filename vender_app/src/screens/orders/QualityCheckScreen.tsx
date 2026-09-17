import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useOrders } from '../../context/OrdersContext';
import { colors, spacing } from '../../theme';
import { OrderActionLayout } from './OrderActionLayout';
import { FlexButton } from './FlexButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'QualityCheckOrders'>;

export function QualityCheckScreen({ navigation }: Props) {
  const { ordersByStatus, passQualityCheck, failQualityCheck } = useOrders();
  const qcOrders = ordersByStatus(['quality-check']);

  return (
    <OrderActionLayout
      title="Quality Check"
      onBack={() => navigation.goBack()}
      pill={{ label: `${qcOrders.length} pending`, color: '#7C3AED', background: '#F5F3FF' }}
      banner={{
        variant: 'info',
        message: 'Inspect freshness, packaging integrity, and quantity before packing.',
      }}
      orders={qcOrders}
      onOrderPress={orderId => navigation.navigate('OrderDetails', { orderId })}
      renderOrderExtra={order => (
        <View style={styles.actionsRow}>
          <FlexButton
            label="QC Failed"
            onPress={() => failQualityCheck(order.id)}
            background={colors.errorSurface}
            textColor={colors.error}
            borderColor={colors.errorBorder}
            flex={1}
          />
          <FlexButton
            label="QC Passed ✓"
            onPress={() => passQualityCheck(order.id)}
            background={colors.primary}
            textColor={colors.white}
            flex={1}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
