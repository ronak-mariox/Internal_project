import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, OtpInput, Screen, ScreenHeader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpEntry'>;

const DEMO_VALID_OTP = '1234';

export function OtpEntryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const isComplete = otp.length === 4;

  const handleVerify = () => {
    if (!isComplete) {
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (otp === DEMO_VALID_OTP) {
        navigation.navigate('CustomerConfirmed', {orderId});
      } else {
        navigation.navigate('DeliveryOtpIncorrect', {orderId});
      }
    }, 500);
  };

  return (
    <Screen backgroundColor={colors.surface} edges={['top', 'bottom']} keyboardAvoiding>
      <ScreenHeader title="Enter Delivery OTP" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.instructions}>
          Ask the customer for their 4-digit delivery code sent to their registered mobile number.
        </Text>

        <View style={styles.customerPill}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>PM</Text>
          </View>
          <Text style={styles.customerName}>Priya Mehta</Text>
        </View>

        <OtpInput value={otp} onChange={setOtp} />

        <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} onPress={() => navigation.navigate('StateActionFailed')}>
          <Text style={styles.otpHelp}>OTP not working?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button label="Clear" variant="outline" fullWidth={false} style={styles.clearButton} onPress={() => setOtp('')} />
        <Button
          label="Verify OTP →"
          fullWidth={false}
          style={styles.verifyButton}
          disabled={!isComplete}
          loading={verifying}
          onPress={handleVerify}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, gap: spacing.xxl},
  instructions: {...typography.body, color: colors.textSecondary, textAlign: 'center'},
  customerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
  },
  customerAvatar: {width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  customerAvatarText: {...typography.captionSemibold, color: colors.white},
  customerName: {...typography.bodySemibold, color: colors.textPrimary},
  otpHelp: {...typography.label, color: colors.primary},
  footer: {flexDirection: 'row', gap: spacing.md, padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border},
  clearButton: {flex: 1},
  verifyButton: {flex: 2},
});
