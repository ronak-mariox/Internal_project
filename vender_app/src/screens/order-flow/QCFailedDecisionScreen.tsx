import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useOrders } from '../../context/OrdersContext';
import { ItemIssueDecisionView } from './ItemIssueDecisionView';

type Props = NativeStackScreenProps<AuthStackParamList, 'QCFailedDecision'>;

export function QCFailedDecisionScreen({ navigation, route }: Props) {
  const { orderId, itemName, itemPrice, itemQty } = route.params;
  const { rejectOrder } = useOrders();

  return (
    <ItemIssueDecisionView
      headerTitle="QC Failed"
      onBack={() => navigation.goBack()}
      statusIcon="x-circle"
      heading="Quality Check Failed"
      subtitle="1 item failed quality inspection. You must replace or remove it before proceeding."
      detailIcon="package"
      detailTitle={`${itemName} ×${itemQty}`}
      detailLines={['Failed check: Packaging undamaged', '2 packets have dented lids, may be leaking']}
      prompt="Choose an option below to continue processing this order."
      options={[
        {
          label: 'Replace with fresh stock',
          tone: 'success',
          onPress: () =>
            navigation.navigate('ReplaceItem', { orderId, itemName, itemPrice, itemQty, source: 'qc' }),
        },
        {
          label: 'Remove item from order',
          tone: 'warning',
          onPress: () =>
            navigation.navigate('RemoveItem', { orderId, itemName, itemPrice, itemQty, source: 'qc' }),
        },
        {
          label: 'Cancel this order',
          tone: 'error',
          onPress: () => {
            rejectOrder(orderId, `${itemName} failed quality check`);
            navigation.replace('RejectOrderConfirmation', {
              orderId,
              reasonLabel: `${itemName} failed quality check`,
            });
          },
        },
      ]}
    />
  );
}
