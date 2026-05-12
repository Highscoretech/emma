import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import type { CumulativeResult } from './cgpa';
import { buildTranscriptHtml } from './transcriptHtml';

export async function exportTranscript(cumulative: CumulativeResult) {
  try {
    const html = buildTranscriptHtml(cumulative);
    const { uri } = await Print.printToFileAsync({ html });

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Transcript',
          UTI: 'com.adobe.pdf',
        });
        return;
      }
    }

    Alert.alert('Transcript saved', `Saved to ${uri}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    Alert.alert('Could not export transcript', message);
  }
}
