import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useOrders } from '../../context/OrdersContext';
import { ItemIssueDecisionView } from './ItemIssueDecisionView';

type Props = NativeStackScreenProps<AuthStackParamList, 'MissingItemDecision'>;

function skuFor(name: string) {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const base = (match ? match[1] : name).trim();
  const size = match ? match[2] : '';
  const words = base.split(/\s+/).filter(Boolean);
  const first = words[0]?.slice(0, 4).toUpperCase() ?? '';
  const last = words[words.length - 1]?.slice(0, 4).toUpperCase() ?? '';
  return [first, last, size.toUpperCase()].filter(Boolean).join('-');
}

export function MissingItemDecisionScreen({ navigation, route }: Props) {
  const { orderId, itemName, itemPrice, itemQty } = route.params;
  const { rejectOrder } = useOrders();

  return (
    <ItemIssueDecisionView
      headerTitle="Item Not Found"
      onBack={() => navigation.goBack()}
      heading="Item Not in Stock"
      subtitle="How would you like to handle this missing item for the customer?"
      detailTitle={itemName}
      detailLines={[`×${itemQty} · ₹${itemPrice * itemQty} · SKU: ${skuFor(itemName)}`, 'Current stock: 0 units']}
      prompt="Choose an option below to continue processing this order."
      optionBordered
      options={[
        {
          icon: 'repeat',
          label: 'Suggest a Replacement',
          hint: 'Offer similar product to customer',
          tone: 'success',
          onPress: () =>
            navigation.navigate('ReplaceItem', { orderId, itemName, itemPrice, itemQty, source: 'missing' }),
        },
        {
          icon: 'minus',
          label: 'Remove Item from Order',
          hint: 'Remove and adjust order total',
          tone: 'warning',
          onPress: () =>
            navigation.navigate('RemoveItem', { orderId, itemName, itemPrice, itemQty, source: 'missing' }),
        },
        {
          icon: 'x-circle',
          label: 'Cancel Entire Order',
          hint: 'Cancel if item is essential',
          tone: 'error',
          onPress: () => {
            rejectOrder(orderId, `${itemName} out of stock`);
            navigation.replace('RejectOrderConfirmation', { orderId, reasonLabel: `${itemName} out of stock` });
          },
        },
      ]}
    />
  );
}
