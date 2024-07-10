import React, { useEffect, useCallback } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useForm } from 'react-hook-form';
import styles from '../styles';

const Form = () => {
  try{
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: async () => (await fetch("http://10.0.0.13:5000/")).json()});
  const values = watch();

  const onSubmit = (data) => {
    console.log(data);
  }
  
  const onChangeField = useCallback(
    name => text => {
      setValue(name, text);
    },
    []
  );

  // useEffect(() => {
  //   register('name');
  //   register('email');
  // }, [register]);

  return (
    <View style={styles.container}>
      <TextInput
        keyboardType="email-address"
        textContentType="emailAddress"
        value={values.name}
        placeholder="Name"
        onChangeText={onChangeField('name')}
      />
      <TextInput
        placeholder="Email"
        value={values.email}
        onChangeText={onChangeField('email')}
      />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
  }
  catch (error) {
    alert(error.message);
  }
};

export default Form;