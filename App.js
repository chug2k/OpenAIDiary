import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
  TextInput,
  FlatList
} from 'react-native';
import { useFireproof } from 'use-fireproof'
import { fireproof } from '@fireproof/core'
import { SafeAreaView } from 'react-native-web';

import { useCompletion } from 'ai/react';


export default function App() {
  const { height } = useWindowDimensions();
  const { useLiveQuery, useDocument } = useFireproof(fireproof('coderAIDiary'))
  const result = useLiveQuery('entryContent');
  const [doc, setDoc, saveDoc] = useDocument({ entryContent: '' });
  const { completion, complete } = useCompletion({
    api: "http://localhost:3000/api/openai"
  });

  useEffect(() => {
    complete("Reflect upon your day.");
  }, []);

  function handleRefreshPromptPress() {
    complete(completion);
  }
  function handleAddEntryPress() {
    saveDoc();
    setDoc(false);
  }

  const DiaryEntry = ({ entryContent, prompt, timestamp }) => (
    <View style={styles.diaryEntry}>
      <Text style={styles.prompt}>{prompt}</Text>
      <Text style={styles.entryContent}>{entryContent}</Text>
      <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
    </View>
  );


  return (
    <SafeAreaView style={styles.safeViewArea}>
      <View style={[styles.container, {height}]}>
        <Text style={styles.promptHeader}>Today's Prompt</Text>
        <Text style={styles.prompt}>
          {completion.trim().replace(/['"]+/g, '')}
        </Text>
        <Pressable style={styles.refreshPromptBtn} onPress={handleRefreshPromptPress}>
          <Text style={styles.btnText}>Refresh Prompt</Text>
        </Pressable>
        <FlatList
          data={result.docs}
          renderItem={({ item }) => <DiaryEntry {...item} />}
          keyExtractor={item => item._id}
        />
        <TextInput
          style={styles.input}
          placeholder="Write your thoughts here..."
          value={doc.entryContent}
          onChangeText={val => setDoc({ ...doc, entryContent: val })}
          multiline
        />
        <Pressable style={styles.addEntryBtn} onPress={handleAddEntryPress}>
          <Text style={styles.btnText}>Add a New Entry</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeViewArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  promptHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  prompt: {
    fontSize: 18,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  refreshPromptBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  diaryEntry: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  entryContent: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  addEntryBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});