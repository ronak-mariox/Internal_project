import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components';
import { useOrders } from '../../context/OrdersContext';
import { colors, spacing } from '../../theme';
import { OrderActionLayout } from './OrderActionLayout';
import { FlexButton } from './FlexButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'NewOrders'>;

export function NewOrdersScreen({ navigation }: Props) {
  const { ordersByStatus, acceptOrder, rejectOrder, acceptAllNew } = useOrders();
  const newOrders = ordersByStatus(['new']);

  return (
    <OrderActionLayout
      title="New Orders"
      onBack={() => navigation.goBack()}
      pill={{ label: `${newOrders.length} NEW`, color: colors.white, background: colors.error }}
      banner={{
        variant: 'info',
        message: 'Accept or reject within 5 minutes to maintain your acceptance rate.',
      }}
      orders={newOrders}
      onOrderPress={orderId => navigation.navigate('NewOrderReceived', { orderId })}
      renderOrderExtra={order => (
        <View style={styles.actionsRow}>
          <FlexButton
            label="Accept"
            onPress={() => acceptOrder(order.id)}
            background={colors.primary}
            textColor={colors.white}
            flex={1.03}
          />
          <FlexButton
            label="Reject"
            onPress={() => rejectOrder(order.id)}
            background={colors.errorSurface}
            textColor={colors.error}
            borderColor={colors.errorBorder}
            flex={1}
          />
        </View>
      )}
      footer={
        newOrders.length > 0 ? (
          <Button label="Accept All New Orders" onPress={acceptAllNew} />
        ) : undefined
      }
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
